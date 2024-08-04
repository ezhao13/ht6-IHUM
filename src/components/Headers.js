import React from 'react';
import logo from './logo.png';
import './Headers.css';

const Headers = () => {
    return (
        <header className="header">
            <h1 className="title">iHum.</h1>
            <img src={logo} alt="Logo" className="logo" />
        </header>
    );
};

export default Headers;
