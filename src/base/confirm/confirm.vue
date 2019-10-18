<template>
  <transition name="confirm-fade">
    <div v-show="showFlag" class="confirm" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div class="operate-btn left" @click="cancel">{{cancelBtnText}}</div>
            <div class="operate-btn" @click="confirm">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// const SEARCH_KEY = "__search__";
// import storage from "good-storage";
// let path = 'variable1.styl'
// if (storage.get(SEARCH_KEY, []).length) {
//   path = "variable.styl";
//   console.log(1);
  
// }
// console.log(path);
// import "common/stylus/variable.styl";
// import(`common/stylus/${path}`)
export default {
  data() {
    return {
      showFlag: false
    };
  },
  props: {
    text: {
      type: String,
      default: "确定清空全部历史记录？"
    },
    confirmBtnText: {
      type: String,
      default: "确定"
    },
    cancelBtnText: {
      type: String,
      default: "取消"
    }
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
    confirm() {
      this.showFlag = false;
      this.$emit("confirm");
    },
    cancel() {
      this.showFlag = false;
      this.$emit("cancel");
    }
  }
};
</script>

<style lang="stylus" scoped>

.confirm
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  z-index 998
  background-color rgba(0, 0, 0, 0.3)
  &.confirm-fade-enter-active
    animation confirm-fadein 0.3s
    .confirm-content
      animation confirm-zoom 0.3s
  .confirm-wrapper
    position absolute
    top 50%
    left 50%
    transform translate3d(-50%, -50%, 0)
    z-index 999
    .confirm-content
      width 270px
      border-radius 13px
      background-color #fff
      .text
        padding 19px 15px
        line-height 22px
        text-align center
        font-size 18px
        color #000000
      .operate
        display flex
        align-items center
        text-align center
        font-size 18px
        .operate-btn
          color #D63E34
          // color $color-theme
          flex 1
          line-height 22px
          padding 10px 0
          border-top 1px solid #eeeeee
          &.left
            border-right 1px solid #eeeeee
@keyframes confirm-fadein
  0%
    opacity 0
  100%
    opacity 1
@keyframes confirm-zoom
  0%
    transform scale(0)
  50%
    transform scale(1.1)
  100%
    transform scale(1)
</style>