// MODULES
import React from 'react';
import cn from 'classnames';

// COMPONENTS
import Icon_hamburger from '../icons/hamburger';
import Icon_notification from '../icons/notification';
import Icon_docs from '../icons/doc';
import Icon_braces from '../icons/braces';
import Icon_chart from '../icons/chart';
import Icon_stock from '../icons/stock';
import Icon_lock from '../icons/lock';
import Icon_security from '../icons/security';
import Icon_telegram from '../icons/telegram';
import Icon_instagram from '../icons/instagram';
import Icon_twitter from '../icons/twitter';

// CONTEXT
import { Context } from '../../context';

// STYLES
import style from './style.module.css';

class Header extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      nav_open: false,
      not_open: false,
      not_opened: true,
    };

    this.ref_notificationmenu = React.createRef();
  }

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <header className={cn(style['header'])}>
        <div
          onClick={() => {
            this.setState({
              ...this.state,
              nav_open: false,
            });
          }}
          className={cn(
            style['header-navshadow'],
            this.state.nav_open ? style['header-navshadowopen'] : null
          )}
        ></div>
        <div
          className={cn(
            style['header-nav'],
            this.state.nav_open ? style['header-navopen'] : null
          )}
        >
          <a href="/" target="_self" className={cn(style['header-nav-logo'])}>
            <img src="/favicon.ico" />
          </a>

          <label className={cn(style['header-nav-label'])}>DEVELOPER</label>

          <a
            href="https://docs.quontral.com/quontral-developer/quick-start"
            target="_blank"
            className={cn(style['header-nav-item'])}
          >
            <Icon_braces active /> <span>Developer</span>
          </a>

          <a
            href="https://docs.quontral.com"
            target="_blank"
            className={cn(style['header-nav-item'])}
          >
            <Icon_docs active /> <span>DOCS</span>
          </a>

          <label className={cn(style['header-nav-label'])}>CONTENT</label>

          <a
            onClick={(e) => {
              this.setState({
                ...this.state,
                nav_open: false,
              });

              if (window.location.pathname !== '/') {
                e.preventDefault();

                window.location.replace('https://quontral.com#complastadts');
              }
            }}
            href="#complastadts"
            target="_self"
            className={cn(style['header-nav-item'])}
          >
            <Icon_security active /> <span>Latest Audits</span>
          </a>

          <a
            onClick={(e) => {
              this.setState({
                ...this.state,
                nav_open: false,
              });

              if (window.location.pathname !== '/') {
                e.preventDefault();

                window.location.replace(
                  'https://quontral.com#compwhaletracker'
                );
              }
            }}
            href="#compwhaletracker"
            target="_self"
            className={cn(style['header-nav-item'])}
          >
            <Icon_stock active /> <span>Whale Alerts</span>
          </a>

          <a
            onClick={(e) => {
              this.setState({
                ...this.state,
                nav_open: false,
              });

              if (window.location.pathname !== '/') {
                e.preventDefault();

                window.location.replace(
                  'https://quontral.com#compupcomingunlocks'
                );
              }
            }}
            href="#compupcomingunlocks"
            target="_self"
            className={cn(style['header-nav-item'])}
          >
            <Icon_lock active /> <span>Upcoming Unlocks</span>
          </a>

          <div className={cn(style['header-nav-socials'])}>
            <a href="https://t.me/quontral" target="_blank">
              <Icon_telegram />
            </a>

            <a href="https://instagram.com/quontral" target="_blank">
              <Icon_instagram />
            </a>

            <a href="https://twitter.com/quontral" target="_blank">
              <Icon_twitter />
            </a>
          </div>
        </div>

        <div
          onClick={() => {
            this.setState({
              ...this.state,
              nav_open: !this.state.nav_open,
              not_open: false,
            });
          }}
          className={cn(style['header-hamburgericon'])}
        >
          <Icon_hamburger />
        </div>

        <a className={cn(style['header-logo'])} href="/" target="_self">
          <img src="/images/mobile_logo.png" />
        </a>

        <div
          onClick={(e) => {
            this.setState({
              ...this.state,
              nav_open: false,
              not_open: !this.state.not_open,
              not_opened: true,
            });
          }}
          className={cn(style['header-notificationicon'])}
        >
          <div
            className={cn(
              style['header-notification-dot'],
              this.state.not_opened
                ? style['header-notification-dotinactive']
                : null
            )}
          ></div>

          <Icon_notification />
        </div>

        <div
          ref={this.ref_notificationmenu}
          className={cn(
            style['header-notificationmenu'],
            this.state.not_open ? style['header-notificationmenuopen'] : null
          )}
        >
          {/**
             * 
             *           <a
            target="_blank"
            href="https://www.pinksale.finance/launchpad/0x6fC397ddF50A70817b41dF1BAb806C1A68fA7Ae1?chain=BSC"
            className={cn(style['header-notificationmenu-item'])}
          >
            <div className={cn(style['header-notificationmenu-item-date'])}>
              {new Date().toDateString()}
            </div>
            Safubase in Presale, BUY NOW!!!
          </a>
             */}
        </div>
      </header>
    );
  }
}

export default Header;
