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
      <div class="search-suggest" v-show="searchSuggestIsShow" ref="searchSuggest">
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
      <scroll
        :data="hots"
        ref="hotHistoryScroll"
        class="hot-history-scroll"
        v-show="hotHistoryIsShow"
      >
        <div>
          <!-- 历史记录 -->
          <div class="history" ref="history" v-show="searchHistory.length">
            <div class="title">
              <span class="name">历史记录</span>
              <div class="clear" @click="showConfirm">
                <i class="iconfont icon-lajitong"></i>
              </div>
            </div>
            <div ref="historyContent" class="content">
              <ul ref="historyList" class="list">
                <li
                  class="item"
                  @click="setHistoryQuery(item)"
                  v-for="(item,index) in searchHistory"
                  :key="index"
                >
                  <div class="text">{{item}}</div>
                </li>
              </ul>
            </div>
          </div>
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
      <scroll :data="songs" ref="songListScroll" class="song-list-scroll" v-show="query.length" :pullup = "true" @scrollToEnd = "searchMore">
        <div>
          <div class="song-list-wrapper" v-show="query.length">
            <song-list @select="selectItem" :songs="songs"></song-list>
            <loading v-show="hasMore"></loading>
          </div>
        </div>
      </scroll>
      <confirm @confirm="confirm" ref="confirm"></confirm>
      <tip class="wrapper"></tip>
      <Tip ref="tip">
        <div class="tip-title">
          <i class="iconfont icon-Artboard"></i>
          <span class="text">清除历史成功</span>
        </div>
      </Tip>
    <song-list-options @selectCurrent="selectItem"></song-list-options>

    </div>
  </transition>
</template>

<script>
const br = 320000;
import Tip from "base/tip/tip";
import BScroll from "@better-scroll/core";
import Confirm from "base/confirm/confirm";
import Loading from "base/loading/loading";
import SongList from "base/song-list/song-list";
import Scroll from "base/scroll/scroll";
import { createSong } from "common/js/song";
import { getSongUrl, getSongDetail } from "api/song";
import { search } from "api/search";
import { playlistMixin } from "common/js/mixin";
import SongListOptions from "components/song-list-options/song-list-options";

