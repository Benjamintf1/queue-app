import React, { Component } from 'react';
import {
  Button,
  Glyphicon,
  Well,
} from 'react-bootstrap';

export default class Queue extends Component {
  render() {
    const { queue, onRemoveClick, numResources } = this.props;

    return <div>
      { queue.map( name => <Well key={name} className="queue-entry clearfix">
        <span className="queue-entry-name">{name}</span>
        <Button
          className="pull-right"
          bsStyle="danger"
          bsSize="large"
          onClick={() => onRemoveClick(name)}
        >
          <Glyphicon glyph="remove" />
        </Button>
      </Well> ) }
    </div>;
  }
}
