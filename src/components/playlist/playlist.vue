<template>
  <transition name="slide">
    <div class="playlist" v-show="showFlag">
      <div class="bg-layer" @click="hide"></div>
      <div class="playlist-wrapper">
        <h1 class="title">
          <span class="text" @click="changeMode">
            <span class="iconfont" :class="iconMode"></span>
            <span class="playMode">{{textMode}}</span>
          </span>
          <div class="clear" @click.stop="showConfirm">
            <i class="iconfont icon-lajitong"></i>
          </div>
        </h1>
        <Scroll class="content" ref="listContent" :data="sequenceList">
          <transition-group name="list" tag="ul">
            <li
              ref="listItem"
              class="item"
              v-for="(item,index) in sequenceList"
              :key="item.id"
              @click="selectItem(item,index)"
            >
              <span class="text" :class="getCurrentColor(item)">
                <i class="iconfont" :class="getCurrentIcon(item)"></i>
                {{item.name}}
                <span class="singer">- {{item.singer}}</span>
              </span>
              <span class="close" @click.stop="deleteOne(item)">
                <i class="iconfont icon-close"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
      </div>
      <confirm text="确定清空播放列表？" @confirm="confirmClear" ref="confirm"></confirm>
    </div>
  </transition>
</template>

<script>
import Confirm from "base/confirm/confirm";
import { playMode } from "common/js/config";
import Scroll from "base/scroll/scroll";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { shuffle } from "common/js/util";
export default {
  data() {
    return {
      showFlag: false
    };
  },
  components: {
    Scroll,
    Confirm
  },
  watch: {
    //检测歌曲是否切换成功
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return;
      }
      console.log(1);

      this.scrollToCurrent(newSong);
    }
  },
  computed: {
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-shunxubofang"
        : this.mode === playMode.loop
        ? "icon-xunhuanbofang"
        : "icon-bofangye-caozuolan-suijibofang";
    },
    textMode() {
      return this.mode === playMode.sequence
        ? "Loop all"
        : this.mode === playMode.loop
        ? "Loop single"
        : "Shuffle";
    },

    ...mapGetters(["playlist", "currentSong", "sequenceList", "mode"])
  },
  methods: {
    show() {
      this.showFlag = true;
      this.$nextTick(() => {
        // 显示的时候初始一下
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSong);
      });
    },
    hide() {
      this.showFlag = false;
    },
    getCurrentIcon(item) {
      return item.id === this.currentSong.id ? "icon-laba" : "";
    },
    getCurrentColor(item) {
      return item.id === this.currentSong.id ? "active" : "";
    },
    selectItem(item, index) {
      ///如果模式是随机
      if (this.mode === playMode.random) {
        //就在播放列表中找索引，设置当前索引
        index = this.playlist.findIndex(song => {
          return song.id === item.id;
        });
      }
      this.setCurrentIndex(index);
      //以免暂停时候，cd不动
      this.setPlayingState(true);
    },
    scrollToCurrent(current) {
      //播放的歌滚动到第一个
      const index = this.sequenceList.findIndex(song => {
        //查找当前播放的索引
        return current.id === song.id;
      });
      //节点是ref = "listItem" ,但是可以写listItem[index],还是头一次见
      //，scrollToElement,是滚动到头部的意思，把listItem[index]滚到头部
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
    },
    deleteOne(item) {
      this.deleteSong(item);
      if (!this.playlist.length) {
        // 播放列表里面啥都没有，则隐藏
        this.hide();
      }
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    confirmClear() {
      this.deleteSongList();
      this.hide();
    },
    changeMode() {
      //切换模式发生改变
      const mode = (this.mode + 1) % 3;
      //mutation设置mode
      this.setPlayMode(mode);

      let list = null;
      //如果是随机模式，把顺序列表打乱
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        // 否则是顺序列表
        list = this.sequenceList;
      }
      //  //随机模式，把当前索引还原
      this.resetCurrentIndex(list);

      //改变播放列表
      this.setPlaylist(list);
    },
    //随机模式，把当前索引还原
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });

      this.setCurrentIndex(index);
    },
    ...mapMutations({
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlaylist: "SET_PLAYLIST"
    }),
    ...mapActions(["deleteSong", "deleteSongList"])
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin'
.playlist
  position fixed
  z-index 151
  &.slide-enter-active, &.slide-leave-active
    transition 0.3s
    .bg-layer, .playlist-wrapper
      transition 0.3s
  &.slide-leave-to, &.slide-enter
    .bg-layer
      opacity 0
    .playlist-wrapper
      transform translate3d(0, 100%, 0)
  .bg-layer
    position fixed
    background-color rgba(0, 0, 0, 0.5)
    top 0
    left 0
    z-index 152
    width 100%
    bottom 0
  .playlist-wrapper
    position fixed
    left 0
    bottom 0
    z-index 153
    top 40%
    width 100%
    overflow hidden
    background-color #fff
    border-radius 5% 5% 0 0
    .title
      position absolute
      width 96%
      left 2%
      top 0
      font-size 14px
      display flex
      justify-content space-between
      border-bottom 1px solid #eeeeee
      align-items center
      .text
        padding 18px 0
        .iconfont
          margin-right 3px
          color #A5A5A5
      .clear
        extend-click()
    .content
      position absolute
      left 2%
      top 50px
      width 96%
      bottom 0
      overflow hidden
      .item
        display flex
        justify-content space-between
        font-size 16px
        align-items center
        height 50px
        no-wrap()
        &.list-enter-active, &.list-leave-active
          transition all 0.1s linear
        &.list-enter, &.list-leave-to
          height 0
        .text
          color #000
          width 90%
          overflow hidden
          .iconfont
            margin-right 4px
          &.active
            color #CA4139
          .singer
            font-size 12px
            color #a5a5a5
        .close
          extend-click()
          color #A5A5A5
</style>