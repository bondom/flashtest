import * as React from 'react';

type State = {
  blured: boolean;
};
class MergedClickBlur extends React.Component<{}, State> {
  state = {
    blured: false
  };

  render() {
    return (
      <div>
        <span data-hook="blur-result">Blured: {this.state.blured + ''}</span>
        <input data-hook="input" onBlur={() => this.setState({ blured: true })} />
      </div>
    );
  }
}

export { MergedClickBlur };
