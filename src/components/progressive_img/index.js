import React from 'react';
import cn from 'classnames';

// CONTEXT
import { Context } from '../../context';

// STYLES
import style from './style.module.css';

class Progressive_img extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};

    this.img_ref = React.createRef();

    this.onscroll = this.onscroll.bind(this);
  }

  onscroll() {
    const img = this.img_ref.current; // element
    const rect = img.getBoundingClientRect();

    if (
      rect.y + rect.height < 0 ||
      window.innerHeight - (rect.y + rect.height) < 0
    ) {
      return;
    }

    const findex = Math.floor(
      (window.innerHeight - (rect.y + rect.height)) * 0.12 // TODO make variable of that multiplication
    );

    img.src = `${this.props.fn}${findex}.${this.props.ext}`; // TODO edit this path and file ext
  }

  componentDidMount() {
    this.onscroll();
    window.addEventListener('scroll', this.onscroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onscroll);
  }

  render() {
    return (
      <img
        className={cn(style['img'], this.props.className)}
        ref={this.img_ref}
        src=""
        alt=""
        title=""
      />
    );
  }
}

export default Progressive_img;
