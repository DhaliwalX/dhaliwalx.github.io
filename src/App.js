import React, { Component } from 'react';
import Dhaliwal from './Dhaliwal';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <Dhaliwal />
      </div>
    );
  }
}

export default App;
