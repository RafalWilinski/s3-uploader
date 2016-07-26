import React from 'react';

import '../styles/base/_animations.scss';

/**
 * Presentational Component for displaying 'login form'.
 *
 * Handles validation and passes data to higher-order components/containers.
 */
class AccessForm extends React.Component {

  /**
   * Constructor, sets default state and binds context to used functions.
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      accessKey: '',
      secretKey: '',
    };

    this.handleSubmit = this._handleSubmit.bind(this);
    this.handleAccessKeyChange = this._handleAccessKeyChange.bind(this);
    this.handleSecretKeyChange = this._handleSecretKeyChange.bind(this);
  };

  /**
   * React built-in function.
   *
   * After mounting component, tries to automatically fill out form with saved credentials.
   */
  componentDidMount() {
    const savedAccessKey = window.localStorage.getItem('accessKey') || '';
    const savedSecretKey = window.localStorage.getItem('secretKey') || '';
    document.getElementById('access_key_input').value = savedAccessKey;
    document.getElementById('secret_key_input').value = savedSecretKey;

    this.setState({
      accessKey: savedAccessKey,
      secretKey: savedSecretKey,
    });
  }

  /**
   * Procedure called when submitting form.
   *
   * Trims input, handles it and adds some fancy animations if something is wrong.
   * @param event
   * @private
   */
  _handleSubmit(event) {
    event.preventDefault();
    const accessKey = this.state.accessKey.trim();
    const secretKey = this.state.secretKey.trim();

    if (accessKey !== '' && secretKey !== '') {
      this.props.onCredentialsSubmitted(accessKey, secretKey);
    } else {
      if (accessKey === '') {
        document.getElementById('access_key_input').focus();
        document.getElementById('access_key_input').className = 'animated shake';
      } else if (secretKey === '') {
        document.getElementById('secret_key_input').focus();
        document.getElementById('secret_key_input').className = 'animated shake';
      }

      // Diminish animation after it ends.
      setTimeout(() => {
        document.getElementById('access_key_input').className = '';
        document.getElementById('secret_key_input').className = '';
      }, 1500);
    }
  };

  /**
   * Changes this.state when user types something to access key field.
   * @param event
   * @private
   */
  _handleAccessKeyChange(event) {
    this.setState({
      accessKey: event.target.value
    });
  };

  /**
   * Changes this.state when user types something to secret key field.
   * @param event
   * @private
   */
  _handleSecretKeyChange(event) {
    this.setState({
      secretKey: event.target.value
    });
  };

  /**
   * React built-in function.
   * @returns {XML}
   */
  render() {
    return (
      <div className="access-form-container">
        <div>
          <div>
            <p className="extra-margin">In order to access S3, please provide AWS Access Key and Secret Key of user with sufficient permissions</p>
            <form onSubmit={this.handleSubmit}>
              <input type="text"
                     name="access_key"
                     placeholder="AWS Access Key"
                     onChange={this.handleAccessKeyChange}
                     id="access_key_input"
              />
              <input type="password"
                     name="secret_key"
                     placeholder="AWS Secret Key"
                     onChange={this.handleSecretKeyChange}
                     id="secret_key_input"
              />
              <input
                id="submitButton"
                type="submit"
                value="Submit"
              />
            </form>
          </div>
          { this.props.error !== null
            ? <p>{this.props.error.message}</p> : ''
          }
        </div>
      </div>
    );
  };
}

AccessForm.propTypes = {
  // Function forwarded from app container, called after validation
  onCredentialsSubmitted: React.PropTypes.func.isRequired,
  // Error data returned from container
  error: React.PropTypes.object.isRequired,
};

export default AccessForm;
