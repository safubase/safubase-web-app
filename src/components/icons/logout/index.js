// MODULES
import React from 'react';
import { MdLogout } from 'react-icons/md';

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <MdLogout />;
  }
}

export default Logout;
