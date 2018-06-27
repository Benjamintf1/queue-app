import React, { Component } from 'react';
import {
  Button,
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
          bsStyle="success"
          bsSize="large"
          onClick={() => onRemoveClick(name)}
        >
          DONE
        </Button>
      </Well> ) }
    </div>;
  }
}
