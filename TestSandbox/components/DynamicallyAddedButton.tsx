import * as React from 'react';

type State = {
  firstButtonClicked: boolean;
  secondButtonClicked: boolean;
};
class DynamicallyAddedButton extends React.Component<{}, State> {
  state = {
    firstButtonClicked: false,
    secondButtonClicked: false
  };

  render() {
    return (
      <div>
        <button
          data-hook="first-button"
          onClick={() => this.setState({ firstButtonClicked: true })}
        >
          First Button
        </button>
        <br />
        {this.state.firstButtonClicked && (
          <button
            data-hook="second-button"
            onClick={() => this.setState({ secondButtonClicked: true })}
          >
            Second Button
          </button>
        )}
        <br />
        {this.state.secondButtonClicked && (
          <span data-hook="second-button-click-result">Second button clicked!!</span>
        )}
      </div>
    );
  }
}

export { DynamicallyAddedButton };
