import React, { Component } from 'react';
import {
  Button,
  Col,
  Collapse,
  Fade,
  Glyphicon,
  Row,
  Well,
} from 'react-bootstrap';

import pongIconBlackSrc from './resource-icon-black.svg';

function QueueEntry({ isWaiting, name, onRemoveClick }) {
  return <Collapse in appear enter exit>
  <div>
      <Well className={"queue-entry clearfix" + ( isWaiting ? " queue-entry-waiting" : "" ) }>
        <span className="queue-entry-name" title={name}>{name}</span>
        { !isWaiting && <img src={pongIconBlackSrc} className="queue-pong-icon" /> }
        <Button
          className="pull-right"
          bsStyle="danger"
          bsSize="large"
          onClick={() => onRemoveClick(name)}
        >
          <Glyphicon glyph="remove" />
        </Button>
      </Well>
    </div>
  </Collapse>;
}

export default class Queue extends Component {
  render() {
    const { queue, onRemoveClick, resourceCount } = this.props;

    const queuePlaying = queue.slice(0, resourceCount);
    const queueWaiting = queue.slice(resourceCount);

    return <Row>
      <Col xs={12} md={6}>
        <h2 className={queuePlaying.length ? null : "queue-empty"}>PLAYING:</h2>
        { queuePlaying.map( ( { Name }, i ) => <QueueEntry
          key={Name}
          name={Name}
          onRemoveClick={onRemoveClick}
        /> ) }
        { queuePlaying.length == 0 && <p className="queue-placeholder">Nobody yet!</p> }
      </Col>
      <Col xs={12} md={6}>
        <h2 className={queueWaiting.length ? null : "queue-empty"}>WAITING:</h2>
        { queueWaiting.map( ( { Name }, i ) => <QueueEntry
          key={Name}
          name={Name}
          onRemoveClick={onRemoveClick}
          isWaiting={true}
        /> ) }
        {queueWaiting.length == 0 && <p className="queue-placeholder">Not a soul</p> }
      </Col>
    </Row>;
  }
}
