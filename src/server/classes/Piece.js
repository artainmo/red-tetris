class Piece {
    constructor(type=null, direction=null, position=null) {
      this._type = type;
      this._direction = direction;
      this._position = position;

      this._types = ["I", "O", "T", "S", "Z", "J", "L"];
      this._directions = ["left", "up", "down", "right"];
      this._positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    get_piece() {
      return {
        type: this._type,
        direction: this._direction,
        position: this._position
      }
    }

    generate_random_piece() {
      this._type = this._types[Math.floor(Math.random() * 7)];
      this._direction = this._directions[Math.floor(Math.random() * 4)];
      this._position = this._positions[Math.floor(Math.random() * 10)];

      return {
        type: this._type,
        direction: this._direction,
        position: this._position
      }
    }
}

module.exports.Piece = Piece;
