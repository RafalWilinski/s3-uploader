import React from 'react';
import AccessForm from '../components/AccessForm.jsx';
import BucketSelector from '../components/BucketSelector.jsx';

import '../styles/main.scss';

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buckets: [],
    };

    this.bucketsLoaded = this._bucketsLoaded.bind(this);
  }

  _bucketsLoaded(payload) {
    this.setState({
      buckets: payload.Buckets
    });

    window.localStorage.setItem('isLoggedIn', true);
  }

  render() {
    return (
      <div>
        {this.state.buckets.length > 0
          ? <BucketSelector buckets={this.state.buckets} />
          : <AccessForm onBucketsLoaded={this.bucketsLoaded} />
        }
      </div>
    );
  }
}

export default Application;
