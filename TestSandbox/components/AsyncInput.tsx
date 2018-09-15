import * as React from 'react';
import { TEST_API_URL } from '../constants';

type ReqStatus = 'none' | 'got' | 'request';
type State = {
  getReqStatus: ReqStatus;
  getReqResult: string;
  statusCode?: number;
};
class AsyncInput extends React.Component<{}, State> {
  state = {
    getReqStatus: 'none' as ReqStatus,
    getReqResult: '',
    statusCode: undefined
  };

  onSendGetBtnClick = (value: string) => {
    this.setState({
      statusCode: undefined,
      getReqStatus: 'request',
      getReqResult: ''
    });
    fetch(`${TEST_API_URL}/toUpperCase/20/${value}`, {
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

  render() {
    return (
      <div>
        <input
          data-hook="async-input__input"
          onChange={e => this.onSendGetBtnClick(e.target.value)}
        />
        <div data-hook="async-input__result">Get Request Result: {this.state.getReqResult}</div>
      </div>
    );
  }
}

export { AsyncInput };
