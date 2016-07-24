import React from 'react';

class StatusMenu extends React.Component {

  getMenu() {
    return (
      <div>
        <div>
          <p>Bucket Selected: {this.props.bucket}</p>
          <p>Permissions: {this.props.ACL}</p>
        </div>
        <div>
          {
            this.props.files.map((file, index) =>
              <div key={index}>
                <p>{file.key}</p>
                <span>{file.status}</span>
                <button>Abort</button>
              </div>)
          }
        </div>
      </div>
    );
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
    key: React.PropTypes.string.isRequired,
  }).isRequired).isRequired,
};

export default StatusMenu;
