import * as React from 'react';

type State = {
  clicked: boolean;
};
class MergedClickFocus extends React.Component<{}, State> {
  state = {
    clicked: false
  };

  render() {
    return (
      <div>
        <span data-hook="click-result">Clicked: {this.state.clicked + ''}</span>
        <input data-hook="input" onClick={() => this.setState({ clicked: true })} />
      </div>
    );
  }
}

export { MergedClickFocus };
