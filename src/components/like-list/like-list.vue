<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
const br = 320000;
import { mapGetters } from "vuex";
import { getPlaylistDetail } from "api/recommend";
import MusicList from "components/music-list/music-list";
import { createSong } from "common/js/song";
import { getSongUrl, getSongDetail } from "api/song";
import { getUserLikelist } from "api/user";
import { loadUserId } from "common/js/cache";
export default {
  data() {
    return {
      songs: [],
      bgImage:''
    };
  },
  components: {
    MusicList
  },
  computed: {
    
    title() {
      return `${this.userInfo.nickname}的音乐` ;
    },
   ...mapGetters(['userInfo'])
  },
  methods: {
    async _getUserLikelist() {
      getUserLikelist(loadUserId()).then(res => {
        getSongDetail(res.data.ids.toString()).then(res => {
          this._normalizeSongs(res.data.songs);
          this.bgImage= res.data.songs[0].al.picUrl
        });
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      // id, name,singer,image,url
      let urlList = [];
      list.forEach((item) => {
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
        this.songs = ret;
      });
    }
  },
  created() {
    this._getUserLikelist();
  }
};
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>