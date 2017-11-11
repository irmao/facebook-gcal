import React, { Component } from 'react';
import RequestService from '../services/RequestService';
import EditableTR from './EditableTR';

class ExtractionForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      txtEventId: '1603569863028785'
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      txtEventId: event.target.value
    });
  }

  handleButtonClick(e) {
    e.preventDefault();

    RequestService.get(`https://graph.facebook.com/v2.10/${this.state.txtEventId}?access_token=EAACEdEose0cBAGpZCM5WCy6QMnwiBnWUzExaTMKWZBOcM9wrpa8pPXpq5ZCOxyFkxiXOZCc3R0mKxKHO0INZAtX2OIIfJ5CJUpMRCvZBfZAcBmDdXoGg1S4mGAHffEXU6pcYZAa0g5HUYzDPZBQsxkVziuu8ZAk1xxjXREc5N1jzei6jIWGMZCUKKCBzCNrUkr5rbnWM13ntaP8CwZDZD&debug=all&format=json&method=get&pretty=0&suppress_http_code=1`)
      .then(response => response.json())
      .then(responseJson => {this.setState({eventInfo: responseJson})})
      .catch(error => {this.setState({eventInfo: error})});
  }

  getValue(fieldName) {
    let value = '';

    if (this.state.eventInfo) {
      value = this.state.eventInfo[fieldName];

      if (fieldName === 'place' && value.name) {
        value = value.name;
      }
    }

    return value;
  }

  render() {
    const inputFieldsComponent = (
      <p className="row">
        <input type="text" placeholder="Event id" value={this.state.txtEventId} onChange={this.handleInputChange} className="form-control col-sm-9" />
        <button onClick={this.handleButtonClick} className="form-control btn btn-primary col-sm-3">Retrieve event</button>
      </p>
    );

    const rowItems = [
      {label: 'Name', jsonFieldName: 'name', index: 0},
      {label: 'Description', jsonFieldName: 'description', index: 1},
      {label: 'Place', jsonFieldName: 'place', index: 2},
      {label: 'Start time', jsonFieldName: 'start_time', index: 3},
      {label: 'End time', jsonFieldName: 'end_time', index: 4}
    ];

    const rowItemsComponent = rowItems.map((item) =>
      <EditableTR label={item.label} key={item.index} value={this.getValue(item.jsonFieldName)} />
    );

    let eventInfoComponent = null;
    if (this.state.eventInfo !== undefined && this.state.eventInfo !== null) {
      eventInfoComponent = (
        <table className="table table-border">
          <tbody>
            {rowItemsComponent}
          </tbody>
        </table>
      );
    }
    
    return (
      <form>
        {inputFieldsComponent}
        {eventInfoComponent}
      </form>
    );
  }
}

export default ExtractionForm;
