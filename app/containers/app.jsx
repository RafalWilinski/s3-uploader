import React from 'react';
import AccessForm from '../components/AccessForm.jsx';
import BucketSelector from '../components/BucketSelector.jsx';

import '../styles/main.scss';

class Application extends React.Component {
  render() {
    return (
      <div>
        {window.localStorage.getItem('isLoggedIn') 
          ? <BucketSelector />
          : <AccessForm />
        }
      </div>
    );
  }
}

export default Application;
