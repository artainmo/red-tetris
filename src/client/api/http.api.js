import { API_ENDPOINT } from "./api_endpoint"

const axios = require('axios');
axios.defaults.baseURL = API_ENDPOINT + "/rest";

/*
** Create account if it does not exist yet and verify name validity.
** Else connect to existing account.
*/
export const connect = async (name) => {
 	try {
    	const response = await axios.get(`/connect/${encodeURIComponent(name)}`);
		return {
			status: response.status,
			data: response.data
		};
 	} catch (err) {
		return err;
  }
}
/*
** Return on success example:
{
  status: 200,
  data: {
          message: 'Connection success of Alfred',
          username: 'Alfred'
        }
}
** Return on failure example:
{
  status: 400,
  data: {
          message: "Player's username is too long"
        }
}
*/

/*
** Create a game with one player and lock it directly to start playing solo.
*/
export const createSoloGame = async (name) => {
	const response = await axios.get("/game/solo/" + name);
	return {status: response.status, game: response.data};
}
/*
** Return on success example:
{
  status: 200,
  game: {
			_id: '69c2c703-ad74-456a-9856-7ec767b2b0df',
			_player1: 'Alfred',
			_player2: null,
			_player3: null,
			_player4: null,
			_player5: null,
			_player6: null,
			_player1_score: null,
			_player2_score: null,
			_player3_score: null,
			_player4_score: null,
			_player5_score: null,
			_player6_score: null
		}
}
*/

/*
** Search a game. If a game exists, join it.
** Else create a game and wait for others to join.
*/
export const createMultiGame = async (name) => {
  console.log("creating multi: " + name)
	const response = await axios.get("/game/multi/" + name);
	return {status: response.status, game: response.data};
}

export const joinMultiGame = async (id, username) => {
  console.log("searching multi: " + username)
	const response = await axios.post("/game/join/" + id, { "username": username });
	return {status: response.status, game: response.data};
}
/*
** Return on success example:
{
  status: 200,
  game: {
          _id: '69c2c703-ad74-456a-9856-7ec767b2b0df',
          _player1: 'Conrad',
          _player2: 'Philip',
          _player3: null,
          _player4: null,
          _player5: null,
          _player6: null,
          _player1_score: null,
          _player2_score: null,
          _player3_score: null,
          _player4_score: null,
          _player5_score: null,
          _player6_score: null
        }
}
*/

/*
** Lock a joinable game so that no-one can join anymore and the game can be started.
// */
// export const gameStart = async (game) => {
// 	try {
// 		var response = await axios.patch("/game/start", game);
// 		return {status: response.status, data: response.data};
// 	} catch (e) {
// 		return {status: e.response.status, data: e.response.data};
// 	}
// }
/*
** Return on success example:
{
  status: 200,
  data: "Game started between Conrad and Philip and null and null and null and null."
}
** Return on failure example:
{
  status: 400,
  data: "Unable to start this game."
}
*/

/*
** A specific player in a specific game quits that game.
*/
// export const gameQuit = async (game, name) => {
//   if (game === null) return ;
// 	try {
// 		var response = await axios.patch("/game/quit/" + name, game);
// 		return {status: response.status, game: response.data};
// 	} catch (e) {
// 		return {status: e.response.status, game: e.response.data};
// 	}
// }
/*
** Return on success example:
{
  status: 200,
  game: {
          _id: '69c2c703-ad74-456a-9856-7ec767b2b0df',
          _player1: 'Philip',
          _player2: null,
          _player3: null,
          _player4: null,
          _player5: null,
          _player6: null,
          _player1_score: null,
          _player2_score: null,
          _player3_score: null,
          _player4_score: null,
          _player5_score: null,
          _player6_score: null
        }
}
** Return on failure when nobody was able to quit:
{
  status: 400,
  game: {
          _id: '69c2c703-ad74-456a-9856-7ec767b2b0df',
          _player1: 'Conrad',
          _player2: 'Philip',
          _player3: null,
          _player4: null,
          _player5: null,
          _player6: null,
          _player1_score: null,
          _player2_score: null,
          _player3_score: null,
          _player4_score: null,
          _player5_score: null,
          _player6_score: null
        }
}
*/

/*
** Verifies if someone joined a game.
** Returns the same game if no-one joined.
** Returns the game with new player if someone joined.
*/
// export const gameWaitForSomeoneToJoin = async (game) => {
// 	try {
// 		const response = await axios.post("/game/wait/join", game);
// 		return {status: response.status, game: response.data};
// 	} catch (e) {
// 		return {status: e.response.status, game: e.response.data};
// 	}
// }
/*
** Return on failure when no-one joined example:
{
  status: 400,
  game: {
          _id: '69c2c703-ad74-456a-9856-7ec767b2b0df',
          _player1: 'Philip',
          _player2: null,
          _player3: null,
          _player4: null,
          _player5: null,
          _player6: null,
          _player1_score: null,
          _player2_score: null,
          _player3_score: null,
          _player4_score: null,
          _player5_score: null,
          _player6_score: null
        }
}
** Return on success when someone joined example:
{
  status: 200,
  game: {
          _id: '69c2c703-ad74-456a-9856-7ec767b2b0df',
          _player1: 'Philip',
          _player2: 'Conrad',
          _player3: null,
          _player4: null,
          _player5: null,
          _player6: null,
          _player1_score: null,
          _player2_score: null,
          _player3_score: null,
          _player4_score: null,
          _player5_score: null,
          _player6_score: null
        }
}
*/

