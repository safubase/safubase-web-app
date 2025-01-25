// MODULES
import React from 'react';
import { IoMdNotifications, IoMdNotificationsOutline } from 'react-icons/io';

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return this.props.active ? (
      <IoMdNotifications />
    ) : (
      <IoMdNotificationsOutline />
    );
  }
}

export default Notification;
