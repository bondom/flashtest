import * as React from 'react';
import { TEST_API_URL } from '../constants';

type ReqStatus = 'none' | 'got' | 'request';
type State = {
  value: string;
  getReqStatus: ReqStatus;
  postReqStatus: ReqStatus;
  getReqResult: string;
  statusCode?: number;
};
class AsyncForm extends React.Component<{}, State> {
  state = {
    value: '',
    getReqStatus: 'none' as ReqStatus,
    postReqStatus: 'none' as ReqStatus,
    getReqResult: '',
    statusCode: undefined
  };

  onSendGetBtnClick = () => {
    this.setState({
      statusCode: undefined,
      getReqStatus: 'request',
      getReqResult: ''
    });
    fetch(`${TEST_API_URL}/base64encode/100/${this.state.value}`, {
      method: 'get'
    })
      .then(res => {
        this.setState({ statusCode: res.status, getReqStatus: 'got' });
        return res.text();
      })
      .then(textRes => {
        this.setState({ getReqResult: textRes });
      });
  };

  onSendPostBtnClick = () => {
    this.setState({
      statusCode: undefined,
      postReqStatus: 'request'
    });
    fetch(`${TEST_API_URL}/status/0/200`, {
      method: 'post',
      body: JSON.stringify({ value: this.state.value })
    }).then(res => {
      this.setState({ statusCode: res.status, postReqStatus: 'got' });
    });
  };
  render() {
    return (
      <div>
        <input
          value={this.state.value}
          onChange={e => this.setState({ value: e.target.value })}
          data-hook="async-button-input"
        />
        <br />
        <button
          data-hook="async-button__get-submit-btn"
          onClick={this.onSendGetBtnClick}
          disabled={this.state.getReqStatus === 'request'}
        >
          Send GET async request
        </button>
        <button
          data-hook="async-button__post-submit-btn"
          onClick={this.onSendPostBtnClick}
          disabled={this.state.postReqStatus === 'request'}
        >
          Send POST async request
        </button>
        <br />
        <div data-hook="async-button__request-status-code">Res: {this.state.statusCode}</div>
        <div data-hook="async-button__get-request-result">
          Get Request Result: {this.state.getReqResult}
        </div>
      </div>
    );
  }
}

export { AsyncForm };
