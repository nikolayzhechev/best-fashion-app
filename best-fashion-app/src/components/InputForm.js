import '../App.css';
import React, { useState, useEffect } from "react";
import { URL } from "../env.js";

function InputForm ({ setData, setNavi, itemOptions }) {
    const [type, setType] = useState("");

    const updateTypeHandler = (e) => {
        setType(e.target.value);
    };

    const sendDataHandler = (e) => {
        const siteName = e.target.value;

        fetch(URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                siteName,
                type
            })
        })
        .then(() => {
            fetch(URL + "getItems")
                .then((res) => {return res.json()})
                .then((data) => {
                    setData(data.itemsData);
                    setNavi(data.naviData);
                });
        })
        .catch((err) => {
            console.log(err.message);
        });
    }

    return (
        <div className='navi-container'>
            <ul className='navi-list-container'>
                <li className='navi-list-container-item'>
                    <button value={"woman"} onMouseOver ={updateTypeHandler}>Woman</button>
                    <ul className='navi-list-dropdown'>
                        {
                            itemOptions?.map((item) =>
                                <li className='navi-list-item'>
                                    <button value={item.name} onClick={sendDataHandler}>
                                        {item.name}
                                    </button>
                                </li>)
                        }
                    </ul>
                </li>
                <li className='navi-list-container-item'>
                    <button value={"men"} onMouseOver ={updateTypeHandler}>Men</button>
                    <ul className='navi-list-dropdown'>
                        {
                            itemOptions?.map((item) =>
                                <li className='navi-list-item'>
                                    <button value={item.name} onClick={sendDataHandler}>
                                        {item.name}
                                    </button>
                                </li>)
                        }
                    </ul>
                </li>
            </ul>

            {/* <form onSubmit={sendDataHandler}>
                <label htmlFor="siteName">Site Name:</label>
                <select id="siteName" name="siteName">
                    {
                        itemOptions?.map((item) => <option value={item.name}>{item.name}</option>)
                    }
                </select>

                <label htmlFor="type">Type:</label>
                <select id="type" name="type">
                    <option value="woman">Woman</option>
                    <option value="men">Men</option>
                </select>

                <button type="submit">Filter items</button>
            </form> */}
        </div>
    )
}

export default InputForm;