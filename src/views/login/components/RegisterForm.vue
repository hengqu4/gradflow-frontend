<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="0" >
    <div style="display: flex; align-items: center; justify-content: center;">
      <el-form-item label="" prop="role">
        <el-radio-group v-model="ruleForm.role">
          <el-radio-button label="student">Student</el-radio-button>
          <el-radio-button label="teacher">Teacher</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </div>

    <el-form-item label="" prop="email">
      <el-input
          placeholder="请输入邮箱"
          autoComplete="on"
          style="position: relative"
          v-model="ruleForm.email"
          @keyup.enter.native="submitForm(ruleFormRef)"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><UserFilled /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="" prop="password">
      <el-input
          placeholder="请输入密码"
          autoComplete="on"
          @keyup.enter.native="submitForm(ruleFormRef)"
          v-model="ruleForm.password"
          :type="passwordType"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><GoodsFilled /></el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </div>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="" prop="confirmPassword">
      <el-input
          placeholder="请确认密码"
          autoComplete="on"
          @keyup.enter.native="submitForm(ruleFormRef)"
          v-model="ruleForm.confirmPassword"
          :type="passwordType"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><GoodsFilled /></el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </div>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item style="width: 100%">
      <el-button
          :loading="loading"
          class="login-btn"
          type="primary"
          @click="submitForm(ruleFormRef)"
      >注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>

  import {reactive, ref} from "vue";
  import {FormInstance} from "element-plus";
  const ruleFormRef = ref<FormInstance>();

  const passwordType = ref('password');
  const loading = ref(false);

  const showPwd = () => {
    if (passwordType.value === 'password') {
      passwordType.value = '';
    } else {
      passwordType.value = 'password';
    }
  };

  const validateEmail = (rule: any, value: any, callback: any) => {
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/.test(value)){
      return Promise.reject(new Error('请输入正确格式的email'));
    }
    return Promise.resolve();
  }

  const validatePassword=(rule: any, value: any, callback: any) => {
    if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)) {
      return Promise.reject(new Error('6到16位的数字字母组合'));
    }
    return Promise.resolve();
  }

  const validateConfirmPassword=(rule: any, value: any, callback: any) => {
    if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)) {
      return Promise.reject(new Error('6到16位的数字字母组合'));
    }
    if (value === ruleForm.password) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('两次密码输入不一致'));
    }
  }

  const rules = reactive({
    role: [
      { required: true, message: '请输入角色', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: validateEmail, trigger: 'blur'}
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { validator: validatePassword, trigger: 'blur'}
    ],
    confirmPassword: [
        { required: true, message: '请输入确认密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur'}
    ]
  });

  const ruleForm = reactive({
    role: 'student',
    email: '',
    password: '',
    confirmPassword:''
  });

</script>

<style scoped>
@import '../index.scss';
</style>
