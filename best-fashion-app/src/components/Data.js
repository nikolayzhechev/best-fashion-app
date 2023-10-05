import '../App.css';
import React, { useState, useEffect } from 'react';

function Data ({ data }) {
    return (
        <div className='data'>
            <img src={data.img} alt='Item'></img>
            <h4>{data?.title}</h4>
            <a href={data?.itemUrl}>Link to item</a>
        </div>
    )
}

export default Data;