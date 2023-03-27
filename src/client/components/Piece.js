import React from 'react';

const colorI = '#cc0f0f';
const colorJ = '#1cd211';
const colorL = '#95e011';
const colorO = '#f6c709';
const colorS = '#5717e0';
const colorT = '#e74208';
const colorZ = '#a808e7';

const getPieceShape = (shape, direction) => {
	switch (shape) {
		case 'I':
			switch (direction) {
				case 'up':
					return [
						[colorI, colorI, colorI, colorI],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					];
				case 'down':
					return [
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[colorI, colorI, colorI, colorI]
					];
				case 'left':
					return [
						[colorI, 0, 0, 0],
						[colorI, 0, 0, 0],
						[colorI, 0, 0, 0],
						[colorI, 0, 0, 0]
					];
				case 'right':
					return [
						[0, 0, 0, colorI],
						[0, 0, 0, colorI],
						[0, 0, 0, colorI],
						[0, 0, 0, colorI]
					];
			}
			break ;
		case 'J':
			switch (direction) {
				case 'up':
					return [
						[colorJ, 0, 0, 0],
						[colorJ, colorJ, colorJ, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
					];
				case 'down':
					return [
							[0, colorJ, colorJ, colorJ],
							[0, 0, 0, colorJ],
							[0, 0, 0, 0],
							[0, 0, 0, 0],
					];
				case 'left':
					return [
						[0, 0, 0, colorJ],
						[0, 0, 0, colorJ],
						[0, 0, colorJ, colorJ],
						[0, 0, 0, 0],
					];
				case 'right':
					return [
						[colorJ, colorJ, 0, 0],
						[colorJ, 0, 0, 0],
						[colorJ, 0, 0, 0],
						[0, 0, 0, 0],
					];
			}
			break ;
		case 'L':
			switch (direction) {
				case 'up':
					return [
						[0, 0, 0, colorL],
						[0, colorL, colorL, colorL],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
					];
				case 'down':
					return [
						[colorL, colorL, colorL, 0],
						[colorL, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
					];
				case 'left':
					return [
						[0, 0, colorL, colorL],
						[0, 0, 0, colorL],
						[0, 0, 0, colorL],
						[0, 0, 0, 0],
					];
				case 'right':
					return [
						[colorL, 0, 0, 0],
						[colorL, 0, 0, 0],
						[colorL, colorL, 0, 0],
						[0, 0, 0, 0],
					];
			}
			break ;
		case 'O':
			switch (direction) {
				case 'up':
					return [
						[0, colorO, colorO, 0],
						[0, colorO, colorO, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					];
				case 'down':
					return [
						[0, colorO, colorO, 0],
						[0, colorO, colorO, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					];
				case 'left':
					return [
						[0, colorO, colorO, 0],
						[0, colorO, colorO, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					];
				case 'right':
					return [
						[0, colorO, colorO, 0],
						[0, colorO, colorO, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					];
			}
			break ;
		case 'S':
			switch (direction) {
				case 'up':
					return [
						[0, colorS, colorS, 0],
						[colorS, colorS, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					];
				case 'down':
					return [
						[0, 0, 0, 0],
						[0, colorS, colorS, 0],
						[colorS, colorS, 0, 0],
						[0, 0, 0, 0]
					];
				case 'left':
					return [
						[colorS, 0, 0, 0],
						[colorS, colorS, 0, 0],
						[0, colorS, 0, 0],
						[0, 0, 0, 0]
					];
				case 'right':
					return [
						[0, colorS, 0, 0],
						[0, colorS, colorS, 0],
						[0, 0, colorS, 0],
						[0, 0, 0, 0],
					];
			}
			break ;
		case 'T':
			switch (direction) {
				case 'up':
					return [
						[0, colorT, 0, 0],
						[colorT, colorT, colorT, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					];
				case 'down':
					return [
						[0, 0, 0, 0],
						[colorT, colorT, colorT, 0],
						[0, colorT, 0, 0],
						[0, 0, 0, 0]
					];
				case 'left':
					return [
						[0, colorT, 0, 0],
						[colorT, colorT, 0, 0],
						[0, colorT, 0, 0],
						[0, 0, 0, 0]
					];
				case 'right':
					return [
						[0, colorT, 0, 0],
						[0, colorT, colorT, 0],
						[0, colorT, 0, 0],
						[0, 0, 0, 0]
					];
			}
			break ;
		case 'Z':
			switch (direction) {
				case 'up':
					return [
						[colorZ, colorZ, 0, 0],
						[0, colorZ, colorZ, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					];
				case 'down':
					return [
						[0, 0, 0, 0],
						[colorZ, colorZ, 0, 0],
						[0, colorZ, colorZ, 0],
						[0, 0, 0, 0]
					];
				case 'left':
					return [
						[0, colorZ, 0, 0],
						[colorZ, colorZ, 0, 0],
						[colorZ, 0, 0, 0],
						[0, 0, 0, 0]
					];
				case 'right':
					return [
						[0, 0, colorZ, 0],
						[0, colorZ, colorZ, 0],
						[0, colorZ, 0, 0],
						[0, 0, 0, 0]
					];
			}
			break ;
	}
};

export default getPieceShape;
