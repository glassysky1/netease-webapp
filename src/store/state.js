import { playMode } from "common/js/config";
import { loadSearch } from "common/js/cache";
export default{
  singer:{},
  playing:false,
  fullScreen:false,
  playlist:[],
  sequenceList:[],///用于随机播放时候
  likeList:[],
  mode:playMode.sequence,//默认顺序列表
  currentIndex:-1,//当前播放索引
  disc:{},
  searchHistory: loadSearch(),
  userInfo:{},
  loginStatus:false,
  likeListDetail:{},
  songOptions:{},//点击三点里面歌的参数
  songListShowFlag:false,//三点里面是否显示
  songOptionsIndex:-1//点击歌曲的索引
}