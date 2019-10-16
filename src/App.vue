<template>
  <div id="app">
    <m-header></m-header>
    <keep-alive>
      <router-view />
    </keep-alive>
    <player></player>
  </div>
</template>
<script>
import Player from "components/player/player";
import MHeader from "components/m-header/m-header";
import { mapGetters } from "vuex";
export default {
  components: {
    MHeader,
    Player
  }
};
</script>
<style lang="stylus"></style>
