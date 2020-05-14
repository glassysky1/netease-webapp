<template>
  <transition name="fade">
    <div class="cover" v-show="showFlag">
      <div class="header">
        <div class="title">恳求页</div>
      </div>
      <div class="center">
        <div class="center-title">丽婷啊:</div>
        <div class="center-content">
          其实....我不知道说什么，有点语无伦次....但我知道我在做什么，其实一直感觉挺对不起你的，真的，真的对不住你。你性格又好，人又温柔，不做作，我感觉自己真的错过了一个好女孩，我...我确实不知道我在说什么，能不能 <strong style="font-weight:bold;color:#f00">再给次机会</strong> ，当我 <strong style="font-weight:bold;color:#f00">女(男)朋友</strong> ，可以吗？
          <br>
          &nbsp;&nbsp;&nbsp;&nbsp;我这个人其实本身就有很多问题，答应之前请三思，我会列一个表，你可以对比一下：  
        </div>
        <div class="center-bottom">
          <ul>
            <li>1.我很<strong style="font-weight:bold;color:#f00">穷</strong>，真心的那种。</li>
            <li>2.我这个人<strong style="font-weight:bold;color:#f00">心态很差</strong>，我一直在努力调整心态。</li>
            <li>3.我对我的未来已经没有什么憧憬了，主要因为第一条和第二条。</li>
            <li>4.我上进心可能没那么强，但一直在做调整，主要因为第三条。</li>
            <li>5.如果把我当成朋友相处的话，我的确是个不错的人，但是我真心不知道在对待感情上是怎样的人。</li>
          </ul>
        </div>

      </div>
      <div class="bottom">
        <div class="bottom-title" @click="selected=!selected"><input type="checkbox" v-model="selected"> 我已阅读以上条款</div>
        <div class="bottom-center">
          <button class="btn-left" :class="{'not-selected':!selected}" @click="accept">接受</button>
        </div>
      </div>
      <my-confirm ref="confirm" :text="text" @confirm="confirm"></my-confirm>
      <tip title="谢谢你" ref="tip"></tip>
    </div>
  </transition>
</template>

<script>
import myConfirm from '../../base/confirm/confirm'
import tip from '../../base/tip/tip'
import {nvpengyou} from '../../api/user'
export default {
  data(){
    return{
      showFlag:true,
      selected:false,
      text:'确定做我女(男)朋友？'
    }
  },
  components:{
    myConfirm,
    tip
  },
  watch:{
    selected(val){
      console.log(val)
    }
  },
  methods:{
    _start(){
      setTimeout(() => {
        this.showFlag = false
      }, 3000);
    },
    accept(){
      if(this.selected){
        this.$refs.confirm.show()
      }
    },
    async confirm(){
      const res =  await nvpengyou()
        if(res.data.code==200){
          this.$refs.tip.show()
        }
    }
  },
  mounted(){
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
  background-color #f7f8fa
  &.fade-enter-active,&.fade-leave-active
    transition all .5s
  &.fade-enter,&.fade-leave-to
    opacity 0
  .header
    height 44px
    background-color #ffffff
    display flex
    justify-content center
    line-height 44px
    font-size 18px
    font-weight bold
  .center
    padding 20px
    .center-title
      font-size 20px
      font-weight bold
    .center-content
      margin-top 20px
      line-height 20px
      text-indent 1em
    .center-bottom
      margin-top 20px
      line-height 25px
  .bottom
    margin-top 20px
    .bottom-title
      padding-left 20px
      color #f00
      font-weight bold
    .bottom-center
      display flex
      justify-content space-around
      margin-top 20px
      .btn-left
      .btn-right
        width 30%
        line-height 30px
        outline none 
        border none 
        background-color #ccc
      .btn-left
        background-color #f00
        color #fff
      .not-selected
        background-color rgba(255,0,0,.4)
</style>