// MODULES
import React from 'react';
import { MdPerson, MdPersonOutline } from 'react-icons/md';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return this.props.active ? <MdPerson /> : <MdPersonOutline />;
  }
}

export default Profile;
