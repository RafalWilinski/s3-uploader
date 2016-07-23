import React from 'react';

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
  constructor(props) {
    super(props);
    this.state = {
      storageClass: '',
      ACL: '',
      encryption: '',
      bucket: '',
    };

    this.storageOptionChange = this._storageOptionChange.bind(this);
    this.permissionOptionChange = this._permissionOptionChange.bind(this);
    this.encryptionOptionChange = this._encryptionOptionChange.bind(this);
    this.changeDefault = this._changeDefault.bind(this);
    this.checkSelection = this._checkSelection.bind(this);
  }

  _changeDefault(bucket) {
    this.setState({
      bucket,
    });
  }

  _checkSelection(item, selection, defaultClasses = '') {
    if(item === selection) {
      return 'selected ' + defaultClasses;
    } else {
      return defaultClasses;
    }
  }

  _storageOptionChange(e, storageClass) {
    e.preventDefault();
    this.setState({
      storageClass,
    });
  }

  _permissionOptionChange(e, ACL) {
    e.preventDefault();
    this.setState({
      ACL,
    });
  }

  _encryptionOptionChange(event) {
    this.setState({
      encryption: event.target.checked ? 'AES256' : '',
    });
  }

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
  onSettingsSelected: React.PropTypes.func.isRequired,
  buckets: React.PropTypes.array.isRequired,
};

export default SettingsMenu;
