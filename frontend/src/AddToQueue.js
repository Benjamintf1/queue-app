import React, { Component } from 'react';
import {
  Button,
  FormControl,
  FormGroup,
  Glyphicon,
  InputGroup,
} from 'react-bootstrap';

function strippedName( name ) {
  return name
    .replace(/^\s+|\s+$/g, "")
    .replace(/\s\s+/g, " ");
}

function canonicalName( name ) {
  return strippedName( name )
    .toLowerCase();
}

window.canonicalName = canonicalName;

export default class AddToQueue extends Component {
  constructor(props) {
    super(props);

    this.state = { name: "" };
  }

  onAddClick = name => {
    if ( /^\s*$/.test(name) || this.props.queue.some( queueName => canonicalName(name) == canonicalName(queueName) ) ) return;
    this.setState({ name: "" });
    this.props.onAddClick( strippedName(name) );
  }

  render() {
    const { queue } = this.props;
    const { name } = this.state;
    const currentCanonicalName = canonicalName(name);
    const nameAlreadyExists = queue.some( queueName => currentCanonicalName == canonicalName(queueName) );

    return <form onSubmit={ e => { e.preventDefault(); this.onAddClick(name) } }>
      <FormGroup>
        <InputGroup bsSize="large">
          <FormControl
            type="text"
            placeholder={"YOUR NAME"}
            onChange={ e => ( this.setState({ name: e.target.value }) ) }
            value={ name }
            onBlur={ e => e.target.focus() }
            autoFocus
          />
          <InputGroup.Button>
            <Button
              bsStyle={ nameAlreadyExists ? null : "success" }
              disabled={ nameAlreadyExists }
              onClick={ () => this.onAddClick(name) }>
              <Glyphicon glyph={ nameAlreadyExists ? "exclamation-sign" : "plus" } />
            </Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    </form>;
  }
}
