<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { MusicListMxin } from "common/js/mixin";
import { getSingerDetail } from 'api/singer';
export default {
  mixins: [MusicListMxin],
  components:
   {
    MusicList
  },
  computed: {
    bgImage() {
      return this.singer.img1v1Url;
    },
    title() {
      return this.singer.name;
    },
    ...mapGetters(["singer"])
  },
  methods: {
    async _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      const { data: res } = await getSingerDetail(this.singer.id);
      this._splitList(res.hotSongs);
    }
  },
  created() {
    this._getDetail();
  },
  mounted() {}
};
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>