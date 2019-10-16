import axios from 'axios'
const BASE_URL = '/api'

export const getSinger = (cat,limit) => axios.get(`${BASE_URL}/artist/list`,{
  params:{
    cat,
    limit,
  }
})

export const getSingerDetail = (id) => axios.get(`${BASE_URL}/artists`,{
  params:{
    id
  }
})