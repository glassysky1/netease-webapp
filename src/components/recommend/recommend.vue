<template>
  <transition name="slide">
    <div class="recommend" ref="recommend">
      <div class="redWall" ref="redWall"></div>
      <scroll
        ref="scroll"
        @scroll="scroll"
        :probe-type="probeType"
        :listen-scroll="listenScroll"
        class="recommend-content"
      >
        <div>
          <div class="swiper-wrapper">
            <swiper :bannerList="bannerList"></swiper>
          </div>
          <div class="four-circles">
            <ul class="four-circles-list">
              <li class="circle-item">
                <div class="circle-box">
                  <i class="iconfont icon-FM"></i>
                </div>
                <h3 class="title">私人FM</h3>
              </li>
              <li class="circle-item">
                <div class="circle-box">
                  <i class="iconfont icon-meirituijian"></i>
                </div>
                <h3 class="title">每日推荐</h3>
              </li>
              <li class="circle-item">
                <div class="circle-box">
                  <i class="iconfont icon-gedan"></i>
                </div>
                <h3 class="title">歌单</h3>
              </li>
              <router-link to="/toplist" tag="li" class="circle-item">
                <div class="circle-box">
                  <i class="iconfont icon-paihang"></i>
                </div>
                <h3 class="title">排行</h3>
              </router-link>
            </ul>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">推荐歌单</h1>
            <ul class="list-content">
              <li
                @click="selectItem(item)"
                class="list-item"
                v-for="(item,index) in recommendList"
                :key="index"
              >
                <div class="info-img">
                  <img @load="loadImage" v-lazy="item.picUrl" alt class="img" />
                </div>
                <div class="info">
                  <p class="desc">{{item.name}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div class="loading-wrapper" v-show="!recommendList.length">
            <loading></loading>
          </div>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
const TYPE = 1;
import Loading from "base/loading/loading";
import Scroll from "base/scroll/scroll";
import Swiper from "components/swiper/swiper";
import { loadBanner, loadRecommendList } from "api/recommend";
import { mapMutations, mapGetters } from "vuex";
import { prefixStyle } from "common/js/dom";
import { playlistMixin } from "common/js/mixin";
const transform = prefixStyle("transform");
export default {
  mixins: [playlistMixin],
  data() {
    return {
      bannerList: [],
      recommendList: [],
      scrollY: 0
    };
  },
  components: {
    Swiper,
    Scroll,
    Loading
  },
  watch: {
    scrollY(newY) {
      const height = 110;
      /*      if (newY <= 0) {
        //如果是向上拉， 高度-向上的偏移，但是不能小于0 */
      const newHeight = Math.max(newY + height, 0);
      this.$refs.redWall.style.height = `${newHeight}px`;
      /*      } else {
        this.$refs.redWall.style.height = `${height}px`;
      } */
    },
    recommendIsFresh(flag) {
      if (!flag) {
        this.$refs.scroll.scrollTo(0, 0);
      }
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    async _loadBanner(TYPE) {
      const { data: res } = await loadBanner(TYPE);

      this.bannerList = res.banners;
    },
    async _loadRecommendList() {
      const { data: res } = await loadRecommendList();
      this.recommendList = res.result;
    },
    loadImage() {
      this.$refs.scroll.refresh();
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.id}`
      });
      this.setDisc(item);
    },
    ...mapMutations({
      setDisc: "SET_DISC"
    })
  },
  created() {
    this._loadBanner();
    this._loadRecommendList();
    this.probeType = 3;
    this.listenScroll = true;
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.recommend
  position fixed
  top 44px
  width 100%
  bottom 0
  &.slide-enter-active,&.slide-leave-active
    transition all .3s
  &.slide-enter
    transform translate3d(-100%, 0, 0)
  &.slide-leave-to
    display none 
  .redWall
    position absolute
    left 0
    z-index -1
    height 110px
    width 100%
    background-color #D63E34
  .recommend-content
    height 100%
    overflow hidden
    .swiper-wrapper
      width 95%
      margin 0 auto
    .four-circles
      margin 20px 0
      .four-circles-list
        display flex
        justify-content space-around
        .circle-item
          .circle-box
            margin 5px auto 10px
            display flex
            justify-content space-around
            align-items center
            height 50px
            width 50px
            border-radius 50%
            background #D63E34
            .iconfont
              color #f1f1f1
              font-size 25px
          .title
            text-align center
            font-weight 400px
            font-size $font-size-medium
            color #333333
    .recommend-list
      margin 0 auto
      width 97%
      .list-title
        line-height 60px
        color #000000
        padding-left 5px
        font-weight bold
      .list-content
        display flex
        flex-wrap wrap
        justify-content space-around
        .list-item
          width 31%
          .info-img
            .img
              width 100%
          .info
            margin-bottom 20px
            .desc
              line-height 16px
              height 32px
              font-size $font-size-small
              color #333
              overflow hidden
  .loading-wrapper
    position absolute
    top 50%
    left 50%
    transform translate3d(-50%, 50%, 0)
</style>