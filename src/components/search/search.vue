<template>
  <transition name="slide">
    <div class="search">
      <div class="search-header">
        <div class="back" @click="$router.back()">
          <i class="iconfont icon-zuo"></i>
        </div>
        <div class="search-box-wrapper">
          <search-box @handleEnter="startSearch" ref="searchBox" @query="onQueryChange"></search-box>
        </div>
      </div>
      <!-- 搜索建议 -->
      <div class="search-suggest" v-show="query.length" ref="searchSuggest">
        <ul class="list">
          <li class="track" v-show="query.length">Search "{{query}}"</li>
          <li
            class="item"
            @click="setSuggestQuery(item)"
            v-for="(item,index) in searchSuggestionList"
            :key="index"
          >
            <i class="iconfont icon-sousuo"></i>
            <span class="text">{{item.keyword}}</span>
          </li>
        </ul>
      </div>
      <scroll :data="hots" ref="hotScroll" class="hot-scroll" v-show="!query.length">
        <div>
          <!-- 热搜榜 -->
          <div class="hot" ref="hot" v-show="!query.length">
            <ul class="list">
              <div class="title">热搜榜</div>
              <li class="item" @click="setHotQuery(item)" v-for="(item,index) in hots" :key="index">
                <div class="index" :class="{'active': index<3}">{{index+1}}</div>
                <div class="info">
                  <h3 class="name" :class="{'active': index<3}">{{item.searchWord}}</h3>
                  <p class="content">{{item.content}}</p>
                </div>
                <div class="score">{{item.score}}</div>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div class="loading-wrapper" v-show="!hots.length">
            <loading></loading>
          </div>
        </div>
      </scroll>
      <scroll :data="songs" ref="songListScroll" class="song-list-scroll" v-show="query.length">
        <div>
          <div class="song-list-wrapper" v-show="query.length">
            <song-list @select="selectItem" :songs="songs"></song-list>
          </div>
        </div>
        <div>
          <div class="loading-wrapper" v-show="!songs.length">
            <loading></loading>
          </div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
const br = 320000;
import Loading from "base/loading/loading";
import SongList from "base/song-list/song-list";
import Scroll from "base/scroll/scroll";
import { createSong } from "common/js/song";
import { getSongUrl, getSongDetail } from "api/song";
import { search } from "api/search";
import { getSearchSuggestions, getSearchHotDetail } from "api/search";
import SearchBox from "components/search-box/search-box";
import { mapActions } from "vuex";
export default {
  name: "Search",
  data() {
    return {
      query: "",
      searchSuggestionList: "",
      hots: [],
      songs: []
      // showSongList:false
    };
  },
  computed: {
    hotsAndSongs() {
      return this.hots.concat(this.songs);
    }
  },
  components: {
    SearchBox,
    Scroll,
    SongList,
    Loading
  },
  watch: {
    query() {
      //如果点击热词，热词关闭，则搜索建议也关闭
      if (this.$refs.hot.style.display === "none") {
        this.$nextTick(() => {
          this.$refs.searchSuggest.style.display = "none";
        });
        return;
      }

      this._getSearchSuggestions();
    }
  },
  methods: {
    onQueryChange(query) {
      this.query = query;
    },
    //设置建议
    setSuggestQuery(item) {
      this.$refs.searchSuggest.style.display = "none";
      this.query = item.keyword;
      this.$refs.searchBox.setQuery(this.query);
      this.$refs.hotScroll.scrollTo(0, 0, 0);
      this._getSearch();
    },
    //设置热词
    setHotQuery(item) {
      this.$refs.hot.style.display = "none";
      this.query = item.searchWord;
      this.$refs.searchBox.setQuery(this.query);
      this.$refs.hotScroll.scrollTo(0, 0, 0);
      this._getSearch();
    },
    //开始搜索
    startSearch() {
      this.$refs.searchSuggest.style.display = "none";
      this.$refs.hot.style.display = "none";
      // this.showSongList=true
      this.$nextTick(() => {
        this._getSearch();
      });
    },
    selectItem(item, index) {
      /*   console.log(1);
      console.log(); */

      this.selectPlay({
        list: this.songs,
        index
      });
    },
    async _getSearch() {
      this.$refs.songListScroll.scrollTo(0, 0);
      const { data: res } = await search(this.query);
      //妈的，跟前面获取歌曲json数据有区别！！！！
      this._normalizeSongs(res.result.songs);
    },
    _normalizeSongs(list) {
      let ret = [];
      let urlList = [];
      let imageList = [];
      list.forEach(item => {
        urlList.push(item.id);
        imageList.push(item.id);
        ret.push(
          createSong({
            id: item.id,
            name: item.name,
            singer: item.artists,
            album: item.album.name
          })
        );
      });
      getSongUrl(urlList.toString(), br).then(res => {
        const data = res.data.data;
        data.forEach(item => {
          ret.forEach(item1 => {
            if (item.id === item1.id) {
              item1.url = item.url;
            }
          });
        });
        getSongDetail(imageList.toString()).then(res => {
          const data = res.data.songs;
          data.forEach(item => {
            ret.forEach(item1 => {
              if (item.id === item1.id) {
                item1.image = item.al.picUrl;
                item1.duration = item.dt;
              }
            });
          });
          this.songs = ret;
        });
      });
    },
    async _getSearchSuggestions() {
      const { data: res } = await getSearchSuggestions(this.query);
      this.searchSuggestionList = res.result.allMatch;
    },
    async _getSearchHot() {
      const { data: res } = await getSearchHotDetail();
      this.hots = res.data;
    },
    ...mapActions(["selectPlay"])
  },
  created() {
    this._getSearchHot();
  }
  // beforeRouteLeave(to, from, next) {
  //   this.showSongList = false;
  //   next();
  // },
};
</script>

<style lang="stylus" scoped>
.search
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 50
  background-color #fff
  &.slide-enter-active, &.slide-leave-active
    transition all 0.4s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
  .search-header
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
    .search-box-wrapper
      padding-top 11px
      margin 0 5px 0 45px
  .search-suggest
    position absolute
    top 50px
    right 5px
    left 15px
    background-color #fff
    z-index 999
    box-shadow 0 0 5px rgba(0, 0, 0, 0.5)
    .list
      line-height 40px
      font-size 0
      .track, .item
        padding 0 10px
        border-bottom 1px solid #eee
      .track
        font-size 14px
        color rgb(75, 75, 180)
      .item
        &:last-child
          border-bottom none
        font-size 14px
        color rgba(0, 0, 0, 0.5)
        .iconfont
          margin-right 10px
  .hot-scroll, .song-list-scroll
    position absolute
    top 50px
    bottom 0
    overflow hidden
    width 100%
  .hot-scroll
    .hot
      width 92%
      position relative
      left 4%
      top 40px
      .list
        .title
          font-size 14px
          font-weight 700
          line-height 20px
        .item
          height 50px
          display flex
          .index
            flex 0 0 25px
            width 25px
            line-height 50px
            text-align left
            color #C0C0C0
            &.active
              color #D1423A
          .info
            flex 1
            display flex
            flex-direction column
            justify-content center
            .name
              font-size 16px
              margin-bottom 5px
              &.active
                font-weight bold
            .content
              font-size 12px
              color #C0C0C0
          .score
            font-size 12px
            margin-top 10px
            color #C0C0C0
    .song-list-wrapper
      position relative
      left 0
      top 0
      width 100%
.loading-wrapper
  position absolute
  left 50%
  top 50%
  transform translate3d(-50%, -50%, 0)
</style>