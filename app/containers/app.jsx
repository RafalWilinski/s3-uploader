import React from 'react';
import AccessForm from '../components/AccessForm.jsx';
import StatusMenu from '../components/StatusMenu.jsx';
import SettingsMenu from '../components/SettingsMenu.jsx';
import IpcService from '../IpcRendererService';

import '../styles/main.scss';

/**
 * Main Application react container responsible for front-end logic.
 * Subscribes to IPCRendererService for main process events, displays presentational components, saves credentials and more.
 * Due to lack of Redux, every information is stored in this.state.
 */
class Application extends React.Component {

  /**
   * constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      // Default permissions e.g. public-read-write
      ACL: window.localStorage.getItem('ACL') || false,
      // Default bucket name
      bucket: window.localStorage.getItem('bucket') || '',
      // Available buckets array
      buckets: [],
      // List of files which are being uploaded and were already uploaded
      files: [],
      // Tells whether user has entered correct AWS credentials
      isLoggedIn: window.localStorage.getItem('isSetupCorrectly') || false,
      // Set to true during S3.listBuckets
      isLoading: false,
      // Set to true after confirming settings in StatusMenu component
      isSettingsSet: window.localStorage.getItem('isSetupCorrectly') || false,
      // Contains error information if applicable
      loginError: {},
      // Default storage class, e.g. REDUCED_REDUNDANCY
      storageClass: window.localStorage.getItem('storageClass') || '',
    };

    this.bucketsLoaded = this._bucketsLoaded.bind(this);
    this.credentialsSubmitted = this._credentialsSubmitted.bind(this);
    this.getMenu = this._getMenu.bind(this);
    this.resetSettings = this._resetSettings.bind(this);
    this.settingsSet = this._settingsSet.bind(this);
    this.startLoading = this._startLoading.bind(this);
    this.uploadStarted = this._uploadStarted.bind(this);
    this.uploadFailed = this._uploadFailed.bind(this);
    this.uploadSucceeded = this._uploadSucceeded.bind(this);
    this.uploadProgressed = this._uploadProgressed.bind(this);

    /**
     * Subscribe for events from Electron main process related with uploading files.
     */
    IpcService.subscribeUploadEvents(
      this.uploadFailed,
      this.uploadSucceeded,
      this.uploadProgressed,
      this.uploadStarted
    );

    /**
     * Add possibility to drag files on window and prevent loading content of it.
     */
    window.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    window.addEventListener('drop', (event) => {
      event.preventDefault();
      IpcService.sendDroppedFiles(event.dataTransfer.files);
    });
  }


  /**
   * Procedure fired when bucket list is fetched using AWS SDK.
   * @param payload
   * @private
   */
  _bucketsLoaded(payload) {
    this.setState({
      buckets: payload.Buckets,
      isLoggedIn: true,
      loginError: {},
      isLoading: false,
    });
  }

  /**
   * Procedure fired when user enters credentials in AccessForm component. Calls AWS.S3.listBuckets
   * function with provided keys.
   * @param accessKey
   * @param secretKey
   * @private
   */
  _credentialsSubmitted(accessKey, secretKey) {
    this.startLoading();

    IpcService.requestBuckets(accessKey, secretKey)
      .then((data) => {
        this.bucketsLoaded(data);
        window.localStorage.setItem('accessKey', accessKey);
        window.localStorage.setItem('secretKey', secretKey);
      })
      .catch((loginError) => {
        this.setState({
          loginError,
          isLoggedIn: false,
          isLoading: false,
        })
      });
  }

  /**
   * Rendering helper function, returns presentational component suitable for current app status.
   * E.g. After entering credentials and before S3 API response, loading indicator is displayed.
   * @returns {XML}
   * @private
   */
  _getMenu() {
    if (this.state.isLoading) {
      return <div className="spin-box"></div>;
    }

    if (this.state.isLoggedIn) {
      if (this.state.isSettingsSet) {
        return <StatusMenu ACL={this.state.ACL}
                           bucket={this.state.bucket}
                           files={this.state.files}
                           resetSettings={this.resetSettings}
                           storageClass={this.state.storageClass}/>;
      } else {
        return <SettingsMenu onSettingsSelected={this.settingsSet}
                             buckets={this.state.buckets}
                             ACL={this.state.ACL} />;
      }
    } else {
      return <AccessForm onCredentialsSubmitted={this.credentialsSubmitted}
                         error={this.state.loginError} />
    }
  }

  _resetSettings() {
    window.localStorage.setItem('isSetupCorrectly', false);

    this.setState({
      isLoggedIn: false,
      isSettingsSet: false,
    });
  }

  /**
   * Procedure fired after saving settings in SettingsMenu presentational component.
   * Saves configuration in localStorage and current state. Also sends this information to main
   * electron process.
   *
   * @param settings
   * @private
   */
  _settingsSet(settings) {
    window.localStorage.setItem('storageClass', settings.storageClass);
    window.localStorage.setItem('ACL', settings.ACL);
    window.localStorage.setItem('encryption', settings.encryption);
    window.localStorage.setItem('bucket', settings.bucket);
    window.localStorage.setItem('isSetupCorrectly', true);

    IpcService.saveConfig({
      ACL: settings.ACL,
      storageClass: settings.storageClass,
      encryption: settings.encryption,
      bucket: settings.bucket,
    });

    this.setState({
      ACL: settings.ACL,
      bucket: settings.bucket,
      isSettingsSet: true,
      storageClass: settings.storageClass,
    });
  }

  /**
   * Shows loading indicator
   * @private
   */
  _startLoading() {
    this.setState({
      isLoading: true
    });
  }

  // TODO: Add directories support and abort function
  /**
   * Procedure fired when Electron main process notifies renderer process via IPC about upload process initiation.
   * Appends this.state.files with dropped files.
   * Contains file path dropped on icon.
   *
   * @param file
   * @private
   */
  _uploadStarted(file) {
    const files = this.state.files;
    files.push({
      path: file.data,
      key: file.data.split('/').pop(),
      status: 'uploading',
      url: '',
    });

    this.setState({
      files
    });
  }

  /**
   * Procedure fired when Electron main process notifies renderer process via IPC about error during upload.
   * Contains error information.
   *
   * @param error
   * @private
   */
  _uploadFailed(error) {
    const newFiles = this.state.files;
    let updated = this.state.files.find((file) => file.key === error.data.Key);
    updated.status = 'failed';
    updated.error = error;

    this.setState({
      files: newFiles,
    });
  }

  /**
   * Procedure fired when Electron main process notifies renderer process via IPC about successful upload.
   * @param data
   * @private
   */
  _uploadSucceeded(data) {
    const newFiles = this.state.files;
    let updated = this.state.files.find((file) => file.key === data.data.Key);
    updated.url = data.data.Location;
    updated.status = 'uploaded';

    this.setState({
      files: newFiles,
    });
  }

  /**
   * Procedure fired when Electron main process notifies renderer process via IPC about progression in uploading a file(s).
   * @param progress
   * @private
   */
  _uploadProgressed(progress) {

  }

  /**
   * React built-in function
   * @returns {XML}
   */
  render() {
    return (
      <div>
        {this.getMenu()}
      </div>
    );
  }
}

export default Application;
