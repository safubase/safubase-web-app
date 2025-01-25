// MODULES
import React from 'react';
import { HiDocument, HiOutlineDocument } from 'react-icons/hi';

class Docs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return this.props.active ? (
      <HiDocument onClick={this.props.onClick} />
    ) : (
      <HiOutlineDocument />
    );
  }
}

export default Docs;
