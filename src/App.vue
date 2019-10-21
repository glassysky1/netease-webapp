<template>
  <div id="app">
    <m-header @menu="menu"></m-header>
    <m-menu @change="change" ref="mMenu"></m-menu>
    <!-- <cover></cover> -->
    <keep-alive :exclude="['Search','LikeList']">
      <router-view />
    </keep-alive>
    <player></player>
    <Progress></Progress>
  </div>
</template>
<script>
import Progress from "components/progress/progress";
import MMenu from "components/m-menu/m-menu";
import Player from "components/player/player";
import MHeader from "components/m-header/m-header";
import { getUserLikelist ,getLoginStatus} from "api/user";
// import Cover from "components/cover/cover";
import { mapGetters } from "vuex";
import { loadUserId } from "common/js/cache";

export default {
  data() {
    return {
      currentPath:'/recommend'
    };
  },
  
  components: {
    MHeader,
    Player,
    MMenu,
    Progress
    // Cover
  },
  methods: {
    menu() {
      this.$refs.mMenu.show();
    },
    //刷新登录状态
    change() {
      this.$store.dispatch("getThenSetLoginStatus", loadUserId());
    }
  },
  mounted() {
    getLoginStatus().then(res=>{
    })
    this.$store.dispatch("getThenSetLoginStatus", loadUserId());
  }
};
</script>
<style lang="stylus"></style>
