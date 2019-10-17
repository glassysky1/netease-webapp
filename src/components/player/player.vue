<template>
  <div class="player" v-show="playlist.length>0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景 -->
        <div class="background">
          <img v-lazy="currentSong.image" width="100%" height="100%" alt />
        </div>

        <!-- 顶部 -->
        <div class="top">
          <div class="back" @click="back">
            <span class="iconfont icon-zuo"></span>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h1 class="subtitle" v-html="currentSong.singer"></h1>
        </div>

        <!-- 中间 -->
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <!-- 左边 -->
          <div class="middle-l" ref="middleL">
            <!-- cd -->
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="adCls">
                <img class="image" v-lazy="currentSong.image" alt />
              </div>
            </div>

            <!-- 歌词 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!-- 放的是数组 -->
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  :class="{'current': currentLineNum ===index}"
                  class="text"
                  v-for="(line,index) in currentLyric.lines"
                  :key="index"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>

        <!-- 底部 -->
        <div class="bottom">
          <!-- 两个小点 -->
          <div class="dot-wrapper">
            <div class="dot" :class="{'active':currentShow==='cd'}"></div>
            <div class="dot" :class="{'active':currentShow==='lyric'}"></div>
          </div>

          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar @percentChange="onProgrressBarChange" :percent="percent"></progress-bar>
            </div>
            <span class="time time-r">{{formatTotalTime(currentSong.duration)}}</span>
          </div>

          <!-- 控件 -->
          <div class="operators">
            <div class="icon i-left" :class="disableCls" @click="changeMode">
              <i class="iconfont" :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls" @click="pre">
              <i class="iconfont icon-yduishangyiqu"></i>
            </div>
            <div class="icon i-center" @click="togglePlaying" :class="disableCls">
              <i class="iconfont" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls" @click="next">
              <i class="iconfont icon-yduixiayiqu"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="iconfont icon-like"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 小屏 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <!-- 左边 -->
        <div class="icon">
          <img :class="adCls" :src="currentSong.image" width="40" height="40" alt />
        </div>

        <!-- 中间 -->
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <h2 v-if="playing && playingLyric" class="desc" v-html="playingLyric"></h2>
          <h2 v-else class="desc" v-html="currentSong.singer"></h2>
        </div>

        <!-- 右边 -->
        <div class="control" @click.stop="togglePlaying">
          <i class="iconfont" :class="playIcon"></i>
        </div>
        <div class="control">
          <i class="iconfont icon-bofangliebiao"></i>
        </div>
      </div>
    </transition>
    <!-- 可以播放就调用ready，请求不到则调用error -->
    <audio
      @timeupdate="updateTime"
      @ended="end"
      ref="audio"
      :src="currentSong.url"
      @play="ready"
      @error="error"
    ></audio>
  </div>
</template>

