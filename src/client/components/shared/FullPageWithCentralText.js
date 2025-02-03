import React from "react";
import { titleContainerStyle, redContainerStyle, whiteStyle } from "../../style/containersStyle";
import RedTetrisLogo from "./RedTetrisLogo";

const FullPageWithCentralText = ({centralText}) => {

	return (
            <div style={titleContainerStyle}>
                <div style={redContainerStyle}>
                    <RedTetrisLogo firstLine="Red" secondLine="Tetris" />
                    <p style={whiteStyle}>
                        {centralText}
                    </p>
                </div>
            </div>
	)
}

export default FullPageWithCentralText;
