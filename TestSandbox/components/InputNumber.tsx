import * as React from 'react';

type State = {
  value: number | string;
};
class InputNumber extends React.Component<{}, State> {
  state = {
    value: ''
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  };
  render() {
    return (
      <div>
        <input
          value={this.state.value}
          type="number"
          onChange={this.onInputChange}
          data-hook="input"
        />
        <div data-hook="some-div">Click on this div to blur from input</div>
      </div>
    );
  }
}

export { InputNumber };
