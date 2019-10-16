<template>
  <div class="m-header">
    <div class="menu">
      <i class="iconfont icon-ziyuan"></i>
    </div>
   <div class="tab">
      <router-link to="/recommend" tag="div" class="tab-item">
        <div class="tab-link">WOW</div>
      </router-link>
      <router-link to="/singer" tag="div" class="tab-item">
        <div class="tab-link">Singer</div>
      </router-link>
    </div>
    <router-link to="/search" tag="div" class="search">
      <i class="iconfont icon-sousuo"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  
  }
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  .m-header
    position relative
    height 44px
    text-align center
    color #fff
    background-color #D63E34
    overflow hidden
    .menu,.search
      position absolute
      top 0
      .iconfont
        display block
        padding 12px
        font-size 20px
        color #fff
    .menu
      left 0
    .search
      right 0
    .tab
      width 40%
      margin 0 auto 
      display flex
      line-height 44px
      font-size 12px
      .tab-item
        flex 1
        text-align center
        .tab-link
          color rgba(255, 255, 255, 0.3)
        &.router-link-active
          .tab-link
            color #fff
            font-size 16px
</style>