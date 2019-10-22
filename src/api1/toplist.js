import axios from 'axios'
const BASE_URL = '/api'
// const BASE_URL = 'http://39.106.77.11:3000'

//获取榜单列表 
export const getToplistDetail = () =>axios.get(`${BASE_URL}/toplist/detail`)