import '../App.css';
import React, { useState, useEffect } from "react";
import { URL } from "../env.js";

function InputForm ({ setData }) {
    const [itemOptions, setItemOptions] = useState([]);

    useEffect(() => {
      fetch(URL)
        .then((res) => {return res.json()})
        .then((data) => setItemOptions(data));
    }, [])

    const sendDataHandler = async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        let responseData = await postFormFieldsAsJson({ formData });

        fetch(URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: responseData
        })
        .then(() => {
            fetch(URL + "getItems")
                .then((res) => {return res.json()})
                .then((data) => setData(data));
        })
        .catch((err) => {
            console.log(err.message);
        });
    }

    async function postFormFieldsAsJson({ formData }){
        let formDataObject = Object.fromEntries(formData.entries());
        let formDataJsonString = JSON.stringify(formDataObject);
        
        return formDataJsonString;
    }

    return (
        <div>
            <form onSubmit={sendDataHandler}>
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
            </form>
        </div>
    )
}

export default InputForm;