<template>
  <ul class="song-list">
    <li class="item" @click="selectItem(songs,index)" v-for="(songs,index) in songs" :key="index">
      <div class="count">{{setIndex(index)}}</div>
      <div class="info">
        <h2 class="name">{{songs.name}}</h2>
        <p class="desc">{{songs.singer}} - {{songs.album}}</p>
      </div>
      <div class="options" @click.stop="clikeOptions">
        <i class="iconfont icon-sangedian"></i>
      </div>
    </li>

  </ul>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  components: {
  
  },
  methods: {
    setIndex(index) {
      return `${index + 1}`.padStart(2, "0");
    },
    selectItem(song, index) {
      this.$emit("select", this.songs, index);
    },
    clikeOptions(){
      this.setOptions(true)
    },
    ...mapMutations({
      setOptions:'SET_OPTIONS'
    })
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
    .count, .options
      flex 0 0 25px
      width 25px
      color #8E8E8E
      font-size 12px
    .options
      flex 0 0 20px
      width 20px
      extend-click()
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