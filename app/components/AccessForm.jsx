import React from 'react';
import S3Service from '../S3Service';

import '../styles/base/_animations.scss';

class AccessForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessKey: '',
      secretKey: '',
      isLoading: false,
      error: null,
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
      this.setState({
        isLoading: true,
        error: null
      });

      const s3 = new S3Service(accessKey, secretKey);

      s3.getBuckets().then((data) => {
        this.setState({
          isLoading: false
        });

        this.props.onBucketsLoaded(data);
      }).catch((error) => {
        console.log(error);
        this.setState({
          isLoading: false,
          error
        });
      });
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
          { this.state.isLoading
            ? <div className="spin-box"></div>
            : <div>
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
          }
          { this.state.error !== null
            ? <p>{this.state.error.message}</p> : ''
          }
        </div>
      </div>
    );
  };
}

AccessForm.propTypes = {
  onBucketsLoaded: React.PropTypes.func.isRequired,
};

export default AccessForm;
