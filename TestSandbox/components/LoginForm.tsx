import * as React from 'react';
import * as styles from '../styles.scss';
import Validator from 'react-validation-utils';
import { lengthRule } from 'react-validation-utils/build/rules';

const validator = new Validator<State>({
  login: {
    rule: lengthRule(5),
    message: 'Please input login'
  },
  password: {
    rule: lengthRule(5),
    message: 'Password length should be at least 5'
  }
});

type State = {
  login: string;
  password: string;
  message: string;
};

class LoginForm extends React.Component<{}, State> {
  state = validator.addValidation({
    login: '',
    password: '',
    message: ''
  });

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState(validator.validate({ [name]: value } as { [key in keyof State]: string }));
  };

  onClick = (e: any) => {
    this.setState({ message: 'Success login' });
  };

  render() {
    const { login, password, message } = this.state;
    return (
      <form className={styles.form}>
        Login Form
        {message && (
          <span className={styles.message} data-hook="login-form-response-msg">
            {message}
          </span>
        )}
        <br />
        <br />
        <input
          value={login}
          name="login"
          data-hook="login-form-login"
          onChange={this.onChange}
          className={validator.isFieldValid(this.state, 'login') ? styles.validInput : ''}
        />
        <br />
        <br />
        <input
          value={password}
          type="password"
          name="password"
          data-hook="login-form-password"
          onChange={this.onChange}
          className={validator.isFieldValid(this.state, 'password') ? styles.validInput : ''}
        />
        <br />
        <button
          data-hook="login-form-submit-btn"
          type="button"
          className={validator.isFormValid(this.state) ? styles.btnValid : ''}
          onClick={this.onClick}
        >
          Log In
        </button>
      </form>
    );
  }
}

export { LoginForm };
