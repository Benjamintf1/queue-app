import moment from 'moment';
import React, { Component } from 'react';
import {
  Button,
  Col,
  Collapse,
  Glyphicon,
  Row,
  Well,
} from 'react-bootstrap';

import pongIconBlackSrc from './resource-icon-black.svg';

const SHOW_TIME_STARTED = process.env.REACT_APP_SHOW_TIME_STARTED || false;
const HIGHLIGHT_TIME_STARTED_AFTER = process.env.REACT_APP_HIGHLIGHT_TIME_STARTED_AFTER || 1;

function QueueTimeStarted({ timeStarted: timeStartedString }) {
  let timeStarted = moment(timeStartedString);

  let className = "queue-entry-time-started";

  if ( moment().diff(timeStarted, 'minutes') > HIGHLIGHT_TIME_STARTED_AFTER ) {
    className += " queue-entry-time-too-long";
  }

  return <span class={className}>{timeStarted.fromNow(true)}</span>;
}

function QueueEntry({ isWaiting, entry: { Name: name, TimeStarted: timeStarted }, onRemoveClick }) {
  return <Collapse in appear enter exit>
  <div>
      <Well className={"queue-entry clearfix" + ( isWaiting ? " queue-entry-waiting" : "" ) }>
        <span className="queue-entry-name" title={name}>{name}</span>
       {  !SHOW_TIME_STARTED && !isWaiting && <img src={pongIconBlackSrc} alt="" className="queue-pong-icon" /> }
       { SHOW_TIME_STARTED && timeStarted && <QueueTimeStarted timeStarted={timeStarted} /> }
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
        { queuePlaying.map( ( entry, i ) => <QueueEntry
          key={entry.Name}
          entry={entry}
          onRemoveClick={onRemoveClick}
        /> ) }
        { queuePlaying.length === 0 && <p className="queue-placeholder">Nobody yet!</p> }
      </Col>
      <Col xs={12} md={6}>
        <h2 className={queueWaiting.length ? null : "queue-empty"}>WAITING:</h2>
        { queueWaiting.map( ( entry, i ) => <QueueEntry
          key={entry.Name}
          entry={entry}
          onRemoveClick={onRemoveClick}
          isWaiting={true}
        /> ) }
        {queueWaiting.length === 0 && <p className="queue-placeholder">Not a soul</p> }
      </Col>
    </Row>;
  }
}
