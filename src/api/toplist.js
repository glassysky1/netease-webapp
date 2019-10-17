import axios from 'axios'
const BASE_URL = '/api'

//获取榜单列表 
export const getToplistDetail = () =>axios.get(`${BASE_URL}/toplist/detail`)