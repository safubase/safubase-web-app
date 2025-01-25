// MODULES
import React from 'react';
import cn from 'classnames';

// STYLES
import style from './style.module.css';

class LineGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className={cn(style['graph'])}>graph</div>;
  }
}

export default LineGraph;
