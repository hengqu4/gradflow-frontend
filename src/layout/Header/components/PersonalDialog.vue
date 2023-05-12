<template>
  <el-dialog v-model="dialogVisible" title="修改密码" width="40%">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
    >
      <el-form-item label="姓名">
        <el-input v-model="ruleForm.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="ruleForm.newPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="ruleForm.confirmPassword" type="password"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { ref, defineExpose, reactive } from 'vue'
  import type { ElForm } from 'element-plus'
  import { useUserStore } from '@/store/modules/user'
  import { ElNotification } from 'element-plus';
  import type { FormInstance } from 'element-plus';
  import {getTimeState} from "@/utils";


  import {resetPassword} from '@/api/user'

  const dialogVisible = ref(false)
  const UserStore = useUserStore()
  const show = () => {
    dialogVisible.value = true
  }
  const hide = () => {
    dialogVisible.value = false
  }
  // type FormInstance = InstanceType<typeof ElForm>

  const formSize = ref('')
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive({
    name: UserStore.userInfo.username,
    newPassword: '',
    confirmPassword: '',
  })

  const validateNewPassword=(rule: any, value: any, callback: any) => {
    if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)) {
      return Promise.reject(new Error('6到16位的数字字母组合'));
    }
    return Promise.resolve();
  }

  const validateConfirmPassword=(rule: any, value: any, callback: any) => {
    if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)) {
      return Promise.reject(new Error('6到16位的数字字母组合'));
    }
    if (value === ruleForm.newPassword) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('两次密码输入不一致'));
    }
  }

  const rules = reactive({
    newPassword: [
      {required: true, message: '请输入新的密码', trigger: 'blur'},
      {validator: validateNewPassword, trigger: 'blur'}
    ],
    confirmPassword: [
      {required: true, message: '请再次输入新的密码', trigger: 'blur'},
      {validator: validateConfirmPassword, trigger: 'blur'}
    ]
  })


  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        let email=UserStore.userInfo.email
        let token=UserStore.userInfo.token
        let resetMsg=await resetPassword(email,ruleForm.confirmPassword,token)
        if (resetMsg.code==0) {
          hide()
          ElNotification({
            title: getTimeState(),
            message: '更改密码成功',
            type: 'success',
            duration: 2000,
          });
        }else {
          hide()
          ElNotification({
            title: getTimeState(),
            message: '更改密码失败',
            type: 'error',
            duration: 2000,
          });
        }
      } else {
        console.log('error submit!')
        return false
      }
    })
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  defineExpose({
    show,
  })
</script>

<style scoped>
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
</style>
