import * as React from 'react';

type State = {
  mousedownTriggered: boolean;
  focusTriggered: boolean;
  mouseupTriggered: boolean;
  clickTriggered: boolean;
};
class ButtonComplex extends React.Component<{}, State> {
  state = {
    mousedownTriggered: false,
    focusTriggered: false,
    mouseupTriggered: false,
    clickTriggered: false
  };

  render() {
    return (
      <div>
        <button
          data-hook="button"
          onMouseDown={() => this.setState({ mousedownTriggered: true })}
          onFocus={() => this.setState({ focusTriggered: true })}
          onMouseUp={() => this.setState({ mouseupTriggered: true })}
          onClick={() => this.setState({ clickTriggered: true })}
        >
          Click
        </button>
        <br />
        <span data-hook="mousedown-result">
          Mousedown triggered on button: {this.state.mousedownTriggered + ''}
        </span>
        <br />
        <span data-hook="focus-result">
          Focus triggered on button: {this.state.clickTriggered + ''}
        </span>
        <br />
        <span data-hook="mouseup-result">
          Mouseup triggered on button: {this.state.mouseupTriggered + ''}
        </span>
        <br />
        <span data-hook="click-result">
          Click triggered on button: {this.state.clickTriggered + ''}
        </span>
      </div>
    );
  }
}

export { ButtonComplex };
