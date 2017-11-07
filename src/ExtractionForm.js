import React, { Component } from 'react';
import RequestService from './RequestService';
import EditableTR from './EditableTR';

class ExtractionForm extends Component {

  constructor(props) {
    super(props);
    this.state = {txtEventId: '1603569863028785'};

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

    RequestService.get(`https://graph.facebook.com/v2.10/${this.state.txtEventId}?access_token=EAACEdEose0cBANMLoTxwVzC1cnoFiHCkg3XI49QdO1bDcZCs1JqfWsl0fevSnoosUobJZCrEmtAhwrfbOHFh27ZBYrhmHKtc8fF02YPI433TdH162VqL20rh0lRD4ZBeDN9UsRD3In0DwZCKyzzbu59kLlshBSCnYGPy6qSdfVSZCXJhMpkH6iTgRshpFTUByxbKUYzVfEMAZDZD&debug=all&format=json&method=get&pretty=0&suppress_http_code=1`)
      .then(response => response.json())
      .then(responseJson => {this.setState({eventInfo: responseJson})})
      .catch(error => {this.setState({eventInfo: error})});
  }

  render() {
    const inputFieldsComponent = (
      <p className="row">
        <input type="text" placeholder="Event id" value={this.state.txtEventId} onChange={this.handleInputChange} className="form-control col-sm-9" />
        <button onClick={this.handleButtonClick} className="form-control btn btn-primary col-sm-3">Retrieve event</button>
      </p>
    );

    let eventInfoComponent = null;
    if (this.state.eventInfo !== undefined && this.state.eventInfo !== null) {
      eventInfoComponent = (
        <table className="table table-border">
          <tbody>
            <EditableTR label="Name" value={this.state.eventInfo.name} />
            <EditableTR label="Description" value={this.state.eventInfo.description} />
            <EditableTR label="Place" value={this.state.eventInfo.place} />
            <EditableTR label="Start time" value={this.state.eventInfo.start_time} />
            <EditableTR label="End time" value={this.state.eventInfo.end_time} />
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
