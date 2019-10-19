<template>
  <transition name="slide">
    <div class="menu" v-show="showFlag">
      <div class="bg-layer" @click="hide"></div>
      <div class="menu-wrapper" @click.stop :class="{'active':!loginStatus}">
        <div class="content" v-show="loginStatus">
          <div class="profile">
            <div class="avatar-wrapper">
              <img width="70" height="70" :src="userInfo.avatarUrl" alt />
            </div>
            <div class="title">
              <span class="name">{{userInfo.nickname}}</span>
              <span class="degree">
                <span class="text">Lv.{{userInfo.vipType}}</span>
              </span>
            </div>
            <div class="check">
              <span class="iconfont icon-jinbi"></span>
              <span class="text">Check</span>
            </div>
          </div>
          <div class="heijiao"></div>
          <div class="my-list">
            <ul class="list">
              <li class="item">
                <i class="iconfont icon-zuijinbofang"></i>
                <div class="text">Recent play</div>
              </li>
              <router-link tag="li" to="/likelist" class="item">
                <i class="iconfont icon-like"></i>
                <div class="text">My favorite</div>
              </router-link>
            </ul>
          </div>
        </div>
        <div class="bottom-tab" v-show="loginStatus">
          <ul class="list">
            <li class="item">
              <div class="night">
                <i class="iconfont icon-yewan"></i>
              </div>
              <div class="text">Night</div>
            </li>
            <li class="item">
              <div class="settings">
                <i class="iconfont icon-shezhi"></i>
              </div>
              <div class="text">Settings</div>
            </li>
            <li class="item" @click="exit">
              <div class="exit">
                <i class="iconfont icon-tuichu1"></i>
              </div>
              <div class="text">Exit</div>
            </li>
          </ul>
        </div>
        <div class="login-tip" v-show="!loginStatus">
          <div class="content">
            <div class="image-wrapper">
              <img width="60" height="60" src="./logo.png" alt />
            </div>
            <div class="text">来都来了，登个录！！</div>
          </div>
          <div @click="login" class="login-btn">
            <span class="text">Login with mobile</span>
          </div>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirm" text="是否退出登录？"></confirm>
      <tip ref="tip">
        <div class="tip-title">
          <span class="text">退出成功！！</span>
        </div>
      </tip>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import Tip from "base/tip/tip";
import { loadUserId } from "common/js/cache";
import Confirm from "base/confirm/confirm";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      showFlag: false
    };
  },
  computed: {
    ...mapGetters(["loginStatus",'userInfo'])
  },
  components: {
    Confirm,
    Tip
  },
  methods: {
    async confirm() {
      
      await this.getLogoutThenSetLoginStatus(loadUserId());
      this.$emit('change')
      this.$nextTick(()=>{
        this.$refs.tip.show()
      })
    },
    exit() {
      this.$refs.confirm.show();
    },
    show() {
      this.showFlag = true;
      this.$emit("show");
    },
    hide() {
      this.showFlag = false;
      this.$emit("hide");
    },
    login() {
      this.showFlag = false;
      this.$router.push({
        path: "/login"
      });
    },
    ...mapActions(["getLogoutThenSetLoginStatus"])
  }
};
</script>

<style lang="stylus" scoped>
.menu
  position fixed
  top 0
  left 0
  bottom 0
  width 100%
  z-index 800
  &.slide-enter-active, &.slide-leave-active
    transition all 0.3s
    .menu-wrapper, .bg-layer
      transition all 0.3s
  &.slide-enter, &.slide-leave-to
    .menu-wrapper
      transform translate3d(-100%, 0, 0)
    .bg-layer
      opacity 0
  .menu-wrapper, .bg-layer
    position absolute
    top 0
    left 0
    bottom 0
  .bg-layer
    width 100%
    z-index 801
    background-color rgba(0, 0, 0, 0.3)
  .menu-wrapper
    width 80%
    z-index 802
    background-color #fff
    &.active
      background-color #DC2C1F
    .login-tip
      position absolute
      top 25%
      left 15%
      bottom 20%
      width 70%
      .content
        text-align center
        .image-wrapper
          border-radius 50%
          overflow hidden
          display inline-block
        .text
          margin-top 20px
          font-size 18px
          color #fff
      .login-btn
        position absolute
        bottom 0
        width 100%
        text-align center
        background-color #fff
        padding 10px 0
        border-radius 20px
        .text
          font-size 14px
          color #DC2C1F
    .bottom-tab
      position absolute
      bottom 0
      left 0
      width 100%
      height 60px
      box-sizing border-box
      border-top 1px solid #eee
      .list
        line-height 60px
        display flex
        align-items center
        .item
          justify-content center
          flex 1
          display flex
          font-size 12px
          .iconfont
            margin-right 5px
            font-size 18px
            color #000
    .content
      .profile
        position relative
        width 86%
        margin 40px auto 25px
        .avatar-wrapper
          display inline-block
          border-radius 50%
          overflow hidden
          margin-bottom 10px
        .title
          .name
            font-size 14px
          .degree
            margin-left 5px
            font-size 12px
            display inline-block
            .text
              border-radius 5px
              background-color #F3F3F3
              display inline-block
              color #90908F
              padding 2px
              font-style oblique
              font-weight bold
        .check
          position absolute
          right 0
          bottom 0
          background-color #DC2C1F
          color #ffff
          padding 0 7px
          border-radius 12px
          line-height 20px
          .iconfont
            font-size 14px
            margin-right 3px
          .text
            vertical-align top
            font-size 12px
      .heijiao
        position relative
        width 86%
        margin 0 auto 25px
        height 50px
        border-radius 5px
        background-color #1C1C1C
      .my-list
        position relative
        width 86%
        margin 0 auto
        border-top 1px solid #eeeeee
        border-bottom 1px solid #eeeeee
        .item
          line-height 50px
          display flex
          .iconfont
            margin-right 5px
            font-size 18px
            &.icon-like
              font-size 20px
              margin-left -2px
          .text
            font-size 14px
</style>