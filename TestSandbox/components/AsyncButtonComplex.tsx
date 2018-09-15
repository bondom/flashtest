import * as React from 'react';
import { TEST_API_URL } from '../constants';

type ReqStatus = 'none' | 'got' | 'request';

type State = {
  mousedownTriggered: boolean;
  focusTriggered: boolean;
  mouseupTriggered: boolean;
  clickTriggered: boolean;

  clickReqStatus: ReqStatus;

  clickRequestResult: string;
  mousedownRequestResult: string;
};
class AsyncButtonComplex extends React.Component<{}, State> {
  state = {
    mousedownTriggered: false,
    focusTriggered: false,
    mouseupTriggered: false,
    clickTriggered: false,

    clickReqStatus: 'none' as ReqStatus,

    clickRequestResult: null,
    mousedownRequestResult: null
  };

  onBtnClick = () => {
    this.setState({
      clickReqStatus: 'request',
      clickTriggered: true
    });
    fetch(`${TEST_API_URL}/toUpperCase/100/clickresult`, {
      method: 'get'
    })
      .then(res => {
        this.setState({ clickReqStatus: 'got' });
        return res.text();
      })
      .then(textRes => {
        this.setState({ clickRequestResult: textRes });
      });
  };

  // represents some analytic request for example
  onBtnMouseDown = () => {
    fetch(`${TEST_API_URL}/toUpperCase/200/mousedownresult`, {
      method: 'get'
    })
      .then(res => {
        return res.text();
      })
      .then(textRes => {
        this.setState({ mousedownRequestResult: textRes });
      });
  };

  render() {
    return (
      <div>
        <button
          data-hook="button"
          onMouseDown={this.onBtnMouseDown}
          onFocus={() => this.setState({ focusTriggered: true })}
          onMouseUp={() => this.setState({ mouseupTriggered: true })}
          onClick={this.onBtnClick}
          disabled={this.state.clickReqStatus === 'request'}
        >
          Click
        </button>
        <br />
        <br />
        <span data-hook="focus-result">
          Focus triggered on button: {this.state.clickTriggered + ''}
        </span>
        <br />
        <span data-hook="mouseup-result">
          Mouseup triggered on button: {this.state.mouseupTriggered + ''}
        </span>
        <br />
        <span data-hook="click-result">
          Click triggered on button: {this.state.clickTriggered + ''}
        </span>
        <br />
        <span data-hook="mousedown-request-result">
          Mousedown request result: {this.state.mousedownRequestResult}
        </span>
        <br />
        <span data-hook="click-request-result">
          Click request result:
          {this.state.clickRequestResult}
        </span>
      </div>
    );
  }
}

export { AsyncButtonComplex };
