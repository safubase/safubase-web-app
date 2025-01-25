// MODULES
import React from 'react';
import { MdOutlineError } from 'react-icons/md';

class Warning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <MdOutlineError />;
  }
}

export default Warning;
