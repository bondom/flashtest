import {
  Action,
  UserInteractionAction,
  MutationType,
  DOMMutationAction,
  RequestAction
} from './types';

function isUserInteractionAction(action: Action): action is UserInteractionAction {
  return typeof (action as UserInteractionAction).eventName !== 'undefined';
}

function isDomMutationAction(action: Action): action is DOMMutationAction {
  return typeof (action as DOMMutationAction).type !== 'undefined';
}

function isRequestAction(action: Action): action is RequestAction {
  return typeof (action as RequestAction).url !== 'undefined';
}

/**
 * Converts array of action chunks:
 * [
 *  [
 *    action1,
 *    mutation1
 *    ..
 *  ],
 *  [
 *    action2,
 *    mutation2,
 *  ]
 * ]
 * To Array of actions:
 *
 * [
 *  action1,
 *  mutation1
 *  ..
 *  action2,
 *  mutation2,
 * ]
 */
function flatActionChunks(actionChunks: Readonly<Action[][]>): Readonly<Action[]> {
  return actionChunks.reduce((acc, currVal) => {
    return acc.concat(currVal);
  }, []);
}

/* Methods to get particular actions from Actions array*/

function getMutationsFromActions(actions: Readonly<Action[]>): DOMMutationAction[] {
  return actions.filter(action => isDomMutationAction(action)) as DOMMutationAction[];
}

function getRequestsFromActions(actions: Readonly<Action[]>): RequestAction[] {
  return actions.filter(action => isRequestAction(action)) as RequestAction[];
}

function getMutationsFromActionChunks(actionChunks: Readonly<Action[][]>): DOMMutationAction[] {
  return getMutationsFromActions(flatActionChunks(actionChunks));
}

function getRequestsFromActionChunks(actionChunks: Readonly<Action[][]>): RequestAction[] {
  return getRequestsFromActions(flatActionChunks(actionChunks));
}

function bothTypesAreAttributeOrNot(type1: MutationType, type2: MutationType): boolean {
  return (
    (type1 === type2 && type2 === 'attributes') ||
    (type1 !== 'attributes' && type2 !== 'attributes')
  );
}

export {
  isUserInteractionAction,
  isDomMutationAction,
  isRequestAction,
  bothTypesAreAttributeOrNot,
  getMutationsFromActionChunks,
  getRequestsFromActionChunks
};
