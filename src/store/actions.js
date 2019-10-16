import * as types from "./mutation-types";
import { playMode } from "common/js/config";
import { shuffle } from "common/js/util";

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
      commit(types.SET_PLAYLIST,list)
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
  }
}