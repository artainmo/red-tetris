import React from "react";
import { logoWhiteStyle, logoRedStyle } from "../../style/pagesStyle";

const logoContainerStyle = {
    height: '100%',
    display: 'flex-column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 0,
}

export default function RedTetrisLogo() {
    return (
        <div style={logoContainerStyle}>
            <div>
                <p style={logoRedStyle}>
                    Red
                </p>
            </div>
            <div>
                <p style={logoWhiteStyle}>
                    Tetris
                </p>
            </div>
        </div>
    )
};