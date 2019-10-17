<template>
  <div class="singer">
    <div class="type-list">
      <ul class="type">
        <li
          class="type-item"
          v-for="(item,index) in type"
          :key="index"
          @click="selectType(item,index)"
        >
          <span class="text" :class="{'active':index===currentTypeIndex}">{{item.name}}</span>
        </li>
      </ul>
      <ul class="type-desc">
        <li
          class="type-desc-item"
          v-for="(item,index) in typeDesc"
          :key="index"
          @click="selectDescType(item,index)"
        >
          <span class="text" :class="{'active':index===currentDescTypeIndex}">{{item.type}}</span>
        </li>
      </ul>
    </div>
    <scroll class="singer-list" ref="singerList">
      <ul class="list-content">
        <li
          class="list-item"
          v-for="(item,index) in singerList"
          :key="index"
          @click="selectSinger(item)"
        >
          <div class="singer-img">
            <img width="60" height="60" @load="loadImage" v-lazy="item.picUrl" />
          </div>
          <div class="singer-name">{{item.name}}</div>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { playlistMixin } from "common/js/mixin";
import Scroll from "base/scroll/scroll";
import { getSinger } from "api/singer";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      cat: 1001,
      cat1: 1000,
      cat2: 1,
      limit: 50,
      singerList: [],
      type: [
        { name: "华语", code: 1000 },
        { name: "欧美", code: 2000 },
        { name: "日本", code: 6000 },
        { name: "韩国", code: 7000 },
        { name: "其他", code: 4000 }
      ],
      typeDesc: [
        { type: "男", code: 1 },
        { type: "女", code: 2 },
        { type: "组合/乐队", code: 3 }
      ],
      currentTypeIndex: 0,
      currentDescTypeIndex: 0,
      hasMore: true
    };
  },
  computed: {},
  watch: {
    cat() {
      this._getSinger();
    },
    cat1() {
      this.cat = this.cat1 + this.cat2;
    },
    cat2() {
      this.cat = this.cat1 + this.cat2;
    }
  },
  components: {
    Scroll
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.singerList.$el.style.bottom = bottom;
      this.$refs.singerList.refresh();
    },
    async _getSinger() {
      this.$refs.singerList.scrollTo(0, 0,1000);
      const { data: res } = await getSinger(this.cat, this.limit);

      this.singerList = res.artists;
    },
    loadImage() {
      if (!this.checkloaded) {
        this.$refs.singerList.refresh();
        this.checkloaded = true;
      }
    },
    selectType(item, index) {
      this.currentTypeIndex = index;
      this.cat1 = item.code;
    },
    selectDescType(item, index) {
      this.currentDescTypeIndex = index;
      this.cat2 = item.code;
    },
    selectSinger(item) {
      this.$router.push({
        path: `/singer/${item.id}`
      });
      this.setSinger(item);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  },
  mounted() {
    this._getSinger();
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
.singer
  position fixed
  width 100%
  top 44px
  bottom 0
  .type-list
    font-size $font-size-medium
    .type
      height 40px
      display flex
      align-items center
      text-align center
      .type-item
        flex 1
      .text
        &.active
          color $color-sub-theme
    .type-desc
      width 50%
      height 40px
      display flex
      align-items center
      text-align center
      .type-desc-item
        flex 1
        .text
          &.active
            color $color-sub-theme
  .singer-list
    position fixed
    top 122px
    bottom 0
    width 100%
    overflow hidden
    .list-content
      margin 0 20px
      .list-item
        margin-top 5px
        padding-bottom 5px
        display flex
        align-items center
        border-bottom 1px solid #eee
        &:last-child
          border-bottom none
        .singer-img
          flex 0 0 60px
          width 60px
          overflow hidden
          border-radius 50%
          img
            display block
        .singer-name
          margin-left 20px
</style>