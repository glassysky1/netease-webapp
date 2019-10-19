<template>
  <div class="music-list">
    <div class="back" @click="$router.back()">
      <span class="iconfont icon-zuo"></span>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
    <div class="play-wrapper" ref="playWrapper" @click="random">
      <div class="play">
         <span class="iconfont icon-bofang"></span>
          <span class="text">Random play all</span>
      </div>
    </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      @scroll="scroll"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-wrapper" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
const RESERVED_HEIGHT = 100;
import { mapActions } from "vuex";
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import Loading from "base/loading/loading";
import { playlistMixin } from "common/js/mixin";
export default {
  mixins:[playlistMixin],
  data() {
    return {
      scrollY: 0
    };
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  },
  props: {
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    },
    bgImage: {
      type: String,
      default: ""
    }
  },
  watch: {
    scrollY(newY) {
      // this.minTranslateY = -(背景高度-80)
      let translateY = Math.max(this.minTranslateY, newY);
      let zIndex = 0;
      this.$refs.layer.style["transform"] = `translate3d(0,${translateY}px,0)`;


    if(newY <0){
      this.$refs.bgImage.style['transform'] = `translate3d(0,${translateY}px,0` 
        if(translateY === this.minTranslateY){
        this.$refs.bgImage.style.zIndex=1
      }
    }
    }
  },
  methods: {
    handlePlaylist(playlist){
      const bottom = playlist.length > 0 ? '60px' :''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(item, index) {
      /*   console.log(1);
      console.log(); */

      this.selectPlay({
        list: this.songs,
        index
      });
    },
    random() {
      this.randomPlay({
        list: this.songs
      });
    },
    ...mapActions(["selectPlay", "randomPlay"])
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    //最高

    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin.styl'
.music-list
  position fixed
  top 0
  bottom 0
  right 0
  left 0
  z-index 100
  background-color #ffffff
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .iconfont
      display block
      padding 10px
      font-size 20px
      color #ffffff
  .title
    position absolute
    top 0
    left 10%
    z-index 40
    width 80%
    no-wrap()
    text-align center
    line-height 40px
    font-size 18px
    color #ffffff
  .bg-image
    position relative
    width 100%
    height 0
    padding-top 80%
    transform-origin top
    background-size cover
    .play-wrapper
      height 60px
      background-color #fff
      position absolute
      left 0
      width 100%
      bottom 0
      box-sizing border-box
      border-bottom 1px solid #eeeeee
      padding 20px
      z-index 2
      border-radius 13px 13px 0 0
      .play
        .iconfont
          font-size 20px
          margin-left -3px
          margin-right 8px
    .filter
      position absolute
      top 0
      left 0
      bottom 0
      right 0
      background-color rgba(7, 17, 27, 0.1)
  .bg-layer
    position relative
    border-radius 13px
    background-color #fff
    height 100%
  .list
    position fixed
    left 0
    bottom 0
    right 0
    .loading-wrapper
      position fixed
      width 100%
      top 50%
      left 50%
      transform translate3d(-50%, -50%, 0)
</style>