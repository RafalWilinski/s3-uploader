import React from 'react';

/**
 * Presentational component showing all processed files statuses and current mode.
 */
class StatusMenu extends React.Component {

  /**
   * Render helper function, shows array of files and current app status
   * @returns {XML}
   */
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
              </div>
            )
          }
        </div>
      </div>
    );
  }

  /**
   * React built-in function
   * @returns {XML}
   */
  render() {
    return (
      <div className="extra-margin">
        {
          this.getMenu()
        }
      </div>
    );
  }
}

StatusMenu.propTypes = {
  // Current permissions e.g. public-read-write
  ACL: React.PropTypes.string.isRequired,
  // Bucket where files fill be uploaded
  bucket: React.PropTypes.string.isRequired,
  // Array of all files (uploaded, failed, in progress)
  files: React.PropTypes.arrayOf(React.PropTypes.shape({
    // Filename
    key: React.PropTypes.string.isRequired,
    // Absolute path to file in local filesystem
    path: React.PropTypes.string.isRequired,
    // File status
    status: React.PropTypes.oneOf(['uploaded', 'uploading', 'failed']),
    // URL to file stored in AWS S3 service, will be set to '' if file is not uploaded
    url: React.PropTypes.string.isRequired,
  }).isRequired).isRequired,
  // Current storage class mode e.g. STANDARD_IA (Infrequent Access)
  storageClass: React.PropTypes.string.isRequired,
};

export default StatusMenu;
