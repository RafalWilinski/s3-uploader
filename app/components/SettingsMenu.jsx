import React from 'react';

/**
 * List of available storage options in AWS S3.
 * @type {*[]}
 */
const storageOptions = [
  {
    displayName: 'Standard',
    id: 'STANDARD',
  }, {
    displayName: 'Reduced Redundancy',
    id: 'REDUCED_REDUNDANCY',
  }, {
    displayName: 'Infrequent Access',
    id: 'STANDARD_IA',
  },
];

/**
 * List of available ACL policies in AWS S3.
 * @type {*[]}
 */
const permissionsOptions = [
  {
    displayName: 'Private',
    id: 'private',
  }, {
    displayName: 'Public Read',
    id: 'public-read',
  }, {
    displayName: 'Public Read/Write',
    id: 'public-read-write',
  }
];

class SettingsMenu extends React.Component {

  /**
   * Constructor, sets default state and binds context to used functions.
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      storageClass: '',
      ACL: '',
      encryption: '',
      bucket: '',
      folder: '',
    };

    this.storageOptionChange = this._storageOptionChange.bind(this);
    this.permissionOptionChange = this._permissionOptionChange.bind(this);
    this.encryptionOptionChange = this._encryptionOptionChange.bind(this);
    this.changeDefault = this._changeDefault.bind(this);
    this.checkSelection = this._checkSelection.bind(this);
    this.folderChange = this._changeFolder.bind(this);
  }

  /**
   * Changes this.state when user selects new default bucket.
   * @param bucket
   * @private
   */
  _changeDefault(bucket) {
    this.setState({
      bucket,
    });
  }

  /**
   * Changes this.folder with user supplied folder path
   * @param folder
   * @private
   */
  _changeFolder(folder) {
    this.setState({
      folder,
    });
  }

  /**
   * Checks if selected item is currently selected.
   * @param item
   * @param selection
   * @param defaultClasses
   * @private
   */
  _checkSelection(item, selection, defaultClasses = '') {
    if(item === selection) {
      return 'selected ' + defaultClasses;
    } else {
      return defaultClasses;
    }
  }

  /**
   * Changes this.state when user changes storage class.
   * @param event
   * @param storageClass
   * @private
   */
  _storageOptionChange(event, storageClass) {
    event.preventDefault();
    this.setState({
      storageClass,
    });
  }

  /**
   * Changes this.state when user changes default upload permissions
   * @param event
   * @param ACL
   * @private
   */
  _permissionOptionChange(event, ACL) {
    event.preventDefault();
    this.setState({
      ACL,
    });
  }

  /**
   * Changes this.state when user toggles encryption
   * @param event
   * @private
   */
  _encryptionOptionChange(event) {
    this.setState({
      encryption: event.target.checked ? 'AES256' : '',
    });
  }

  /**
   * React built-in function
   * @returns {XML}
   */
  render() {
    return (
      <div className="permissions-dialog-container">
        <div className="left column">
          <ul>
            {this.props.buckets.map((bucket, index) =>
              <li key={index}>
                <div onClick={(e) => this.changeDefault(bucket.Name)} id={index}>
                  <span className={this.checkSelection(bucket.Name, this.state.bucket)}>
                    {bucket.Name}
                  </span>
                </div>
              </li>
            )}
          </ul>
        </div>

        <div className="right column">
          <form>
            <p className="form-head">Folder</p>
            <input type="text" name="folder"
                    onBlur={(e) => this.folderChange(e.target.value)}>
            </input>
          </form>
          <form>
            <p className="form-head">Storage Class</p>
            {
              storageOptions.map((option, index) =>
                <button type="radio" name="storage"
                        onClick={(e) => this.storageOptionChange(e, option.id)} key={index}>
                  <span className={this.checkSelection(option.id, this.state.storageClass, 'white big')}>
                    {option.displayName}
                  </span>
                </button>
              )
            }
          </form>
          <form>
            <p className="form-head">Default Permissions</p>
            {
              permissionsOptions.map((option, index) =>
                <button type="radio" name="permissions"
                        onClick={(e) => this.permissionOptionChange(e, option.id)} key={index}>
                  <span className={this.checkSelection(option.id, this.state.ACL, 'white big')}>
                    {option.displayName}
                  </span>
                </button>
              )
            }
          </form>
          <button onClick={(e) => this.props.onSettingsSelected(this.state)}>
            Confirm
          </button>
        </div>
      </div>
    );
  }
}

SettingsMenu.propTypes = {
  // Function forwarded from app container, to be called when confirming settings
  onSettingsSelected: React.PropTypes.func.isRequired,
  // List of buckets returned from S3Service
  buckets: React.PropTypes.array.isRequired,
};

export default SettingsMenu;
