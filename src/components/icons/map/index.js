// MODULES
import React from 'react';
import { BsMapFill, BsMap } from 'react-icons/bs';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return this.props.active ? <BsMapFill /> : <BsMap />;
  }
}

export default Map;
