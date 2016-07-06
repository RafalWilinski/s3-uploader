import React from 'react';
import S3Service from '../S3Service';

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

  _handleSubmit(event) {
    event.preventDefault();
    const accessKey = this.state.accessKey.trim();
    const secretKey = this.state.secretKey.trim();
    console.log(accessKey + " " + secretKey);

    if (accessKey !== null && secretKey !== null) {
      const s3 = new S3Service(accessKey, secretKey);
      s3.getBuckets().then((data) => {
        console.log(data);
      })
    } else {
      
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
          <p>In order to access S3, please provide AWS Access Key and Secret Key of user with
            sufficient permissions</p>
          <form onSubmit={this.handleSubmit}>
            <input type="text"
                   name="access_key"
                   placeholder="AWS Access Key"
                   onChange={this.handleAccessKeyChange}
            />
            <input type="password"
                   name="secret_key"
                   placeholder="AWS Secret Key"
                   onChange={this.handleSecretKeyChange}
            />
            <input
              id="submitButton"
              type="submit"
              value="Submit"
            />
          </form>
        </div>
      </div>
    );
  };
}

export default AccessForm;
