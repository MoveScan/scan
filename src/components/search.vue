<template>
  <div class="container search">
    <div class="mt-4">
      <el-input v-model="input" size="large" placeholder="Please input" class="input-with-select">
        <template #append>
          <el-button :icon="Search" @click="searchHash()" />
        </template>
      </el-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getAddressInfo, getBlockHash, getTransactionAggregated } from '@/http/api/index.ts'

const input = ref('')

const accountAddress = (hash: any) => {
  debugger
  getAddressInfo({ hash: hash })
    .then((res: any) => {
      console.log('Aaccount', res)
    })
    .catch((e) => {
      console.log(e)
    })
}
const block = (hash: any) => {
  getBlockHash({ hash: hash })
    .then((res: any) => {
      console.log('Block', res)
    })
    .catch((e) => {
      console.log(e)
    })
}
const aggregated = (hash: any) => {
  getTransactionAggregated({ hash: hash })
    .then((res: any) => {
      console.log('Block', res)
    })
    .catch((e) => {
      console.log(e)
    })
}

const searchHash = () => {
  let hash = input.value
  debugger
  accountAddress(hash)
  block(hash)
  aggregated(hash)
}

onMounted(() => {})
</script>
<style>
.search {
  margin-bottom: 20px;
}
</style>
