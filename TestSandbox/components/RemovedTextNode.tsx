import * as React from 'react';

type State = {
  value: string;
};
class RemovedTextNode extends React.Component<{}, State> {
  state = {
    value: 'somevalue'
  };

  render() {
    return (
      <React.Fragment>
        <div data-hook="wrapper-div">{this.state.value}</div>
        <button onClick={() => this.setState({ value: '' })} data-hook="clear-button">
          Clear value
        </button>
      </React.Fragment>
    );
  }
}

export { RemovedTextNode };
