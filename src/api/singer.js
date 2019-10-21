import axios from 'axios'
const BASE_URL = '/api'
// const BASE_URL = 'http://39.106.77.11:3000'

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