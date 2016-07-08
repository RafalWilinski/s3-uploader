import React from 'react';

class BucketSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: window.localStorage.getItem('default_bucket') || ''
    };

    this.changeDefault = this._changeDefault.bind(this);
  }

  _changeDefault(defaultBucketName) {
    this.setState({
      current: defaultBucketName
    });

    window.localStorage.setItem('default_bucket', defaultBucketName);
  };

  render() {
    return (
      <div className="bucket-selector-container">
        <p className="bucket-selector-head">Select default upload bucket</p>
        <form>
          {this.props.buckets.map((bucket, index) =>
            <li key={index}>
              <label for={index}>
                <input onClick={(e) => this.changeDefault(bucket.Name)} type="radio" name="bucket"
                       id={index}/>
                {bucket.Name}
              </label>
            </li>
          )}
        </form>
      </div>
    );
  }
}

BucketSelector.propTypes = {
  buckets: React.PropTypes.array.isRequired,
};

export default BucketSelector;
