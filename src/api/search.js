import axios from 'axios'
const BASE_URL = '/api'
// const BASE_URL = 'http://39.106.77.11:3000'

//搜索建议
export const getSearchSuggestions = keywords => axios.get(`${BASE_URL}/search/suggest`,{
  params:{
    keywords,
    type:'mobile'
  }
})

//热词
export const getSearchHotDetail = () => axios.get(`${BASE_URL}/search/hot/detail`)

//搜索
export const search = (keywords,offset)=> axios.get(`${BASE_URL}/search`,{
  params:{
    keywords,
    offset
  }
})