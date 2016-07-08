import React from 'react';
import AccessForm from '../components/AccessForm.jsx';
import BucketSelector from '../components/BucketSelector.jsx';
import StatusMenu from '../components/StatusMenu.jsx';
import PermissionsDialog from '../components/PermissionsDialog.jsx';

import S3Service from '../S3Service';

import '../styles/main.scss';

class Application extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buckets: [],
      currentMenu: 'bucketSelect',
      isLoggedIn: window.localStorage.getItem('isLogggedIn') || false,
      loginError: {},
    };

    this.bucketsLoaded = this._bucketsLoaded.bind(this);
    this.getMenu = this._getMenu.bind(this);
    this.onBucketSelected = this._onBucketSelected.bind(this);
    this.credentialsSubmitted = this._credentialsSubmitted.bind(this);
  }

  _bucketsLoaded(payload) {
    window.localStorage.setItem('isLoggedIn', true);

    this.setState({
      buckets: payload.Buckets,
      isLoggedIn: true
    });
  }

  _credentialsSubmitted(accessKey, secretKey) {
    const s3 = new S3Service(accessKey, secretKey);

    s3.getBuckets().then((data) => {
      this.bucketsLoaded(data);

      this.setState({
        loginError: {},
      });
    }).catch((loginError) => {
      this.setState({
        loginError,
      })
    });
  }

  _getMenu() {
    switch (this.state.currentMenu) {
      case 'bucketSelect':
        return <BucketSelector buckets={this.state.buckets}
                               onBucketSelected={this.onBucketSelected}/>;
      case 'permissionsSelect':
        return <PermissionsDialog permissions={{}}/>;
      default:
        return <StatusMenu status={{}}/>;
    }
  }

  _onBucketSelected(bucketName) {
    window.localStorage.setItem('default_bucket', bucketName);

    this.setState({
      currentMenu: 'permissionsSelect'
    });
  }

  render() {
    return (
      <div>
        {!this.state.isLoggedIn
          ? <AccessForm onCredentialsSubmitted={this.credentialsSubmitted}
                        error={this.state.loginError}/>
          : this.getMenu()
        }
      </div>
    );
  }
}

export default Application;
