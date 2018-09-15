import * as React from 'react';

type State = {
  mousedownTriggered: boolean;
};
class ButtonMousedown extends React.Component<{}, State> {
  state = {
    mousedownTriggered: false
  };

  render() {
    return (
      <div>
        <button data-hook="button" onMouseDown={() => this.setState({ mousedownTriggered: true })}>
          Click
        </button>
        <span data-hook="click-result">
          Mousedown triggered on button: {this.state.mousedownTriggered + ''}
        </span>
      </div>
    );
  }
}

export { ButtonMousedown };
