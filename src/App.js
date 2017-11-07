import React, { Component } from 'react';
import ExtractionForm from './ExtractionForm';

class App extends Component {

  render() {
    return (
      <div>
        <h1>Event Transfer</h1>
        <h4>Retrieves facebook events and adds them to google calendar</h4>
        <ExtractionForm />
      </div>
    );
  }
}

export default App;
