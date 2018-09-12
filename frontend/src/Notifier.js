import React, { Component } from 'react';
import ReactNotifications from 'react-browser-notifications';

import pongIconBlackSrc from './resource-icon-black.svg';

export default class Notifier extends Component {
  show() {
    if (this.notifications && this.notifications.supported()) this.notifications.show();
  }

  constructor() {
    super();
    if (Notification.permission !== 'denied' || Notification.permission === "default") {
        Notification.requestPermission(function (permission) {});
    }
  }

  onClick = event => {
    this.notifications.close(event.target.tag);
  }

  render() {
    return <ReactNotifications
      onRef={ref => (this.notifications = ref)} // Required
      title="Your table is ready!" // Required
      body="Go grab it before it runs away!"
      icon={pongIconBlackSrc}
      onClick={this.onClick}
    />;
  }
}
