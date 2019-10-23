<template>
  <transition name="slide">
    <div class="song-list-options" v-show="songListShowFlag">
      <div class="bg-layer" @click="hide"></div>
      <div class="options-wrapper">
        <h1 class="title" @click.stop="selectCurrent">
          <div class="image-wrapper">
            <img :src="songOptions.image" alt width="50" height="50" />
          </div>
          <div class="info">
            <div class="name">Track:{{songOptions.name}}</div>
            <div v-if="songOptions.singers" class="singer">{{songOptions.singers.names}}</div>
          </div>
        </h1>
        <div class="content">
          <ul class="list">
            <li class="item">
              <span class="icon">
                <i class="iconfont icon-bofang"></i>
              </span>
              <span class="text">Play Next</span>
            </li>
            <li class="item">
              <span class="icon">
                <i class="iconfont icon-xiazai"></i>
              </span>
              <span class="text">Download</span>
            </li>
            <li class="item">
              <span class="icon">
                <i class="iconfont icon-pinglun1"></i>
              </span>
              <span class="text">Comment(99999)</span>
            </li>
            <li class="item">
              <span class="icon">
                <i class="iconfont icon-geshou"></i>
              </span>
              <span class="text">Artist:Beyond</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters,mapMutations } from 'vuex';
export default {
  computed:{
    ...mapGetters(['songOptions','songListShowFlag','songOptionsIndex'])
  },
  methods:{
    hide(){
      this.setSongListShow(false)
    },
    selectCurrent(){
      this.$emit('selectCurrent',this.songOptions,this.songOptionsIndex)
      this.setSongListShow(false)
    },
    ...mapMutations({
      setSongListShow:'SET_SONG_LIST_SHOW'
    })
  },
  mounted(){
    console.log(this.songOptions);
    
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin'
.song-list-options
  position fixed
  z-index 151
  &.slide-enter-active, &.slide-leave-active
    transition all 0.3s
    .bg-layer, .options-wrapper
      transition all 0.3s
  &.slide-leave-to, &.slide-enter
    .bg-layer
      opacity 0
    .options-wrapper
      transform translate3d(0, 100%, 0)
  .bg-layer
    z-index 1
    background-color rgba(0, 0, 0, 0.3)
    position fixed
    left 0
    top 0
    width 100%
    bottom 0
  .options-wrapper
    z-index 2
    position fixed
    left 0
    bottom 0
    padding 3%
    box-sizing border-box
    width 100%
    height 60%
    background-color #fff
    border-radius 20px 20px 0 0
    .title
      display flex
      align-items top
      .image-wrapper
        flex 0 0 50px
        width 50px
        margin-right 3px
      .info
        .name
          margin-top 5px
          font-size 14px
          line-height 22px
          color #000
        .singer
          font-size 12px
          color #a5a5a5
          no-wrap()
    .content
      .list
        .item
          display flex
          align-items center
          height 50px
          .icon
            margin-right 10px
            color #4D4D4D
          .text
            font-size 14px
            color #000
</style>