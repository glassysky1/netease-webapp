import axios from 'axios'
const BASE_URL = '/api'
export const loadBanner =() => axios.get(`${BASE_URL}/banner`)

export const loadRecommendList = () => axios.get(`${BASE_URL}/personalized`)

//获取歌单详情
export const getPlaylistDetail = (id) => axios.get(`${BASE_URL}/playlist/detail`,{
  params:{
    id
  }
})