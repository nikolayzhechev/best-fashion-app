import './App.css';
import React, { useState, useEffect } from 'react';
import Data from './components/Data';
import InputForm from './components/InputForm';
import Navi from './components/Navi.js';
import { URL } from './env.js';

function App() {
  const [siteData, setSiteData] = useState([]);
  const [naviData, setNaviData] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [error, setError] = useState(null);

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    fetch(URL)
      .then((res) => {return res.json()})
      .then((data) => setItemOptions(data))
      .catch(err => setError(err));
  }, []);

  const handleClearClick = async () => {
    fetch(URL)
      .then((res) => {return res.json()})
      .then((data) => setSiteData(data))
  }
                                          // TODO: check title nad link props
  return (
    <section>
      <div>
        <InputForm setData={setSiteData} setNavi={setNaviData} itemOptions={itemOptions}></InputForm>
      </div>
      <div className='navi-wrapper'>
        <ul>
          {
            naviData.map(item => <Navi data={ item }></Navi>)
          }
        </ul>
      </div>
      <div>
        <button onClick={handleClearClick}>Clear items</button>
      </div>
    
      <div className='items-wrapper'>
        { 
          error
            ?
          <p>No data available.</p>
            :
          siteData?.map(item => <Data data={ item } />) 
        }
      </div>
    </section>
  );
}

export default App;
