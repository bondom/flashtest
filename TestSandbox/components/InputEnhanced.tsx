import * as React from 'react';

type State = {
  value: string;
  secondValue: string;
  keyCodes: string[];
  keyDownsCount: number;
  inputFocused: boolean;
  secondInputFocused: boolean;
};
class InputEnhanced extends React.Component<{}, State> {
  state = {
    value: '',
    secondValue: '',
    keyCodes: [] as string[],
    keyDownsCount: 0,
    inputFocused: false,
    secondInputFocused: false
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  };

  onInputSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ secondValue: e.target.value });
  };

  onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keyCodes = this.state.keyCodes.slice();
    keyCodes.push(e.key);
    this.setState({ keyCodes });
  };

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    this.setState(prevState => {
      return {
        keyDownsCount: prevState.keyDownsCount + 1
      };
    });
  };

  onInputFocusToggle = (e: React.FocusEvent<HTMLInputElement>, focused: boolean) => {
    this.setState({ inputFocused: focused });
  };

  onSecondInputFocusToggle = (e: React.FocusEvent<HTMLInputElement>, focused: boolean) => {
    this.setState({ secondInputFocused: focused });
  };

  render() {
    return (
      <div>
        <div data-hook="key-codes-div">Pressed keys on inputs: {this.state.keyCodes}</div>
        <div data-hook="key-downs-count-div">
          Key downs count on inputs: {this.state.keyDownsCount}
        </div>
        <div data-hook="first-input-focus-state">
          first input focused: {this.state.inputFocused + ''}
        </div>
        <div data-hook="second-input-focus-state">
          second input focused: {this.state.secondInputFocused + ''}
        </div>
        <input
          value={this.state.value}
          data-hook="input"
          onChange={this.onInputChange}
          onKeyPress={this.onKeyPress}
          onKeyDown={this.onKeyDown}
          onFocus={e => this.onInputFocusToggle(e, true)}
          onBlur={e => this.onInputFocusToggle(e, false)}
        />
        <input
          value={this.state.secondValue}
          data-hook="input-second"
          onChange={this.onInputSecondChange}
          onFocus={e => this.onSecondInputFocusToggle(e, true)}
          onBlur={e => this.onSecondInputFocusToggle(e, false)}
        />
      </div>
    );
  }
}

export { InputEnhanced };
