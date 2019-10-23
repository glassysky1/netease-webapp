import * as types from "./mutation-types";
import { playMode } from "common/js/config";
import { shuffle } from "common/js/util";
import { saveSearch, deleteSearch, clearSearch, saveUserId, clearUserId, loadUserId, } from "common/js/cache";
import { getLoginStatus, getUesrInfo } from "api/user";
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
export default {
  //选择播播放
  selectPlay({ commit, state }, { list, index }) {
    //顺序播放来一手
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
      //如果是随机播放，则重新洗牌
      let randomList = shuffle(list)
      //提交随机列表到播放列表
      commit(types.SET_PLAYLIST, randomList)
      //找到点击的索引
      index = findIndex(randomList, list[index])
    } else {
      commit(types.SET_PLAYLIST, list)
    }
    //提交当前要播放的索引
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
  },

  //随机播放
  randomPlay({ commit, state }, { list }) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
  },

  saveSearchHistory({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
  },
  deleteSearchHistory({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
  },
  clearSearchHistory({ commit }) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
  },

  deleteSong({ commit, state }, song) {
    //深拷贝
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let pIndex = findIndex(playlist, song)
    //从当前播放列表中查找索引，然后删除
    playlist.splice(pIndex, 1)

    //获取这首歌在顺序列表中的索引,删除
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)
    //如果你删除的歌索引大于播放列表中的索引，或者是等于播放列表的长度，则剪剪
    if (currentIndex > pIndex || currentIndex === playlist.length) {
      currentIndex--
    }
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)

    if (!playlist.length) {
      //如果你把播放列表删除完了
      commit(types.SET_PLAYING_STATE, false)
    }

  },
  deleteSongList({commit}){
    commit(types.SET_PLAYLIST,[])
    commit(types.SET_SEQUENCE_LIST,[])
    commit(types.SET_CURRENT_INDEX,-1)
    commit(types.SET_PLAYING_STATE,false)
  },
  async getThenSetLoginStatus({ commit }, uid) {
    try {
      const { data: user } = await getLoginStatus()
      console.log(user);
      console.log(uid);

      //写入本地存储
      if (!loadUserId().length) {
        saveUserId(uid)
      }

      const { data: res } = await getUesrInfo(uid)

      const { nickname, backgroundUrl, avatarUrl, gender, follows, followeds, signature, vipType } = res.profile
      commit(types.SET_USER_INFO, { nickname, backgroundUrl, avatarUrl, gender, follows, followeds, vipType, signature })
      commit(types.SET_lOGIN_STATUS, true)
    } catch (e) {
      commit(types.SET_lOGIN_STATUS, false)
    }
  },
  //退出登录设置登录状态
  async getLogoutThenSetLoginStatus({ commit }, uid) {
    try {
      clearUserId(uid)
      const { data: res } = await getLogout()
      console.log(res);

      commit(types.SET_lOGIN_STATUS, false)
      commit(types.SET_USER_INFO, {})
    } catch (e) {
      commit(types.SET_lOGIN_STATUS, true)

    }
  },
  selectOptions({commit},{song,index}){
    //有歌的时候才能提交歌曲选项
    commit(types.SET_SONG_OPTIONS,song)
    commit(types.SET_SONG_LIST_SHOW,true)
    console.log(index);
    
    commit(types.SET_SONG_OPTIONS_INDEX,index)
  }
}