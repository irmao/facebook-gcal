/* global FB */

import React, { Component } from 'react';
import RequestService from '../services/RequestService';
import CalendarComponent from './CalendarComponent';
import EditableTR from './EditableTR';

class ExtractionForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      txtEventId: '1603569863028785',
      logedInFacebook: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRetrieveButtonClick = this.handleRetrieveButtonClick.bind(this);
  }

  componentDidMount() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '168433393896287',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.11'
      });
        
      FB.AppEvents.logPageView();
    };
  
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  handleInputChange(event) {
    this.setState({
      txtEventId: event.target.value
    });
  }

  handleRetrieveButtonClick(e) {
    e.preventDefault();

    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        this.accessToken = response.authResponse.accessToken;

        const eventId = this.state.txtEventId.split('/')[4];

        RequestService.get(`https://graph.facebook.com/v2.10/${eventId}?access_token=${this.accessToken}&debug=all&format=json&method=get&pretty=0&suppress_http_code=1`)
          .then(response => response.json())
          .then(responseJson => {this.setState({eventInfo: responseJson})})
          .catch(error => {this.setState({eventInfo: error})});
      } else {
        FB.login();
      }
    });
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
