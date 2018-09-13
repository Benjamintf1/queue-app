import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import faviconBusy from './favicon-busy.png';
import faviconFree from './favicon-free.png';

export default class Favicon extends Component {
  render() {
    const { status } = this.props;

    return ReactDOM.createPortal(
      <link rel="shortcut icon" href={status === 'free' ? faviconFree : faviconBusy} />,
      document.head
    );
  }
}
