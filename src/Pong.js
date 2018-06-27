import React, { Component } from 'react';
import {
  Grid,
  Row,
  Col,
  PageHeader,
} from 'react-bootstrap';
import 'typeface-montserrat';

import './Pong.css';
import pongLogoSrc from './Anonymous-pong-01.svg';
import AddToQueue from './AddToQueue';
import Queue from './Queue';

const API_URL = "http://localhost:8080";
const REFRESH_PERIOD = 5 * 1000;

function PongHeader({ availableResources }) {
  const pongLogo = <img className="pong-logo" src={pongLogoSrc} alt="PONG" />;

  let className;
  let contents;

  if ( availableResources == null ) {
    contents = <React.Fragment>
      LOADING THE {pongLogo}
    </React.Fragment>;
  } else if ( availableResources > 0 ) {
    contents = <React.Fragment>
      YOU MAY {pongLogo}
    </React.Fragment>;
  } else {
    contents = <React.Fragment>
      {pongLogo} MUST WAIT
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

  refreshList() {
    fetch(API_URL + "/list")
      .then(response => response.json())
      .then(({ Queue: queue, ResourceCount: resourceCount }) => {
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
      queue: queue.filter( queueName => queueName != name ),
    }) );
    fetch(
      API_URL + "/remove",
      {
        method: "POST",
        body: JSON.stringify({ Name: name }),
      },
    );
  }

  render() {
    const { queue, resourceCount } = this.state;
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
        <Grid>
          <Row>
            <Col xs={0} md={3}></Col>
            <Col xs={12} md={6}>
              <AddToQueue onAddClick={this.onAddClick} />
              <Queue
                resourceCount={this.state.resourceCount}
                queue={this.state.queue}
                onRemoveClick={this.onRemoveClick}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Pong;
