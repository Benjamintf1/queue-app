import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import './Pong.css';
import pongLogo from './Anonymous-pong-01.svg';

class Pong extends Component {
  render() {
    return (
      <div className="Pong">
        <Navbar>
          <Navbar.Header>
            <a className="navbar-left pong-logo-container" href="#">
              <img className="pong-logo" src={pongLogo} />
            </a>
            <Navbar.Brand>
              YOU MAY PONG
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
      </div>
    );
  }
}

export default Pong;
