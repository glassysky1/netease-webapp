const BASE_URL = '/api'
import { getLyric } from "api/song";
import { getSingerDetail } from "api/singer";
import { reject } from "q";
export default class Song {
  constructor({ id, name, singers, image, album, duration }) {
    this.id = id
    this.name = name
    this.singers = singers
    this.image = image
    this.album = album
    this.duration = duration
  }
  //封装歌词
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.id).then((res) => {
        //请求成功，并且res.data.lrc.lyric有数据
        if (res.data.code === 200) {
          if (res.data.hasOwnProperty('lrc')){
            this.lyric = res.data.lrc.lyric
            resolve(this.lyric)

          }else{
            reject('no lyric')
          }
            

        } else {
          reject('no lyric')
        }
      })
    })
  }
}

export const createSong = ({ id, name, singers, image, album, duration }) => {
  return new Song({
    id,
    name,
    singers: filterSinger(singers),
    image,
    album,
    duration
  })
}

function filterSinger(singers) {
  let singersInfo={
    names:'',
    info:[]
  }
  let nameArr=[]
  if (!singers) {
    return ''
  }
  singers.forEach(s => {
    nameArr.push(s.name)
    getSingerDetail(s.id).then((res)=>{
      singersInfo.info.push({
        id:s.id,
        name:s.name,
        image:res.data.artist.img1v1Url
      })
    })
  })
  singersInfo.names = nameArr.join('/')
  
  return singersInfo
}