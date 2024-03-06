/*
	In Tetris, the lock delay refers to the delay given to player when the tetro is in contact with the pile.
	When the tetro is in contact with the pile, there is a slight delay when the player can still move the tetro.
	Every move reset the lock delay. When the piece is still in contact with the pile after the lock delay 
	and no move has been made, then the tetro is added to the pile. The lock delay mechanic is active when the tetro
	is in direct contact with the pile. It suspends gravity until the player input moves the tetro outside of direct
	contact with the pile. Then gravity starts again. 
*/

class LockDelayController {

	constructor (onLockCallback, lockDelay) {
		this._onLockCallback = onLockCallback;
		this._lockDelay = lockDelay;
		this._lockTimeoutId = null;
		this._remaining = this._lockDelay;
		this._lastStartTime = 0;
	}

	start() {
		if (!this._lockTimeoutId) {
			this._lastStartTime = Date.now();
			this._lockTimeoutId = setTimeout(() => {
				this._onLockCallback();
				this._lockTimeoutId = null;
			}, this._remaining);
		}
	}

	reset() {

	}

	clear() {

	}

	pause() {

	}

	resume() {

	}
	
	
	startLockDelay() {
		this.clearLockDelay();

		this._lockTimeoutId = setTimeout(() => {
			this.onLockCallback();
		}, this._lockDelay);
	}

	/* when player does some move during the delay but the tetro is still on contact with the pile */
	resetLockDelay() {
		this.startLockDelay();
	}

	/* the tetro is still on contact with the pile after lock delay, no move has been made or
	a move is made and the tetro is not on contact with the pile anymore */
	clearLockDelay() {
		if (this._lockTimeoutId !== null) {
			clearTimeout(this._lockTimeoutId);
			this._lockTimeoutId = null;
		}
	}
}

module.exports.LockDelayController = LockDelayController;
