import React, { Component } from 'react';
import RequestService from '../services/RequestService';
import CalendarComponent from './CalendarComponent';
import EditableTR from './EditableTR';

class ExtractionForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      txtEventId: '1603569863028785'
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRetrieveButtonClick = this.handleRetrieveButtonClick.bind(this);
    this.handleAddToCalendarButtonClick = this.handleAddToCalendarButtonClick.bind(this); 
  }

  handleInputChange(event) {
    this.setState({
      txtEventId: event.target.value
    });
  }

  handleRetrieveButtonClick(e) {
    e.preventDefault();

    const access_token = 'EAACEdEose0cBAF5AAC7qTeGZBE1ShATuC4ZB4F1spjH57CfBu6so3w0A64YbW1ZAYvtuplbyCisZBlbknE5h22UJCxOzijmgGa3A8SEpxzFckn0lfjtCvkhpTB1tkzZC7PPAZBYbHyv8TY141wNNM7BkIcHZC2YeO0cV1Acdg4aJxbOTvy9c2gmgLZBjiCQN1zPZC8yPY08VxRAZDZD';

    RequestService.get(`https://graph.facebook.com/v2.10/${this.state.txtEventId}?access_token=${access_token}&debug=all&format=json&method=get&pretty=0&suppress_http_code=1`)
      .then(response => response.json())
      .then(responseJson => {this.setState({eventInfo: responseJson})})
      .catch(error => {this.setState({eventInfo: error})});
  }

  handleAddToCalendarButtonClick(e) {
    e.preventDefault();
  }

  getValue(fieldName) {
    let value = '';

    if (this.state.eventInfo && this.state.eventInfo[fieldName]) {
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
        <button onClick={this.handleRetrieveButtonClick} className="form-control btn btn-primary col-sm-3">Retrieve event</button>
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

    let calendarComponent = null;
    if (this.state.eventInfo !== undefined && this.state.eventInfo !== null) {
      calendarComponent = (
        <CalendarComponent eventInfo={this.state.eventInfo} />
      );
    }
    
    return (
      <form>
        {inputFieldsComponent}
        {eventInfoComponent}
        {calendarComponent}
      </form>
    );
  }
}

export default ExtractionForm;
