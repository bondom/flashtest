import * as React from 'react';
import { TEST_API_URL } from '../constants';

// This file has only difference from ./AsyncButtonMockedJsonResponse.tsx:
// when button is clicked, only request is sent, but DOM isn't mutated(button isn't disabled)
type State = {
  getReqResult: string;
};
class AsyncButtonMockedJsonResponseWithoutMutatingDOM extends React.Component<{}, State> {
  state = {
    getReqResult: ''
  };

  onSendGetBtnClick = () => {
    this.setState({
      getReqResult: ''
    });
    fetch(`${TEST_API_URL}/wrapIntoObject/100/sometext`, {
      method: 'get'
    })
      .then(res => {
        return res.json();
      })
      .then(jsonRes => {
        this.setState({ getReqResult: jsonRes.wrappedArg });
      });
  };

  render() {
    return (
      <div>
        <button data-hook="async-button__get-submit-btn" onClick={this.onSendGetBtnClick}>
          Send GET async request
        </button>
        <div data-hook="async-button__get-request-result">
          Get Request Result: {this.state.getReqResult}
        </div>
      </div>
    );
  }
}

export { AsyncButtonMockedJsonResponseWithoutMutatingDOM };
