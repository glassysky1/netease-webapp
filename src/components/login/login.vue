<template>
  <transition name="slide">
    <div class="login">
      <header-back title="Login with mobile" :styleChange="styleChange"></header-back>
      <form @submit.prevent.stop="startLogin" class="login-wrapper">
        <div class="input-box">
          <span class="code">+86</span>
          <input
            type="text"
            pattern="^1[345789]\d{9}"
            placeholder="Mobile number"
            v-model="phone"
            class="box"
            required="required"
            autofocus
          />
          <span class="clear" @click="clearPhone">
            <i class="iconfont icon-close"></i>
          </span>
        </div>
        <div class="input-box">
          <input
            type="password"
            placeholder="Password"
            v-model="password"
            class="box"
            required="required"
          />
          <span class="clear" @click="clearPassword">
            <i class="iconfont icon-close"></i>
          </span>
        </div>

        <div class="login-btn-container">
          <input class="login-btn" type="submit" value="Login" />
        </div>
      </form>
      <tip ref="tip">
        <div class="tip-title">
          <span v-if="tipFlag" class="text">success!!!</span>
          <span v-else class="text">Please check your phone or password</span>
        </div>
      </tip>
    </div>
    <router-view></router-view>
  </transition>
</template>

<script>
import Tip from "base/tip/tip";
import HeaderBack from "base/header-back/header-back";
import { login } from "api/user";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      phone: "",
      password: "",
      styleChange: true,
      tipFlag:false
    };
  },
  components: {
    HeaderBack,
    Tip
  },
  methods: {
    clearPhone() {
      this.phone = "";
    },
    clearPassword() {
      this.password = "";
    },
    async startLogin() {
      try {
        const { data: res } = await login(this.phone, this.password);
        this.tipFlag = true
        await this.getThenSetLoginStatus(res.account.id);
        this.$refs.tip.show();
        this.$router.replace({
          path: "/recommend"
        });
      } catch (e) {
        this.tipFlag = false
        this.$refs.tip.show();
        
      }
    },
    ...mapActions(["getThenSetLoginStatus"])
  }
};
</script>

<style lang="stylus" scoped>
.login
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color #fff
  z-index 150
  &.slide-enter-active, &.slide-leave-active
    transition all 0.3s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
  .login-wrapper
    position relative
    width 90%
    left 5%
    top 50px
    .input-box
      font-size 16px
      width 100%
      display flex
      line-height 35px
      border-bottom 1px solid #cccccc
      .code
        flex 0 0 30px
        width 30px
        margin-right 7px
      .box
        flex 1
        outline none
        &::-webkit-input-placeholder
          color rgba(0, 0, 0, 0.3)
    .login-btn-container
      margin-top 50px
      width 100%
      text-align center
      font-size 16px
      .login-btn
        color #ffffff
        border-radius 20px
        line-height 40px
        background-color #DC2C1F
        width 100%
        height 100%
.tip-title
  font-size 12px
</style>