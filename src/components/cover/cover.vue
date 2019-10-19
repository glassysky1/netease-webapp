<template>
  <transition name="fade">
    <div class="cover" v-show="showFlag">
      <div class="title">
        <p class="text">与你只若如初见</p>
        <p class="text">何须伤感离别</p>
      </div>
      <div class="content">
        <div class="image-wrapper">
          <img width="30" height="30" src="./logo.png" alt />
        </div>
        <div class="name">小月音乐</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data(){
    return{
      showFlag:true
    }
  },
  methods:{
    _start(){
      setTimeout(() => {
        this.showFlag = false
      }, 2000);
    }
  },
  mounted(){
    this._start()
  }
};
</script>

<style lang="stylus" scoped>
.cover
  position fixed
  top 0
  left 0
  bottom 0
  right 0
  z-index 998
  background-color #DC2C1F
  &.fade-enter-active,&.fade-leave-active
    transition all .5s
  &.fade-enter,&.fade-leave-to
    opacity 0
  .title
    position absolute
    width 100%
    text-align center
    top 30%
    .text
      font-size 18px
      color #ffffff
      line-height 36px
      font-style italic
      font-weight bold
  .content
    position absolute
    bottom 10%
    left 50%
    transform translate3d(-50%, 0, 0)
    display flex
    align-items center
    .name
      font-size 16px
      color #fff
      font-weight bold
</style>