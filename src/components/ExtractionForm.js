/* global FB */

import React, { Component } from 'react';
import RequestService from '../services/RequestService';
import CalendarComponent from './CalendarComponent';
import EditableTR from './EditableTR';
import AlertContainer from 'react-alert';

class ExtractionForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      logedInFacebook: false,
      txtEventUrl: '',
      eventInfo: null
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInfoChange = this.handleInfoChange.bind(this);
    this.handleRetrieveButtonClick = this.handleRetrieveButtonClick.bind(this);
    this.handleAddSuccess = this.handleAddSuccess.bind(this);
    this.handleAddFailure = this.handleAddFailure.bind(this);
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
      txtEventUrl: event.target.value
    });
  }

  handleInfoChange(fieldName, newInfo) {
    let eventInfo = this.state.eventInfo;
    eventInfo[fieldName] = newInfo;

    this.setState({eventInfo: eventInfo});
  }
  
  handleRetrieveButtonClick(e) {
    e.preventDefault();

    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        this.accessToken = response.authResponse.accessToken;

        const eventId = this.state.txtEventUrl.split('/')[4];

        RequestService.get(`https://graph.facebook.com/v2.10/${eventId}?access_token=${this.accessToken}&debug=all&format=json&method=get&pretty=0&suppress_http_code=1`)
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.place.name) {
              responseJson.place = responseJson.place.name;
            }
            this.setState({eventInfo: responseJson});
          })
          .catch(error => {this.setState({eventInfo: {}})});
      } else {
        FB.login();
      }
    });
  }

  handleAddSuccess(event) {
    console.log('Event created: ' + event.htmlLink);
    this.setState({eventInfo: null});
    this.msg.success('Event added successfully');
  }

  handleAddFailure(error) {
    console.log('Error: ' + error);
    this.msg.error('Error adding event');    
  }

  render() {
    const inputFieldsComponent = (
      <p className="row">
        <input type="text" placeholder="Event url" value={this.state.txtEventUrl} onChange={this.handleInputChange} className="form-control col-sm-9" />
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

    let eventInfoComponent = null;
    
    if (this.state.eventInfo !== undefined && this.state.eventInfo !== null) {
      const rowItemsComponent = rowItems.map((item) =>
        <EditableTR label={item.label} key={item.index} value={this.state.eventInfo[item.jsonFieldName]} 
          fieldName={item.jsonFieldName} onTextChange={this.handleInfoChange} />
      );

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
        <CalendarComponent eventInfo={this.state.eventInfo} 
          onAddSuccess={this.handleAddSuccess}
          onAddFailure={this.handleAddFailure} />
      );
    }
    
    return (
      <form>
        {inputFieldsComponent}
        {eventInfoComponent}
        {calendarComponent}
        <AlertContainer ref={a => this.msg = a} />
      </form>
    );
  }
}

export default ExtractionForm;
