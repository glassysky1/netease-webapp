<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getPlaylistDetail } from "api/recommend";
import MusicList from "components/music-list/music-list";
import { MusicListMxin } from "common/js/mixin";
export default {
  mixins:[MusicListMxin],
  components: {
    MusicList
  },
  computed: {
    bgImage() {
      return this.disc.picUrl ? this.disc.picUrl : this.disc.coverImgUrl;
    },
    title() {
      return this.disc.name;
    },
    ...mapGetters(["disc"])
  },
  methods: {
    async _getPlaylistDetail() {
      if (!this.disc.id) {
        this.$router.push("/recommend");
        return;
      }
      const { data: res } = await getPlaylistDetail(this.disc.id);
      this._splitList(res.playlist.tracks);
    },

  },
  created() {
    this._getPlaylistDetail();
  }
};
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>