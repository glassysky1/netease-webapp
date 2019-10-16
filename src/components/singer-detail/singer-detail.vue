<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
const br = 320000
import MusicList from "components/music-list/music-list";
import { getSingerDetail } from "api/singer";
import { getSongUrl } from "api/song";
import { mapGetters } from "vuex";
import { createSong } from "common/js/song";
import { async } from "q";

export default {
  data() {
    return {
      songs: []
    };
  },
  components: {
    MusicList
  },
  computed: {
    bgImage() {
      return this.singer.img1v1Url;
    },
    title() {
      return this.singer.name;
    },
    ...mapGetters(["singer"])
  },
  methods: {
    async _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
     const { data: res } = await getSingerDetail(this.singer.id);
     this._normalizeSongs(res.hotSongs);
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
            duration:item.dt
          })
        );
      });
      getSongUrl(urlList.toString(),br).then(res => {
        const data = res.data.data
       data.forEach((item)=>{
         ret.forEach(item1=>{
           if(item.id ===item1.id){
             item1.url = item.url
           }
         })
       })
       //地址真的难弄
        this.songs = ret
      });
    },
  },
  created() {
    this._getDetail();
  },
  mounted() {
  }
};
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>