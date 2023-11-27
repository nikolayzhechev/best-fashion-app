import '../App.css';
import React, { useState, useEffect } from 'react';

function Navi ({ data }) {
    return (
        <li><a href={data.link}>{data.title}</a></li>
    )
}

export default Navi;