import React from 'react';
const { clipboard } = require('electron');

/**
 * Changes clipboard contents to file URL from AWS S3 if file was uploaded successfully.
 * @param file
 */
const saveLinkToClipboard = (file) => {
  if (file.status === 'uploaded' && file.url !== '') {
    clipboard.writeText(file.url);
  } else {
    console.warn('File has been not uploaded yet!');
  }
};

/**
 * Presentational component showing all processed files statuses and current mode.
 */
const StatusMenu = (props) => (
  <div className="status-menu-container">
    <div className="status-menu-bar">
      <div className="align-start">
        <span className="bigger">{props.bucket}</span>
        <span>Permissions: {props.ACL}</span>
        <span>Storage Class: {props.storageClass}</span>
      </div>
    </div>
    {
      props.files.length === 0
        ?
        <div className="status-menu-nofiles">
          <span>No files were uploaded yet.</span>
        </div>
        :
        <ul className="status-menu-filelist">
          {
            props.files.map((file, index) =>
              <li key={index} onClick={(e) => saveLinkToClipboard(file)}>
                <span>{file.key}</span>
                <div className={file.status + ' status-icon'}/>
              </li>
            )
          }
        </ul>
    }
  </div>
);


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
