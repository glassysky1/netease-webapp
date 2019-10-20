<template>
  <div  class="header-back"  :class="{'active':styleChange}">
    <div v-show="!hideBack" class="back" @click="$router.back()">
      <i class="iconfont icon-zuo"></i>
    </div>
    <div class="title">{{title}}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    styleChange:{
      type:Boolean,
      default:false
    },
    hideBack:{
      type:Boolean,
      default:false
    }
  },
  computed:{
  },
  mounted(){
  }
};
</script>
<style lang="stylus" scoped>
.header-back
  position relative
  width 100%
  height 50px
  background-color #D63E34
  color #ffffff
  &.active
    background-color rgba(0,0,0,0)
    color #000000
  .back
    position absolute
    top 0
    left 0
    .iconfont
      display block
      padding 10px
      font-size 30px
  .title
    line-height 50px
    font-size 18px
    width 70%
    margin 0 auto
    text-align left
</style>