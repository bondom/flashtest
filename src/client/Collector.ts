import devConsole from '../devConsole';
import {
  Action,
  ElementMarkup,
  EventName,
  MutationType,
  DOMMutationAction,
  UserInteractionAction,
  RequestAction
} from './types';
import { isRequestAction, isUserInteractionAction } from './helper';

// There are four types of data that are collected:
// 1. Initial outer HTML of elements
// 2. User interactions(are collected via addEventListener):
//   - 'click'
//   - 'input',
//   - ...
// 3. DOM changes(result of user interaction and/or request to backend) - are collected via MutationObserver:
//   - attributes
//     a) value
//     b) disabled
//     c) className
//       ...
//   - characterData (text) - in this case we find nearest parent with data-hook
//   - childList - is useful in cases when CharacterData node or HTMLElement was added to page, or deleted from it
// 4. Requests sent with window.fetch: url, method, body(body isn't recorded yet)
// NOT SOLVED PROBLEMS:
// 1) If input[type="checkbox"] or input[type="radio"] is clicked =>
//     it becomes checked, but this change will not be collected, because HTML isn't changed.
// 2) If value in <select> is selected => DOM also isn't changed

class Collector {
  url: string;
  actions: Action[] = [];
  initialMarkup: ElementMarkup[] = [];
  eventListenersCallbacksMap: Array<{
    eventName: string;
    callback: ((e: Event) => void);
  }> = [];
  mutationObserver: MutationObserver;
  requestStatus: 'none' | 'processing' | 'ended' = 'none';
  requestStatusOfMutation: 'none' | 'processing' | 'ended' = 'none';
  indicator: HTMLElement | null;
  indicatorQuerySelector?: string;
  errorsArray: string[];
  handleUrlTimerId: number;
  interactionElementTagNames: string[] = ['input', 'textarea', 'button', 'select'];
  serverUrl: string;

  constructor({
    indicatorQuerySelector,
    errorsArray,
    serverUrl
  }: {
    indicatorQuerySelector?: string;
    errorsArray: string[];
    serverUrl: string;
  }) {
    this.eventListenersCallbacksMap = [
      'click',
      'input',
      'keyup',
      'keydown',
      'keypress',
      'focus',
      'blur',
      'mousedown',
      'mouseup'
    ].map(eventName => {
      return {
        eventName,
        callback: (e: Event) => this.eventListener(e, eventName)
      };
    });
    this.indicator = null;
    this.indicatorQuerySelector = indicatorQuerySelector;
    this.errorsArray = errorsArray;
    this.serverUrl = serverUrl;
  }

  start() {
    this.url = window.location.href;
    this.collectFetchRequests();
    this.handleUrlChange();
    window.addEventListener('DOMContentLoaded', () => {
      this.checkElementsDataHookOnUniqueness();
      this.initializeIndicator();
      this.getInitialMarkup();
      this.registerEventListeners();
      this.registerMutationObservers();
    });
  }

  private checkElementsDataHookOnUniqueness() {
    const allDataHooks = Array.from(document.querySelectorAll('[data-hook]'));
    const dataHookCountMap = allDataHooks
      .map(el => el.getAttribute('data-hook'))
      .reduce(
        (acc, currVal: string) => Object.assign(acc, { [currVal]: (acc[currVal] || 0) + 1 }),
        {}
      );

    const duplicates = Object.keys(dataHookCountMap).filter(a => dataHookCountMap[a] > 1);
    if (duplicates.length > 0) {
      this.errorsArray.push(`
        Warning:
        There are duplicated data-hook attributes:<br/>
        ${duplicates}<br/>
        Library doesn't work properly with duplicated data-hook attributes.
        Please make them all unique.
      `);
    }
  }

  private initializeIndicator() {
    if (!this.indicatorQuerySelector) {
      return;
    }
    const element = document.querySelector(this.indicatorQuerySelector);
    if (!element) {
      /* eslint-disable no-console */
      console.error(`indicatorQuerySelector is invalid, element isn't found`);
      /* eslint-enable no-console */
      return;
    }

    if (!(element instanceof HTMLElement)) {
      /* eslint-disable no-console */
      console.error(`element selected for indicatorQuerySelector is not HTMLElement`);
      /* eslint-enable no-console */
      return;
    }
    this.indicator = element;
  }

  private getInitialMarkup() {
    Array.from(document.querySelectorAll('[data-hook]')).forEach(element => {
      this.initialMarkup.push({
        dataHook: element.getAttribute('data-hook')!,
        outerHTML: element.outerHTML
      });
    });
  }

