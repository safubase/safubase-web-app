// MODULES
import React from 'react';
import cn from 'classnames';

// COMPONENTS
import Head from '../../components/head';
import UserLayout from '../../components/layouts/user';

// STYLES
import style from './style.module.css';

class Error extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <>
        <Head
          title="Safubase.com | Blockchain Security & Algo Trading with AI"
          desc="Contract audit, investment security and algo trading with artificial intelligence. Safubase is a security company."
        />

        <main>
          <section className={cn('section', style['sectionerror'])}>
            <div className={cn(style['sectionerror-ctr'])}>
              <div className={cn(style['sectionerror-ctr-title'])}>
                {this.props.data}
              </div>

              <div className={cn(style['sectionerror-ctr-desc'])}>
                {this.props.data === 404
                  ? "Sorry, couldn't find the page you are looking for."
                  : null}
              </div>

              <a className={cn(style['sectionerror-ctr-homebtn'])} href="/">
                Go home
              </a>
            </div>
          </section>
        </main>
      </>
    );
  }
}

export default Error;
