import '../App.css';
import React, { useState, useEffect } from 'react';
import { URL } from "../env.js";

function Navi ({ data, setData, setNavi, thisSite }) {

    const queryDataHandler = (e) => {
        const queryLink = e.target.value;

        fetch(URL + "query", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                queryLink,
                thisSite
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