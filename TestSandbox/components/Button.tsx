import * as React from 'react';

type State = {
  clicked: boolean;
};
class Button extends React.Component<{}, State> {
  state = {
    clicked: false
  };

  render() {
    return (
      <div>
        <button data-hook="button" onClick={() => this.setState({ clicked: true })}>
          Click
        </button>
        <span data-hook="click-result">Button clicked: {this.state.clicked + ''}</span>
      </div>
    );
  }
}

export { Button };
