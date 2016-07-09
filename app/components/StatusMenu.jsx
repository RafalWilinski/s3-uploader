import React from 'react';

class StatusMenu extends React.Component {
  render() {
    return (<div>
      <p>{this.props.status.name}</p>
      {
        this.props.status.name !== 'ready'
        ? ''
          : ''
      }
    </div>);
  }
}

StatusMenu.propTypes = {
  status: React.PropTypes.object.isRequired,
};

export default StatusMenu;
