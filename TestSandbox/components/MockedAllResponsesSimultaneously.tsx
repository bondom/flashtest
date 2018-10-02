import * as React from 'react';
import { TEST_API_URL } from '../constants';

type ReqStatus = 'none' | 'got' | 'request';
type State = {
  getReqStatus: ReqStatus;
  textRes: string;
  jsonRes: string;
};
class MockedAllResponsesSimultaneously extends React.Component<{}, State> {
  state = {
    getReqStatus: 'none' as ReqStatus,
    textRes: '',
    jsonRes: ''
  };

  image = React.createRef<HTMLImageElement>();

  onSendGetBtnClick = () => {
    this.setState({
      getReqStatus: 'request',
      textRes: '',
      jsonRes: ''
    });

    return Promise.all([this.getImageSrc(), this.getJson(), this.getText()]).then(
      ([imageSrc, jsonRes, textRes]: string[]) => {
        this.image.current.src = imageSrc;
        this.setState({
          textRes,
          jsonRes,
          getReqStatus: 'got'
        });
      }
    );
  };

  getImageSrc = (): Promise<string> => {
    return fetch(`${TEST_API_URL}/files/dog.jpg`, {
      method: 'get'
    }).then(res => {
      return res.arrayBuffer().then(buffer => {
        var base64Flag = 'data:image/jpeg;base64,';
        var imageStr = this.arrayBufferToBase64(buffer);

        return base64Flag + imageStr;
      });
    });
  };

  getJson = (): Promise<string> => {
    return fetch(`${TEST_API_URL}/wrapIntoObject/100/sometext`, {
      method: 'get'
    })
      .then(res => {
        return res.json();
      })
      .then(jsonRes => {
        return jsonRes.wrappedArg;
      });
  };

  getText = (): Promise<string> => {
    return fetch(`${TEST_API_URL}/base64/100/SFRUUEJJTiBpcyBhd2Vzb21l`, {
      method: 'get'
    }).then(res => {
      return res.text();
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
        <div data-hook="async-button__text-result">Text Request Result: {this.state.textRes}</div>
        <div data-hook="async-button__json-result">JSON Request Result: {this.state.jsonRes}</div>
      </div>
    );
  }
}

export { MockedAllResponsesSimultaneously };
