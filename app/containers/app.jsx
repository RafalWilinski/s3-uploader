import React from 'react';
import AccessForm from '../components/AccessForm.jsx';
import BucketSelector from '../components/BucketSelector.jsx';
import StatusMenu from '../components/StatusMenu.jsx';
import SettingsMenu from '../components/SettingsMenu.jsx';

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
    this.bucketSelected = this._bucketSelected.bind(this);
    this.credentialsSubmitted = this._credentialsSubmitted.bind(this);
    this.settingsSet = this._settingsSet.bind(this);
  }

  _bucketsLoaded(payload) {
    window.localStorage.setItem('isLoggedIn', true);

    this.setState({
      buckets: payload.Buckets,
      isLoggedIn: true,
      loginError: {},
    });
  }

  _bucketSelected(bucketName) {
    window.localStorage.setItem('default_bucket', bucketName);

    this.setState({
      currentMenu: 'permissionsSelect'
    });
  }

  _credentialsSubmitted(accessKey, secretKey) {
    const s3 = new S3Service(accessKey, secretKey);

    s3.getBuckets().then((data) => {
      this.bucketsLoaded(data);
    }).catch((loginError) => {
      this.setState({
        loginError,
        isLoggedIn: false,
      })
    });
  }

  _getMenu() {
    switch (this.state.currentMenu) {
      case 'bucketSelect':
        return <BucketSelector buckets={this.state.buckets}
                               onBucketSelected={this.bucketSelected}/>;
      case 'permissionsSelect':
        return <SettingsMenu onSettingsSelected={this.settingsSet}/>;
      default:
        return <StatusMenu />;
    }
  }

  _settingsSet(settings) {
    window.localStorage.setItem('storage', settings.storage);
    window.localStorage.setItem('permission', settings.permission);
    window.localStorage.setItem('encryption', settings.encryption);

    this.setState({
      currentMenu: 'ready'
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
