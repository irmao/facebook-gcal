import React, { Component } from 'react';

class EditableTR extends Component {

  constructor(props) {
    super(props);
    this.label = props.label;
    this.value = props.value;
  }

  render() {    
    return (
      <tr><td>{this.label}</td><td>{this.value}</td><td><a href="#"><img src={require('./assets/open-iconic/svg/pencil.svg')} alt="Edit" /></a></td></tr>
    );
  }
}

export default EditableTR;
