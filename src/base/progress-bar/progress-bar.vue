<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <!-- 进度条 -->
      <div class="progress" ref="progress"></div>
      <!-- 按钮 -->
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
        
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from "common/js/dom";
const transform = prefixStyle("transform");
const progressBtnWidth = 16;
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    //
    percent(newPercent) {
      //百分比>0 且没有被拖动的时候
      if (newPercent >= 0 && !this.touch.initiated) {
        //进度条宽度=进度条总宽度-小球的宽度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        //偏移的宽度=newPercent * 进度条宽度
        const offsetWidth = newPercent * barWidth;
        this._offset(offsetWidth);
      }
    }
  },
  methods: {
    progressTouchStart(e) {
      //touch进行初始化
      this.touch.initiated = true;
      //第一个手指的横向坐标
      this.touch.startX = e.touches[0].pageX;
      //记录按钮已经偏移了多少值
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      //如果没初始化则return掉
      if (!this.touch.initiated) {
        return;
      }
      //手指横向偏移量 = 移动的横向坐标-起始横向坐标
      const deltaX = e.touches[0].pageX - this.touch.startX;
      //按钮移动的偏移位置=按钮已经偏移了多少位置+手指横向偏移量，但是不能超出坐标的宽度

      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.left + deltaX)
      );

      //要偏移的进度条宽度，按钮的偏移
      this._offset(offsetWidth);
    },
    progressTouchEnd(e) {
      //初始化为false
      this.touch.initiated = false;
      this._triggerPercent();
    },
    //progress-bar的点击进度
    progressClick(e) {
      //相对于带有定位的进度条的x，y
      //当点击progressBtn，offset是不对的
      const rect = this.$refs.progressBar.getBoundingClientRect()
      //偏移量= 屏幕左侧距离-总进度条的左侧
      const offsetWidth = e.pageX - rect.left
      
      this._offset(offsetWidth);
      this._triggerPercent();
    },
    _triggerPercent() {
      //进度条宽度=进度条总宽度-小球的宽度
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;

      //百分比=进度条拖动的宽度/进度条宽度
      const percent = this.$refs.progress.clientWidth / barWidth;

      //派发出去

      this.$emit("percentChange", percent);
    },
    //要偏移的进度条宽度，按钮的偏移
    _offset(offsetWidth) {
      //把偏移的宽度赋值到要偏移的进度条
      this.$refs.progress.style.width = `${offsetWidth}px`;

      //按钮进行偏移
      this.$refs.progressBtn.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
    }
  },
  created() {
    this.touch = {};
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.progress-bar
  height 30px
  .bar-inner
    position relative
    top 13px
    height 4px
    background-color rgba(0, 0, 0, 0.3)
    .progress
      position absolute
      height 100%
      background-color rgba(255, 255, 255, 0.3)
    .progress-btn-wrapper
      position absolute
      left -8px
      top -13px
      width 30px
      height 30px
      .progress-btn
        position relative
        top 7px
        left 7px
        box-sizing border-box
        width 16px
        height 16px
        border-radius 50%
        background-color #fff
</style>