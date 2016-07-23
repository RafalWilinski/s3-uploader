import React from 'react';
import AccessForm from '../components/AccessForm.jsx';
import StatusMenu from '../components/StatusMenu.jsx';
import SettingsMenu from '../components/SettingsMenu.jsx';
import IpcService from '../IpcRendererService';

import '../styles/main.scss';

class Application extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buckets: [],
      isLoggedIn: false,
      isLoading: false,
      isSettingsSet: false,
      loginError: {},
      bucket: '',
      ACL: '',
      region: '',
      status: 'Ready',
    };

    this.bucketsLoaded = this._bucketsLoaded.bind(this);
    this.credentialsSubmitted = this._credentialsSubmitted.bind(this);
    this.getMenu = this._getMenu.bind(this);
    this.settingsSet = this._settingsSet.bind(this);
    this.startLoading = this._startLoading.bind(this);
    this.uploadStarted = this._uploadStarted.bind(this);
    this.uploadFailed = this._uploadFailed.bind(this);
    this.uploadSucceeded = this._uploadSucceeded.bind(this);
    this.uploadProgressed = this._uploadProgressed.bind(this);

    IpcService.listenForUploadEvents(
      this.uploadFailed,
      this.uploadSucceeded,
      this.uploadProgressed,
      this.uploadStarted
    );
  }

  _bucketsLoaded(payload) {
    this.setState({
      buckets: payload.Buckets,
      isLoggedIn: true,
      loginError: {},
      isLoading: false,
    });
  }

  _credentialsSubmitted(accessKey, secretKey) {
    this.startLoading();

    IpcService.requestBuckets(accessKey, secretKey)
      .then((data) => {
        this.bucketsLoaded(data);
      })
      .catch((loginError) => {
        this.setState({
          loginError,
          isLoggedIn: false,
          isLoading: false,
        })
      });
  }

  _getMenu() {
    if (this.state.isLoading) {
      return <div className="spin-box"></div>;
    }

    if (this.state.isLoggedIn) {
      if (this.state.isSettingsSet) {
        return <StatusMenu status={this.state.status} bucket={this.state.bucket} ACL={this.state.ACL} region={this.state.region}/>;
      } else {
        return <SettingsMenu onSettingsSelected={this.settingsSet} buckets={this.state.buckets}
                             ACL={this.state.ACL} />;
      }
    } else {
      return <AccessForm onCredentialsSubmitted={this.credentialsSubmitted}
                         error={this.state.loginError} />
    }
  }

  _settingsSet(settings) {
    window.localStorage.setItem('storageClass', settings.storageClass);
    window.localStorage.setItem('ACL', settings.ACL);
    window.localStorage.setItem('encryption', settings.encryption);
    window.localStorage.setItem('bucket', settings.bucket);
    window.localStorage.setItem('region', settings.region);

    IpcService.saveConfig({
      ACL: settings.ACL,
      storageClass: settings.storageClass,
      encryption: settings.encryption,
      bucket: settings.bucket,
      region: settings.region,
    });

    this.setState({
      ACL: settings.ACL,
      bucket: settings.bucket,
      region: settings.region,
      isSettingsSet: true,
    });
  }

  _startLoading() {
    this.setState({
      isLoading: true
    });
  }

  _uploadStarted() {
    this.setState({
      status: 'Uploading...',
    });
  }

  _uploadFailed(error) {
    this.setState({
      status: 'Ready',
    });
  }

  _uploadSucceeded(data) {
    this.setState({
      status: 'Ready',
    });
  }

  _uploadProgressed(progress) {
    console.log(process);
    this.setState({
      status: 'Uploading...',
    });
  }

  render() {
    return (
      <div>
        {this.getMenu()}
      </div>
    );
  }
}

export default Application;
