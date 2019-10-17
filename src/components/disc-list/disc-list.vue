<template>
  <div class="disc-list">
    <h2 class="title">{{title}}</h2>
    <ul class="list">
      <li @click="selectItem(item)" class="item" v-for="(item,index) in list" :key="index">
        <div class="image-wrapper">
          <img @load="loadImage" v-lazy="item.coverImgUrl"  class="image">
        </div>
        <p class="text">{{item.name}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      default:''
    },
    list:{
      type:Array,
      default:[]
    }
  },
  methods:{
    loadImage(){
      this.$emit('loadImage')
    },
    selectItem(item){
      this.$emit('selectItem',item)
    }
  }
}
</script>

<style lang="stylus" scoped>
.disc-list
  .title
    font-size 18px
    font-weight bold
    line-height 30px
  .list
    padding 20px 0
    display flex
    flex-wrap wrap
    justify-content space-between
    .item
      padding-bottom 15px
      width 31%
      .image-wrapper
        .image
          width 100%
          height 100%
      .text
        font-size 12px
        line-height 20px
</style>