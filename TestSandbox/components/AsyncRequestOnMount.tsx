import * as React from 'react';
import { TEST_API_URL } from '../constants';

type ReqStatus = 'none' | 'got' | 'request';
type State = {
  getReqStatus: ReqStatus;
  getReqResult: string;
};
class AsyncRequestOnMount extends React.Component<{}, State> {
  state = {
    getReqStatus: 'none' as ReqStatus,
    getReqResult: ''
  };

  componentDidMount() {
    this.setState({ getReqStatus: 'request' });
    fetch(`${TEST_API_URL}/base64encode/100/Uasia`, {
      method: 'get'
    })
      .then(res => {
        this.setState({ getReqStatus: 'got' });
        return res.text();
      })
      .then(textRes => {
        this.setState({ getReqResult: textRes });
      });
  }
  render() {
    return (
      <div>
        {this.state.getReqStatus === 'request' ? <span data-hook="loader">Loading...</span> : null}
        {this.state.getReqResult && (
          <div data-hook="result">Get Request Result: {this.state.getReqResult}</div>
        )}
      </div>
    );
  }
}

export { AsyncRequestOnMount };
