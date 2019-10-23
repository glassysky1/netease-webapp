<template>
  <div id="app">
    <m-header @menu="menu"></m-header>
    <!-- <cover></cover> -->
    <keep-alive :exclude="['Search','LikeList']">
      <router-view />
    </keep-alive>
    <player></player>
    <Progress></Progress>
    <m-menu @change="change" ref="mMenu"></m-menu>
    
  </div>
</template>
<script>
import Progress from "components/progress/progress";
import MMenu from "components/m-menu/m-menu";
import Player from "components/player/player";
import MHeader from "components/m-header/m-header";
import { getUserPlaylist, getLoginStatus } from "api/user";
// import Cover from "components/cover/cover";
import { mapGetters, mapMutations } from "vuex";
import { MusicListMxin } from "common/js/mixin";
import { loadUserId } from "common/js/cache";
import { getPlaylistDetail } from "api/recommend";

export default {
  mixins: [MusicListMxin],
  components: {
    MHeader,
    Player,
    MMenu,
    Progress,

    // Cover
  },
  computed: {
    ...mapGetters(["loginStatus"])
  },
  watch: {
    loginStatus(flag) {
      if (flag) {
        //如果登录成功则从新获取喜欢列表
        this._getUserPlaylist();
      }
    }
  },
  methods: {
    menu() {
      this.$refs.mMenu.show();
    },
    //退出登录改变状态,喜欢列表为空
    change() {
      this.$store.dispatch("getThenSetLoginStatus", loadUserId());
      if (!loadUserId.length) {
        this.setLikeList(null);
      }
    },
    //刚开始就获取用户的喜欢列表，把songs存起来
    _getUserPlaylist() {
      getUserPlaylist(loadUserId()).then(res => {
        const playlist = res.data.playlist;
        const bgImage = playlist[0].coverImgUrl;
        const title = playlist[0].name;
        getPlaylistDetail(playlist[0].id).then(res => {
          const tracks = res.data.playlist.tracks;
          this._splitList(tracks);
          this.setLikeListDetail({ bgImage, title });
          this.setLikeList(this.songs);
          console.log(this.songs[0].name);
        });
      });
    },
    ...mapMutations({
      setLikeList: "SET_LIKE_LIST",
      setLikeListDetail: "SET_LIKE_LIST_DETAIL"
    })
  },
  created() {
    getLoginStatus().then(res => {});
    this.$store.dispatch("getThenSetLoginStatus", loadUserId());
    this._getUserPlaylist();
  }
};
</script>
<style lang="stylus"></style>