  /**
   *
   * Registering Event listeners to collect User interactions
   *
   */
  private registerEventListeners() {
    const elements = document.querySelectorAll('[data-hook]');
    [].forEach.call(elements, (el: HTMLElement) => this.registerEventListenersForElement(el));
  }

  private registerEventListenersForElement(el: HTMLElement) {
    const eventNames: string[] = this.eventListenersCallbacksMap.map(item => item.eventName);
    this.eventListenersCallbacksMap.forEach(({ callback, eventName }) => {
      el.addEventListener(eventName, callback);
    });
    devConsole.log(`Registered ${eventNames} event listeners on: `, el);
  }

  private unregisterEventListeners() {
    const elements = document.querySelectorAll('[data-hook]');
    const eventNames: string[] = this.eventListenersCallbacksMap.map(item => item.eventName);
    [].forEach.call(elements, (el: Element) => {
      this.eventListenersCallbacksMap.forEach(({ callback, eventName }) => {
        el.removeEventListener(eventName, callback);
      });
      devConsole.log(`Unregistered ${eventNames} event listeners on: `, el);
    });
  }

  // TODO: wrong using can be detected exactly!!!
  // using mousedown
  private handleFastInputAfterClick(e: Event, eventName: string) {
    if (
      eventName === 'click' &&
      (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
    ) {
      const clickIsTriggeredAfterInputEvent = this.actions
        .filter(isUserInteractionAction)
        .slice(-2)
        .some(action =>
          ['keydown', 'keyup', 'input', 'keypress'].some(item => item === action.eventName)
        );
      if (clickIsTriggeredAfterInputEvent) {
        this.errorsArray.push(
          `Warning: 
         
          Did you intentionally type value in input(or textarea) element, and then clicked on it?<br/>
          If no, it seems that you clicked on your input and started to enter symbols at once, library
          doesn't handle this case properly now, after click on input/textarea elements, please 
          wait 1 second before input.<br/><br/>
          Now it is better to reload page and start from scratch.`
        );
      }
    }
  }

  /**
   * TODO: ADD TESTS!!!!!
   * It is prohibited to interact with page till all async requests are finished,
   * i.e. user clicked button that caused async request, request isn't finished yet but user clicked some element.
   * This case isn't handled by library in right way.
   * But even if this case would be implemented in right way, it is useless until mocking of requests is implemented,
   * because time of responses to async requests differ from test run to test run.
   *
   * This method finds out if programmer interacts with page till all async requests are finished,
   * if it is such case, error message is pushed to errorsArray
   */
  private handleInteractionTillRequestsAreFinished(e: Event, eventName: string) {
    if (!this.allRequestsAreFinished()) {
      const indexOfLastRequest = this.actions.map(isRequestAction).lastIndexOf(true);
      const indexOfInteractionCausedRequest = this.actions
        .slice(0, indexOfLastRequest)
        .map(isUserInteractionAction)
        .lastIndexOf(true);
      const interaction = this.actions[indexOfInteractionCausedRequest] as UserInteractionAction;

      let errorShouldBeShown = false;
      switch (interaction.eventName) {
        case 'click': {
          if (eventName !== 'blur') {
            errorShouldBeShown = true;
          }
          break;
        }
        case 'input': {
          if (eventName !== 'keyup') {
            errorShouldBeShown = true;
          }
          break;
        }
        case 'keyup': {
          errorShouldBeShown = true;
          break;
        }
        case 'keydown': {
          if (!['keypress', 'input', 'keyup'].some(item => item === eventName)) {
            errorShouldBeShown = true;
          }
          break;
        }
        case 'keypress': {
          if (!['input', 'keyup'].some(item => item === eventName)) {
            errorShouldBeShown = true;
          }
          break;
        }
        case 'focus': {
          // 'click' is needed there??
          if (!['mouseup', 'click'].some(item => item === eventName)) {
            errorShouldBeShown = true;
          }
          break;
        }
        case 'blur': {
          if (!['focus', 'mouseup', 'click'].some(item => item === eventName)) {
            errorShouldBeShown = true;
          }
          break;
        }
        case 'mousedown': {
          if (!['blur', 'focus', 'mouseup', 'click'].some(item => item === eventName)) {
            errorShouldBeShown = true;
          }
          break;
        }
        case 'mouseup': {
          if (eventName !== 'click') {
            errorShouldBeShown = true;
          }
          break;
        }
      }

      if (errorShouldBeShown) {
        this.errorsArray.push(`
          Warning: you interacted with page until all async requests are finished.
          More likely generated code will be wrong.<br/>
          Indicator line below shows when all async requests are finished.<br/>
          If it is red please don't interact with page.<br/><br/>
          Now it is better to reload page and start from scratch.
        `);
      }
    }
  }

  private handleUrlChange() {
    this.handleUrlTimerId = window.setInterval(() => {
      if (window.location.href !== this.url) {
        this.errorsArray.push(`
          Warning:
          
          Detected window.location.href change, route transitions aren't supported by library yet.
          Please open url you want to test, reload page on this url and start whole process from scratch. 
        `);
        window.clearInterval(this.handleUrlTimerId);
      }
    }, 100);
  }

  private eventListener(e: Event, eventName: string) {
    if (this.requestStatus === 'ended') {
      devConsole.log(`Set request status to 'none'`);
      this.requestStatus = 'none';
    }

    devConsole.group(`${eventName} event handler callback is called`);
    if (!(e.target instanceof HTMLElement) || !e.target.hasAttribute('data-hook')) {
      devConsole.log(
        `Skipping ${eventName} for `,
        e.target,
        ` because it isn't HTMLElement or doesn't have data-hook attribute`
      );
      devConsole.groupEnd();
      return;
    }

    if (
      eventName === 'input' &&
      e.target instanceof HTMLInputElement &&
      e.target.type === 'number'
    ) {
      // hack for input[type="number"]: DOM of this input changes only when other element is focused
      // so we should manually trigger change of DOM to trigger invocation of MutationObserver callback
      e.target.setAttribute('value', e.target.value);
    }

    if (e.target instanceof HTMLButtonElement && eventName === 'blur') {
      // blur event is triggered on button even when DOM changes!!!
      devConsole.log(`Skipping 'blur' event for button`);
      devConsole.groupEnd();
      return;
    }

    this.handleFastInputAfterClick(e, eventName);
    this.handleInteractionTillRequestsAreFinished(e, eventName);

    const interaction: UserInteractionAction = {
      dataHook: e.target.getAttribute('data-hook')!,
      eventName: eventName as EventName,
      // @ts-ignore
      value: e.target.value || '',
      // @ts-ignore
      inputData: e.data,
      tagName: e.target.tagName,
      currentTargetDataHook:
        e.currentTarget && e.currentTarget instanceof HTMLElement
          ? e.currentTarget.getAttribute('data-hook')
          : undefined
    };

    if (interaction.tagName === 'INPUT') {
      interaction.inputType = e.target.getAttribute('type')!;
    }
    this.actions.push(interaction);
    devConsole.log(`Collected '${eventName}' event for: \n`, e.target);
    devConsole.groupEnd();
    return;
  }

  /**
   * Registering MutationObserver to collect DOM mutations
   */
  private registerMutationObservers() {
    this.mutationObserver = new MutationObserver(mutationRecords => {
      if (mutationRecords.every(record => record.target === this.indicator)) {
        return;
      }
      // use setTimeout because we need to push mutation after actual action that caused this mutation
      // it is needed for such cases:
      // 1) Programmer added several input event listeners to element
      // 2) We added one more to record input event
      // 3) When creating test programmer inputs value in field, first event listener is executed,
      //    as a result mutation happens and is pushed to actions array,
      //    but our event listener isn't pushed yet to actions array! - it is wrong

      this.requestStatusOfMutation = this.requestStatus;
      setTimeout(() => {
        devConsole.group('MutationObserver callback is called');
        devConsole.log('Mutation batch:', mutationRecords);

        const handledMutationRecords = this.deleteSimilarMutationsRecords(mutationRecords);
        handledMutationRecords.forEach(record => {
          switch (record.type) {
            case 'childList': {
              this.handleChildListMutationRecord(record);
              break;
            }
            case 'characterData': {
              this.handleCharacterDataMutationRecord(record);
              break;
            }
            case 'attributes': {
              this.handleAttributeMutationRecord(record);
            }
          }
        });

        devConsole.groupEnd();
      }, 0);
    });

    this.mutationObserver.observe(document, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });
  }

