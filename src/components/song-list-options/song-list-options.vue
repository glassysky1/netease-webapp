<template>
  <div class="song-list-options">
    <transition name="slide">
      <div class="song-list-options-wrapper" v-show="songListShowFlag">
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
              <li class="item" @click="selectSinger">
                <span class="icon">
                  <i class="iconfont icon-geshou"></i>
                </span>
                <span class="text" v-if="songOptions.singers">Artist:{{songOptions.singers.names}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
    <div class="singers-select" v-show="singerShowFlag" v-if=" songOptions.singers">
      <h1 class="title">Check Artist</h1>
      <div class="item" v-for="(item,index) in songOptions.singers.info">
        <div class="image-wrapper">
          <img :src="item.image" width="40" height="40" alt />
        </div>
        <div class="singer">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      singerShowFlag: false,
      singerBgShowFlag: false
    };
  },
  computed: {
    ...mapGetters(["songOptions", "songListShowFlag", "songOptionsIndex"])
  },
  methods: {
    hide() {
      this.setSongListShow(false);
    },
    selectCurrent() {
      this.$emit("selectCurrent", this.songOptions, this.songOptionsIndex);
      this.setSongListShow(false);
    },
    selectSinger() {
      this.singerShowFlag = true;
      this.setSongListShow(false);
    },
    ...mapMutations({
      setSongListShow: "SET_SONG_LIST_SHOW"
    })
  },
  mounted() {
    console.log(this.songOptions);
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin'
.song-list-options
  position fixed
  z-index 151
  .singers-select
    z-index 4
    position fixed
    left 5%
    width 90%
    top 50%
    transform translate3d(0, -100%, 0)
    padding 10px
    border-radius 20px
    background-color #ffffff
    box-sizing border-box
    box-shadow 0 0 5px rgba(0, 0, 0, 0.5)
    .title
      font-weight bold
      margin-bottom 20px
    .item
      margin-bottom 10px
      display flex
      align-items center
      .image-wrapper
        margin-right 10px
      .singer
        font-size 14px
  .song-list-options-wrapper
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