import '../App.css';
import Images from './Images';
import React, { useState, useEffect } from 'react';

function Data ({ data }) {
    return (
        <div className='data-wrapper'>
            <div className='data-wrapper-img'>
                {
                    data.img?.map(item => <Images data={ item }/>)
                }
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