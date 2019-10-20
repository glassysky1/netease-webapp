<template>
  <div id="app">
    <m-header @menu="menu"></m-header>
    <!-- <cover></cover> -->
    <keep-alive :exclude="['Search','LikeList']">
      <router-view />
    </keep-alive>
    <player></player>
    <m-menu @change="change" ref="mMenu"></m-menu>
  </div>
</template>
<script>
import MMenu from "components/m-menu/m-menu";
import Player from "components/player/player";
import MHeader from "components/m-header/m-header";
import { getUserLikelist } from "api/user";
// import Cover from "components/cover/cover";
import { mapGetters } from "vuex";
import { loadUserId } from "common/js/cache";

export default {
  data() {
    return {};
  },
  components: {
    MHeader,
    Player,
    MMenu
    // Cover
  },
  methods: {
    menu() {
      this.$refs.mMenu.show();
    },
    change() {
      this.$store.dispatch("getThenSetLoginStatus", loadUserId());
    }
  },
  mounted() {
    this.$store.dispatch("getThenSetLoginStatus", loadUserId());
  }
};
</script>
<style lang="stylus"></style>
