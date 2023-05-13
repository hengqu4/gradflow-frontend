<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/image/login/side-logo.png" />
      </div>
      <div class="login-form">
        <div class="login-title">
          <img class="icon" src="@/assets/logo.png" alt="logo" />
          <h2 class="title">ECNU毕业设计</h2>
        </div>
        <div>
          <el-radio-group v-model="loginOrRegister" size="large" class="login-or-register">
            <el-radio-button label="Register" />
            <el-radio-button label="Login" />
          </el-radio-group>
        </div>
        <LoginForm v-if="loginOrRegister=='Login'"/>
        <RegisterForm  v-if="loginOrRegister=='Register'" v-on:registerSuccess="registerSuccess"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoginForm from './components/LoginForm.vue';
  import RegisterForm from './components/RegisterForm.vue'
  import {ref} from "vue";

  const loginOrRegister = ref('Login')

  const registerSuccess=()=>{
    loginOrRegister.value='Login'
  }
</script>
<style lang="scss" scoped>
@import './index';
</style>
