<template>
  <transition name="slide">
    <music-list :title="likeListDetail.title" :bgImage="likeListDetail.bgImage" :songs="likeList"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getPlaylistDetail } from "api/recommend";
import MusicList from "components/music-list/music-list";
import { getUserLikelist, getUserPlaylist } from "api/user";
import { loadUserId } from "common/js/cache";
import { async } from "q";
export default {
  name: "LikeList",
  components: {
    MusicList
  },
  computed: {
    //获取喜欢列表
    ...mapGetters(["likeList", "likeListDetail"])
  },
  // beforeRouteLeave(to, from, next) {
  //   // 导航离开该组件的对应路由时调用
  //   // 可以访问组件实例 `this`
  //   this.likeList=null
  //   this.likeListDetail = null
  //   next();
  // }
};
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>