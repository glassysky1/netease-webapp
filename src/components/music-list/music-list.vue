<template>
  <div class="music-list">
    <div class="back" @click="$router.back()">
      <span class="iconfont icon-zuo"></span>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
          <span class="iconfont icon-bofang"></span>
          <span class="text">随机播放全部</span>
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
const RESERVED_HEIGHT = 40;
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
      let translateY = Math.max(this.minTranslateY, newY);
      let zIndex = 0;
      let scale = 1;
      let blur = 0;
      this.$refs.layer.style["transform"] = `translate3d(0,${translateY}px,0)`;

      //下拉的时候
      const percent = Math.abs(newY / this.imageHeight);
      //newY>0,就是下拉的时候，把image的层级提高
      if (newY > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20 * percent, 20);
      }
      this.$refs.filter.style["backdrop-filter"] = `blur(${blur})px`;

      if (newY < this.minTranslateY) {
        //如果bglayer滚到顶部
        zIndex = 10;
        //就把背景图片的paddingTop为0，高度为40px
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        this.$refs.playBtn.style.display = "none";
      } else {
        //如果没滚上去，或者下来了
        zIndex = 0;
        this.$refs.playBtn.style.display = "";

        this.$refs.bgImage.style.paddingTop = "70%";
        this.$refs.bgImage.style.height = 0;
      }
      //然后层级提高，只能看到背景图的一丢丢
      this.$refs.bgImage.style.zIndex = zIndex;

      this.$refs.bgImage.style["transform"] = `scale(${scale})`;
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
  background #fff
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
    padding-top 70%
    transform-origin top
    background-size cover
    .play-wrapper
      position absolute
      bottom 20px
      z-index 50
      width 100%
      .play
        box-sizing border-box
        width 135px
        padding 7px 0
        margin 0 auto
        text-align center
        border 1px solid #DB3E35
        color #DB3E35
        border-radius 100px
        font-size 0
        .iconfont
          display inline-block
          vertical-align middle
          margin-right 6px
          font-size 16px
        .text
          display inline-block
          vertical-align middle
          font-size 12px
    .filter
      position absolute
      top 0
      left 0
      bottom 0
      right 0
      background-color rgba(7, 17, 27, 0.4)
  .bg-layer
    position relative
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