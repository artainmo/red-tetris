import React from 'react'
import PropTypes from 'prop-types'
import {
	arrayContainerStyle,
	arrayDivStyle,
	titleStyle,
	delimiterStyle,
} from '../../style/panelStyle'

const BestScoresArray = ({ scores }) => {
	return (
		<div style={arrayContainerStyle}>
			<div style={arrayDivStyle}>
				<div>
					<h2 style={titleStyle}>Best Scores</h2>
					<div style={delimiterStyle}></div>
				</div>
				<div>
					{Object.keys(scores).map((key, index) => (
						<p key={index}>
							{key} best scores is <mark>{scores[key]}</mark> points
						</p>
					))}
				</div>
			</div>
		</div>
	)
}

BestScoresArray.propTypes = {
	scores: PropTypes.object.isRequired,
}

export default BestScoresArray
