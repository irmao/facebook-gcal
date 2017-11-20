/* global gapi */

import React, { Component } from 'react';

class CalendarComponent extends Component {
  constructor(props) {
    super();
    
    // Client ID and API key from the Developer Console
    this.CLIENT_ID = '343899958217-nqrbp6vlgr082t3gqh3vtdr4e5eled0u.apps.googleusercontent.com';
    this.API_KEY = 'AIzaSyCsZxBc9triZJDYBo5RunqbEbXnkBTBYUc';

    // Array of API discovery doc URLs for APIs used by the quickstart
    this.DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    this.SCOPES = "https://www.googleapis.com/auth/calendar";
    
    this.state = { gapiReady: false, isSignedIn: false };

    this.eventInfo = props.eventInfo;

    this.initClient = this.initClient.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";

    script.onload = () => {
      gapi.load('client:auth2', this.initClient);
    };

    document.body.appendChild(script);
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  initClient() {
    gapi.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      discoveryDocs: this.DISCOVERY_DOCS,
      scope: this.SCOPES
    }).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

      // Handle the initial sign-in state.
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      this.handleAuthClick = this.handleAuthClick.bind(this);
      this.handleSignoutClick = this.handleSignoutClick.bind(this);
      this.handlePostClick = this.handlePostClick.bind(this);

      this.setState( {gapiReady: true} );
    });
  }

  updateSigninStatus(isSignedIn) {
    this.setState( { isSignedIn: isSignedIn } );
  }

  /**
   *  Sign in the user upon button click.
  */
  handleAuthClick(e) {
    e.preventDefault();
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  handleSignoutClick(e) {
    e.preventDefault();
    gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * Post an event upon button click.
   */
  handlePostClick(e) {
    e.preventDefault();

    var event = {
      'summary': this.eventInfo['name'],
      'location': this.eventInfo['place']['name'] ? this.eventInfo['place']['name'] : this.eventInfo['place'],
      'description': this.eventInfo['description'],
      'end': {
        'dateTime': this.eventInfo['end_time'],
        'timeZone': 'America/Sao_Paulo'
      },
      'start': {
      'dateTime': this.eventInfo['start_time'],
      'timeZone': 'America/Sao_Paulo'
      }
    };

    var request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    });

    request.execute((event) => {
      console.log('Event created: ' + event.htmlLink);
    });
  }

  render() {
    let authorizeButton = null;
    let signoutButton = null;
    let postButton = null;

    if (this.state.gapiReady) {
      if (this.state.isSignedIn) {
        signoutButton = (
          <button onClick={this.handleSignoutClick} className="form-control btn btn-primary">Singout from Google Calendar</button>        
        );
  
        postButton = (
          <button onClick={this.handlePostClick} className="form-control btn btn-primary">Add event</button>        
        );
      } else {
        authorizeButton = (
          <button onClick={this.handleAuthClick} className="form-control btn btn-primary">Authorize access to Google Calendar</button>
        );
      }
    }

    return (
      <div style={{marginBottom: 10}}>
        <div style={{marginBottom: 10}}>
          {authorizeButton}
          {postButton}
        </div>
        {signoutButton}
      </div>
    );
  }
}

export default CalendarComponent;