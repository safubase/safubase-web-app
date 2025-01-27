// MODULES
import React from 'react';
import cn from 'classnames';

// CONTEXT
import { Context } from '../../../context';

// STYLES
import style from './style.module.css';

class Modal_presale extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return this.state.open ? (
      <div className={cn(style['modalpresale'])}>
        <div className={cn(style['modalpresale-content'])}>
          <img
            onClick={(e) => {
              this.setState({
                ...this.state,
                open: false,
              });
            }}
            src="/images/cross_white.png"
            className={cn(style['modalpresale-content-closebtn'])}
          />

          <div className={cn(style['modalpresale-content-logoctr'])}>
            <img
              src="/favicon.ico"
              className={cn(style['modalpresale-content-logoctr-logo'])}
            />
          </div>

          <div className={cn(style['modalpresale-content-title'])}>
            SAFUBASE <span>PRESALE</span>
          </div>

          <div className={cn(style['modalpresale-content-desc'])}>
            Safubase's official token is on Presale! <br /> and
            Check out and participate in the <br /> presale of the most
            innovative project of 2025, which has big goals after the presale!
          </div>

          <div className={cn(style['modalpresale-content-btnctr'])}>
            <a
              href="https://presale.safubase.com/"
              target="_blank"
              className={cn(style['modalpresale-content-btnctr-btn'])}
            >
              JOIN PRESALE
            </a>
          </div>
        </div>
      </div>
    ) : null;
  }
}

export default Modal_presale;
