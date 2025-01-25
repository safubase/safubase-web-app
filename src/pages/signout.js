// MODULES
import React from 'react';

// UTILS
import UTILS_API from '../utils/api.js';

/**
 *
 * PAGE
 *
 */
class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    UTILS_API.signout(1).then((res) => {
      if (res.code) {
        console.log(res);
        return;
      }

      console.log('SIGNOUT SUCCESSFULL');
    });
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return null;
  }
}

export default Logout;
