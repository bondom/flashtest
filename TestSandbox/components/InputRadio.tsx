import * as React from 'react';

type State = {
  size: string;
};

class InputRadio extends React.Component<{}, State> {
  state = {
    size: ''
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      size: event.target.value
    });
  };

  render() {
    return (
      <div>
        <p>Select a pizza size:</p>

        <ul>
          <li>
            <label>
              <input
                type="radio"
                value="small"
                checked={this.state.size === 'small'}
                onChange={this.handleChange}
                data-hook="small-pizza-input"
              />
              Small
            </label>
          </li>

          <li>
            <label>
              <input
                type="radio"
                value="medium"
                checked={this.state.size === 'medium'}
                onChange={this.handleChange}
                data-hook="medium-pizza-input"
              />
              Medium
            </label>
          </li>

          <li>
            <label>
              <input
                type="radio"
                value="large"
                checked={this.state.size === 'large'}
                onChange={this.handleChange}
                data-hook="large-pizza-input"
              />
              Large
            </label>
          </li>
        </ul>
        <span data-hook="selected-pizza">Selected pizza: {this.state.size}</span>
      </div>
    );
  }
}

export { InputRadio };
