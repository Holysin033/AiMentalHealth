<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <span>&#8592; 返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账号</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form :model="formData" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input v-model="formData.username" placeholder="请输入账号" size="large" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" show-password clearable type="password" />
        </el-form-item>
        <el-button class="btn" type="primary" size="large" @click="submitForm(formRef)">登录</el-button>

      </el-form>
      <div class="footer">
        <p>还没有账号？<router-link to="/auth/register">去注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup name="Login">
import { reactive, ref, useTemplateRef } from 'vue'
import { login } from '@/api/admin'
import { useRouter } from 'vue-router'

const router = useRouter()
// const formRef = useTemplateRef("formRef");
const formRef = ref(null)
const formData = reactive({
  username: '',
  password: ''
})
const rules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})
// 登录
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('表单验证通过', fields)
      login(formData).then(data => {
        const { token, userInfo } = data
        // 判断有无返回token
        if (token) {
          // 登录成功，保存token和userInfo信息
          ElMessage.success('登录成功')
          localStorage.setItem('token', token)
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          // 判断角色类型
          if (userInfo.userType === 2 && userInfo.userTypeDisplayName === '管理员') {
            router.push('/back/knowledge')
          }
        }
        else {
          alert('没有账号，请先注册')
        }
      }).catch(() => {
        ElMessage.error('登录失败')
      })
    } else {
      console.log('表单验证失败', fields)
    }
  })
}
</script>

<style lang="scss" scoped>
.container {
  width: 384px;

  .title {
    .back-home {
      margin-bottom: 60px;
      cursor: pointer;
    }

    .title-text {
      text-align: center;
      margin-bottom: 60px;

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
    margin-top: 30px;

    .btn {
      margin-top: 40px;
      width: 100%;
    }

    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>