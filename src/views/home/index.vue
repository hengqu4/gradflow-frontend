<template>
  <div class="app-container">
    <div class="app-container-inner">
      <el-descriptions
          class="margin-top"
          title="个人信息"
          :column="3"
          size="large"
          border
          style="word-break: break-all;word-wrap: break-word"
      >
        <template #extra>
          <el-button @click="controlEditShow" type="primary">{{ editButtonText }}</el-button>
        </template>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <user />
              </el-icon>
              Username
            </div>
          </template>
          {{ UserStore.userInfo.username }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <iphone />
              </el-icon>
              Telephone
            </div>
          </template>
          {{ UserStore.userInfo.phone }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <User />
              </el-icon>
              Sex
            </div>
          </template>
          {{ sex }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <tickets />
              </el-icon>
              Role
            </div>
          </template>
          {{ UserStore.userInfo.role }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <office-building />
              </el-icon>
              Address
            </div>
          </template>
          {{ UserStore.userInfo.address }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Document />
              </el-icon>
              Signature
            </div>
          </template>
          {{ UserStore.userInfo.signature }}
        </el-descriptions-item>
      </el-descriptions>

      <el-form
          :label-position="left"
          label-width="100px"
          :model="userInfo"
          class="edit-form"
          v-show="formIfShow"
          :rules="rules"
          ref="ruleFormRef"
      >
        <el-text type="primary" size="large">编辑信息</el-text>
        <el-form-item label="Username" prop="username">
          <el-input v-model="userInfo.username" />
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="userInfo.phone" />
        </el-form-item>
        <el-form-item label="Sex" prop="sex">
          <div class="mb-2 flex items-center text-sm">
            <el-radio-group v-model="userInfo.sex" class="ml-4">
              <el-radio label="0" size="large">男</el-radio>
              <el-radio label="1" size="large">女</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="Address" prop="address">
          <el-input v-model="userInfo.address" />
        </el-form-item>
        <el-form-item label="Signature" prop="signature">
          <el-input v-model="userInfo.signature" />
        </el-form-item>

        <el-button type="primary" @click="submitForm(ruleFormRef)" :disabled="isSame">提交</el-button>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
  import {useUserStore} from '@/store/modules/user'
  import {computed, reactive, ref} from "vue";
  import type { FormInstance} from 'element-plus';
  import {ElNotification, FormRules,ElMessage} from "element-plus";
  import {userInfoUpdate} from '@/api/user'
  import {getTimeState} from "@/utils";


  const UserStore = useUserStore()
  const ruleFormRef = ref<FormInstance>();

  // 性别
  const sex = computed(() => {
    return UserStore.userInfo.sex == 0 ? '男' : '女'
  })

  const formIfShow=ref(false)

  const editButtonText = computed(() => {
    return formIfShow.value == false ? '编辑' : '取消编辑'
  })

  const isSame=computed(()=>{
    for (let key in userInfo){
      if (userInfo[key]!=UserStore.userInfo[key]) return false
    }
    return true
  })

  const userInfo = reactive({
    username: UserStore.userInfo.username,
    phone: UserStore.userInfo.phone,
    sex: UserStore.userInfo.sex+"",
    address: UserStore.userInfo.address,
    signature: UserStore.userInfo.signature
  })

  const controlEditShow=()=>{
    formIfShow.value=!formIfShow.value
  }

  const rules = reactive<FormRules>({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    phone: [{ pattern: /^[0-9]{11}$/, message: '请输入11位手机号', trigger: 'blur'}],
  });

  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate(async (valid,fields) => {
      if (valid){
        for (let key in userInfo) {
          if (userInfo.hasOwnProperty(key) && (userInfo[key] === null || userInfo[key] === undefined || userInfo[key] === '')) {
            delete userInfo[key];
          }
        }
        await userInfoUpdate(userInfo,UserStore.token)
          .then((userUpdateRes)=>{
            if (userUpdateRes.code==0){
              ElNotification({
                title: getTimeState(),
                message: '修改用户信息成功',
                type: 'success',
                duration: 3000,
              });
              // 修改store中的值
              for (let key in userInfo) {
                if (!(userInfo.hasOwnProperty(key) && (userInfo[key] === null || userInfo[key] === undefined || userInfo[key] === ''))) {
                  UserStore.userInfo[key]=userInfo[key];
                }
              }
            }
          }).catch(()=>{
              ElNotification({
                title: getTimeState(),
                message: '修改用户信息失败',
                type: 'error',
                duration: 3000,
            });
          }).finally(()=>{
              formIfShow.value=false
          })
      }else {
        console.log('error submit!', fields)
        ElMessage({
          showClose: true,
          message: '请完善正确的格式.',
          type: 'warning',
        })
      }
    })
  }
</script>

<style scoped lang="scss">
  @import './index';
</style>
