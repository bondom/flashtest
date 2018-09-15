import * as React from 'react';
import * as styles from '../styles.scss';

type State = {
  input: string;
};
class InputButtonSpan extends React.Component<{}, State> {
  state = {
    input: ''
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: e.target.value });
  };
  render() {
    return (
      <div>
        <span data-hook="input-button-span__span">Some interesting text{this.state.input}</span>
        <br />
        <input
          value={this.state.input}
          onChange={this.onInputChange}
          data-hook="input-button-span__input"
        />
        <br />
        <button
          disabled={this.state.input.length < 5}
          data-hook="input-button-span__button"
          className={this.state.input.length < 5 ? '' : styles.valid}
          onClick={() => this.setState({ input: '' })}
        >
          Clear Input
        </button>
      </div>
    );
  }
}

export { InputButtonSpan };
