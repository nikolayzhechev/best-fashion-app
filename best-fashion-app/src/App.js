import './App.css';
import React, { useState } from 'react';
import Data from './components/Data';
import InputForm from './components/InputForm';
import { URL } from './env.js';

function App() {
  const [siteData, setSiteData] = useState([]);

  const handleClearClick = async () => {
    fetch(URL)
      .then((res) => {return res.json()})
      .then((data) => setSiteData(data));
  }

  return (
    <section>
      <div>
        <InputForm setData={setSiteData}></InputForm>
      </div>
      <div>
        <button onClick={handleClearClick}>Clear items</button>
      </div>
    
      <div className='items-wrapper'>
        { 
          siteData.length === 0
            ? 
          <p>No data available.</p>
            :
          siteData.map(item => <Data data={ item } />) 
        }
      </div>
    </section>
  );
}

export default App;
