<template>
  <transition name="bounce">
    <div class="tip" v-show="showFlag" @click.stop='hide'>
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  data(){
    return{
      showFlag:false
    }
  },
  props:{
    delay:{
      type:Number,
      default:2000
    }
  },
  methods:{
    show(){
      this.showFlag = true
      clearTimeout(this.timer)
      this.timer= setTimeout(() => {
        this.hide()
      }, this.delay);
    },
    hide(){
      this.showFlag = false
    }
  }
}
</script>

<style lang="stylus">
  .tip
    position fixed
    top 65% 
    z-index 500
    left 50%
    transform translate3d(-50%,0,0)
    background-color #fff
    box-shadow 0 0 3px rgba(0,0,0,0.2)
    padding 3px
    &.bounce-enter-active,&.bounce-leave-active
      transition all .3s
    &.bounce-enter,&.bounce-leave-to
      opacity 0
</style>