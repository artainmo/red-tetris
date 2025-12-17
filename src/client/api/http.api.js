import { API_ENDPOINT } from './api_endpoint'
import axios from 'axios'

axios.defaults.baseURL = API_ENDPOINT + '/rest'

export const connect = async (name) => {
	try {
		const response = await axios.get(`/connect/${encodeURIComponent(name)}`)
		return {
			status: response.status,
			data: response.data,
		}
	} catch (err) {
		return err
	}
}

export const getJoinableGames = async () => {
	const response = await axios.get('/joinablegames/')
	return { status: response.status, games: response.data }
}

export const getUserScores = async (name) => {
	const response = await axios.get('/scores/' + name)
	return { status: response.status, scores: response.data }
}

export const getBestScores = async () => {
	const response = await axios.get('/bestscores/')
	return { status: response.status, scores: response.data }
}
