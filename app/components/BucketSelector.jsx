import React from 'react';

class BucketSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: window.localStorage.getItem('default_bucket') || ''
    };

    this.changeDefault = this._changeDefault.bind(this);
  }

  componentDidMount() {
    this.props.buckets.forEach((bucket, index) => {
      if (bucket.Name === window.localStorage.getItem('default_bucket')) {
        document.getElementById(index).checked = true;
      }
    });
  }

  _changeDefault(current) {
    this.setState({
      current
    });
  };

  render() {
    return (
      <div className="bucket-selector-container">
        <p className="bucket-selector-head">Select default upload bucket</p>
        <form>
          {this.props.buckets.map((bucket, index) =>
            <li key={index}>
              <label for={index}>
                <input onClick={(e) => this.changeDefault(bucket.Name)}
                       type="radio"
                       name="bucket"
                       id={index}/>
                {bucket.Name}
              </label>
            </li>
          )}
        </form>
        <button onClick={(e) => this.props.onBucketSelected(this.state.current)}>
          Select default upload rights
        </button>
      </div>
    );
  }
}

BucketSelector.propTypes = {
  buckets: React.PropTypes.array.isRequired,
  onBucketSelected: React.PropTypes.func.isRequired,
};

export default BucketSelector;
