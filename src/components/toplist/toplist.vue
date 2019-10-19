<template>
  <transition name="slide">
    <div class="toplist">
      <header-back title="Charts"></header-back>
      <scroll :data="list" class="toplist-content" ref="list">
        <div>
          <!-- 官方榜 -->
          <div class="official-content">
            <h2 class="title">官方榜</h2>
            <ul class="list">
              <li
                class="item"
                @click="selectItem(item)"
                v-for="(item,index) in officalList"
                :key="index"
              >
                <div class="image-wrapper">
                  <img v-lazy="item.coverImgUrl" class="image" width="110" height="110" alt />
                </div>
                <div class="disc">
                  <div class="text" v-for="(track,index) in item.tracks" :key="index">
                    <span class="index">{{index+1}}.</span>
                    {{track.first}} - {{track.second}}
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- 推荐榜 -->
          <div class="recommend-wrapper">
            <disc-list
              @loadImage="loadImage"
              @selectItem="selectItem"
              title="推荐榜"
              :list="recommendList"
            ></disc-list>
          </div>
          <!-- 全球榜 -->
          <div class="international-wrapper">
            <disc-list
              @loadImage="loadImage"
              title="全球榜"
              @selectItem="selectItem"
              :list="internationalList"
            ></disc-list>
          </div>
          <!-- 更多 -->
          <div class="more-wrapper">
            <disc-list
              @loadImage="loadImage"
              title="更多榜单"
              @selectItem="selectItem"
              :list="moreList"
            ></disc-list>
          </div>
        </div>
        <div>
          <div class="loading-wrapper" v-show="!list.length">
            <loading></loading>
          </div>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import HeaderBack from "base/header-back/header-back";
import Scroll from "base/scroll/scroll";
import DiscList from "components/disc-list/disc-list";
import { getToplistDetail } from "api/toplist";
import { mapMutations } from "vuex";
import Loading from "base/loading/loading";
import { playlistMixin } from "common/js/mixin";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      officalList: [],
      recommendList: [],
      internationalList: [],
      moreList: [],
      list: []
    };
  },
  components: {
    DiscList,
    Scroll,
    Loading,
    HeaderBack
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    async _getToplistDetail() {
      const { data: res } = await getToplistDetail();
      const { list } = res;
      this.list = list;
      this.officalList = list.slice(0, 4);
      this.recommendList = list.slice(4, 10);
      this.internationalList = list.slice(10, 16);
      this.moreList = list.slice(16);
    },

    loadImage() {
      this.$refs.list.refresh();
    },
    selectItem(item) {
      this.$router.push({
        path: `/toplist/${item.id}`
      });
      this.setDisc(item);
    },
    ...mapMutations({
      setDisc: "SET_DISC"
    })
  },
  created() {
    this._getToplistDetail();
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin'
.toplist
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 50
  background-color #fff
  &.slide-enter-active,&.slide-leave-active
    transition all .3s
  &.slide-enter,&.slide-leave-to
    transform translate3d(100%,0,0)
  .toplist-header
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
    .title
      line-height 50px
      font-size 18px
      color #fff
      width 70%
      margin 0 auto
      text-align left
  .toplist-content
    left 4%
    position fixed
    top 50px
    width 92%
    overflow hidden
    bottom 0
    .official-content
      padding 0 0 20px 0
      .title
        font-size 18px
        font-weight bold
        line-height 30px
      .list
        .item
          padding 10px 0
          display flex
          font-size 0
          .image-wrapper
            flex 0 0 100px
            width 100px
            margin-right 10px
            .image
              width 100%
              height 100%
          .disc
            font-size 12px
            flex 1
            display flex
            flex-direction column
            justify-content space-around
            no-wrap()
    .loading-wrapper
      position absolute
      width 100%
      left 50%
      top 50%
      transform translate3d(-50%, -50%, 0)
</style>