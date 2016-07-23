import React from 'react';

class StatusMenu extends React.Component {

  getMenu() {
    if (this.props.status === 'Ready') {
      return (
        <div>
          <p>Bucket Selected: {this.props.bucket}</p>
          <p>Permissions: {this.props.ACL}</p>
        </div>
      );
    } else {
      return (
        <div>
          {
            this.props.files.map((file) =>
              <div>
                <p>{file.name}</p>
                <button onClick={file.abortFunction}>Abort</button>
              </div>)
          }
        </div>
      );
    }
  }

  render() {
    return (
      <div className="extra-margin">
        <p>{this.props.status}</p>
        {this.getMenu()}
      </div>
    );
  }
}

StatusMenu.propTypes = {
  ACL: React.PropTypes.string.isRequired,
  bucket: React.PropTypes.string.isRequired,
  status: React.PropTypes.string.isRequired,
  files: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    abortFunction:  React.PropTypes.func.isRequired,
  }).isRequired).isRequired,
};

export default StatusMenu;
