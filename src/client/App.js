import React from 'react';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import MainMenu from './pages/MainMenu';
import Game from './pages/Game';
import MultiGame from './pages/MultiGame';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import AuthGuard from './guards/AuthGuard';
import store from './redux/store';
import Lobby from './pages/Lobby';
import GameGuard from './guards/GameGuard';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/auth' element={<Auth />} />
                    <Route path='/main_menu' element={
                        <AuthGuard>
                            <MainMenu />
                        </AuthGuard>
                    } />
                    <Route path='/lobby' element={
                        <AuthGuard>
                            <Lobby /> 
                        </AuthGuard>
                    } />
                    <Route path='/game/:room_id' element={
                        <AuthGuard>
                            <GameGuard>
                                <Game/>
                            </GameGuard>
                        </AuthGuard>
                    } />
                    <Route path='/multiplayer/:room_id' element={
                        <AuthGuard>
                            <GameGuard>
                                <MultiGame/>
                            </GameGuard>
                        </AuthGuard>
                    } />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;
