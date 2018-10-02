import * as React from 'react';
import { TEST_API_URL } from '../constants';

type ReqStatus = 'none' | 'got' | 'request';
type State = {
  getReqStatus: ReqStatus;
  getReqResult: string;
};
class MockedImageResponse extends React.Component<{}, State> {
  state = {
    getReqStatus: 'none' as ReqStatus,
    getReqResult: ''
  };

  image = React.createRef<HTMLImageElement>();

  onSendGetBtnClick = () => {
    this.setState({
      getReqStatus: 'request',
      getReqResult: ''
    });
    fetch(`${TEST_API_URL}/files/dog.jpg`, {
      method: 'get'
    }).then(res => {
      res.arrayBuffer().then(buffer => {
        this.setState({ getReqStatus: 'got' });
        var base64Flag = 'data:image/jpeg;base64,';
        var imageStr = this.arrayBufferToBase64(buffer);

        this.image.current.src = base64Flag + imageStr;
      });
    });
  };

  arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach(b => (binary += String.fromCharCode(b)));

    return window.btoa(binary);
  }

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
        <img ref={this.image} data-hook="async-button__image" />
      </div>
    );
  }
}

export { MockedImageResponse };
