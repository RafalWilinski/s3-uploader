import React from 'react';

const storageOptions = [
  {
    displayName: 'Standard Storage',
    id: 'STANDARD',
  }, {
    displayName: 'Reduced Redundancy Storage',
    id: 'REDUCED_REDUNDANCY',
  }, {
    displayName: 'Infrequent Access Storage',
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
    };

    this.storageOptionChange = this._storageOptionChange.bind(this);
    this.permissionOptionChange = this._permissionOptionChange.bind(this);
    this.encryptionOptionChange = this._encryptionOptionChange.bind(this);
  }

  _storageOptionChange(storageClass) {
    this.setState({
      storageClass
    });
  }

  _permissionOptionChange(ACL) {
    this.setState({
      ACL
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
        <form>
          <p>Storage Class</p>
          {
            storageOptions.map((option, index) =>
              <label key={index}>
                <input type="radio" name="storage"
                       onClick={(e) => this.storageOptionChange(option.id)}/>
                {option.displayName}
              </label>)
          }
        </form>
        <form>
          <label>
            <input type="checkbox" name="encryption"
                   onClick={(e) => this.encryptionOptionChange(e)}/>
            Use Server Side Encryption
          </label>
        </form>
        <form>
          <p>Default Permissions</p>
          {
            permissionsOptions.map((option, index) =>
              <label key={index}>
                <input type="radio" name="permissions"
                       onClick={(e) => this.permissionOptionChange(option.id)}/>
                {option.displayName}
              </label>)
          }
        </form>
        <button onClick={(e) => this.props.onSettingsSelected(this.state)}>
          Confirm
        </button>
      </div>
    );
  }
}

SettingsMenu.propTypes = {
  onSettingsSelected: React.PropTypes.func.isRequired,
};

export default SettingsMenu;
