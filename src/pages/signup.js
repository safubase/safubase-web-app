// MODULES
import React from 'react';
import cn from 'classnames';

// CONFIG
import config from '../config/index.js';

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
import style from '../styles/pages/signup.module.css';

/**
 *
 * COMPONENT MODAL LOGIN
 *
 */
class Comp_modal_signup extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      api_loading: false,
      input_username: '',
      input_email: '',
      input_password: '',
      input_password_verification: '',
    };

    this.form_ref = React.createRef();
  }

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className={cn(style['compmodalsignup'])}>
        <div className={cn(style['compmodalsignup-top'])}>
          <div className={cn(style['compmodalsignup-top-logoctr'])}>
            Sign Up
          </div>

          <div className={cn(style['compmodalsignup-top-inputctr'])}>
            <Icon_profile />

            <input
              value={this.state.input_username}
              onChange={(e) => {
                this.setState({
                  ...this.state,
                  input_username: e.target.value,
                });
              }}
              type="text"
              placeholder="Username..."
            />
          </div>

          <div className={cn(style['compmodalsignup-top-inputctr'])}>
            <Icon_profile />

            <input
              value={this.state.input_email}
              onChange={(e) => {
                this.setState({
                  ...this.state,
                  input_email: e.target.value,
                });
              }}
              placeholder="Email..."
            />
          </div>

          <div className={cn(style['compmodalsignup-top-inputctr'])}>
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

          <div className={cn(style['compmodalsignup-top-inputctr'])}>
            <Icon_lock />

            <input
              value={this.state.input_password_verification}
              onChange={(e) => {
                this.setState({
                  ...this.state,
                  input_password_verification: e.target.value,
                });
              }}
              type="password"
              placeholder="Password verification..."
            />
          </div>

          <form
            className={cn(style['compmodalsignup-top-captchactr'])}
            ref={this.form_ref}
          >
            <div
              className="h-captcha"
              data-sitekey={config.env.CAPTCHA_SITE_KEY}
            ></div>
          </form>

          <button
            onClick={async () => {
              if (this.state.api_loading) {
                return;
              }

              this.setState({ ...this.state, api_loading: true });

              const api_res_signup = await UTILS_API.signup(1, {
                username: this.state.input_username,
                email: this.state.input_email,
                password: this.state.input_password,
                password_verification: this.state.input_password_verification,
                captcha_token: this.form_ref.current.elements[0].value,
              });

              this.setState({ ...this.state, api_loading: false });

              if (api_res_signup.code) {
                this.context.set_state({
                  ...this.context.state,
                  ui_toasts: [
                    ...this.context.state.ui_toasts,
                    {
                      type: 'error',
                      message: api_res_signup.message,
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
                    message: 'Sucessfully signed up',
                    created_at: new Date(),
                  },
                ],
              });
            }}
            className={cn(
              style['compmodalsignup-top-loginbtn'],
              this.state.api_loading
                ? style['compmodalsignup-top-loginbtnloading']
                : null
            )}
          >
            {this.state.api_loading ? <Icon_loading /> : 'Sign Up'}
          </button>
        </div>

        <div className={cn(style['compmodalsignup-bottom'])}>
          Already have an account? <a href="/login">Log In</a>
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
class Signup extends React.Component {
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
      window.location.replace('https://safubase.com');
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
          title="Quontral.com | Blockchain Security with AI"
          desc="Contract audit and investment security with artificial intelligence. Quontral is a security company."
        />

        <Layout_login>
          <>
            <section className={cn('section', style['sectionlogin'])}>
              <Comp_modal_signup />
            </section>
          </>
        </Layout_login>
      </>
    );
  }
}

export default Signup;
