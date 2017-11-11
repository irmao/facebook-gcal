import React, { Component } from 'react';

class EditableTR extends Component {

  constructor(props) {
    super(props);
    this.label = props.label;

    this.state = {
      value: props.value,
      openForEdit: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleOpenForEdit = this.toggleOpenForEdit.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  toggleOpenForEdit() {
    this.setState((prevState) => ({
      openForEdit: !prevState.openForEdit
    }));
  }

  render() {
    let valueField = (
      <td>{this.state.value}</td>
    );

    if (this.state.openForEdit) {
      valueField = (
        <td>
          <input type="text" value={this.state.value} onChange={this.handleInputChange} className="form-control" />
        </td>
      );
    }

    return (
      <tr>
        <td>{this.label}</td>
        {valueField}  
        <td><a href="#" onClick={this.toggleOpenForEdit}><img src={require('../assets/open-iconic/svg/pencil.svg')} alt="Edit" /></a></td>
      </tr>
    );
  }
}

export default EditableTR;
