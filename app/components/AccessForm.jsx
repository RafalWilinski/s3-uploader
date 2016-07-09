import React from 'react';

import '../styles/base/_animations.scss';

class AccessForm extends React.Component {
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

      setTimeout(() => {
        document.getElementById('access_key_input').className = '';
        document.getElementById('secret_key_input').className = '';
      }, 1500);
    }
  };

  _handleAccessKeyChange(event) {
    this.setState({
      accessKey: event.target.value
    });
  };

  _handleSecretKeyChange(event) {
    this.setState({
      secretKey: event.target.value
    });
  };

  render() {
    return (
      <div className="access-form-container">
        <div>
          <div>
            <p>In order to access S3, please provide AWS Access Key and Secret Key of user with
              sufficient permissions</p>
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
  onCredentialsSubmitted: React.PropTypes.func.isRequired,
  error: React.PropTypes.object.isRequired,
};

export default AccessForm;
