import axios from 'axios'
const BASE_URL = '/api'

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
export const search = (keywords)=> axios.get(`${BASE_URL}/search`,{
  params:{
    keywords
  }
})