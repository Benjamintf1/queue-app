import React, { Component } from 'react';
import {
  Button,
  Glyphicon,
  Well,
} from 'react-bootstrap';

import pongIconBlackSrc from './resource-icon-black.svg';

function QueueEntry({ isWaiting, name, onRemoveClick }) {
  return <Well className={"queue-entry clearfix" + ( isWaiting ? " queue-entry-waiting" : "" ) }>
    <span className="queue-entry-name">{name}</span>
    { !isWaiting && <img src={pongIconBlackSrc} className="queue-pong-icon" /> }
    <Button
      className="pull-right"
      bsStyle="danger"
      bsSize="large"
      onClick={() => onRemoveClick(name)}
    >
      <Glyphicon glyph="remove" />
    </Button>
  </Well>;
}

export default class Queue extends Component {
  render() {
    const { queue, onRemoveClick, resourceCount } = this.props;

    const queuePlaying = queue.slice(0, resourceCount);
    const queueWaiting = queue.slice(resourceCount);

    return <div>
      { queuePlaying.length ? <h2>PLAYING:</h2> : null }
      { queuePlaying.map( ( name, i ) => <QueueEntry
        key={name}
        name={name}
        onRemoveClick={onRemoveClick}
      /> ) }
      { queueWaiting.length ? <h2>WAITING:</h2> : null }
      { queueWaiting.map( ( name, i ) => <QueueEntry
        key={name}
        name={name}
        onRemoveClick={onRemoveClick}
        isWaiting={true}
      /> ) }
    </div>;
  }
}
