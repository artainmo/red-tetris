import React from 'react';

const colorI = '#cc0f0f';
const colorJ = '#1cd211';
const colorL = '#0720e1';
const colorO = '#f6c709';
const colorS = '#5717e0';
const colorT = '#e74208';
const colorZ = '#a808e7';
const black = '#000000';

const getPieceShape = (shape) => {
	switch (shape) {
		case 'I':
			return [
				[colorI, colorI, colorI, colorI],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
			];
		case 'J':
			return [
				[colorJ, 0, 0],
				[colorJ, colorJ, colorJ],
			];
		case 'L':
			return [
				[0, 0, colorL],
				[colorL, colorL, colorL],
			];
		case 'O':
			return [
				[colorO, colorO],
				[colorO, colorO],
			];
		case 'S':
			return [
				[0, colorS, colorS],
				[colorS, colorS, 0],
			];
		case 'T':
			return [
				[0, colorT, 0],
				[colorT, colorT, colorT],
			];
		case 'Z':
			return [
				[colorZ, colorZ, 0],
				[0, colorZ, colorZ],
			];
		default:
			return [];
	}
};

export default getPieceShape;
