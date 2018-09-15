import * as React from 'react';
import { TEST_API_URL } from '../constants';

type ReqStatus = 'none' | 'got' | 'request';
type State = {
  getReqStatus: ReqStatus;
  getReqResult: string;
};
class AsyncButton extends React.Component<{}, State> {
  state = {
    getReqStatus: 'none' as ReqStatus,
    getReqResult: ''
  };

  onSendGetBtnClick = () => {
    this.setState({
      getReqStatus: 'request',
      getReqResult: ''
    });
    fetch(`${TEST_API_URL}/base64/100/SFRUUEJJTiBpcyBhd2Vzb21l`, {
      method: 'get'
    })
      .then(res => {
        this.setState({ getReqStatus: 'got' });
        return res.text();
      })
      .then(textRes => {
        this.setState({ getReqResult: textRes });
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

export { AsyncButton };
