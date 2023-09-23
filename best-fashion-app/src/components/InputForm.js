import React, { useState } from "react";
import { URL } from "../env.js";

function InputForm () {
    //const [formData, setFormData] = useState( {url: "", siteName: "", type: "", });

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
        .catch((err) => {
            console.log(err.message);
        });
    }

    async function postFormFieldsAsJson({ formData }){
        let formDataObject = Object.fromEntries(formData.entries());
        let formDataJsonString = JSON.stringify(formDataObject);
        return formDataJsonString;
    }

//value={formData.url} onChange={(e) => setFormData(e.target.url)}
    return (
        <div>
            <form onSubmit={sendDataHandler}>
                <label htmlFor="url">URL:</label>
                <input type="text" id="url" name="url"></input>

                <label htmlFor="siteName">Site Name:</label>
                <input type="text" id="siteName" name="siteName"></input>

                <label htmlFor="type">Type:</label>
                <input type="text" id="type" name="type"></input>

                <button type="submit" >Send</button>
            </form>
        </div>
    )
}

export default InputForm;