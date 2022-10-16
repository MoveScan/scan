<script lang="ts" setup>
import { getMsg } from '@/http/api/login.ts'
import { getBlockHeight } from '@/http/api/index.ts'
import { useStore } from '@/store/store.ts'

const mainStore = useStore()

const updateName = () => {
  // $patch 修改 store 中的数据
  mainStore.$patch({
    name: '名称被修改了,nameLength也随之改变了'
  })
}

const getdata = () => {
  getMsg().then((res: any) => {
    console.log(res)
    console.log('测试')
  })
}
const getToken = () => {
  getBlockHeight({ height: '7937128' })
    .then((res: any) => {
      console.log(res)
      console.log('测试')
    })
    .catch((e) => {
      console.log(e)
    })
}
</script>
<template>
  <div class="main">
    <div>
      用户名:{{ mainStore.name }}
      <br />
      长度:{{ mainStore.nameLength }}
    </div>
    <hr />
    <el-button @click="updateName">修改store中的name</el-button>
    <!-- <el-button @click="()=>this.$router.push('/')">返回首页</el-button> -->
    <button @click="getToken">测试</button>
  </div>
</template>
<style scoped></style>
