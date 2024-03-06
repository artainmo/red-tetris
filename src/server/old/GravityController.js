/* this class allows GameLogic to be able to enable and stop gravity */

class GravityController {
	constructor (updateFunction, gravetyTimeout) {
		this._updateFunction = updateFunction;
        this._gravityDelay = gravetyTimeout;
        this._gravityTimeoutId = null;
		this._remaining = this._gravityDelay;
		this._lastStartTime = 0;
	}

	start() {
		if (!this._gravityTimeoutId) {
			this._lastStartTime = Date.now();

			this._gravityTimeoutId = setTimeout(() => {
				this._updateFunction();
				this._gravityTimeoutId = null;
				this.start();
			}, this._remaining);
		}
	}

	stop() {
		if (this._gravityTimeoutId) {
			clearTimeout(this._gravityTimeoutId);
			this._gravityTimeoutId = null;
			this.remaining -= Date.now() - this.lastStartTime;
		}
	}

	reset() {
		this.stop();
		this._remaining = this._gravityDelay;
	}

	resume() {
		if (!this._gravityTimeoutId) {
			this.start();
		}
	}
}

module.exports.GravityController = GravityController;
