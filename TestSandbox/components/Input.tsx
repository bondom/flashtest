import * as React from 'react';

type State = {
  value: string;
};
class Input extends React.Component<{}, State> {
  state = {
    value: ''
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  };
  render() {
    return (
      <div>
        <input value={this.state.value} onChange={this.onInputChange} data-hook="input" />
      </div>
    );
  }
}

export { Input };
