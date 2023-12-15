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
  const [pageData, setPageData] = useState([]);
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
    <section className='main-section'>
      <div>
        <InputForm
          setData={setSiteData}
          setNavi={setNaviData}
          setPages={setPageData}
          itemOptions={itemOptions}
          setSiteName={setCurrentSiteName}>
          </InputForm>
      </div>
      <div className='navi-wrapper'>
        <ul className='navi-wrapper-list'>
          {
            naviData.map(item => <Navi
              data={item}
              mainSiteData={siteData}
              setData={setSiteData}
              setNavi={setNaviData}
              thisSite={currentSiteName}>
              </Navi>)
          }
        </ul>
      </div>
      <div className='clear-btn'>
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

      <div className='pagination-container'>
        <ul>
          { pageData?.map(item => <li>
              <button><a href={item.url}>{item.text}</a></button>
            </li>)
          }
        </ul>
      </div>
    </section>
  );
}

export default App;