  // There are cases when mutation batch contains similar mutation records.
  // Similar means: they have the same target, type and attributeName.
  // For now such records were detected only when using textarea
  private deleteSimilarMutationsRecords(mutationRecords: MutationRecord[]): MutationRecord[] {
    const handledMutationRecords: MutationRecord[] = [];
    mutationRecords.forEach(record => {
      const similarBatchedRecord = handledMutationRecords.find(
        batchedRecord =>
          record.target === batchedRecord.target &&
          record.type === batchedRecord.type &&
          record.attributeName === batchedRecord.attributeName
      );
      if (typeof similarBatchedRecord !== 'undefined') {
        const addedRecordNode = Array.from(record.addedNodes)[0];
        const removedBatchedRecordNode = Array.from(similarBatchedRecord.removedNodes)[0];
        // if the same text node was removed and then added
        // we delete already pushed mutation record from batched records and skip current one
        if (
          addedRecordNode instanceof Text &&
          removedBatchedRecordNode instanceof Text &&
          addedRecordNode.data === removedBatchedRecordNode.data
        ) {
          const index = handledMutationRecords.findIndex(el => el === similarBatchedRecord);
          handledMutationRecords.splice(index, 1);
          devConsole.log(
            'Skipping two mutation records: first for adding Text Node, second for deleting TextNode - they are mutually exclusive'
          );
          return;
        } else {
          handledMutationRecords.push(record);
        }
      } else {
        handledMutationRecords.push(record);
      }
    });
    return handledMutationRecords;
  }

