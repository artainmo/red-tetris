import React from 'react';
import LandingPage from './LandingPage';
import Auth from './Auth';
import MainMenu from './MainMenu';
import Game from './Game';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import AuthGuard from '../guards/authGuard';
import store from '../redux/store';
import Lobby from './Lobby';
import Stopwatch from '../components/Stopwatch';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path='/' element={<Stopwatch />} />
                    <Route path='/auth' element={<Auth />} />
                    <Route path='/main_menu' element={
                        <AuthGuard>
                            <MainMenu />
                        </AuthGuard>
                    } />
                    <Route path='/#:room_id[:player_id]' element={
                            < Game/>
                    } />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;
