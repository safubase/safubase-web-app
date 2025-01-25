// MODULES
import React from 'react';
import { AiOutlineLoading } from 'react-icons/ai';

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <AiOutlineLoading />;
  }
}

export default Loading;
