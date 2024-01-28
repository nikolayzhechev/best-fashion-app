import '../App.css';
import React, { useState, useEffect } from 'react';
import { URL } from "../env.js";

function Navi ({ data, setData, setNavi, currentSite }) {

    const queryDataHandler = (e) => {
        const url = e.target.value;

        fetch(URL + "query", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                url,
                currentSite
            })
        })
        .then(() => {
          fetch(URL + "getQueryItems")
            .then((res) => {return res.json()})
            .then((data) => {
                setData(data.itemsData);
                setNavi(data.naviData);
            })
        })
    }

    return (
        <li className='navi-wrapper-list-item'>
            <button value={data.link} onClick={queryDataHandler}>
                {data.title}
            </button>
        </li>
    )
}

export default Navi;