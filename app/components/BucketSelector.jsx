import React from 'react';

const BucketSelector = (props) => {
  return (
    <div>
      <h1>Buckets</h1>
      {props.buckets.map((bucket, index) =>
        <p key={index}>{bucket.Name}</p>
      )}
    </div>
  );
};

BucketSelector.propTypes = {
  buckets: React.PropTypes.array.isRequired,
}

export default BucketSelector;
