import { Action, ReadonlyChunksArray } from './types';
import { isDomMutationAction, isRequestAction } from './helper';

// Prepare chunks to code generating: add single quotes to strings, replaces class with className
// and other small preparations
export default function prepareToCodeGenerating(chunks: ReadonlyChunksArray): ReadonlyChunksArray {
  const handledChunks: Action[][] = [];

  chunks.forEach(chunk => {
    const handledChunk: Action[] = [];

    chunk.forEach(action => {
      if (isDomMutationAction(action)) {
        const initialAttrName = action.attributeName;
        // @ts-ignore - boolean can't be assigned in collector, but it can be assigned there
        // TODO: maybe it is needed to create separate type for handled data
        const value = handleAttributeValue(initialAttrName, action.value);
        const attributeName = handleAttributeName(action.attributeName);
        // @ts-ignore - boolean can't be assigned in collector, but it can be assigned there
        const oldValue = handleAttributeValue(initialAttrName, action.oldValue);
        handledChunk.push(
          Object.assign({}, action, {
            value,
            attributeName,
            oldValue,
            /* eslint-disable quotes */
            HTML: action.HTML.replace(/'/g, "\\'")
            /* eslint-enable quotes */
          })
        );
      } else if (isRequestAction(action)) {
        handledChunk.push(
          Object.assign({}, action, {
            method: action.method.toUpperCase(),
            response: {
              status: action.response.status,
              contentType: handleStringOrNullValue(action.response.contentType),
              body: handleStringOrNullValue(action.response.body),
              headers: action.response.headers
            }
          })
        );
      } else {
        handledChunk.push(Object.assign({}, action));
      }
    });

    handledChunks.push(handledChunk);
  });

  return handledChunks;
}

function handleAttributeName(attributeName?: string | null): string | null | undefined {
  return attributeName === 'class' ? 'className' : attributeName;
}

// TODO: test should be added when all cases will be clear for this function
function handleAttributeValue(
  attributeName: string | null,
  value: string | null
): string | null | boolean {
  if (attributeName === 'disabled') {
    return value === '';
  } else {
    return handleStringOrNullValue(value);
  }
}

function handleStringOrNullValue(value: string | null) {
  if (value === null) return null;
  return `'${value}'`;
}
