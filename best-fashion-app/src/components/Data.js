import React, { useState, useEffect } from 'react';

function Data ({ data }) {
    return (
        <div>
            <img src={data.imgPath} alt="img" />
            <a href={data.imgPath}>Link to item</a>
        </div>
    )
}

export default Data;