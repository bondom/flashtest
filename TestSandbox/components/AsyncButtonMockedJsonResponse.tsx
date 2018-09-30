import * as React from 'react';
import { TEST_API_URL } from '../constants';

type ReqStatus = 'none' | 'got' | 'request';
type State = {
  getReqStatus: ReqStatus;
  getReqResult: string;
};
class AsyncButtonMockedJsonResponse extends React.Component<{}, State> {
  state = {
    getReqStatus: 'none' as ReqStatus,
    getReqResult: ''
  };

  onSendGetBtnClick = () => {
    this.setState({
      getReqStatus: 'request',
      getReqResult: ''
    });
    fetch(`${TEST_API_URL}/wrapIntoObject/100/sometext`, {
      method: 'get'
    })
      .then(res => {
        this.setState({ getReqStatus: 'got' });
        return res.json();
      })
      .then(jsonRes => {
        this.setState({ getReqResult: jsonRes.wrappedArg });
      });
  };

  render() {
    return (
      <div>
        <button
          data-hook="async-button__get-submit-btn"
          onClick={this.onSendGetBtnClick}
          disabled={this.state.getReqStatus === 'request'}
        >
          Send GET async request
        </button>
        <div data-hook="async-button__get-request-result">
          Get Request Result: {this.state.getReqResult}
        </div>
      </div>
    );
  }
}

export { AsyncButtonMockedJsonResponse };
