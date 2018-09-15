import { Action, EventName, UserInteractionAction } from './types';
import Console from '../Console';
import {
  isUserInteractionAction,
  isRequestAction,
  bothTypesAreAttributeOrNot,
  isDomMutationAction
} from './helper';

/**
 * This handler handle actions, prepare them for test generating.
 *
 * TODO: It is very badly implemented, it should be refactored when most cases will be known
 * and all events will be handled.
 * These cases will be known after feedback from community or using this library on very big project
 *
 * TODO: more likely returning to chunks with EndRequestAction should be done.
 * Because it is hard to handle some cases and code is messed. For example:
 * - first input triggered adding of DOM node,
 * - second input triggered removing of DOM node.
 * In this case we don't need to merge these two inputs
 * To implement this handling for one actions array we need to create some workarounds and hacks.
 * Handling isn't clear.
 */

class ActionsHandler {
  duplicateEventsArray = ['keydown', 'keypress', 'input', 'keyup'];

  private resolveEventName(eventName: EventName): EventName {
    if (eventName === 'keyup') {
      return 'input';
    } else {
      return eventName;
    }
  }

  private areEventsDuplicates(eventName1: string, eventName2: string): boolean {
    return (
      this.duplicateEventsArray.includes(eventName1) &&
      this.duplicateEventsArray.includes(eventName2)
    );
  }

  async handle(actions: Readonly<Action[]>): Promise<Readonly<Action[][]>> {
    return Promise.resolve()
      .then(() => this.batchInputActions(actions))
      .then(actions => {
        Console.log('batchInputActions: ', actions);
        return this.batchFocusAndClickActions(actions);
      })
      .then(actions => {
        Console.log('batchFocusAndClickActions: ', actions);
        return this.filterLastActionIfNeeded(actions);
      })
      .then(actions => {
        Console.log('filterLastActionIfNeeded: ', actions);
        return this.batchActionsForSelect(actions);
      })
      .then(actions => {
        Console.log('batchActionsForSelect: ', actions);
        return this.splitActionsOnChunks(actions);
      })
      .then(chunks => {
        Console.log('chunks: ', chunks);
        return chunks;
      });
  }

  private batchInputActions(actions: Readonly<Action[]>): Readonly<Action[]> {
    const res: Readonly<Action[]> = [];
    actions.forEach(action => {
      const indexOfLastInteraction = res.map(isUserInteractionAction).lastIndexOf(true);
      if (indexOfLastInteraction === -1) {
        res.push(action);
        return;
      }

      const indexOfLastRequest = res.map(isRequestAction).lastIndexOf(true);

      if (isUserInteractionAction(action)) {
        const lastPushedInteraction: UserInteractionAction = res[
          indexOfLastInteraction
        ] as UserInteractionAction;

        // if last request raised by input was done later than last interaction and
        // current event is keydown(so user again entered value)
        // we don't need to merge current interaction with some of previous ones,
        // we just push it to destination array
        if (
          indexOfLastRequest > indexOfLastInteraction &&
          action.eventName === 'keydown' &&
          lastPushedInteraction.eventName === 'input'
        ) {
          res.push(action);
          return;
        }

        if (
          action.dataHook === lastPushedInteraction.dataHook &&
          // we skip select element there for tests,
          // because when page.select() is called in puppeteer, only input event is collected,
          // we should avoid batching of them.
          // For real case(when user manually selects value) it isn't needed, because when selecting
          // value manually 3 events are collected: 'click', 'input', 'click'
          action.tagName !== 'SELECT' &&
          this.areEventsDuplicates(action.eventName, lastPushedInteraction.eventName)
        ) {
          lastPushedInteraction.value = action.value;

          if (action.eventName === 'input') {
            // inputData is needed for 'input' which caused async requests,
            // in this case we should use only last entered symbol, but not full value;
            // because of this field is undefined for 'keyup' event which is triggered after 'input',
            // we make sure that this field isn't cleared by undefined from 'keyup' action.
            lastPushedInteraction.inputData = action.inputData;
          }

          lastPushedInteraction.eventName = this.resolveEventName(action.eventName);
          return;
        }

        // for checkbox and radio inputs
        if (
          action.dataHook === lastPushedInteraction.dataHook &&
          action.eventName === 'input' &&
          lastPushedInteraction.eventName === 'click' &&
          (action.inputType === 'checkbox' || action.inputType === 'radio')
        ) {
          lastPushedInteraction.value = action.value;
          lastPushedInteraction.eventName = 'click';
          return;
        }
      } else if (isDomMutationAction(action)) {
        const indexToGetLastMutations =
          indexOfLastInteraction > indexOfLastRequest ? indexOfLastInteraction : indexOfLastRequest;

        const lastPushedMutations = res.slice(indexToGetLastMutations).filter(isDomMutationAction);

        const similarMutation = lastPushedMutations.find(
          mutation =>
            action.dataHook === mutation.dataHook &&
            bothTypesAreAttributeOrNot(action.type, mutation.type) &&
            action.attributeName === mutation.attributeName &&
            action.raisedByRequest === mutation.raisedByRequest
        );

        if (similarMutation) {
          similarMutation.value = action.value;
          similarMutation.type = action.type;
          similarMutation.HTML = action.HTML;
          return;
        }
      }

      res.push(action);
    });
    return res;
  }

