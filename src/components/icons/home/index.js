// MODULES
import React from 'react';
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return this.props.active ? <AiFillHome /> : <AiOutlineHome />;
  }
}

export default Home;
