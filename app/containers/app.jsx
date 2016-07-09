import React from 'react';
import AccessForm from '../components/AccessForm.jsx';
import BucketSelector from '../components/BucketSelector.jsx';
import StatusMenu from '../components/StatusMenu.jsx';
import SettingsMenu from '../components/SettingsMenu.jsx';
const { ipcRenderer } = require('electron');

import IpcService from '../IpcRendererService';

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
      status: {
        name: 'Ready',
      }
    };

    this.bucketsLoaded = this._bucketsLoaded.bind(this);
    this.getMenu = this._getMenu.bind(this);
    this.bucketSelected = this._bucketSelected.bind(this);
    this.credentialsSubmitted = this._credentialsSubmitted.bind(this);
    this.settingsSet = this._settingsSet.bind(this);
    this.startLoading = this._startLoading.bind(this);

    ipcRenderer.on('asynchronous-message', (event, arg) => {
      console.log(arg);
    });
  }

  _bucketsLoaded(payload) {
    this.setState({
      buckets: payload.Buckets,
      isLoggedIn: true,
      loginError: {},
      isLoading: false,
    });
  }

  _bucketSelected(bucketName) {
    window.localStorage.setItem('bucket', bucketName);

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
        return <StatusMenu status={this.state.status}/>;
    }
  }

  _settingsSet(settings) {
    window.localStorage.setItem('storageClass', settings.storage);
    window.localStorage.setItem('ACL', settings.permission);
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