<script>
import animations from "create-keyframe-animation";
import { mapGetters, mapMutations } from "vuex";
import { prefixStyle } from "common/js/dom";
import ProgressBar from "base/progress-bar/progress-bar";
import { playMode } from "common/js/config";
import { shuffle } from "common/js/util";
import Lyric from "lyric-parser";
import Scroll from "base/scroll/scroll";
const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");
export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      //歌词当前行
      currentLineNum: 0,
      currentShow: "cd",
      playingLyric: ""
    };
  },
  components: {
    ProgressBar,
    Scroll
  },
  computed: {
    playIcon() {
      return this.playing ? "icon-zanting" : "icon-bofang";
    },
    adCls() {
      return this.playing ? "play" : "play pause";
    },
    disableCls() {
      return this.songReady ? "" : "disable";
    },
    percent() {
      return this.currentTime / Math.floor(this.currentSong.duration / 1000);
    },
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-shunxubofang"
        : this.mode === playMode.loop
        ? "icon-xunhuanbofang"
        : "icon-bofangye-caozuolan-suijibofang";
    },
    ...mapGetters([
      "playlist",
      "fullScreen",
      "currentSong",
      "sequenceList",
      "mode",
      "playing",
      "currentIndex"
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        return;
      }
      if (newSong.id === oldSong.id) {
        return;
      }
      //先停止
      if (this.currentLyric) {
        this.currentLyric.stop();
        this.currentTime = 0;
        this.playingLyric = "";
        this.currentLineNum = 0;
      }
      // 清除定时器
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$refs.audio.play();
        this.getLyric();
      }, 1000);
    },
    playing(newPlaying) {
      // 监听playing,让歌曲是否播放
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    }
  },
  methods: {
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        //刚开始在唱片左下角
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        //现在在当中
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        //回弹正常状态
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      //动画注册
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      //运行动画
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      //取消注册
      animations.unregisterAnimation("move");
      //清空动画
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      //给唱片过渡时间
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      //获取位置和缩放
      const { x, y, scale } = this._getPosAndScale();
      //离开时候，回到小图像的距离
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      //监听动画是否完成
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      //把唱过渡为空，动画为空
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    //得到小图像到唱片的位置和缩放
    _getPosAndScale() {
      //就是小图像的宽度
      const targetWidth = 40;
      //小图像中心坐标离左边40px
      const paddingLeft = 40;
      //离底部30px
      const paddingBottom = 30;
      //唱片容器到顶部是80px
      const paddingTop = 80;

      //窗口的宽度，也就是cd的宽度
      const width = window.innerWidth * 0.8;

      //初始缩放比例,用小图像/cd唱片
      const scale = targetWidth / width;

      //初始的x,就是小图像的中心，到唱片的中心的x方向位移
      //目标点到起始点，所以负的
      const x = -(window.innerWidth / 2 - paddingLeft);
      //窗口的高度-唱片到顶部的高度-唱片的高度-小图像的底部
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;

      return {
        x,
        y,
        scale
      };
    },
    ready() {
      //如果歌曲加载成功，可以播放
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    end() {
      //如果是循环模式，则循环
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        //否则下一首
        this.next();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyric) {
        //从头开始
        this.currentLyric.seek(0);
      }
    },
    format(time) {
      const mm = `${Math.floor(time / 60)}`.padStart(2, "0");
      const ss = `${Math.floor(time % 60)}`.padStart(2, "0");
      return `${mm}:${ss}`;
    },
    formatTotalTime(time) {
      time = Math.floor(time / 1000);
      const mm = `${Math.floor(time / 60)}`.padStart(2, "0");
      const ss = `${Math.floor(time % 60)}`.padStart(2, "0");
      return `${mm}:${ss}`;
    },
    onProgrressBarChange(percent) {
      const currentTime =
        Math.floor(this.currentSong.duration / 1000) * percent;
      this.$refs.audio.currentTime = currentTime;
      //如果布播放。则播放
      if (!this.playing) {
        this.togglePlaying();
      }
      //歌词定位到指定位置
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    changeMode() {
      //切换模式发生改变
      const mode = (this.mode + 1) % 3;
      //mutation设置mode
      this.setPlayMode(mode);

      let list = null;
      //如果是随机模式，把顺序列表打乱
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        // 否则是顺序列表
        list = this.sequenceList;
      }
      //  //随机模式，把当前索引还原
      this.resetCurrentIndex(list);

      //改变播放列表
      this.setPlaylist(list);
    },
    //随机模式，把当前索引还原
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });

      this.setCurrentIndex(index);
    },
    getLyric() {
      //封装歌词
      this.currentSong
        .getLyric()
        .then(lyric => {

          if(this.currentSong.lyric !== lyric){
            return
          }
          //创建歌词实例
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            //如果播放，则播放歌词
            this.currentLyric.play();
          }
        })
        .catch(() => {
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentLineNum = 0;
        });
    },
    //处理歌词
    handleLyric({ lineNum, txt }) {
      //播放当前歌词行的时候，赋值，导致高亮
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        //如果播放的行数大于五行
        //则歌词元素滚动到播放的行数-5的位置，并且时间是一秒
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        //否则歌词置顶
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    middleTouchStart(e) {
      //触摸初始化
      this.touch.initiated = true;
      //获取第一根手指
      const touch = e.touches[0];
      //获取手指到窗口横纵距离
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      //获得移动的偏移
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        //如果纵向偏移大于横向偏移，则返回
        return;
      }
      //left如果当前显示的是cd则为0，否则为-一个屏幕宽度
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      //滑动的宽度
      const width = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
      //滑动的宽度占屏幕的百分比
      this.touch.percent = Math.abs(width / window.innerWidth);
      this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px,0,0)`;
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style[transitionDuration] = 0;
    },
    middleTouchEnd(e) {
      let offsetWidth;
      let opacity;
      //说如果当前显示的是cd
      if (this.currentShow === "cd") {
        //偏移的位置大于10%，则偏移到歌词,否则不偏移
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        //如果是歌词
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      const itme = 300;
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = `${itme}ms`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[transitionDuration] = 0;
    },
    togglePlaying() {
      //如果歌曲没有加载则返回
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);

      if (this.currentLyric) {
        //歌词播放暂停
        this.currentLyric.togglePlay();
      }
    },
    next() {
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        //如果歌曲列表为1则循环
        this.loop();
        return;
      }
      //当前索引加1
      let index = this.currentIndex + 1;
      //如果索引加到列表的长度，则置位0
      if (index === this.playlist.length) {
        index = 0;
      }
      //设置当前索引，并换歌
      this.setCurrentIndex(index);
      //如果切换不播放，则调用
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    pre() {
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        //如果歌曲列表为1则循环
        this.loop();
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlaylist: "SET_PLAYLIST"
    })
  },
  created() {
    this.touch = {};
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/mixin.styl'
.player
  .normal-player
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    background-color #222
    &.normal-enter-active, &.normal-leave-active
      transition all 0.4s
      .top, .bottom
        transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity 0
      .top
        transform translate3d(0, -100px, 0)
      .bottom
        transform translate3d(0, 100px, 0)
    .background
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      z-index -1
      opacity 0.6
      filter blur(50px)
    .top
      position relative
      margin-bottom 25px
      .back
        position absolute
        top 0
        left 6px
        z-index 50
        .iconfont
          display block
          padding 9px
          font-size 30px
          color #ffffff
      .title
        width 65%
        margin 0 auto
        line-height 40px
        no-wrap()
        font-size 18px
        color #ffffff
      .subtitle
        width 65%
        margin 0 auto
        font-size 14px
        color rgba(255, 255, 255, 0.3)
    .middle
      position fixed
      width 100%
      top 80px
      bottom 170px
      white-space nowrap
      font-size 0
      .middle-l
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 0
        padding-top 80%
        .cd-wrapper
          position absolute
          left 10%
          top 0
          width 80%
          height 100%
          .cd
            width 100%
            height 100%
            border-radius 50%
            &.play
              animation rotate 20s linear infinite
            &.pause
              animation-play-state paused
            .image
              position absolute
              box-sizing border-box
              left 0
              top 0
              // 不能right，bottom，因为他是图片啊。。。。。。
              width 100%
              height 100%
              border-radius 50%
              border 10px solid rgba(255, 255, 255, 0.1)
        .playing-lyric-wrapper
          width 80%
          margin 30px auto 0 auto
          overflow hidden
          text-align center
          .playing-lyric
            height 20px
            line-height 20px
            font-size 12px
            color rgba(255, 255, 255, 0.5)
      .middle-r
        display inline-block
        vertical-align top
        width 100%
        height 100%
        overflow hidden
        .lyric-wrapper
          width 80%
          margin 0 auto
          overflow hidden
          text-align center
          .text
            line-height 32px
            color rgba(255, 255, 255, 0.5)
            font-size 14px
            &.current
              color #ffffff
    .progress-wrapper
      display flex
      align-items center
      width 85%
      margin 0 auto
      padding 10px 0
      .time
        color #fff
        font-size 12px
        flex 0 0 35px
        line-height 30px
        width 35px
        &.time-l
          text-align left
        &.time-r
          text-align right
      .progress-bar-wrapper
        flex 1
    .bottom
      position absolute
      bottom 50px
      width 100%
      .dot-wrapper
        text-align center
        font-size 0
        .dot
          display inline-block
          vertical-align middle
          margin 0 4px
          width 8px
          height 8px
          border-radius 50%
          background-color rgba(255, 255, 255, 0.5)
          &.active
            width 20px
            border-radius 5px
            background rgba(255, 255, 255, 0.8)
      .operators
        display flex
        align-items center
        .icon
          flex 1
          color rgba(255, 255, 255, 0.8)
          &.disable
            color rgba(255, 255, 255, 0.3)
          .iconfont
            font-size 30px
        .i-left
          text-align right
        .i-center
          padding 0 20px
          text-align center
          .iconfont
            font-size 50px
            color rgba(255, 255, 255, 0.8)
        .i-right
          text-align left
  .mini-player
    display flex
    align-items center
    position fixed
    left 0
    bottom 0
    width 100%
    height 60px
    background-color #fff
    &.mini-enter-active, .mini-leave-acitve
      transition all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity 0
    .icon
      flex 0 0 40px
      width 40px
      margin 0 10px 0
      img
        border-radius 50%
        &.play
          animation rotate 10s linear infinite
        &.pause
          animation-play-state paused
    .text
      display flex
      flex 1
      flex-direction column
      justify-content center
      line-height 20px
      overflow hidden
      .name
        margin-bottom 2px
        no-wrap()
        font-size 14px
        color #000
      .desc
        no-wrap()
        font-size 12px
        color color rgba(0, 0, 0, 0.3)
    .control
      flex 0 0 30px
      width 30px
      margin 0 10px
      .iconfont
        font-size 30px
        color #000
@keyframes rotate
  0%
    transform rotate(0)
  100%
    transform rotate(360deg)
</style>