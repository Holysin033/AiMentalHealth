<template>
  <div class="container">
    <div class="title">
      <div class="title-text">
        <h2>创建账号</h2>
        <p>请填写您的个人信息以创建账号</p>
      </div>
    </div>
    <div class="form-container">
      <el-form :model="formData" ref="submitFormRef" :rules="rules" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" size="large" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" size="large" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入昵称(可选)" size="large" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号(可选)" size="large" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" size="large" clearable type="password"
            show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="formData.confirmPassword" placeholder="请输入确认密码" size="large" type="password" clearable
            show-password />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formData.gender">
            <el-radio value="1">男</el-radio>
            <el-radio value="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="用户类型" prop="userType">
          <el-radio-group v-model="formData.userType">
            <el-radio label="1">普通用户</el-radio>
            <el-radio label="2">管理员</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item>
          <el-button class="btn" type="primary" size="large" @click="submitForm(submitFormRef)">注册</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script setup name="Register">
import { register } from "@/api/common";
import { ref, onMounted, useTemplateRef, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter()

const formData = ref({
  "username": "",
  "email": "",
  "nickname": "",
  "phone": "",
  "password": "",
  "confirmPassword": "",
  "gender": 0,
  "userType": 1,//1:普通用户 2:管理员
})
const submitFormRef = useTemplateRef('submitFormRef')
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' }
  ],
})
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        const res = await register(formData.value)
        const data = res?.data
        if (data?.code === 'BUSINESS_ERROR') {
          ElMessage.error(data.msg || '注册失败')
          return
        }
        ElMessage.success('注册成功!')
        router.push('/auth/login')
      } catch (err) {
        ElMessage.error(err.message || '注册失败')
      }
    } else {
      console.log('表单验证失败')
    }
  })
}
</script>

<style lang="scss" scoped>
.container {
  width: 384px;

  .flex-box {
    display: flex;
    align-items: center;
  }

  .title {
    .title-text {
      text-align: center;

      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }

      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }

  .form-container {
    margin-top: 20px;

    .btn {
      // margin-top: 40px;
      width: 100%;
    }

    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>