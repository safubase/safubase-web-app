// MODULES
import React from 'react';
import cn from 'classnames';

// CONTEXT
import { Context } from '../../context';

// COMPONENTS
import Icon_home from '../icons/home';
import Icon_profile from '../icons/profile';
import Icon_settings from '../icons/settings';
import Icon_login from '../icons/login';
import Icon_logout from '../icons/logout';
import Icon_doc from '../icons/doc';
import Icon_map from '../icons/map';
import Icon_braces from '../icons/braces';
import Icon_chart from '../icons/chart';
import Icon_telegram from '../icons/telegram';
import Icon_twitter from '../icons/twitter';
import Icon_instagram from '../icons/instagram';

// UTILS
import UTILS from '../../utils/index';

// STYLES
import style from './style.module.css';

class Sidebar extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      pathname: window.location.pathname,
    });
  }

  render() {
    return (
      <aside
        className={cn(
          style['sidebarctr'],
          this.context.state.ui_sidebar_open ? style['sidebarctropen'] : null
        )}
        onMouseOver={() => {
          if (window.innerWidth < 650) return;

          this.context.set_state({
            ...this.context.state,
            ui_sidebar_open: true,
          });
        }}
        onMouseLeave={() => {
          if (window.innerWidth < 650) return;

          this.context.set_state({
            ...this.context.state,
            ui_sidebar_open: false,
          });
        }}
      >
        <div className={cn(style['sidebarctr-sidebar'])}>
          <div className={cn(style['sidebarctr-sidebar-logo'])}>
            <a href="https://app.safubase.com" target="_self">
              <img src="/images/safubase.jpg" />
            </a>
          </div>

          <div className={cn(style['sidebarctr-sidebar-top'])}>
            <a className={cn(style['sidebarctr-sidebar-top-iconctr'])} href="/">
              <Icon_home active={this.state.pathname === '/' ? true : false} />
              <span
                className={cn(
                  this.context.state.ui_sidebar_open
                    ? style['sidebarctr-sidebar-top-iconctr-spanactive']
                    : null
                )}
              >
                Home
              </span>
            </a>
          </div>

          <div className={cn(style['sidebarctr-sidebar-top'])}>
            <a
              className={cn(style['sidebarctr-sidebar-top-iconctr'])}
              href="https://safubase.gitbook.io/"
              target="_blank"
            >
              <Icon_braces />

              <span
                className={cn(
                  this.context.state.ui_sidebar_open
                    ? style['sidebarctr-sidebar-top-iconctr-spanactive']
                    : null
                )}
              >
                Developer
              </span>
            </a>
          </div>

          <div className={cn(style['sidebarctr-sidebar-top'])}>
            <a
              className={cn(style['sidebarctr-sidebar-top-iconctr'])}
              href="https://safubase.gitbook.io/"
              target="_blank"
            >
              <Icon_doc
                active={
                  this.state.pathname === 'safubase.gitbook.io/' ? true : false
                }
              />

              <span
                className={cn(
                  this.context.state.ui_sidebar_open
                    ? style['sidebarctr-sidebar-top-iconctr-spanactive']
                    : null
                )}
              >
                DOCS
              </span>
            </a>
          </div>

          <div
            className={cn(
              style['sidebarctr-sidebar-socials'],
              this.context.state.ui_sidebar_open
                ? style['sidebarctr-sidebar-socialsopen']
                : null
            )}
          >
            <a
              className={cn(
                style['sidebarctr-sidebar-socials-iconctr'],
                this.context.state.ui_sidebar_open
                  ? style['sidebarctr-sidebar-socials-iconctropen']
                  : null
              )}
              href="https://t.me/safubase"
              target="_blank"
            >
              <Icon_telegram />
            </a>

            <a
              className={cn(
                style['sidebarctr-sidebar-socials-iconctr'],
                this.context.state.ui_sidebar_open
                  ? style['sidebarctr-sidebar-socials-iconctropen']
                  : null
              )}
              href="https://instagram.com/safubase"
              target="_blank"
            >
              <Icon_instagram />
            </a>

            <a
              className={cn(
                style['sidebarctr-sidebar-socials-iconctr'],
                this.context.state.ui_sidebar_open
                  ? style['sidebarctr-sidebar-socials-iconctropen']
                  : null
              )}
              href="https://twitter.com/safubase"
              target="_blank"
            >
              <Icon_twitter />
            </a>
          </div>

          <div className={cn(style['sidebarctr-sidebar-bottom'])}>
            <div
              onClick={async () => {
                if (!this.context.state.wallet_address) {
                  const accounts = await UTILS.wallet_connect({ chain_id: 56 });

                  if (accounts === null) {
                    this.context.set_state({
                      ...this.context.state,
                      ui_toasts: [
                        ...this.context.state.ui_toasts,
                        {
                          type: 'error',
                          message: 'No web3 wallet detected in the browser',
                          created_at: new Date(),
                        },
                      ],
                    });

                    return;
                  }

                  this.context.set_state({
                    ...this.context.state,
                    wallet_address: accounts[0],
                  });
                }
              }}
              className={cn(style['sidebarctr-sidebar-bottom-iconctr'])}
            >
              {this.context.state.wallet_address ? (
                <>
                  <Icon_logout />
                  <span
                    className={cn(
                      this.context.state.ui_sidebar_open
                        ? style['sidebarctr-sidebar-bottom-iconctr-spanactive']
                        : null
                    )}
                  >
                    Disconnect
                  </span>
                </>
              ) : (
                <>
                  <Icon_login />
                  <span
                    className={cn(
                      this.context.state.ui_sidebar_open
                        ? style['sidebarctr-sidebar-bottom-iconctr-spanactive']
                        : null
                    )}
                  >
                    Connect
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
