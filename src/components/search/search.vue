<template>
  <div class="search">

    <div class="search-wrapper">
      <div class="back" @click="$router.back()">
        <i class="iconfont icon-zuo"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
.search
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color #fff
  .search-wrapper
    position relative
    width 100%
    height 50px
    background-color #D63E34
    .back
      position absolute
      top 0
      left 0
      .iconfont
          display block
          padding 10px
          font-size 30px
          color #fff
</style>