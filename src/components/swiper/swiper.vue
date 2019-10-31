<template>
  <swiper class="swiper" :options="swiperOption" v-if="bannerList.length">
    <swiper-slide class="swiper-slide" v-for="(item, index) in bannerList" :key="index">
      <img class="img" @click="clickType(item)" ref="img" :src="item.imageUrl" alt />
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
const br = 320000;
import "swiper/dist/css/swiper.css";
import { getSongUrl, getSongDetail } from "api/song";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { createSong } from "common/js/song";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination"
        },
        loop: true,
        loopAdditionalSlides: 0,
        autoplay: {
          daley: 3000,
          //手触摸不会停止
          disableOnInteraction: false
        }
      }
    };
  },
  components: {
    swiper,
    swiperSlide
  },
  props: {
    bannerList: {
      type: Array,
      default: []
    }
  },
  methods: {
    clickType(item) {
      if (item.targetType === 3000) {
        window.open(item.url);
        return;
      }
      if (item.targetType === 1) {
        getSongUrl(item.targetId.toString(), br).then(res => {
          let ret = [];
          const data = res.data.data;
          
          getSongDetail(item.targetId.toString()).then(res => {
            const data1 = res.data.songs;
            // console.log(data[0].url);
            
            ret.push(
              createSong({
                id: data1[0].id,
                name: data1[0].name,
                singers: data1[0].ar,
                album: data1[0].al.name,
                image: data1[0].al.picUrl,
                duration: data1[0].dt,
              })
            );
            ret[0].url =data[0].url
            
            this.selectPlay({
              list: ret,
              index: 0
            });
          });
        });
        return
      }
    },

    ...mapActions(["selectPlay"])
  },
  watch: {},
  mounted() {}
};
</script>

<style lang="stylus" scoped>
.swiper
  width 100%
  .swiper-slide
    overflow hidden
    border-radius 7px
    .img
      width 100%
</style>