import React from "react";
import { whiteStyle, redStyle, redContainerStyle } from "../../style/pagesStyle";

const titleContainerStyle = {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    margin: 'auto'
}

export default function RedTetrisTitle() {
    return (
        <div style={titleContainerStyle}>
            <div style={redContainerStyle}>
                <p style={redStyle}>
                    Red
                </p>
            </div>
            <div style={redContainerStyle}>
                <p style={whiteStyle}>
                    Tetris
                </p>
            </div>
        </div>
    )
};