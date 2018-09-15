import * as React from 'react';

type State = {
  value: string;
};
class Textarea extends React.Component<{}, State> {
  state = {
    value: ''
  };

  onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ value: e.target.value });
  };
  render() {
    return (
      <div>
        <textarea value={this.state.value} onChange={this.onChange} data-hook="textarea" />
      </div>
    );
  }
}

export { Textarea };
