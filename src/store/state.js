import { playMode } from "common/js/config";
import { loadSearch } from "common/js/cache";
export default{
  singer:{},
  playing:false,
  fullScreen:false,
  playlist:[],
  sequenceList:[],///用于随机播放时候
  mode:playMode.sequence,//默认顺序列表
  currentIndex:-1,//当前播放索引
  disc:{},
  searchHistory: loadSearch()
}