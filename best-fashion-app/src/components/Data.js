import React, { useState, useEffect } from 'react';

function  Data ({ data }) {
    return (
        <div>
            <h2>{data.title}</h2>
            <a href={data.url}>Link to item</a>
        </div>
    )
}

export default Data;