<template>
  <Header />
  <div class="login">
    <!-- <img src="@/assets/logo.png" alt="" /> -->
    <el-input class="login-input" v-model="userName" placeholder="输入用户名" clearable />
    <el-input
      class="login-input"
      type="password"
      v-model="pwd"
      placeholder="输入密码"
      @keydown="(e:any)=>e.code === 'Enter'?login():''"
      clearable
    />
    <el-button @click="login()">点击登录,跳转首页</el-button>
  </div>
  <Footer />
</template>
<script lang="ts" setup>
import Header from '../../components/header.vue'
import Footer from '../../components/footer.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userName = ref('')
const pwd = ref('')

const login = () => {
  if (userName.value === 'admin' && pwd.value === 'admin') {
    ElMessage({ type: 'success', message: '登录成功' })
    router.push('/main')
  } else if (userName.value === '' && pwd.value === '') {
    ElMessage({ type: 'error', message: '请输入用户名和密码' })
  } else {
    ElMessage({ type: 'error', message: '用户名或密码输入错误' })
  }

  return {
    userName: userName.value,
    pwd: pwd.value
  }
}
</script>
<style scoped>
.login {
  margin: 0 auto;
  width: 300px;
  height: 800px;
}

.login-input {
  width: 200px;
  margin: 10px;
}
</style>
