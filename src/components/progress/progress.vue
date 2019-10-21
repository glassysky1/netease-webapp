<template>
  <div class="progress">
    <transition name="fade">
      <div
        class="my-progress"
        @touchstart.prevent="touchStart"
        @touchmove.prevent="touchMove"
        @touchend="touchEnd"
        ref="myProgress"
        v-show="showFlag"
      >
        <div class="title">
          <span class="text">my progress</span>
        </div>
        <div class="close" @click.stop="toggleShow">
          <i class="iconfont icon-close"></i>
        </div>
        <div class="content">
          <p
            class="text"
          >轮播图(歌曲、链接)、排行榜、推荐歌单、歌单里的歌曲搜索、歌手、歌手详情、搜索、播放器、登录(简约)
          、登出、喜欢列表、点击红心喜欢音乐(目测有延迟,但是我是本地mutation存储或者删除，一般看不出来)
          
          </p>
          <!-- 只要登录在首页就获取喜欢列表数据了，退出和登录是都会刷新喜欢列表 -->
        </div>
      </div>
    </transition>
    <div
      class="dot"
      ref="dot"
      @touchstart.prevent="touchStart"
      @touchmove.prevent="touchMove"
      @touchend="touchEnd"
      @click="toggleShow"
      v-show="!showFlag"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    toggleShow() {
      this.showFlag = !this.showFlag;
    },
    touchStart(e) {
      //触摸初始化
      this.touch.initiated = true;
      //获取第一根手指
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
      let rect = null;
      if (this.showFlag) {
        rect = this.$refs.myProgress.getBoundingClientRect();
      } else {
        rect = this.$refs.dot.getBoundingClientRect();
      }
      this.touch.X = rect.left;
      this.touch.Y = rect.top;
    },
    touchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      //获得移动的偏移
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      if (this.showFlag) {
        this.$refs.myProgress.style.top = this.touch.Y + deltaY + "px";
        this.$refs.myProgress.style.left = this.touch.X + deltaX + "px";
      } else {
        this.$refs.dot.style.left = this.touch.X + deltaX + "px";

        this.$refs.dot.style.top = this.touch.Y + deltaY + "px";
      }
    },
    touchEnd(e) {
      this.touch.initiated = false;
    }
  },
  created() {
    this.touch = {};
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin'
.progress
  .my-progress
    z-index 999
    position fixed
    width 70%
    left 15%
    top 30%
    height 40%
    background-color #F0F0F0
    border-radius 20px
    overflow hidden
    &.fade-enter-active
      animation my-fadein 0.3s
      .content
        animation my-zoom 0.3s
    .title
      background-color #D63E34
      width 100%
      text-align center
      color #fff
      .text
        font-size 14px
        font-weight bold
        line-height 25px
    .close
      position absolute
      right 0
      top 0
      color #ffffff
      padding 5px
    .content
      position absolute
      top 30px
      left 10px
      right 10px
      bottom 10px
      background-color #fff
      overflow auto
      border-radius 20px
      .text
        padding 0 20px
        font-size 12px
        line-height 30px
  .dot
    width 20px
    height 20px
    z-index 999
    position absolute
    border-radius 50%
    border 2px solid #D63E34
    background-color #ffffff
    right 5%
    bottom 200px
@keyframes my-fadein
  0%
    opacity 0
  100%
    opacity 1
@keyframes my-zoom
  0%
    transform scale(0)
  50%
    transform scale(1.1)
  100%
    transform scale(1)
</style>