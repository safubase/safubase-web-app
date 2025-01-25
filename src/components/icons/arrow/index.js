// MODULES
import React from 'react';
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardArrowUp,
} from 'react-icons/md';

class Arrow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.choose_dir = this.choose_dir.bind(this);
  }

  choose_dir(dir) {
    switch (dir) {
      case 'down':
        return <MdKeyboardArrowDown onClick={this.props.onClick} />;
      case 'left':
        return <MdKeyboardArrowLeft onClick={this.props.onClick} />;
      case 'right':
        return <MdKeyboardArrowRight onClick={this.props.onClick} />;
      case 'up':
        return <MdKeyboardArrowUp onClick={this.props.onClick} />;
      default:
        return <MdKeyboardArrowUp onClick={this.props.onClick} />;
    }
  }

  render() {
    return this.choose_dir(this.props.dir);
  }
}

export default Arrow;
