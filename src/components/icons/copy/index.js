// MODULES
import React from 'react';
import { IoIosCopy } from 'react-icons/io';

class Copy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <IoIosCopy onClick={this.props.onClick} />;
  }
}

export default Copy;
