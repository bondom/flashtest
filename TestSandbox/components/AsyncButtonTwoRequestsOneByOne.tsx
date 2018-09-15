import * as React from 'react';
import { TEST_API_URL } from '../constants';

type ReqStatus = 'none' | 'got' | 'request';
type State = {
  firstReqStatus: ReqStatus;
  secondReqStatus: ReqStatus;
  firstReqResult: string;
  secondReqResult: string;
};
class AsyncButtonTwoRequestsOneByOne extends React.Component<{}, State> {
  state = {
    firstReqStatus: 'none' as ReqStatus,
    secondReqStatus: 'none' as ReqStatus,
    firstReqResult: '',
    secondReqResult: ''
  };

  onSendGetBtnClick = () => {
    this.setState({
      firstReqStatus: 'request' as ReqStatus,
      secondReqStatus: 'request' as ReqStatus,
      firstReqResult: '',
      secondReqResult: ''
    });

    return this.executeFirstRequest().then(() => this.executeSecondRequest());
  };

  executeFirstRequest = () => {
    return fetch(`${TEST_API_URL}/base64/100/SFRUUEJJTiBpcyBhd2Vzb21l`, {
      method: 'get'
    })
      .then(res => {
        return res.text();
      })
      .then(textRes => {
        this.setState({ firstReqResult: textRes, firstReqStatus: 'got' });
      });
  };

  executeSecondRequest = () => {
    fetch(`${TEST_API_URL}/base64/200/SGVsbG8gV29ybGQ=`, {
      method: 'get'
    })
      .then(res => {
        return res.text();
      })
      .then(textRes => {
        this.setState({ secondReqResult: textRes, secondReqStatus: 'got' });
      });
  };

  render() {
    return (
      <div>
        <button
          data-hook="async-button__get-submit-btn"
          onClick={this.onSendGetBtnClick}
          disabled={
            this.state.firstReqStatus === 'request' || this.state.secondReqStatus === 'request'
          }
        >
          Send Two GET requests One By One
        </button>
        <div data-hook="async-button__first-request-result">
          First Request Result: {this.state.firstReqResult}
        </div>
        <div data-hook="async-button__second-request-result">
          Second Request Result: {this.state.secondReqResult}
        </div>
      </div>
    );
  }
}

export { AsyncButtonTwoRequestsOneByOne };
