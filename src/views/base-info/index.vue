<template>
  <div class="app-container">
    <div class="app-container-inner">
      <el-descriptions
        class="baseinfo-desc"
        title="个人基本信息"
        :column="1"
        size="large"
        :border="true"
        style="word-break: break-all; word-wrap: break-word"
      >
        <template #extra>
          <el-button @click="controlEditShow" type="primary">
            {{ editButtonText }}
          </el-button>
        </template>
        <div v-if="!formIfShow">
          <el-descriptions-item label-class-name="desc-item-label">
            <template #label>
              <div>
                <el-icon>
                  <user />
                </el-icon>
                姓名
              </div>
            </template>
            {{ UserStore.userInfo.username }}
          </el-descriptions-item>

          <el-descriptions-item label-class-name="desc-item-label">
            <template #label>
              <div>
                <el-icon>
                  <iphone />
                </el-icon>
                电话
              </div>
            </template>
            {{ UserStore.userInfo.phone }}
          </el-descriptions-item>

          <el-descriptions-item label-class-name="desc-item-label">
            <template #label>
              <div>
                <el-icon>
                  <User />
                </el-icon>
                性别
              </div>
            </template>
            {{ sex }}
          </el-descriptions-item>

          <el-descriptions-item label-class-name="desc-item-label">
            <template #label>
              <div>
                <el-icon>
                  <tickets />
                </el-icon>
                角色
              </div>
            </template>
            {{ UserStore.userInfo.role }}
          </el-descriptions-item>

          <el-descriptions-item label-class-name="desc-item-label">
            <template #label>
              <div>
                <el-icon>
                  <office-building />
                </el-icon>
                地址
              </div>
            </template>
            {{ UserStore.userInfo.address }}
          </el-descriptions-item>

          <el-descriptions-item label-class-name="desc-item-label">
            <template #label>
              <div>
                <el-icon>
                  <Document />
                </el-icon>
                签名
              </div>
            </template>
            {{ UserStore.userInfo.signature }}
          </el-descriptions-item>
        </div>
      </el-descriptions>

      <el-form
        label-position="left"
        label-width="100px"
        :model="userInfo"
        class="edit-form baseinfo-desc"
        v-show="formIfShow"
        :rules="rules"
        ref="ruleFormRef"
      >
        <el-text type="primary" size="large">编辑信息</el-text>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="userInfo.username" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userInfo.phone" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <div class="mb-2 flex items-center text-sm">
            <el-radio-group v-model="userInfo.sex" class="ml-4">
              <el-radio label="0" size="large">男</el-radio>
              <el-radio label="1" size="large">女</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="userInfo.address" />
        </el-form-item>
        <el-form-item label="签名" prop="signature">
          <el-input v-model="userInfo.signature" />
        </el-form-item>

        <div style="justify-content: center; display: flex">
          <el-button
            type="primary"
            @click="submitForm(ruleFormRef)"
            :disabled="isSame"
            >提交</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { computed, reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { ElNotification, FormRules, ElMessage } from 'element-plus';
import { userInfoUpdate } from '@/api/user';
import { getTimeState } from '@/utils';

const UserStore = useUserStore();
const ruleFormRef = ref<FormInstance>();

// 性别
const sex = computed(() => {
  return UserStore.userInfo.sex == 0 ? '男' : '女';
});

const formIfShow = ref(false);

const editButtonText = computed(() => {
  return formIfShow.value == false ? '编辑' : '取消编辑';
});

const isSame = computed(() => {
  for (let key in userInfo) {
    if (userInfo[key] != UserStore.userInfo[key]) return false;
  }
  return true;
});

const userInfo = reactive({
  username: UserStore.userInfo.username,
  phone: UserStore.userInfo.phone,
  sex: UserStore.userInfo.sex + '',
  address: UserStore.userInfo.address,
  signature: UserStore.userInfo.signature,
});

const controlEditShow = () => {
  formIfShow.value = !formIfShow.value;
};

const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  phone: [
    { pattern: /^[0-9]{11}$/, message: '请输入11位手机号', trigger: 'blur' },
  ],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      for (let key in userInfo) {
        if (
          userInfo.hasOwnProperty(key) &&
          (userInfo[key] === null ||
            userInfo[key] === undefined ||
            userInfo[key] === '')
        ) {
          delete userInfo[key];
        }
      }
      await userInfoUpdate(userInfo, UserStore.token)
        .then((userUpdateRes) => {
          if (userUpdateRes.code == 0) {
            ElNotification({
              title: getTimeState(),
              message: '修改用户信息成功',
              type: 'success',
              duration: 3000,
            });
            // 修改store中的值
            for (let key in userInfo) {
              if (
                !(
                  userInfo.hasOwnProperty(key) &&
                  (userInfo[key] === null ||
                    userInfo[key] === undefined ||
                    userInfo[key] === '')
                )
              ) {
                UserStore.userInfo[key] = userInfo[key];
              }
            }
          }
        })
        .catch(() => {
          ElNotification({
            title: getTimeState(),
            message: '修改用户信息失败',
            type: 'error',
            duration: 3000,
          });
        })
        .finally(() => {
          formIfShow.value = false;
        });
    } else {
      console.log('error submit!', fields);
      ElMessage({
        showClose: true,
        message: '请完善正确的格式.',
        type: 'warning',
      });
    }
  });
};
</script>

<style scoped lang="scss">
@import './index';
.baseinfo-desc {
  margin: 0 3%;
}
</style>
