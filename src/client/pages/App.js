import React from 'react';
import Auth from './Auth'
import Tetris from './Tetris'

const App = () => {
    return (
        <div>
            <Tetris user={'bob'} game={null} setGame={null} setPage={null} />
        </div>
    );
};

export default App;
