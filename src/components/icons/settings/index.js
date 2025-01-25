// MODULES
import React from 'react';
import { RiSettings4Fill, RiSettings4Line } from 'react-icons/ri';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return this.props.active ? <RiSettings4Fill /> : <RiSettings4Line />;
  }
}

export default Settings;
