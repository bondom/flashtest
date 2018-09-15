import * as React from 'react';

type State = {
  checked: boolean;
};
/**
 * BUG: Information about change of checkbox state isn't collected, because
 * HTML isn't changed
 */
class InputCheckbox extends React.Component<{}, State> {
  state = {
    checked: false
  };

  render() {
    return (
      <div>
        <div data-hook="checked-div">Checked: {this.state.checked + ''}</div>
        <input
          type="checkbox"
          checked={this.state.checked}
          onChange={e => this.setState({ checked: e.target.checked })}
          data-hook="checkbox"
        />
      </div>
    );
  }
}

export { InputCheckbox };
