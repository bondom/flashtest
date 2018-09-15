import * as React from 'react';
import * as styles from '../styles.scss';

type State = {
  clicked: boolean;
};
class NestedDivInsideDiv extends React.Component<{}, State> {
  state = {
    clicked: false
  };

  render() {
    let innerDivClassName = styles.clickableDiv;
    if (this.state.clicked) {
      innerDivClassName += ' ' + styles.valid;
    }
    return (
      <div data-hook="wrapper-div">
        Outer div
        <div
          data-hook="wrapped-div"
          className={innerDivClassName}
          onClick={() => this.setState({ clicked: true })}
        >
          Inner Div
        </div>
      </div>
    );
  }
}

export { NestedDivInsideDiv };
