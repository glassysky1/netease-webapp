export default{
  singer(state){
    return state.singer
  },
  playing(state){
    return state.playing
  },
  fullScreen(state){
    return state.fullScreen
  },
  playlist(state){
    return state.playlist
  },
  sequenceList(state){
    return state.sequenceList
  },
  mode(state){
    return state.mode
  },
  currentIndex(state){
    return state.currentIndex
  },
  currentSong(state){
    return state.playlist[state.currentIndex] || {}
  },
  disc(state){
    return state.disc
  },
  searchHistory(state){
    return state.searchHistory
  },
  loginStatus(state){
    return state.loginStatus
  },
  userInfo(state){
    return state.userInfo
  },
  recommendIsFresh(state){
    return state.recommendIsFresh
  },
  likeList(state){
    return state.likeList
  },
  likeListDetail(state){
    return state.likeListDetail
  },
  songOptions(state){
    return state.songOptions
  },
  songListShowFlag(state){
    return state.songListShowFlag
  },
  songOptionsIndex(state){
    return state.songOptionsIndex
  }
}