<template>
  <div class="search-box">
    <input
      :class="{'active':styleChange}"
      ref="query"
      autofocus
      type="text"
      v-model="query"
      class="box"
      :placeholder="placeholder"
      @keydown.enter="handleEnter"
    />
    <div class="clear" v-show="query.length" @click="clear">
      <i class="iconfont icon-close"></i>
    </div>
  </div>
</template>

<script>
import { search } from "api/search";
import { debounce } from "common/js/util";
export default {
  data() {
    return {
      query: ""
    };
  },
  props: {
    placeholder: {
      type: String,
      default: ``
    },
    styleChange:{
      type:Boolean,
      default:false
    }
  },
  methods: {
    setQuery(query) {
      this.query = query;
    },
    clear() {
      this.query = "";
    },
    handleEnter() {
      if (this.query.trim() ==='') return;
      this.$emit("handleEnter");
    }
  },
  created() {
    this.$watch(
      "query",
      debounce(newQuery => {
        this.$emit("query", newQuery.trim());
      }, 200)
    );
  }
};
</script>

<style lang="stylus" scoped>
.search-box
  position relative
  width 100%
  align-items center
  display flex
  vertical-align middle
  border-bottom 1px solid #e6e6e6
  .box
    flex 1
    width 100%
    height 28px
    background-color #D63E34
    &.active
      background-color rgba(0,0,0,0)
    color rgba(255, 255, 255, 0.7)
    font-size 16px
    outline none
    &::-webkit-input-placeholder
      color rgba(255, 255, 255, 0.3)
  .clear
    flex 0 0 30px
    width 30px
    .iconfont
      display block
      font-size 25px
      color rgba(255, 255, 255, 0.8)
</style>