import './App.css';
import React, { useState } from 'react';
import Data from './components/Data';

function App() {
  const [siteData, setSiteData] = useState([]);

  const handleFetchClick = async () => {
    fetch("http://localhost:5000/")
      .then((res) => {return res.json()})
      .then((data) => setSiteData(data));
  }

  const handleClearClick = async () => {
    fetch("http://localhost:5000/clear")
      .then((res) => {return res.json()})
      .then((data) => setSiteData(data));
  }

  return (
    <section>
      <div>
        <button onClick={handleFetchClick}>Fetch data</button>
      </div>
      <div>
        <button onClick={handleClearClick}>Clear data</button>
      </div>
    
      <div>
        { siteData.map(item => <Data data={ item } />) }
      </div>
    </section>
  );
}

export default App;
