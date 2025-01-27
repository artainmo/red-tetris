import React from "react";
import { logoWhiteStyle, logoRedStyle } from "../../style/pagesStyle";

const logoContainerStyle = {
    height: '20%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: 0,
    alignSelf: 'start'
}

const redContainerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
}

export default function RedTetrisLogo() {
    return (
        <div style={logoContainerStyle}>
            <div style={redContainerStyle}>
                <p style={logoRedStyle}>
                    Red
                </p>
            </div>
            <div style={redContainerStyle}>
                <p style={logoWhiteStyle}>
                    Tetris
                </p>
            </div>
        </div>
    )
};