/*
** Verifies if someone quitted a game.
** Returns the same game if no-one quitted.
** Returns the game with new composition of players if someone quitted.
*/
// export const gameWaitQuit = async (game) => {
// 	try {
// 		var response = await axios.patch("/game/wait/quit", game);
// 		return {status: response.status, game: response.data};
// 	} catch (e) {
// 		return {status: e.response.status, game: e.response.data};
// 	}
// }
/*
** Return on failure when no-one quitted example:
{
  status: 400,
  game: {
          _id: '69c2c703-ad74-456a-9856-7ec767b2b0df',
          _player1: 'Philip',
          _player2: 'Conrad',
          _player3: null,
          _player4: null,
          _player5: null,
          _player6: null,
          _player1_score: null,
          _player2_score: null,
          _player3_score: null,
          _player4_score: null,
          _player5_score: null,
          _player6_score: null
        }
}
** Return on success when someone quitted example:
{
  status: 200,
  game: {
          _id: '69c2c703-ad74-456a-9856-7ec767b2b0df',
          _player1: 'Philip',
          _player2: null,
          _player3: null,
          _player4: null,
          _player5: null,
          _player6: null,
          _player1_score: null,
          _player2_score: null,
          _player3_score: null,
          _player4_score: null,
          _player5_score: null,
          _player6_score: null
        }
}
*/

/*
** Verifies if game has started.
** Host is player1 of game and has the power to start the game.
** Other players need to verify when the game got started by host.
*/
export const gameWaitStart = async (game) => {
	try {
		var response = await axios.post("/game/wait/start", game);
		return {status: response.status, data: response.data};
	} catch (e) {
		return {status: e.response.status, data: e.response.data};
	}
}
/*
** Return on failure when game has not been started yet:
{
  status: 400,
  data: "This game has not been started."
}
** Return on success when game has been started:
{
  status: 200,
  data: "Philip started the game."
}
*/

/*
** Post in database the final game score.
** If unable to add game score, returns same game object with status code 400.
** Else returns game object with new scores.
*/
// export const gameFinalScore = async(gameId, playerId, score) => {

//   try {
//     var response = await axios.post("/game/" + gameId + "/score/", {
//       playerId,
//       score,
//     });
// 		return {status: response.status, game: response.data};
// 	} catch (e) {
//     console.log(e)
// 		return {status: e.response.status, game: e.response.data};
// 	}
// }
/*
** Return on success:
{
  status: 200,
  game: {
          _id: '69c2c703-ad74-456a-9856-7ec767b2b0df',
          _player1: 'Philip',
          _player2: 'Conrad',
          _player3: null,
          _player4: null,
          _player5: null,
          _player6: null,
          _player1_score: 12,
          _player2_score: 73,
          _player3_score: null,
          _player4_score: null,
          _player5_score: null,
          _player6_score: null
        }
}
*/

/*
** After a game finishes the next game is automatically created for same players.
** However the host changes, the host of next game will be winner of prior game.
** The host is found at '_player1' and has the power to start the game when he wants.
*/
export const gameNext = async (game) => {
	try {
		var response = await axios.post("/game/next", game);
		return {status: response.status, data: response.data};
	} catch (e) {
		return {status: e.response.status, data: e.response.data};
	}
}
/*
** Return on success:
{
  status: 200,
  data: {
          _id: '69c2c703-ad74-456a-9856-7ec767b2b0df',
          _player1: 'Conrad',
          _player2: 'Philip',
          _player3: null,
          _player4: null,
          _player5: null,
          _player6: null,
          _player1_score: null,
          _player2_score: null,
          _player3_score: null,
          _player4_score: null,
          _player5_score: null,
          _player6_score: null
        }
}
** Return on failure when trying to get next game of unfinished prior game:
{
  status: 400,
  data: "This game is not finished. Can't go to next game."
}
*/

/*  
** On success example 1:
{
  status: 200,
  games: []
}
** On success example 2:
{
  status: 200,
  games: [
          {
            _id: 'bd122399-f081-4d09-a776-d502c1453240',
            _player1: 'Philip',
            _player2: 'Conrad',
            _player3: null,
            _player4: null,
            _player5: null,
            _player6: null,
            _player1_score: 12,
            _player2_score: 73,
            _player3_score: null,
            _player4_score: null,
            _player5_score: null,
            _player6_score: null
          },
          {
            _id: 'ebb67a1d-d83f-48ad-b47d-f937f9880cf1',
            _player1: 'Conrad',
            _player2: 'Philip',
            _player3: null,
            _player4: null,
            _player5: null,
            _player6: null,
            _player1_score: 42,
            _player2_score: 19,
            _player3_score: null,
            _player4_score: null,
            _player5_score: null,
            _player6_score: null
          }
        ]
}
*/

export const getJoinableGames = async () => {
	var response = await axios.get("/joinablegames/");
	return {status: response.status, games: response.data};
}

export const getUserScores = async (name) => {
  var response = await axios.get("/scores/" + name);
  return {status: response.status, scores: response.data};
}

export const getBestScores = async () => {
  var response = await axios.get("/bestscores/");
  return {status: response.status, scores: response.data};
}