// MODULES
import React from 'react';
import axios from 'axios';
import cn from 'classnames';

// COMPONENTS
import Head from '../components/head';
import UserLayout from '../components/layouts/user';

// CONTEXT
import { Context } from '../context';

// STYLES
import style from '../styles/pages/profile.module.css';

/**
 *
 * SERVER SIDE
 *
 */
export async function getServerSideProps({ req }) {
  return {
    props: {
      data: null,
    },
  };
}

/**
 *
 * * * PAGE
 *
 */
class Settings extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <>
        <Head title="safubase" desc="safubase" />
        <UserLayout
          element={
            <section className={cn('section', style['sectionsettings'])}>
              settings
            </section>
          }
        />
      </>
    );
  }
}

export default Settings;

//test
