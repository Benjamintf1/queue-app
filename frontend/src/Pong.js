import React, { Component } from 'react';
import {
  Grid,
  Row,
  Col,
  PageHeader,
} from 'react-bootstrap';
import 'typeface-montserrat';

import './Pong.css';
import pongIconWhiteSrc from './resource-icon-white.svg';
import AddToQueue from './AddToQueue';
import Favicon from './Favicon';
import Notifier from './Notifier';
import Queue from './Queue';

const REFRESH_PERIOD = 5 * 1000;

function PongHeader({ availableResources }) {
  const pongIcon = <img className="pong-icon" src={pongIconWhiteSrc} alt="PONG" />;

  let contents;

  if ( availableResources == null ) {
    contents = <React.Fragment>
      LOADING THE {pongIcon}
    </React.Fragment>;
  } else if ( availableResources > 0 ) {
    contents = <React.Fragment>
      YOU MAY {pongIcon}
    </React.Fragment>;
  } else {
    contents = <React.Fragment>
      PLEASE WAIT TO {pongIcon}
    </React.Fragment>;
  }

  return <PageHeader>
    {contents}
  </PageHeader>;
}

class Pong extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queue: [],
      resourceCount: null,
    };
  }

  maybeNotify( newQueue ) {
    const { queue: oldQueue, lastAddedName, resourceCount } = this.state;

    if ( !lastAddedName ) return;

    const oldPosition = oldQueue.findIndex( ( { Name } ) => Name === lastAddedName );
    const newPosition = newQueue.findIndex( ( { Name } ) => Name === lastAddedName );

    if ( newPosition !== -1 &&
        newPosition < oldPosition &&
        oldPosition >= resourceCount &&
        newPosition < resourceCount ) {
      this.notifications.show();
    }
  }

  refreshList() {
    fetch("/backend/list")
      .then(response => response.json())
      .then(({ Queue: queue, ResourceCount: resourceCount }) => {
        this.maybeNotify( queue );

        this.setState({
          queue: queue || [],
          resourceCount,
        });
      });
  }

  componentDidMount() {
    console.log("https://github.com/Benjamintf1/queue-app - made with love by @Benjamintf1 and @pianohacker");

    this.refreshList();
    this.refreshInterval = setInterval( () => { this.refreshList() }, REFRESH_PERIOD );
  }

  componentWillUnmount() {
    if ( this.refreshInterval ) clearInterval( this.refreshInterval );
  }

  onRemoveClick = name => {
    this.setState( ({ queue, resourceCount }) => {
      let newQueue = queue.filter( ( { Name } ) => Name !== name );

      return newQueue;
    } );
    fetch(
      "/backend/remove",
      {
        method: "POST",
        body: JSON.stringify({ Name: name }),
      },
    ).then( () => {
      this.refreshList();
    } );
  }

  onAddClick = name => {
    this.setState( ({ queue }) => ({
      queue: queue.concat( [ { Name: name } ] ),
      lastAddedName: name,
    }) );
    fetch(
      "/backend/add",
      {
        method: "POST",
        body: JSON.stringify({ Name: name }),
      },
    ).then( () => {
      this.refreshList();
    } );
  }

  render() {
    const { queue, resourceCount, lastAddedName } = this.state;
    const availableResources = resourceCount - queue.length;
    const stillLoading = resourceCount == null;

    let className = "Pong";

    if ( stillLoading ) {
      className += " Pong-loading";
    } else if ( availableResources <= 0 ) {
      className += " Pong-busy";
    }

    return (
      <div className={className}>
        <PongHeader availableResources={availableResources} />
        <Notifier lastAddedName={lastAddedName} ref={notifications => this.notifications = notifications} />
        <Favicon status={availableResources > 0 ? 'free' : 'busy'} />
        <Grid>
          <Row>
            <Col xs={0} md={3}></Col>
            <Col xs={12} md={6}>
              <AddToQueue
                onAddClick={this.onAddClick}
                queue={this.state.queue}
              />
            </Col>
          </Row>
          <Queue
            resourceCount={this.state.resourceCount}
            queue={this.state.queue}
            onRemoveClick={this.onRemoveClick}
          />
        </Grid>
      </div>
    );
  }
}

export default Pong;
