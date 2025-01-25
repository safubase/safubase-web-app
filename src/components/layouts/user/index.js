// MODULES
import React from 'react';
import cn from 'classnames';
import Script from 'next/script';

// COMPONENTS
import Header from '../../header';
import Footer from '../../footer';
import Sidebar from '../../sidebar';
import Toaster from '../../toaster';

// CONTEXT
import { Context } from '../../../context/index.js';

// UTILS
import UTILS from '../../../utils/index.js';
import UTILS_API from '../../../utils/api.js';

// STYLES
import style from './style.module.css';

class Layout_user extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <>
        <Header />
        <Sidebar />
        <Toaster />

        <main
          className={cn(
            style['main'],
            this.context.state.ui_sidebar_open
              ? style['mainsidebaropen']
              : null,
            this.props.height === 'auto' ? style['mainautoheight'] : null
          )}
        >
          {this.props.element || this.props.children}
        </main>

        <Script src="https://js.hcaptcha.com/1/api.js" async defer></Script>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-F28TSKZ877"
        ></Script>
        <Script
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-F28TSKZ877');",
          }}
        ></Script>
      </>
    );
  }
}

export default Layout_user;
