import '../App.css';
import React, { useState, useEffect } from 'react';

function Data ({ data }) {
    return (
        <div className='data-wrapper'>
            <div className='data-wrapper-img'>
                <img src={data.img} alt='Item'></img>
            </div>
            <div className='data-wrapper-content'>
                <a href={data.itemUrl}>{data.title}</a>
                <p>{data?.description}</p>
                <p className='content-price'>{data.price}</p>
                <p className='content-old-price'>{data.originalPrice}</p>
            </div>
        </div>
    )
}

export default Data;