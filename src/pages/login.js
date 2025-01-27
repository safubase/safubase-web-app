// MODULES
import React from 'react';
import cn from 'classnames';

// COMPONENTS
import Head from '../components/head';
import Layout_login from '../components/layouts/login';

// COMPONENTS > ICONS
import Icon_profile from '../components/icons/profile';
import Icon_lock from '../components/icons/lock';
import Icon_loading from '../components/icons/loading';
import Icon_arrow from '../components/icons/arrow';

// CONTEXT
import { Context } from '../context';

// UTILS
import UTILS from '../utils/index.js';
import UTILS_API from '../utils/api.js';

// STYLES
import style from '../styles/pages/login.module.css';

/**
 *
 * COMPONENT MODAL LOGIN
 *
 */
class Comp_modal_login extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      api_loading: false,
      input_uid: '',
      input_password: '',
      open_forgot_pwd: false,
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className={cn(style['compmodallogin'])}>
        <div className={cn(style['compmodallogin-top'])}>
          <div className={cn(style['compmodallogin-top-logoctr'])}>
            {this.state.open_forgot_pwd ? (
              <Icon_arrow
                onClick={() => {
                  this.setState({
                    ...this.state,
                    open_forgot_pwd: false,
                  });
                }}
                dir="left"
              />
            ) : null}
            {this.state.open_forgot_pwd ? 'Forgot Password' : 'Log In'}
          </div>

          <div className={cn(style['compmodallogin-top-inputctr'])}>
            <Icon_profile />

            <input
              value={this.state.input_uid}
              onChange={(e) => {
                if (this.state.open_forgot_pwd) {
                  this.setState({
                    ...this.state,
                    input_uid: e.target.value,
                  });

                  return;
                }

                this.setState({
                  ...this.state,
                  input_uid: e.target.value,
                });
              }}
              placeholder={
                this.state.open_forgot_pwd ? 'Email...' : 'Email or Username...'
              }
            />
          </div>

          {this.state.open_forgot_pwd ? null : (
            <div className={cn(style['compmodallogin-top-inputctr'])}>
              <Icon_lock />

              <input
                value={this.state.input_password}
                onChange={(e) => {
                  this.setState({
                    ...this.state,
                    input_password: e.target.value,
                  });
                }}
                type="password"
                placeholder="Password..."
              />
            </div>
          )}

          <button
            onClick={async () => {
              if (this.state.api_loading) {
                return;
              }

              this.setState({ ...this.state, api_loading: true });

              if (this.state.open_forgot_pwd) {
                const api_res_email_send_password_reset_link =
                  await UTILS_API.email_send_password_reset_link(1, {
                    email: this.state.input_uid,
                  });

                this.setState({ ...this.state, api_loading: false });

                if (api_res_email_send_password_reset_link.code) {
                  this.context.set_state({
                    ...this.context.state,
                    ui_toasts: [
                      ...this.context.state.ui_toasts,
                      {
                        type: 'error',
                        message: api_res_email_send_password_reset_link.message,
                        created_at: new Date(),
                      },
                    ],
                  });

                  return;
                }

                this.context.set_state({
                  ...this.context.state,
                  ui_toasts: [
                    ...this.context.state.ui_toasts,
                    {
                      type: 'success',
                      message: 'Sucessfully send password reset link',
                      created_at: new Date(),
                    },
                  ],
                });

                return;
              }

              const api_res_login = await UTILS_API.login(1, {
                uid: this.state.input_uid,
                password: this.state.input_password,
              });

              this.setState({ ...this.state, api_loading: false });

              if (api_res_login.code) {
                this.context.set_state({
                  ...this.context.state,
                  ui_toasts: [
                    ...this.context.state.ui_toasts,
                    {
                      type: 'error',
                      message: api_res_login.message,
                      created_at: new Date(),
                    },
                  ],
                });

                return;
              }

              this.context.set_state({
                ...this.context.state,
                ui_toasts: [
                  ...this.context.state.ui_toasts,
                  {
                    type: 'success',
                    message: 'Sucessfully logged in',
                    created_at: new Date(),
                  },
                ],
              });

              setTimeout(() => {
                window.location.replace('https://app.safubase.com');
              }, 1500);
            }}
            className={cn(
              style['compmodallogin-top-loginbtn'],
              this.state.api_loading
                ? style['compmodallogin-top-loginbtnloading']
                : null
            )}
          >
            {this.state.api_loading ? <Icon_loading /> : null}

            {!this.state.api_loading && this.state.open_forgot_pwd
              ? 'Send Reset Link'
              : null}

            {!this.state.api_loading && !this.state.open_forgot_pwd
              ? 'Log In'
              : null}
          </button>

          {this.state.open_forgot_pwd ? null : (
            <div
              onClick={() => {
                this.setState({
                  ...this.state,
                  open_forgot_pwd: true,
                });
              }}
              className={cn(style['compmodallogin-top-forgotlink'])}
            >
              Forgot Password?
            </div>
          )}
        </div>

        <div className={cn(style['compmodallogin-bottom'])}>
          Don't have an account? <a href="/signup">Create one</a>
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
class Login extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};

    this.init = this.init.bind(this);
  }

  async init() {
    const context_state = {
      ...this.context.state,
      ui_toasts: [],
    };

    /**
     *
     * ASYNC PROMISE CALLS
     *
     */ // [get_profile(), another_async_func()]
    const api_responses = await Promise.all([UTILS_API.get_profile(1)]);
    const api_res_get_profile = api_responses[0];

    if (api_res_get_profile.code) {
      context_state.ui_toasts = [
        ...context_state.ui_toasts,
        {
          type: 'error',
          message: api_res_get_profile.message,
          created_at: new Date(),
        },
      ];
    } else if (api_res_get_profile.data === null) {
      context_state.user_auth = false;
      context_state.user_id = null;
      context_state.user_username = null;
      context_state.user_email = null;
      context_state.user_email_verified = null;
      context_state.user_role = null;
      context_state.user_img = null;
    } else if (api_res_get_profile.data) {
      window.location.replace('https://app.safubase.com');
      return;
    }

    /*
     *
     * CONTEXT UPDATE
     *
     */
    this.context.set_state(context_state);
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <>
        <Head
          title="Safubase.com | Blockchain Security & Algo Trading with AI"
          desc="Contract audit, investment security and algo trading with artificial intelligence. Safubase is a security company."
        />

        <Layout_login>
          <>
            <section className={cn('section', style['sectionlogin'])}>
              <Comp_modal_login />
            </section>
          </>
        </Layout_login>
      </>
    );
  }
}

export default Login;
