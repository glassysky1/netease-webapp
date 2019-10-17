const BASE_URL = '/api'
import { getLyric } from "api/song";
import { reject } from "q";
export default class Song {
  constructor({ id, name, singer, image, album, duration }) {
    this.id = id
    this.name = name
    this.singer = singer
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

export const createSong = ({ id, name, singer, image, album, duration }) => {
  return new Song({
    id,
    name,
    singer: filterSinge(singer),
    image,
    album,
    duration
  })
}

function filterSinge(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}