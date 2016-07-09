import React from 'react';
import AccessForm from '../components/AccessForm.jsx';
import BucketSelector from '../components/BucketSelector.jsx';
import StatusMenu from '../components/StatusMenu.jsx';
import SettingsMenu from '../components/SettingsMenu.jsx';

import IpcService from '../IpcService';

import '../styles/main.scss';

class Application extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buckets: [],
      currentMenu: 'bucketSelect',
      isLoggedIn: false,
      isLoading: false,
      loginError: {},
    };

    this.bucketsLoaded = this._bucketsLoaded.bind(this);
    this.getMenu = this._getMenu.bind(this);
    this.bucketSelected = this._bucketSelected.bind(this);
    this.credentialsSubmitted = this._credentialsSubmitted.bind(this);
    this.settingsSet = this._settingsSet.bind(this);
    this.startLoading = this._startLoading.bind(this);
    this.stopLoading = this._stopLoading.bind(this);
  }

  componentWillMount() {
    if (window.localStorage.getItem('validCredentialsStored')) {
      this.credentialsSubmitted(window.localStorage.getItem('accessKey'),
        window.localStorage.getItem('secretKey'));
    }
  }

  _bucketsLoaded(payload) {
    window.localStorage.setItem('validCredentialsStored', true);

    this.setState({
      buckets: payload.Buckets,
      isLoggedIn: true,
      loginError: {},
      isLoading: false,
    });
  }

  _bucketSelected(bucketName) {
    window.localStorage.setItem('default_bucket', bucketName);

    this.setState({
      currentMenu: 'permissionsSelect'
    });
  }

  _credentialsSubmitted(accessKey, secretKey) {
    this.startLoading();

    IpcService.requestBuckets(accessKey, secretKey).then((data) => {
      this.bucketsLoaded(data);
    }).catch((loginError) => {
      this.setState({
        loginError,
        isLoggedIn: false,
        isLoading: false,
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

  _startLoading() {
    this.setState({
      isLoading: true
    });
  }

  _stopLoading() {
    this.setState({
      isLoading: false
    });
  }

  render() {
    return (
      <div>
        {!this.state.isLoading
          ? !this.state.isLoggedIn
          ? <AccessForm onCredentialsSubmitted={this.credentialsSubmitted}
                        error={this.state.loginError}/>
          : this.getMenu()
          : <div className="spin-box"></div>
        }
      </div>
    );
  }
}

export default Application;
