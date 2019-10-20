<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getPlaylistDetail } from "api/recommend";
import MusicList from "components/music-list/music-list";
import { getUserLikelist, getUserPlaylist } from "api/user";
import { loadUserId } from "common/js/cache";
import { MusicListMxin } from "common/js/mixin";
import { async } from "q";
export default {
  name: "LikeList",
    mixins:[MusicListMxin],
  data() {
    return {
      bgImage: "",
      title: ""
    };
  },
  components: {
    MusicList
  },
  methods: {
    _getUserPlaylist() {
      getUserPlaylist(loadUserId()).then(res => {
        const playlist = res.data.playlist;
        this.bgImage = playlist[0].coverImgUrl;
        this.title = playlist[0].name;
        getPlaylistDetail(playlist[0].id).then(res => {
          const tracks = res.data.playlist.tracks;
          this._splitList(tracks)
        });
      });
    },
  },
  created() {
    this._getUserPlaylist();
  }
};
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>