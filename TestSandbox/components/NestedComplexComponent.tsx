import * as React from 'react';
import * as styles from '../styles.scss';

type State = {
  inputValue: string;
  textareaValue: string;
  checkboxValue: boolean;
  clicksNumber: number;
};
class NestedComplexComponent extends React.Component<{}, State> {
  state = {
    inputValue: '',
    textareaValue: '',
    checkboxValue: false,
    clicksNumber: 0
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  onTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ textareaValue: e.target.value });
  };

  onButtonClick = (e: React.ChangeEvent<any>) => {
    this.setState(prevState => ({ clicksNumber: prevState.clicksNumber + 1 }));
  };
  render() {
    return (
      <React.Fragment>
        <div
          data-hook="wrapper-input-div"
          className={this.state.inputValue.length > 5 ? styles.valid : ''}
        >
          {this.state.inputValue}
          <input
            value={this.state.inputValue}
            onChange={this.onInputChange}
            data-hook="wrapped-input"
          />
        </div>
        <br />
        <div
          data-hook="wrapper-textarea-div"
          className={this.state.textareaValue.length > 5 ? styles.valid : ''}
        >
          {this.state.textareaValue}
          <textarea
            value={this.state.textareaValue}
            onChange={this.onTextareaChange}
            data-hook="wrapped-textarea"
          />
        </div>
        <br />
        <div
          data-hook="wrapper-button-div"
          className={this.state.clicksNumber > 5 ? styles.valid : ''}
        >
          Clicks number: {this.state.clicksNumber}
          <button onClick={this.onButtonClick} data-hook="wrapped-button">
            Click
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export { NestedComplexComponent };
