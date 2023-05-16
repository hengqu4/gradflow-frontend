<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="0">
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
    <el-form-item style="width: 100%">
      <el-button
        :loading="loading"
        class="login-btn"
        type="primary"
        @click="submitForm(ruleFormRef)"
        >登录</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElNotification } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { getTimeState } from '@/utils/index';
import { login } from '@/api/user';
import md5 from 'js-md5';

const ruleFormRef = ref<FormInstance>();
const router = useRouter();
const UserStore = useUserStore();

const passwordType = ref('password');
const loading = ref(false);
const rules = reactive<FormRules>({
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});
// 表单数据
const ruleForm = reactive({
  email: 'admin3@qq.com',
  password: 'admin123',
});

const showPwd = () => {
  if (passwordType.value === 'password') {
    passwordType.value = '';
  } else {
    passwordType.value = 'password';
  }
};
const submitForm = (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      // 登录
      setTimeout(async () => {
        const data = {
          ...ruleForm,
          password: md5(ruleForm.password),
        };
        await UserStore.userLogin(data)
          .then(async () => {
            await router.push({
              path: '/',
            });
            ElNotification({
              title: getTimeState(),
              message: '欢迎登录 ECNU毕业设计系统',
              type: 'success',
              duration: 3000,
            });
          })
          .catch(() => {
            ElNotification({
              title: getTimeState(),
              message: '登录失败',
              type: 'error',
              duration: 3000,
            });
          })
          .finally(() => {
            loading.value = false;
          });
      }, 1000);
    } else {
      console.log('error submit!');
      setTimeout(async () => {
        loading.value = false;
      }, 1000);
    }
  });
};
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>
