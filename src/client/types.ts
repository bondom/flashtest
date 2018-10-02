export type ElementMarkup = { dataHook: string; outerHTML: string };

// "attributes" - attribute of Element changed
// "childList-added-node" - means that this node was added
// "childList-removed-node" - means that this node was removed
// "childList" - means that content of target node was changed(some children nodes were added or deleted)
// "characterData" - some text was inserted or removed, in this case we get nearest parent Element,
//  if this parent Element has [data-hook], we collect info
//  (Such approach leads to bug with contentEditable Element, see registerMutationObservers file)
export type MutationType =
  | 'characterData'
  | 'childList'
  | 'attributes'
  | 'childList-added-node'
  | 'childList-removed-node';

export type DOMMutationAction = {
  type: MutationType;
  dataHook: string;
  HTML: string;
  htmlType: 'outer' | 'inner';
  attributeName?: string | null;
  oldValue?: string | null;
  value?: string | null;
  raisedByRequest?: boolean;
};

export type EventName =
  | 'click'
  | 'input'
  | 'focus'
  | 'blur'
  | 'keydown'
  | 'keyup'
  | 'keypress'
  | 'mousedown'
  | 'mouseup';

export type UserInteractionAction = {
  dataHook: string;
  eventName: EventName;
  value?: string;
  name?: string;
  tagName?: string;
  inputType?: string | null;
  inputData?: string | null; // last entered symbol
  currentTargetDataHook?: string | null;
};

export type RequestAction = {
  id: number;
  url: string;
  method: string;
  response: {
    status: number;
    headers: {
      [key: string]: string;
    };
    contentType: string | null;
    body: string;
    shouldBeMocked: boolean;
  };
  finished: boolean;
};

export type Action = DOMMutationAction | UserInteractionAction | RequestAction;

export type ReadonlyActionsArray = ReadonlyArray<Readonly<Action>>;
export type ReadonlyChunksArray = ReadonlyArray<ReadonlyActionsArray>;
