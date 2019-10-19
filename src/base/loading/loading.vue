<template>
  <div class="loading">
    <img width="24" height="24" src="./loading1.gif">
    <!-- <img src="./loading.gif" width="24" height="24" alt=""> -->
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      default:'玩命加载中...'
    }
  }
}
</script>
<style lang="stylus" scoped>
  .loading
    width 100%
    text-align center
    .desc
      line-height 20px
      font-size 12px
      color #333
</style>