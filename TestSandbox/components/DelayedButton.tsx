import * as React from 'react';

type State = {
  clicksNumber: number;
};
class DelayedButton extends React.Component<{}, State> {
  state = {
    clicksNumber: 0
  };

  onBtnClick = (e: any) => {
    this.setState(prevState => ({ clicksNumber: prevState.clicksNumber + 1 }));
  };
  render() {
    return (
      <div>
        <button
          data-hook="button"
          onClick={this.onBtnClick}
          disabled={this.state.clicksNumber === 5}
        >
          Click
        </button>
        {this.state.clicksNumber === 5 && (
          <span data-hook="warning">
            You clicked button 5 times, you can&apos;t click it anymore
          </span>
        )}
      </div>
    );
  }
}

export { DelayedButton };
