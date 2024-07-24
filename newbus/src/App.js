import React from 'react';
import logo from './logo.svg';
import './App.css';
import { CitiesProvider } from './CitiesContext';  // Import the CitiesProvider
import CityList from './Components/CityList';  // Assuming you have a CityList component
import OtherComponent from './Components/OtherComponent';  // Import any other components that need access to cities

function App() {
  return (
    <CitiesProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <CityList />  {/* Your CityList component */}
        <OtherComponent />  {/* Any other components */}
      </div>
    </CitiesProvider>
  );
}

export default App;