  private handleChildListMutationRecord(record: MutationRecord) {
    const addedNodes = Array.from(record.addedNodes);
    if (
      addedNodes.length == 0 &&
      Array.from(record.removedNodes).every(node => node instanceof Text && node.data === '')
    ) {
      devConsole.log(
        'Skipping recording mutation for removed Text Node, because its value was empty string'
      );
      return;
    }

    if (
      addedNodes.length > 0 &&
      addedNodes.every(node => node instanceof Text && node.data === '')
    ) {
      devConsole.log(
        'Skipping recording mutation for added Text Nodes, because their values are empty strings'
      );
      return;
    }

    const numberOfHandledAddedChildren = this.tryToHandleChildrenNodes(
      'childList-added-node',
      record.addedNodes
    );

    this.checkDataHookOnUniquenessAndRegisterEventListenersOnAddedNodes(record.addedNodes);

    const numberOfHandledRemovedChildren = this.tryToHandleChildrenNodes(
      'childList-removed-node',
      record.removedNodes
    );

    // we handle original target of childList mutation
    // only if no added and removed nodes were handled(it is possible
    // if record.target don't have children Element Nodes with [data-hook] attribute)
    //
    // in this case content of original target node changed, but it is not added to the DOM
    // so innerHTML should be checked
    if (numberOfHandledAddedChildren === 0 && numberOfHandledRemovedChildren === 0) {
      // record.target can be only Element Node(because type of current mutation is childList)
      // not we handle only HTMLElement but not SVGElement or other types
      this.handleElement({
        element: record.target as HTMLElement,
        type: 'childList',
        htmlType: 'inner'
      });
    }
  }

  private handleCharacterDataMutationRecord(record: MutationRecord) {
    const parentElement = record.target.parentElement!;

    // This case is possible if we have such piece of code:
    // <div data-hook="div">
    //   [input value]
    //   <input data-hook="input" />
    // </div>
    // And user enters value in input
    if (this.elementHasInteractionElementsAsChildren(parentElement)) {
      devConsole.log(
        `Skipping recording mutation for Text Node, because parent of this Text Node has child with tagName equal to one of: INPUT, BUTTON, TEXTAREA, SELECT`
      );
      return;
    }

    // // if content of interaction element changed
    // //  For example:
    // // <button data-hook="attr">
    // //   {buttonTextThatChanges}
    // // </button>
    // // TODO: in this case we should handle innerHTML of button. Checking of outerHTML is redundant
    // if (this.interactionElementTagNames.some(tagName => tagName === parentElement.tagName)) {

    // }

    // TODO: in case if contentEditable Element is changed:
    // - it doesn't handle inserted value properly
    // - divs and spans can be inserted into DOM which will wrap entered text,
    // these divs and spans don't have [data-hook] attribute, so mutation will be skipped.
    // But it should be skipped only if
    //  contentEditable Element doesn't have [data-hook] atttribute itself
    this.handleElement({ element: parentElement, type: 'characterData', htmlType: 'inner' });
  }

