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

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value});
  }

  handleInputChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  toggleOpenForEdit() {
    this.setState(function(prevState) {
      if (prevState.openForEdit) {
        this.props.onTextChange(this.props.fieldName, this.state.value);
      }

      return {
        openForEdit: !prevState.openForEdit
      }
    });
  }

  render() {
    let valueField = (
      <td>{this.state.value}</td>
    );

    const editIcon = require('../assets/open-iconic/svg/pencil.svg');
    const doneIcon = require('../assets/open-iconic/svg/check.svg');

    let icon = editIcon;

    if (this.state.openForEdit) {
      valueField = (
        <td>
          <input type="text" value={this.state.value} onChange={this.handleInputChange} className="form-control" />
        </td>
      );

      icon = doneIcon;
    }

    return (
      <tr>
        <td>{this.label}</td>
        {valueField}  
        <td><img src={icon} alt="Edit" style={{width: 15}} onClick={this.toggleOpenForEdit}/></td>
      </tr>
    );
  }
}

export default EditableTR;
