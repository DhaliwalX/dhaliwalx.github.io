import React, { Component } from 'react';
import { StaggeredMotion, spring } from 'react-motion';
import './App.css';

class App extends Component {
  render() {
    const text = "Dhaliwal";
    return (
      <div className="App">
        <StaggeredMotion
              defaultStyles={text.split("").map(() => ({ step: 0 }))}
              styles={ prevInterpolatingStyles => prevInterpolatingStyles.map((_, i) => {
                return i === 0 ?
                      { step: spring(100, { stiffness: 100, precision: 0.01 }) }
                      : { step : prevInterpolatingStyles[i - 1].step }
              })}>
          {
            interpolatingStyles => (
              <div className="letters">
                {
                  interpolatingStyles.map((style, i) => {
                    return (
                      <div className="letter" key={i} style={{ transform: "translateY(" + (100-style.step) + "%)", opacity: style.step / 100 }}>
                        { text[i] }
                      </div>
                    )
                  })
                }
              </div>
            )
          }
        </StaggeredMotion>
      </div>
    );
  }
}

export default App;
