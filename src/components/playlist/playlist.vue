<template>
  <transition name="slide">
    <div class="playlist" v-show="showFlag">
      <div class="bg-layer" @click="hide"></div>
      <div class="playlist-wrapper">
        <div class="title">
          <div class="text"><span class="iconfont icon-shunxubofang"></span><span class="playMode">随机播放</span></div>
          <div class="clear">
            <i class="iconfont icon-lajitong"></i>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin'
.playlist
  position fixed
  z-index 151
  &.slide-enter-active,&.slide-leave-active
    transition .3s
    .bg-layer,.playlist-wrapper
      transition .3s
  &.slide-leave-to,&.slide-enter
    .bg-layer
      opacity 0
    .playlist-wrapper
      transform translate3d(0,100%,0)
  .bg-layer
    position fixed
    background-color rgba(0, 0, 0, 0.5)
    top 0
    left 0
    z-index 152
    width 100%
    bottom 0
  .playlist-wrapper
    position fixed
    left 0
    bottom 0
    z-index 153
    top 40%
    width 100%
    background-color #fff
    border-radius 5% 5% 0 0
    .title
      position relative
      font-size 14px
      padding 0 10px
      .text
        line-height 50px
        .iconfont
          margin-right 3px
          color #A5A5A5
      .clear
        position absolute
        right 5px
        top 10px
        padding 5px
</style>