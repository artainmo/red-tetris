import React from 'react';
import LandingPage from './LandingPage';
import Auth from './Auth';
import MainMenu from './MainMenu';
import Game from './Game';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthGuard from '../guards/authGuard';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/auth' element={<Auth />} />
                <Route path='/main_menu' element={
                    <AuthGuard>
                        <MainMenu />
                    </AuthGuard>
                } />
                <Route path='/#:room_id[:player_id]' element={< Game/>} />
            </Routes>
        </Router>
    );
};

export default App;
