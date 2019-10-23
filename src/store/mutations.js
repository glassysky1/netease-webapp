import * as types from "./mutation-types";

export default {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC](state,disc){
    state.disc =disc
  },
  [types.SET_SEARCH_HISTORY](state,history){
    state.searchHistory = history
  },
  [types.SET_USER_INFO](state, userInfo) {
    state.userInfo = userInfo
  },
  [types.SET_lOGIN_STATUS](state, loginStatus) {
    state.loginStatus = loginStatus
  },
  [types.SET_LIKE_LIST](state,likeList){
    state.likeList = likeList
  },
  [types.SET_LIKE_LIST_DETAIL](state,likeListDetail){
    state.likeListDetail = likeListDetail
  },
  [types.SET_SONG_OPTIONS](state,song){
    state.songOptions = song
  },
  [types.SET_SONG_LIST_SHOW](state,flag){
    state.songListShowFlag = flag
  },
  [types.SET_SONG_OPTIONS_INDEX](state,index){
    state.songOptionsIndex = index
  }
}