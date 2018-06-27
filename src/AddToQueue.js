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

    return <form>
      <FormGroup>
        <InputGroup bsSize="large">
          <FormControl type="text" placeholder="YOUR NAME" />
          <InputGroup.Button>
            <Button bsStyle="success"><Glyphicon glyph="plus" /></Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    </form>;
  }
}
