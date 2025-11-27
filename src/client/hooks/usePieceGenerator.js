import React, { useState } from "react";
import { useSelector } from "react-redux";

const usePieceGenerator = () => {
  const [bag, setBag] = useState([]);
  const roomId = useSelector((state) => state.room.id);

  const PIECES_TYPE = ["I", "O", "T", "L", "J", "S", "Z"];

  const seed = roomId
    .toString()
    .split("")
    .map(c => c.charCodeAt(0))
    .reduce((a, b) => a + b, 0);

  const rng = makeSeededRandom(seed);

  const shuffleArrayWithFisherYatesPermutationAlgo = ([...arr]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const getNextPiece = () => {
    if (bag.length === 0) {
      const newBag = shuffleArrayWithFisherYatesPermutationAlgo(PIECES_TYPE);
      setBag(newBag);
      return newBag.pop();
    } else {
      const newBag = [...bag];
      const piece = newBag.pop();
      setBag(newBag);
      return piece;
    }
  };

  return getNextPiece;
};

function makeSeededRandom(seed) {
  let state = seed;
  return function() {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export default usePieceGenerator;
