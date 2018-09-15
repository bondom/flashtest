import * as React from 'react';

type State = {
  value: string;
};
class Select extends React.Component<{}, State> {
  state = {
    value: 'coconut'
  };

  handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ value: e.target.value });
  };
  render() {
    return (
      <div>
        <span data-hook="select-result">Selected: {this.state.value}</span>
        <br />
        Pick your favorite flavor:
        <select value={this.state.value} onChange={this.handleChange} data-hook="select">
          <option value="grapefruit">Grapefruit</option>
          <option value="lime">Lime</option>
          <option value="coconut">Coconut</option>
          <option value="mango">Mango</option>
        </select>
      </div>
    );
  }
}

export { Select };
