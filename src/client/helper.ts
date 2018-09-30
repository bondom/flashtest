import {
  Action,
  UserInteractionAction,
  MutationType,
  DOMMutationAction,
  RequestAction,
  ReadonlyActionsArray,
  ReadonlyChunksArray
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
function flatActionChunks(actionChunks: ReadonlyChunksArray): ReadonlyActionsArray {
  return actionChunks.reduce((acc, currVal) => {
    return acc.concat(currVal);
  }, []);
}

/* Methods to get particular actions from Actions array*/

function getMutationsFromActions(actions: ReadonlyActionsArray): DOMMutationAction[] {
  return actions.filter(action => isDomMutationAction(action)) as DOMMutationAction[];
}

function getRequestsFromActions(actions: ReadonlyActionsArray): RequestAction[] {
  return actions.filter(action => isRequestAction(action)) as RequestAction[];
}

function getMutationsFromActionChunks(actionChunks: ReadonlyChunksArray): DOMMutationAction[] {
  return getMutationsFromActions(flatActionChunks(actionChunks));
}

function getRequestsFromActionChunks(actionChunks: ReadonlyChunksArray): RequestAction[] {
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
