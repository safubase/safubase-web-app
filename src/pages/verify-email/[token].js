// MODULES
import React from 'react';
import cn from 'classnames';

// COMPONENTS
import Head from '../../components/head';
import Layout_login from '../../components/layouts/login';
import Icon_loading from '../../components/icons/loading';
import Icon_check from '../../components/icons/check';
import Icon_error from '../../components/icons/error';

// CONTEXT
import { Context } from '../../context';

// UTILS
import UTILS from '../../utils/index.js';
import UTILS_API from '../../utils/api.js';

// STYLES
import style from '../../styles/pages/verifyemail.module.css';

/**
 *
 * COMPONENT VERIFY EMAIL
 *
 */
class Comp_verify_email extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      verification: null, // null, true, false
    };

    this.api_verify_email = this.api_verify_email.bind(this);
  }

  async api_verify_email() {
    const parts = window.location.href.split('/');
    const token = parts[parts.length - 1];
    const res = await UTILS_API.verify_email(1, token);

    if (res.code) {
      this.setState({
        ...this.state,
        verification: false,
      });

      if (res.code === 'ERR_NETWORK') {
        this.context.set_state({
          ...this.context.state,
          ui_toasts: [
            ...this.context.state.ui_toasts,
            { type: 'error', message: res.message, created_at: new Date() },
          ],
        });
      }

      return;
    }

    this.setState({
      ...this.state,
      verification: true,
    });

    setTimeout(() => {
      window.location.replace('https://quontral.com');
    }, 1500);
  }

  componentDidMount() {
    this.api_verify_email();
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className={cn(style['compverifyemail'])}>
        <div className={cn(style['compverifyemail-top'])}>
          {this.state.verification === null ? (
            <div
              className={cn(
                style['compverifyemail-top-iconctr'],
                style['compverifyemail-top-loadingicon']
              )}
            >
              <Icon_loading />
            </div>
          ) : null}

          {this.state.verification === true ? (
            <div
              className={cn(
                style['compverifyemail-top-iconctr'],
                style['compverifyemail-top-successicon']
              )}
            >
              <Icon_check />
            </div>
          ) : null}

          {this.state.verification === false ? (
            <div
              className={cn(
                style['compverifyemail-top-iconctr'],
                style['compverifyemail-top-erricon']
              )}
            >
              <Icon_error />
            </div>
          ) : null}
        </div>

        <div className={cn(style['compverifyemail-desc'])}>
          {this.state.verification === null
            ? 'Verifying your email, please wait...'
            : null}

          {this.state.verification === true
            ? 'Your email has been verified, you are being directed...'
            : null}

          {this.state.verification === false
            ? 'Something went wrong while verifying your email'
            : null}
        </div>
      </div>
    );
  }
}

/**
 *
 * PAGE
 *
 */
class Verify_email extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <>
        <Head
          title="Quontral.com | Blockchain Security with AI"
          desc="Contract audit and investment security with artificial intelligence. Quontral is a security company."
        />

        <Layout_login>
          <>
            <section className={cn('section', style['sectionverifyemail'])}>
              <Comp_verify_email />
            </section>
          </>
        </Layout_login>
      </>
    );
  }
}

export default Verify_email;
