// MODULES
import React from 'react';
import { BiSearchAlt } from 'react-icons/bi';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return this.props.active ? <BiSearchAlt /> : <BiSearchAlt />;
  }
}

export default Search;
