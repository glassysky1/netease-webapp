<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <div class="no-result-text">{{title}}</div>
  </div>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      default:''
    }
  }
}
</script>

<style lang="stylus" scoped>
  .no-result
    text-align center
    .no-result-text
      font-size 14px
      color #fff
</style>