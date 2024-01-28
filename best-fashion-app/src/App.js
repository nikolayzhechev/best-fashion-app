import './App.css';
import React, { useState, useEffect } from 'react';
import Data from './components/Data';
import InputForm from './components/InputForm';
import Navi from './components/Navi.js';
import { URL } from './env.js';

function App() {
  const [siteData, setSiteData] = useState([]);
  const [naviData, setNaviData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [currentSite, setCurrentSite] = useState("");
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
  };

  const handlePageClick = async (e) => {
    const url = e.target.value;

    fetch(URL + "query", {          // get data via page link
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        url,
        currentSite
      })
    }).then(() => {
      fetch(URL + "query")
        .then((res) => {return res.json()})
        .then((data) => {
          setSiteData(data.itemsData);
          setNaviData(data.naviData); 
        })
    })
      
  };

  const handleScroll = (e) => {
    const pagebottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    console.log(pagebottom)
    if (pagebottom){
      //TODO: fetch data on page bottom
      //(append data to existing data, do NOT remove old data here)
      fetch(URL + "getItems?page")
        .then((res) => {return res.json()})
        .then((data) => {
          setSiteData(data.itemsData)
        })
    }
  };

  return (
    <section className='main-section' onScroll={handleScroll}>
      <div>
        <InputForm
          setData={setSiteData}
          setNavi={setNaviData}
          setPages={setPageData}
          itemOptions={itemOptions}
          setSiteName={setCurrentSite}>
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
              currentSite={currentSite}>
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
              <button value={item.url} onClick={handlePageClick}>
                {item.text}
              </button>
            </li>)
          }
        </ul>
      </div>
    </section>
  );
}

export default App;
