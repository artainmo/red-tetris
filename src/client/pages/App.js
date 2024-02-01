import React from 'react';
import Tetris from './Tetris'
import Home from './Home'
import LandingPage from './LandingPage';
import { Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/tetris" element={<Tetris/>}/>
        </Routes>
    );
};

export default App;
