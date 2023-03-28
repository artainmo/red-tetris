const colorI = '#cc0f0f';
const colorJ = '#1cd211';
const colorL = '#95e011';
const colorO = '#f6c709';
const colorS = '#5717e0';
const colorT = '#e74208';
const colorZ = '#a808e7';
const colorBg = '#3565d0';

// useless now but can be useful in the future
const getPieceColor = (shape) => {
	switch (shape) {
		case 'I':
			return colorI;
		case 'J':
			return colorJ;
		case 'L':
			return colorL;
		case 'O':
			return colorO;
		case 'S':
			return colorS;
		case 'T':
			return colorT;
		case 'Z':
			return colorZ;
		default:
			return colorBg;
	}
};

const getPieceShape = (shape, direction) => {
	switch (shape) {
		case 'I':
			switch (direction) {
				case 'up':
					return [
						[colorI, colorI, colorI, colorI],
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
				case 'down':
					return [
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
						[colorI, colorI, colorI, colorI]
					];
				case 'left':
					return [
						[colorI, colorBg, colorBg, colorBg],
						[colorI, colorBg, colorBg, colorBg],
						[colorI, colorBg, colorBg, colorBg],
						[colorI, colorBg, colorBg, colorBg]
					];
				case 'right':
					return [
						[colorBg, colorBg, colorBg, colorI],
						[colorBg, colorBg, colorBg, colorI],
						[colorBg, colorBg, colorBg, colorI],
						[colorBg, colorBg, colorBg, colorI]
					];
			}
			break ;
		case 'J':
			switch (direction) {
				case 'up':
					return [
						[colorJ, colorBg, colorBg, colorBg],
						[colorJ, colorJ, colorJ, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
					];
				case 'down':
					return [
							[colorBg, colorJ, colorJ, colorJ],
							[colorBg, colorBg, colorBg, colorJ],
							[colorBg, colorBg, colorBg, colorBg],
							[colorBg, colorBg, colorBg, colorBg],
					];
				case 'left':
					return [
						[colorBg, colorBg, colorBg, colorJ],
						[colorBg, colorBg, colorBg, colorJ],
						[colorBg, colorBg, colorJ, colorJ],
						[colorBg, colorBg, colorBg, colorBg],
					];
				case 'right':
					return [
						[colorJ, colorJ, colorBg, colorBg],
						[colorJ, colorBg, colorBg, colorBg],
						[colorJ, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
					];
			}
			break ;
		case 'L':
			switch (direction) {
				case 'up':
					return [
						[colorBg, colorBg, colorBg, colorL],
						[colorBg, colorL, colorL, colorL],
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
					];
				case 'down':
					return [
						[colorL, colorL, colorL, colorBg],
						[colorL, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
					];
				case 'left':
					return [
						[colorBg, colorBg, colorL, colorL],
						[colorBg, colorBg, colorBg, colorL],
						[colorBg, colorBg, colorBg, colorL],
						[colorBg, colorBg, colorBg, colorBg],
					];
				case 'right':
					return [
						[colorL, colorBg, colorBg, colorBg],
						[colorL, colorBg, colorBg, colorBg],
						[colorL, colorL, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
					];
			}
			break ;
		case 'O':
			switch (direction) {
				case 'up':
					return [
						[colorBg, colorO, colorO, colorBg],
						[colorBg, colorO, colorO, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
				case 'down':
					return [
						[colorBg, colorO, colorO, colorBg],
						[colorBg, colorO, colorO, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
				case 'left':
					return [
						[colorBg, colorO, colorO, colorBg],
						[colorBg, colorO, colorO, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
				case 'right':
					return [
						[colorBg, colorO, colorO, colorBg],
						[colorBg, colorO, colorO, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
			}
			break ;
		case 'S':
			switch (direction) {
				case 'up':
					return [
						[colorBg, colorS, colorS, colorBg],
						[colorS, colorS, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
				case 'down':
					return [
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorS, colorS, colorBg],
						[colorS, colorS, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
				case 'left':
					return [
						[colorS, colorBg, colorBg, colorBg],
						[colorS, colorS, colorBg, colorBg],
						[colorBg, colorS, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
				case 'right':
					return [
						[colorBg, colorS, colorBg, colorBg],
						[colorBg, colorS, colorS, colorBg],
						[colorBg, colorBg, colorS, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
					];
			}
			break ;
		case 'T':
			switch (direction) {
				case 'up':
					return [
						[colorBg, colorT, colorBg, colorBg],
						[colorT, colorT, colorT, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
				case 'down':
					return [
						[colorBg, colorBg, colorBg, colorBg],
						[colorT, colorT, colorT, colorBg],
						[colorBg, colorT, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
				case 'left':
					return [
						[colorBg, colorT, colorBg, colorBg],
						[colorT, colorT, colorBg, colorBg],
						[colorBg, colorT, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
				case 'right':
					return [
						[colorBg, colorT, colorBg, colorBg],
						[colorBg, colorT, colorT, colorBg],
						[colorBg, colorT, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
			}
			break ;
		case 'Z':
			switch (direction) {
				case 'up':
					return [
						[colorZ, colorZ, colorBg, colorBg],
						[colorBg, colorZ, colorZ, colorBg],
						[colorBg, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
				case 'down':
					return [
						[colorBg, colorBg, colorBg, colorBg],
						[colorZ, colorZ, colorBg, colorBg],
						[colorBg, colorZ, colorZ, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
				case 'left':
					return [
						[colorBg, colorZ, colorBg, colorBg],
						[colorZ, colorZ, colorBg, colorBg],
						[colorZ, colorBg, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
				case 'right':
					return [
						[colorBg, colorBg, colorZ, colorBg],
						[colorBg, colorZ, colorZ, colorBg],
						[colorBg, colorZ, colorBg, colorBg],
						[colorBg, colorBg, colorBg, colorBg]
					];
			}
			break ;
	}
};

export {getPieceColor, getPieceShape};
