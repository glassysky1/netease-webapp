import axios from 'axios'
const BASE_URL = '/api'

//获取歌曲url
export const getSongUrl =(id,br) => axios.get(`${BASE_URL}/song/url`,{
  params:{
    id,
    br
  }
})
//获取歌曲详情
export const getSongDetail = (ids) =>axios.get(`${BASE_URL}/song/detail`,{
  params:{
    ids
  }
})

//获取歌词
export const getLyric = (id) =>axios.get(`${BASE_URL}/lyric`,{
  params:{
    id
  }
})