import { getSearchSuggestions, getSearchHotDetail } from "api/search";
import SearchBox from "base/search-box/search-box";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Search",
  mixins: [playlistMixin],
  data() {
    return {
      query: "",
      searchSuggestionList: "",
      hots: [],
      songs: [],
      flag: false,
      offset: 0,
      hotHistoryIsShow: true,
      // showSongList:false
      queryByClick: false,
      searchSuggestIsShow: false,
      suggestByClick: false,
      hasMore: false,
      muiscListQuery:this.$route.query.muiscListQuery
    };
  },
  computed: {
    ...mapGetters(["searchHistory"])
  },
  components: {
    SearchBox,
    Scroll,
    SongList,
    Loading,
    Confirm,
    Tip,
        SongListOptions

  },
  watch: {
    query(newQuery) {
      //如果为空，就返回
      if (newQuery === "") {
        this.hotHistoryIsShow = true;
        //如果是空的话，就是没有点击了
        this.songs = [];
        this.searchSuggestIsShow = false;

        //刷新一下，不然没法滚动
        this.$nextTick(() => {
          this.$refs.hotHistoryScroll.refresh();
        });
        return;
      } else {
        this.hotHistoryIsShow = false;
        this.searchSuggestIsShow = true;
      }
      //如果点击热词，热词关闭，则搜索建议也关闭,但是，如果不是点击热词的话，肯定是在输入框搜索的啊，所以这一段不执行
      this._getSearchSuggestions();
    },

  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.hotHistoryScroll.$el.style.bottom = bottom;
      this.$refs.hotHistoryScroll.refresh();
      this.$refs.songListScroll.$el.style.bottom = bottom;
      this.$refs.songListScroll.refresh();
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    confirm() {
      this.clearSearchHistory();
      this.$refs.tip.show();
    },
    onQueryChange(query) {
      this.query = query;
    },
    //设置建议
    setSuggestQuery(item) {
      // this.$refs.searchSuggest.style.display = "none";
      this.query = item.keyword;
      this.$refs.searchBox.setQuery(this.query);
      this.$refs.hotHistoryScroll.scrollTo(0, 0, 0);
      this._getSearch();
    },

    //设置热词
    setHotQuery(item) {
      this.query = item.searchWord;
      this._historyAndHot();
    },
    //设置历史记录到搜索栏
    setHistoryQuery(item) {
      this.query = item;
      this._historyAndHot();
    },
    _historyAndHot() {
      //被点击
      this.$refs.searchBox.setQuery(this.query);
      this.$refs.hotHistoryScroll.scrollTo(0, 0, 0);
      //搜索
      this._getSearch();
    },
    //开始搜索
    startSearch() {
      // this.$refs.searchSuggest.style.display = "none";
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
    //搜索请求
    async _getSearch() {
      this.$nextTick(() => {
        this.hotHistoryIsShow = false;
        this.searchSuggestIsShow = false;
      });

      this.saveSearchHistory(this.query);
      //所搜之前页面缓存清掉
      this.songs = [];
      this.$refs.songListScroll.scrollTo(0, 0);
      this.offset = 0;
      this.hasMore = true;
      const { data: res } = await search(this.query, this.offset);
      //妈的，跟前面获取歌曲json数据有区别！！！！
      this.songs = this._normalizeSongs(res.result.songs);
      //检测是否更多
      this._checkMore(res.result.songs);
    },
    async searchMore() {
      //如果没有更多则返回,并且
      if (!this.hasMore) {
        return;
      }
      if(this.query ===''){
        return
      }
      this.offset++;
      
      const { data: res } = await search(this.query, this.offset);
      
      this.songs = this.songs.concat(this._normalizeSongs(res.result.songs));
      
      this._checkMore(res.result.songs);
    },
    //如果列表为0，则hasMore 为false 
    _checkMore(list){
      if(!list.length){
        this.hasMore = false
      }
    }
    ,
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
            singers: item.artists,
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
        });
      });
      return ret;
    },
    async _getSearchSuggestions() {
      const { data: res } = await getSearchSuggestions(this.query);
      this.searchSuggestionList = res.result.allMatch;
    },
    async _getSearchHot() {
      const { data: res } = await getSearchHotDetail();
      this.hots = res.data;
    },
    ...mapActions(["selectPlay", "saveSearchHistory", "clearSearchHistory"])
  },
  mounted() {
      //如果是搜索列表里面传来的值，就搜搜

      
      if(this.muiscListQuery && this.muiscListQuery.length){
        this.query = this.muiscListQuery
         this.$nextTick(()=>{
          //延迟一丢
          this.startSearch()
           this.$refs.searchBox.setQuery(this.query);
        })
      }
    
    //如果有数据，则计算历史记录的宽度
    this.$nextTick(() => {
      if (this.searchHistory.length) {
        const ul = this.$refs.historyList;
        const lis = ul.getElementsByClassName("item");
        let totalWidth = 0;
        const space = 5;
        this.searchHistory.forEach((item, index) => {
          totalWidth += lis[index].offsetWidth + space;
        });
        ul.style.width = totalWidth + "px";
        this.$nextTick(() => {
          new BScroll(this.$refs.historyContent, {
            click: true,
            scrollX: true
          });
          //先这样
        });
      }
    });
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
@import '~common/stylus/mixin'
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
  .hot-history-scroll, .song-list-scroll
    position absolute
    top 50px
    bottom 0
    overflow hidden
    width 100%
  .hot-history-scroll
    .history
      position relative
      width 92%
      left 4%
      top 25px
      height 80px
      overflow hidden
      .title
        display flex
        align-items center
        justify-content space-between
        .name
          font-size 14px
          font-weight bold
          line-height 40px
        .clear
          extend-click()
      .content
        overflow hidden
        position relative
        width 100%
        .list
          white-space nowrap
          .item
            display inline-block
            margin-right 5px
            font-size 14px
            background #F3F3F3
            padding 8px
            border-radius 12px
    .hot
      position relative
      width 92%
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
.tip-title
  font-size 12px
  .iconfont
    display inline-block
    color #D63E34
</style>