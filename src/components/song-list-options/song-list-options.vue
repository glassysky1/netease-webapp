<template>
  <div class="song-list-options"  v-show="options">
    <div class="bg-layer" @click="hide"></div>
    <div class="options-wrapper">

    </div>
  </div>
</template>

<script>
import { mapGetters,mapMutations } from 'vuex';
export default {
  computed:{
    ...mapGetters(['options'])
  },
  methods:{
    hide(){
      this.setOptions(false)
    }
    ,
     ...mapMutations({
      setOptions:'SET_OPTIONS'
    })
  }
}
</script>

<style lang="stylus" scoped>
.song-list-options
  position fixed
  z-index 151
  .bg-layer
    z-index 1
    background-color rgba(0,0,0,.3)
    position fixed
    left 0
    top 0
    width 100%
    bottom 0
  .options-wrapper
    z-index 2
    position fixed
    left 0
    bottom 0
    width 100%
    height 400px
    background-color #fff
    border-radius 20px 20px 0 0
</style>