  private batchFocusAndClickActions(actions: Readonly<Action[]>): Readonly<Action[]> {
    const res: Action[] = [];

    actions.forEach(action => {
      const indexOfLastInteraction = res.map(isUserInteractionAction).lastIndexOf(true);
      if (indexOfLastInteraction === -1) {
        res.push(action);
        return;
      }
      if (isUserInteractionAction(action)) {
        const lastPushedInteraction: UserInteractionAction = res[
          indexOfLastInteraction
        ] as UserInteractionAction;

        if (
          action.dataHook === lastPushedInteraction.dataHook &&
          ((action.eventName === 'focus' && lastPushedInteraction.eventName === 'mousedown') ||
            (action.eventName === 'mouseup' && lastPushedInteraction.eventName === 'focus') ||
            (action.eventName === 'click' && lastPushedInteraction.eventName === 'mouseup') ||
            // this is for button if it was previously clicked
            (action.eventName === 'mouseup' && lastPushedInteraction.eventName === 'mousedown'))
        ) {
          res.splice(indexOfLastInteraction, 1, action);
          return;
        }

        // if there are two click actions recorded from one event handler but for two elements(bubbling)
        // we just skip second one
        if (
          action.dataHook === lastPushedInteraction.dataHook &&
          action.currentTargetDataHook !== lastPushedInteraction.currentTargetDataHook &&
          ((action.eventName === 'click' && lastPushedInteraction.eventName === 'click') ||
            (action.eventName === 'mousedown' && lastPushedInteraction.eventName === 'mousedown') ||
            (action.eventName === 'mouseup' && lastPushedInteraction.eventName === 'mouseup'))
        ) {
          return;
        }

        // if user focuses or clicks on some element, previous blur is redundant
        if (
          (action.eventName === 'focus' || action.eventName === 'click') &&
          lastPushedInteraction.eventName === 'blur'
        ) {
          // there we also check if there is mousedown event before blur,
          // we just delete it if it exists
          // POSSIBLE_BUG: it can cause BUG with mutations for mousedown event
          const indexOfLastButOneInteraction = res
            .slice(0, indexOfLastInteraction)
            .map(isUserInteractionAction)
            .lastIndexOf(true);
          if (indexOfLastButOneInteraction !== -1) {
            const lastButOnePushedInteraction: UserInteractionAction = res[
              indexOfLastButOneInteraction
            ] as UserInteractionAction;
            if (
              lastButOnePushedInteraction.eventName === 'mousedown' &&
              lastButOnePushedInteraction.dataHook === action.dataHook
            ) {
              res.splice(indexOfLastInteraction, 1, action);
              res.splice(indexOfLastButOneInteraction, 1);
            }
          } else {
            res.splice(indexOfLastInteraction, 1, action);
          }
          return;
        }
      }

      res.push(action);
    });
    return res;
  }

  /**
   * This method batch actions only for <select> element
   * @param actionChunks
   */
  private batchActionsForSelect(actions: Readonly<Action[]>): Readonly<Action[]> {
    const res: Action[] = [];

    actions.forEach(action => {
      const indexOfLastInteraction = res.map(isUserInteractionAction).lastIndexOf(true);
      if (indexOfLastInteraction === -1) {
        res.push(action);
        return;
      }

      const indexOfLastButOneInteraction = res
        .slice(0, indexOfLastInteraction)
        .map(isUserInteractionAction)
        .lastIndexOf(true);

      if (indexOfLastButOneInteraction === -1) {
        res.push(action);
        return;
      }

      if (isUserInteractionAction(action)) {
        const lastPushedInteraction: UserInteractionAction = res[
          indexOfLastInteraction
        ] as UserInteractionAction;
        const lastButOnePushedInteraction: UserInteractionAction = res[
          indexOfLastButOneInteraction
        ] as UserInteractionAction;

        if (
          action.tagName === 'SELECT' &&
          action.dataHook === lastPushedInteraction.dataHook &&
          action.dataHook === lastButOnePushedInteraction.dataHook &&
          action.eventName === 'click' &&
          lastPushedInteraction.eventName === 'input' &&
          lastButOnePushedInteraction.eventName === ('click' as EventName)
        ) {
          res.splice(indexOfLastInteraction, 1);
          lastButOnePushedInteraction.value = action.value;
          // set 'input' because 'input' is triggered when item is selected
          // with page.select(), so our tests and real cases are consistent
          lastButOnePushedInteraction.eventName = 'input';
          return;
        }
      }

      res.push(action);
    });

    return res;
  }

  private filterLastActionIfNeeded(actions: Readonly<Action[]>): Readonly<Action[]> {
    const lastAction = actions[actions.length - 1];
    if (isUserInteractionAction(lastAction) && lastAction.eventName === 'blur') {
      // delete last action, if it is 'blur' UserInteractionAction,
      // because this event was caused by pressing Finish button
      return actions.slice(0, actions.length - 1);
    }
    return actions;
  }

  private splitActionsOnChunks(actions: Readonly<Action[]>): Readonly<Action[][]> {
    return actions.reduce(
      (acc, currVal, currIndex) => {
        if (isUserInteractionAction(currVal) || (isRequestAction(currVal) && currIndex === 0)) {
          acc.push([currVal]);
        } else {
          acc[acc.length - 1].push(currVal);
        }
        return acc;
      },
      [] as Action[][]
    );
  }
}

export default ActionsHandler;