  private handleAttributeMutationRecord(record: MutationRecord) {
    // @ts-ignore
    const value = (record.target as HTMLElement).getAttribute(record.attributeName);
    if (
      record.attributeName === 'src' &&
      (this.valueIsBase64ImageSrc(record.oldValue) || this.valueIsBase64ImageSrc(value))
    ) {
      devConsole.log(
        'Skipping recording attribute Mutation for src attribute, because its value or its oldValue is base64'
      );
    } else {
      this.handleElement({
        element: record.target as HTMLElement,
        type: 'attributes',
        attributeName: record.attributeName,
        oldValue: record.oldValue,
        value
      });
    }
  }

  private valueIsBase64ImageSrc(value: string | null) {
    return value && value.startsWith('data:image/jpeg;base64,');
  }

  private elementHasInteractionElementsAsChildren(element: HTMLElement) {
    return (
      Array.from(element.querySelectorAll(this.interactionElementTagNames.join(','))).length > 0
    );
  }

  /**
   * Try to handle(i.e add to actionsArray, see this.handleElement) nodes passed in NodeList,
   * returns number of successfully handled Nodes.
   *
   * Node won't successfully handled if all next conditions are true:
   * 1) it isn't HTMLElement
   * 2) it doesn't have [data-hook] attribute
   * 3) it doesn't have at least one HTMLElement child with data-hook attribute
   */
  private tryToHandleChildrenNodes(
    type: 'childList-added-node' | 'childList-removed-node',
    nodeList: NodeList
  ): number {
    return Array.from(nodeList)
      .map(element => {
        if (element instanceof HTMLElement) {
          const childrenWithDataHookAttribute = this.getMostNestedChildrenWithDataHookAttribute(
            element
          );
          if (childrenWithDataHookAttribute.length > 0) {
            devConsole.log(
              `Next element has children with data-hook attribute, so ${type} mutation
            will be handled for its children: `,
              element
            );
            let handledChildrenNumber = 0;
            childrenWithDataHookAttribute.forEach(child => {
              const handled = this.handleElement({ element: child, type });
              if (handled) {
                handledChildrenNumber++;
              }
            });
            return handledChildrenNumber;
          } else {
            devConsole.log(
              `Next element has no children with data-hook attribute, so ${type} mutation
            will be handled for this element itself: `,
              element
            );
            return this.handleElement({ element: element as HTMLElement, type });
          }
        }
        return false;
      })
      .filter(Boolean).length;
  }

  /**
   * Recursively gets children with data-hook attribute for all most nested sub-trees.
   * Example:
   * <div data-hook="root-div">
   *  <span data-hook="span1">Some text</span>
   *  <div data-hook="div1">
   *    <div data-hook="div1-nested">
   *      <span data-hook="span2">Some text2</span>
   *    </div>
   *  </div>
   *  <div data-hook="div2">
   *    <input data-hook="input" value="val" />
   *  </div>
   * </div>
   *
   * In this case elements with next data-hooks will be returned in array:
   * ["span1", "span2", "input"]
   */
  private getMostNestedChildrenWithDataHookAttribute(element: HTMLElement): HTMLElement[] {
    return Array.from(element.children)
      .map(element => {
        if (!(element instanceof HTMLElement)) {
          return [];
        }
        const childrenWithDataHookAttribute = this.getMostNestedChildrenWithDataHookAttribute(
          element
        );
        if (childrenWithDataHookAttribute.length > 0) {
          return childrenWithDataHookAttribute;
        } else {
          if (element.hasAttribute('data-hook')) {
            return [element];
          }
        }
        return [];
      })
      .reduce((acc, currVal) => {
        return acc.concat(currVal);
      }, []);
  }

  /**
   * Returns true if element was handled, false otherwise
   */
  private handleElement({
    element,
    type,
    attributeName,
    oldValue,
    value,
    htmlType = 'outer'
  }: {
    element: HTMLElement;
    type: MutationType;
    attributeName?: string | null;
    oldValue?: string | null;
    value?: string | null;
    htmlType?: 'outer' | 'inner';
  }): boolean {
    const dataHook = element.getAttribute('data-hook');
    if (!dataHook) {
      devConsole.log('Skipped mutation due lack of [data-hook] attribute: ', element);
      return false;
    }

    const collectedMutation: DOMMutationAction = {
      type,
      attributeName,
      oldValue,
      dataHook,
      HTML: htmlType === 'outer' ? element.outerHTML : element.innerHTML,
      htmlType,
      value
    };

    // TODO: bug can be caused:
    // first request.then(secondrequest)
    // first request finished
    // second request started
    // mutation raised by first request is catched by MutationObserver
    if (this.requestStatusOfMutation === 'ended') {
      collectedMutation.raisedByRequest = true;
    }

    devConsole.log('Collected mutation: ', collectedMutation);
    this.actions.push(collectedMutation);
    return true;
  }

