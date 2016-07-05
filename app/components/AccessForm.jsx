import React from 'react';

const AccessForm = () => {
  return (
    <div className="access-form-container">
      <div>
        <p>In order to access S3, please provide AWS Access Key and Secret Key of user with
          sufficient permissions</p>
        <form>
          <input type="text" name="access_key" placeholder="AWS Access Key"/>
          <input type="password" name="secret_key" placeholder="AWS Secret Key"/>
        </form>
      </div>
    </div>
  );
};

export default AccessForm;
