<template>
  <div class="music-list">
    <header-back
      class="headerBack"
      v-show="searchFlag"
      :hideBack="hideBack"
      :styleChange="styleChange"
    >
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange" :styleChange="styleChange"></search-box>
      </div>
    </header-back>
    <div class="back" @click="back">
      <span class="iconfont icon-zuo"></span>
    </div>
    <div class="search-btn" @click="searchBtn" v-show="!searchFlag && songs.length">
      <i class="iconfont icon-sousuo"></i>
    </div>
    <div class="title" v-show="!searchFlag">{{title}}</div>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" v-show="songs.length" ref="playWrapper" @click="random">
        <div class="play">
          <span class="iconfont icon-bofang"></span>
          <span class="text">Random play all</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      @scroll="scroll"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper" v-show="!searchFlag">
        <song-list @select="selectItem" :songs="songs"></song-list>
        <loading v-show="!songs.length"></loading>
      </div>
    </scroll>

    <scroll class="search-song-list" ref="searchSongList" :data="newSongs" v-show="searchFlag">
      <div>
        <div class="not-find-result" v-show="notFindResult">
          <span class="text">No contents matched with</span>
          <span @click="toSearch" class="query"> "{{query}}"</span>
        </div>
        <song-list @select="selectItem" :songs="newSongs"></song-list>
      </div>

    </scroll>
  </div>
</template>

<script>
const RESERVED_HEIGHT = 110;
import HeaderBack from "base/header-back/header-back";
import SearchBox from "base/search-box/search-box";
import { mapActions } from "vuex";
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import Loading from "base/loading/loading";
import { playlistMixin } from "common/js/mixin";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      scrollY: 0,
      searchFlag: false,
      styleChange: true,
      hideBack: true,
      query: "",
      newSongs: [],
      notFindResult:false
    };
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  components: {
    SongList,
    Scroll,
    Loading,
    SearchBox,
    HeaderBack
  },
  props: {
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    },
    bgImage: {
      type: String,
      default: ""
    }
  },
  watch: {
    scrollY(newY) {
      // this.minTranslateY = -(背景高度-80)
      let translateY = Math.max(this.minTranslateY, newY);
      let zIndex = 0;
      this.$refs.layer.style["transform"] = `translate3d(0,${translateY}px,0)`;

      if (newY < 0) {
        this.$refs.bgImage.style[
          "transform"
        ] = `translate3d(0,${translateY}px,0`;
        if (translateY === this.minTranslateY) {
          this.$refs.bgImage.style.zIndex = 1;
        }
      }
    },
    query(newQuery) {
      if (!newQuery.length) {
        this.newSongs = [];
        this.notFindResult=false
        return;
      }
      this.filterSongs();
      //如果查询有值，但是列表里找不到
      if(newQuery && !this.newSongs.length){
        this.notFindResult = true
      }else{
        this.notFindResult = false
      }
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.searchSongList.$el.style.bottom = bottom;

      this.$refs.list.refresh();
      this.$refs.searchSongList.refresh();
    },
    //列表里没有，那就去搜索里面搜索
    toSearch(){
      this.$router.push({
        path:'/search',
        query:{muiscListQuery:this.query}
      })
    },
    //得把songs里面的东西提出来
    filterSongs() {
      this.newSongs = this.songs
        .filter(song => {
          return (
            song.name.toUpperCase().indexOf(this.query.toUpperCase()) > -1 ||
            song.singer.toUpperCase().indexOf(this.query.toUpperCase()) > -1 ||
            song.album.toUpperCase().indexOf(this.query.toUpperCase()) > -1
          );
        })
        .slice();
    },
    onQueryChange(query) {
      this.query = query;
    },
    searchBtn() {
      this.searchFlag = true;
      this.$nextTick(() => {
        this.$refs.searchSongList.refresh();
      });
    },
    back() {
      if (!this.searchFlag) {
        this.$router.back();
      } else {
        this.searchFlag = false;
        this.$refs.searchBox.clear();
        //返回的时候
        //懂了，刷新列表啊
        this.$nextTick(() => {
          this.$refs.list.refresh();
        });
      }
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(item, index) {
      /*   console.log(1);
      console.log(); */
      if (this.searchFlag) {
        //如果点击的是搜搜列表
        this.selectPlay({
          list: this.newSongs,
          index
        });
      } else {
        this.selectPlay({
          list: this.songs,
          index
        });
      }
    },
    random() {
      this.randomPlay({
        list: this.songs
      });
    },
    ...mapActions(["selectPlay", "randomPlay"])
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    //最高

    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin.styl'
.music-list
  position fixed
  top 0
  bottom 0
  right 0
  left 0
  z-index 100
  background-color #ffffff
  .headerBack
    position absolute
    width 100%
    left 0
    top 0
    z-index 100
    .search-box-wrapper
      padding-top 11px
      margin 0 5px 0 45px
  .search-song-list
    overflow hidden
    position fixed
    top 50px
    width 100%
    left 0
    bottom 0
    z-index 100
    background-color #fff
    .not-find-result
      position absolute
      width 100%
      top 10%
      text-align center
      font-size 14px
      color rgba(0,0,0,.5)
      .query
        extend-click()
        color #5F85AE

      
  .back
    position absolute
    top 0
    left 6px
    z-index 101
    .iconfont
      display block
      padding 10px
      font-size 20px
      color #ffffff
  .title
    position absolute
    top 0
    left 10%
    z-index 40
    width 80%
    no-wrap()
    text-align center
    line-height 40px
    font-size 18px
    color #ffffff
  .search-btn
    position absolute
    right 0
    z-index 10
    padding 10px
    .iconfont
      font-size 25px
      color #fff
  .bg-image
    position relative
    width 100%
    height 0
    padding-top 80%
    transform-origin top
    background-size cover
    .play-wrapper
      height 60px
      background-color #fff
      position absolute
      left 0
      width 100%
      bottom 0
      box-sizing border-box
      border-bottom 1px solid #eeeeee
      padding 20px
      z-index 2
      border-radius 13px 13px 0 0
      .play
        .iconfont
          font-size 20px
          margin-left -3px
          margin-right 8px
    .filter
      position absolute
      top 0
      left 0
      bottom 0
      right 0
      background-color rgba(7, 17, 27, 0.1)
  .bg-layer
    position relative
    border-radius 13px
    background-color #fff
    height 100%
  .list
    position fixed
    left 0
    bottom 0
    right 0
</style>