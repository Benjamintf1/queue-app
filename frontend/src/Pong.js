import React, { Component } from 'react';
import {
  Grid,
  Row,
  Col,
  PageHeader,
} from 'react-bootstrap';
import ReactNotifications from 'react-browser-notifications';
import 'typeface-montserrat';

import './Pong.css';
import pongIconBlackSrc from './resource-icon-black.svg';
import pongIconWhiteSrc from './resource-icon-white.svg';
import AddToQueue from './AddToQueue';
import Queue from './Queue';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
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

class PongNotifier extends Component {
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

    const oldPosition = oldQueue.findIndex( ( { Name } ) => Name == lastAddedName );
    const newPosition = newQueue.findIndex( ( { Name } ) => Name == lastAddedName );;

    if ( newPosition < oldPosition && oldPosition >= resourceCount && newPosition < resourceCount ) {
      console.log( "Yo you went from", oldPosition, "to", newPosition, "GRAB YO TABLE" );
      this.notifications.show();
    }
  }

  refreshList() {
    fetch(API_URL + "/list")
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
    this.refreshList();
    this.refreshInterval = setInterval( () => { this.refreshList() }, REFRESH_PERIOD );
  }

  componentWillUnmount() {
    if ( this.refreshInterval ) clearInterval( this.refreshInterval );
  }

  onRemoveClick = name => {
    this.setState( ({ queue }) => ({
      queue: queue.filter( ( { Name } ) => Name != name ),
    }) );
    fetch(
      API_URL + "/remove",
      {
        method: "POST",
        body: JSON.stringify({ Name: name }),
      },
    );
  }

  onAddClick = name => {
    this.setState( ({ queue }) => ({
      queue: queue.concat( [ { Name: name } ] ),
      lastAddedName: name,
    }) );
    fetch(
      API_URL + "/add",
      {
        method: "POST",
        body: JSON.stringify({ Name: name }),
      },
    );
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
        <PongNotifier lastAddedName={lastAddedName} ref={notifications => this.notifications = notifications} />
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
