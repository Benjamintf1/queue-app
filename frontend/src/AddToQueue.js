import React, { Component } from 'react';
import {
  Button,
  FormControl,
  FormGroup,
  Glyphicon,
  InputGroup,
} from 'react-bootstrap';

export default class AddToQueue extends Component {
  render() {
    const { onAddClick } = this.props;

    return <form onSubmit={ () => onAddClick(this.nameInput.value) }>
      <FormGroup>
        <InputGroup bsSize="large">
          <FormControl type="text" placeholder={"YOUR NAME"} inputRef={ el => this.nameInput = el } />
          <InputGroup.Button>
            <Button bsStyle="success" onClick={ () => onAddClick(this.nameInput.value) }>
              <Glyphicon glyph="plus" />
            </Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    </form>;
  }
}
