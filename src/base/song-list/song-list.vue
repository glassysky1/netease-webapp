<template>
  <ul class="song-list">
    <li class="item" @click="selectItem(song,index)" v-for="(song,index) in songs" :key="index">
      <div class="count">{{setIndex(index)}}</div>
      <div class="info">
        <h2 class="name">{{song.name}}</h2>
        <p class="desc">{{song.singer}} - {{song.album}}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  methods:{
    setIndex(index){
      return `${index+1}`.padStart(2,'0')
    },
    selectItem(song,index){
      this.$emit('select',song,index)
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin.styl'
.song-list
  .item
    display flex
    height 60px
    align-items center
    box-sizing border-box
    padding 20px
    line-height 20px
    overflow hidden
    font-size 14px
    border-bottom 1px solid #eeeeee
    &:last-child
      border-bottom none 
    no-wrap()
    .count
      flex 0 0 25px
      width 25px
      color #8E8E8E
      font-size 12px
    .info
      flex 1
      display flex
      flex-direction column 
      justify-content center
      no-wrap()
      .name
        margin-bottom 10px
        color #000000
      .desc
        color #8E8E8E
        font-size 12px
</style>