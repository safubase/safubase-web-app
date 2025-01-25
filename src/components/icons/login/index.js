// MODULES
import React from 'react';
import { MdOutlineLogin } from 'react-icons/md';

class LoginIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return this.props.active ? <MdOutlineLogin /> : <MdOutlineLogin />;
  }
}

export default LoginIcon;
