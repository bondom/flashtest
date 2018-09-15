import * as React from 'react';

type State = {
  value: string;
  keyPressTriggersNumber: number;
  keyDownTriggersNumber: number;
  keyUpTriggersNumber: number;
};
class InputKeyEvents extends React.Component<{}, State> {
  state = {
    value: '',
    keyPressTriggersNumber: 0,
    keyDownTriggersNumber: 0,
    keyUpTriggersNumber: 0
  };

  onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    this.setState(prevState => {
      return {
        keyPressTriggersNumber: prevState.keyPressTriggersNumber + 1
      };
    });
  };

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    this.setState(prevState => {
      return {
        keyDownTriggersNumber: prevState.keyDownTriggersNumber + 1
      };
    });
  };

  onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    this.setState(prevState => {
      return {
        keyUpTriggersNumber: prevState.keyUpTriggersNumber + 1
      };
    });
  };

  render() {
    return (
      <div>
        <div data-hook="key-press-div">
          Key Press event was triggered: {this.state.keyPressTriggersNumber} times
        </div>
        <div data-hook="key-down-div">
          Key Down event was triggered: {this.state.keyDownTriggersNumber} times
        </div>
        <div data-hook="key-up-div">
          Key Up event was triggered: {this.state.keyUpTriggersNumber} times
        </div>
        <input
          value={this.state.value}
          data-hook="input"
          onChange={e => this.setState({ value: e.target.value })}
          onKeyPress={this.onKeyPress}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
        />
      </div>
    );
  }
}

export { InputKeyEvents };
