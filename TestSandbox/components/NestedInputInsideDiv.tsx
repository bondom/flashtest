import * as React from 'react';
import * as styles from '../styles.scss';

type State = {
  value: string;
};
class NestedInputInsideDiv extends React.Component<{}, State> {
  state = {
    value: ''
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  };
  render() {
    return (
      <div data-hook="wrapper-div" className={this.state.value.length > 5 ? styles.valid : ''}>
        <input value={this.state.value} onChange={this.onInputChange} data-hook="wrapped-input" />
      </div>
    );
  }
}

export { NestedInputInsideDiv };
