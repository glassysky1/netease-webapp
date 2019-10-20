import { mapGetters } from "vuex";
import { createSong } from "common/js/song";
import { getSongUrl } from "api/song";
const br = 320000;
//高度自适应
export const playlistMixin = {
  computed: {
    ...mapGetters(['playlist'])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

//抽取请求音乐列表数据
export const MusicListMxin ={
  data() {
    return {
      songs: []
    };
  },
  methods:{
    _splitList(tracks) {
      const arr = [];
      let minArr = [];
      tracks.forEach(item => {
        if (minArr.length === 50) {
          minArr = [];
        }
        if (minArr.length === 0) {
          arr.push(minArr);
        }
        minArr.push(item);
      });

      arr.forEach(list => {
        this.songs = this.songs.concat(this._normalizeSongs(list));
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      // id, name,singer,image,url
      let urlList = [];
      list.forEach(item => {
        // item.id ,item.name,item.ar
        //getSongDetail ,image
        //getSongUrl,url
        urlList.push(item.id);
        ret.push(
          createSong({
            id: item.id,
            name: item.name,
            singer: item.ar,
            album: item.al.name,
            image: item.al.picUrl,
            duration: item.dt
          })
        );
      });
      getSongUrl(urlList.toString(), br).then(res => {
        const data = res.data.data;
        data.forEach(item => {
          ret.forEach(item1 => {
            if (item.id === item1.id) {
              item1.url = item.url;
            }
          });
        });
        //地址真的难弄
      });
      return ret;
    }
  }
}