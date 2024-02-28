/* this class allows GameLogic to be able to enable and stop gravity */

class GravityController {
	constructor (updateFunction, interval) {
		this.updateFunction = updateFunction;
        this.interval = interval;
        this.intervalId = null;
	}

	start() {
		if (this.intervalId === null) {
			this.intervalId = setInterval(this.updateFunction, this.interval);
		}
	}

	stop() {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}
}

module.exports.GravityController = GravityController;
