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

  async getThenSetLoginStatus({ commit }, uid) {
    try {
     const {data:user} =  await getLoginStatus()
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
      const {data:res} = await getLogout()
      console.log(res);
      
      commit(types.SET_lOGIN_STATUS, false)
      commit(types.SET_USER_INFO, {})
    } catch (e) {
      commit(types.SET_lOGIN_STATUS, true)

    }
  },
}