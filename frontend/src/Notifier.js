import React, { Component } from 'react';
import ReactNotifications from 'react-browser-notifications';

import pongIconBlackSrc from './resource-icon-black.svg';

export default class Notifier extends Component {
  componentDidMount() {
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  onVisibilityChange = () => {
    if (!document.hidden) {
      this.setTitle(false);
    }
  }

  setTitle(addNotification) {
    if (addNotification) {
      document.title = 'Pong - table is ready!'
    } else {
      document.title = 'Pong'
    }
  }

  show() {
    if (this.notifications && this.notifications.supported()) this.notifications.show();

    this.setTitle(true);
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
      onRef={ref => (this.notifications = ref)}
      title="Your table is ready!"
      body="Go grab it before it runs away!"
      icon={pongIconBlackSrc}
      onClick={this.onClick}
    />;
  }
}
