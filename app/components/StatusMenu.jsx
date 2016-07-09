import React from 'react';

class StatusMenu extends React.Component {
  render() {
    return (<div>
      <p>Ready</p>
    </div>);
  }
}

StatusMenu.propTypes = {
  status: React.PropTypes.object.isRequired,
};

export default StatusMenu;
