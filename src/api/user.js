import axios from 'axios'
// const BASE_URL = '/api'
const BASE_URL = 'http://39.106.77.11:3000'

export const login = (phone, password) => axios.get(`${BASE_URL}/login/cellphone`, {
  params: {
    phone,
    password,
    random: Math.random()
  },
  withCredentials: true
})

//得到登录状态
export const getLoginStatus = () => axios.get(`${BASE_URL}/login/status`, {
  withCredentials: true,
  params: {
    random: Math.random()
  }
})

//加random的 作用使得get请求不走缓存
///likelist?uid=32953014
export const getUserLikelist = uid => axios.get(`${BASE_URL}/likelist`, {
  params: {
    uid,
    random: Math.random()
  },
  withCredentials: true
})

//退出登录
export const getLogout = () => axios(`${BASE_URL}/logout`, {
  withCredentials: true,
  params: {
    random: Math.random()
  }
});

//获取用户信息
export const getUesrInfo = (uid) => axios.get(`${BASE_URL}/user/detail`, {
  params: {
    uid,
    random: Math.random()
  },
  withCredentials: true
})

//用户喜欢列表是他妈无序的
//换用户歌单
export const getUserPlaylist = (uid) =>axios.get(`${BASE_URL}/user/playlist`,{
  params: {
    uid,
    random: Math.random()
  },
  withCredentials: true
})

//喜欢音乐
//like是布尔值
export const toggleStarTheSong = (id, like) => axios.get(`${BASE_URL}/like`, {
  params: {
    id,
    like,
  },
  withCredentials: true
})
