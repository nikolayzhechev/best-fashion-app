import React, { useState, useEffect } from 'react';

function Data ({ data }) {
    return (
        <div>
            {console.log(data)}
            <h4>{data.title}</h4>
            <a href={data.itemUrl}>Link to item</a>
        </div>
    )
}

export default Data;