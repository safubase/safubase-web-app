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
            QUONTRAL <span>PRESALE</span>
          </div>

          <div className={cn(style['modalpresale-content-desc'])}>
            Quontral's official token is on Presale between june 2nd <br /> and
            5th. Check out and participate in the <br /> presale of the most
            innovative project of 2023, which has big goals after the presale
          </div>

          <div className={cn(style['modalpresale-content-btnctr'])}>
            <a
              href="https://www.pinksale.finance/launchpad/0x6fC397ddF50A70817b41dF1BAb806C1A68fA7Ae1?chain=BSC"
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
