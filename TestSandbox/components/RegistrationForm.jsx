import * as React from 'react';
import * as styles from '../styles.scss';
import Validator from 'react-validation-utils';
import { lengthRule, requiredRule } from 'react-validation-utils/build/rules';

const validator = new Validator({
  login: {
    rule: lengthRule(5),
    message: 'Login length should be at least 5'
  },
  password: {
    rule: lengthRule(5),
    message: 'Password length should be at least 5'
  },
  sex: {
    rule: requiredRule,
    message: 'Please choose your sex'
  },
  age: {
    rule: requiredRule,
    message: 'Please input your age'
  },
  privacyPolicy: {
    rule: requiredRule,
    message: 'Please agree with privacy policy'
  }
});

class RegistrationForm extends React.Component {
  constructor() {
    super();
    this.state = validator.addValidation({
      login: '',
      password: '',
      sex: '',
      age: '',
      privacyPolicy: false,
      message: ''
    });
    this.onChange = this.onChange.bind(this);
    this.onPrivacyPolicyChange = this.onPrivacyPolicyChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState(validator.validate({ [name]: value }));
  }

  onPrivacyPolicyChange(e) {
    this.setState(validator.validate({ privacyPolicy: e.target.checked }));
  }

  onSubmit(e) {
    e.preventDefault();
    // check validated and prevalidated fields
    if (!validator.isFormValid(this.state)) {
      // validate all fields in the state to show all error messages
      return this.setState(validator.validate());
    }
    this.setState({ message: 'Success login' });
  }

  render() {
    const errors = validator.getErrors(this.state);
    return (
      <form className={styles.registrationForm} onSubmit={this.onSubmit}>
        Registration Form
        {this.state.message && (
          <span className={styles.message} data-hook="registration-form__response-msg">
            {this.state.message}
          </span>
        )}
        <label className={styles.label}>Login</label>
        <input
          value={this.state.login}
          name="login"
          data-hook="registration-form__login"
          onChange={this.onChange}
          className={validator.isFieldValid(this.state, 'login') ? styles.validInput : ''}
        />
        {errors.login && (
          <span className={styles.registrationFormError} data-hook="registration-form__login-error">
            {errors.login}
          </span>
        )}
        <label className={styles.label}>Password</label>
        <input
          value={this.state.password}
          type="password"
          name="password"
          data-hook="registration-form__password"
          onChange={this.onChange}
          className={validator.isFieldValid(this.state, 'password') ? styles.validInput : ''}
        />
        {errors.password && (
          <span
            className={styles.registrationFormError}
            data-hook="registration-form__password-error"
          >
            {errors.password}
          </span>
        )}
        <label className={styles.label}>Sex</label>
        <select
          value={this.state.sex}
          onChange={this.onChange}
          data-hook="registration-form__sex"
          name="sex"
          className={validator.isFieldValid(this.state, 'sex') ? styles.validInput : ''}
        >
          <option value="">Please select sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.sex && (
          <span className={styles.registrationFormError} data-hook="registration-form__sex-error">
            {errors.sex}
          </span>
        )}
        <label className={styles.label}>Age</label>
        <input
          type="number"
          name="age"
          data-hook="registration-form__age"
          className={validator.isFieldValid(this.state, 'age') ? styles.validInput : ''}
          value={this.state.age}
          onChange={this.onChange}
        />
        {errors.age && (
          <span className={styles.registrationFormError} data-hook="registration-form__age-error">
            {errors.age}
          </span>
        )}
        <br />
        <div
          className={validator.isFieldValid(this.state, 'privacyPolicy') ? styles.validInput : ''}
          data-hook="registration-form__privacyPolicy-wrapper"
        >
          <input
            type="checkbox"
            name="privacyPolicy"
            data-hook="registration-form__privacy-policy"
            value={this.state.privacyPolicy}
            onChange={this.onPrivacyPolicyChange}
          />
          Agree with privacy policy
        </div>
        {errors.privacyPolicy && (
          <span
            className={styles.registrationFormError}
            data-hook="registration-form__privacy-policy-error"
          >
            {errors.privacyPolicy}
          </span>
        )}
        <br />
        <button
          data-hook="registration-form__submit-btn"
          type="submit"
          className={validator.isFormValid(this.state) ? styles.btnValid : ''}
        >
          Sign Up
        </button>
      </form>
    );
  }
}

export { RegistrationForm };
