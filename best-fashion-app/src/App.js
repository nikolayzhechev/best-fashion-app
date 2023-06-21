import './App.css';
import React, { useState, useEffect } from 'react';
import Data from './components/Data';

function App() {
  const [siteData, setSiteData] = useState([]);

  useEffect(function (){
    fetch("http://localhost:5000/")
      .then((res) => {return res.json()})
      .then((data) => setSiteData(data));
  }, []);

  return (
    <div>
      { siteData.map(item => <Data data={ item } />) }
    </div>
  );
}

export default App;