  private checkDataHookOnUniquenessAndRegisterEventListenersOnAddedNodes(nodeList: NodeList) {
    this.checkElementsDataHookOnUniqueness();
    Array.from(nodeList).forEach(element => {
      if (element instanceof HTMLElement) {
        Array.from(element.querySelectorAll('[data-hook]')).forEach(el => {
          if (el instanceof HTMLElement) {
            this.registerEventListenersForElement(el);
          }
        });
        if (element.hasAttribute('data-hook')) {
          this.registerEventListenersForElement(element);
        }
      }
    });
  }

  finish() {
    devConsole.group('Collector.finish');
    this.unregisterEventListeners();
    if (this.mutationObserver) this.mutationObserver.disconnect();

    // We assign actions and initialMarkup on window object for tests
    // @ts-ignore
    window.ACTIONS = this.actions;
    // @ts-ignore
    window.INITIAL_MARKUP = this.initialMarkup;

    devConsole.log('Collected data: ', JSON.parse(JSON.stringify(this.actions)));
    devConsole.log('Initial html of elements: ', JSON.parse(JSON.stringify(this.initialMarkup)));
    devConsole.groupEnd();
  }

  private allRequestsAreFinished() {
    return this.actions.filter(isRequestAction).every(req => !!req.finished);
  }

  /**
   * Collects information about all requests on page made with window.fetch
   */
  private collectFetchRequests() {
    const originalFetch = window.fetch;
    const self = this;
    let lastRequestId = 0;
    window.fetch = function() {
      const url = arguments[0];
      if (url === self.serverUrl) {
        return originalFetch.apply(this, arguments);
      }
      const method: string = arguments[1] ? arguments[1].method || 'get' : 'get';
      const newId = ++lastRequestId;

      // response property is required for RequestAction, it will be assigned in response
      // so to avoid typescript error we use 'as RequestAction'
      const requestAction: RequestAction = {
        id: newId,
        url,
        method,
        finished: false
      } as RequestAction;

      if (self.indicator) {
        self.indicator.style.backgroundColor = 'red';
      }

      // !!!NOTE: this comment is related to commented setTimeout functionality below,
      // we push 'pushing of RequestAction' to callback queue,
      // it is needed to do easier handling of async actions in ActionsHandler
      // Explanation: after user does some action which leads to request
      // (clicks button or types value in input), bunch of actions are pushed to array:
      // - keydown, keypress, input, keyup in case of typing in input,
      // - focusin click in case of click

      // setTimeout(() => {
      devConsole.log(`Pushed RequestAction to result array: `, requestAction);
      self.actions.push(requestAction);
      self.requestStatus = 'processing';
      // }, 0);

      return originalFetch.apply(this, arguments).then(async (response: Response) => {
        // setTimeout(() => {
        self.requestStatus = 'ended';
        devConsole.log('Response has just arrived, set requestStatus to ended');
        await self.updateRequestAction(requestAction, response);
        // if all requests are finished switch indicator to green
        if (self.allRequestsAreFinished() && self.indicator) {
          self.indicator.style.backgroundColor = 'green';
        }
        // }, 0);
        return response;
      });
    };
  }

  private async updateRequestAction(requestAction: RequestAction, response: Response) {
    requestAction.finished = true;
    // browser encodes url also, so we update url with encoded one
    requestAction.url = response.url;

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.startsWith('image')) {
      devConsole.log(
        'Skipping reading body and headers of Response because contentType starts with image'
      );
      requestAction.response = {
        status: response.status,
        headers: {},
        contentType,
        body: '',
        shouldBeMocked: false
      };
    } else {
      const clonedResponseForJson = response.clone();
      const clonedResponseForText = response.clone();

      let body: string;
      try {
        const jsonRes: JSON = await clonedResponseForJson.json();
        body = JSON.stringify(jsonRes);
      } catch (error) {
        body = await clonedResponseForText.text();
      }

      const headersObj: {
        [key: string]: string;
      } = {};

      response.headers.forEach((value: string, key: string) => {
        headersObj[key] = value;
      });

      requestAction.response = {
        status: response.status,
        headers: headersObj,
        contentType,
        body,
        shouldBeMocked: true
      };
    }
  }
}

export default Collector;
