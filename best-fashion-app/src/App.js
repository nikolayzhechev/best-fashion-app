import './App.css';
import React, { useState, useEffect } from 'react';
import Data from './components/Data';
import InputForm from './components/InputForm';
import Navi from './components/Navi.js';
import { URL } from './env.js';

function App() {
  const [siteData, setSiteData] = useState([]);
  const [naviData, setNaviData] = useState([]);
  const [queryData, setQueryData] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [currentSiteName, setCurrentSiteName] = useState("");
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

  return (
    <section>
      <div>
        <InputForm
          setData={setSiteData}
          setNavi={setNaviData}
          itemOptions={itemOptions}
          setSiteName={setCurrentSiteName}></InputForm>
      </div>
      <div className='navi-wrapper'>
        <ul className='navi-wrapper-list'>
          {
            naviData.map(item => <Navi
              data={item}
              mainSiteData={siteData}
              setData={setSiteData}
              setNavi={setNaviData}
              thisSite={currentSiteName}></Navi>)
          }
        </ul>
      </div>
      <div>
        <button onClick={handleClearClick}>Clear filters</button>
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
