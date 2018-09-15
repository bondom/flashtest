import { Action, ElementMarkup } from './types';
import { isDomMutationAction, isRequestAction } from './helper';

class DataHandler {
  handleData(
    actions: Readonly<Action>[],
    initialMarkup: ElementMarkup[]
  ): {
    handledActions: Action[];
    handledInitialMarkup: ElementMarkup[];
  } {
    const handledActions: Action[] = [];
    actions.forEach(action => {
      if (isDomMutationAction(action)) {
        const initialAttrName = action.attributeName;
        // @ts-ignore - boolean can't be assigned in collector, but it can be assigned there
        // TODO: maybe it is needed to create separate type for handled data
        const value = this.handleAttributeValue(initialAttrName, action.value);
        const attributeName = this.handleAttributeName(action.attributeName);
        // @ts-ignore - boolean can't be assigned in collector, but it can be assigned there
        const oldValue = this.handleAttributeValue(initialAttrName, action.oldValue);

        handledActions.push(
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
        handledActions.push(
          Object.assign({}, action, {
            method: action.method.toUpperCase()
          })
        );
      } else {
        handledActions.push(Object.assign({}, action));
      }
    });

    return {
      handledActions,
      handledInitialMarkup: initialMarkup
    };
  }

  private handleAttributeName(attributeName?: string | null): string | null | undefined {
    return attributeName === 'class' ? 'className' : attributeName;
  }

  // TODO: test should be added when all cases will be clear for this function
  private handleAttributeValue(
    attributeName: string | null,
    value: string | null
  ): string | null | boolean {
    if (attributeName === 'disabled') {
      return value === '';
    } else {
      if (value === null) return null;
      return `'${value}'`;
    }
  }
}

export default DataHandler;
