<template>
  <div class="container search">
    <el-input
      v-model="input3"
      size="large"
      placeholder="Please input"
      class="input-with-select"
      clearable
    >
      <template #prepend>
        <el-button :icon="Search" />
      </template>
      <template #append>
        <el-select v-model="select" size="large" placeholder="Select" style="width: 115px">
          <el-option label="Restaurant" value="1" />
          <el-option label="Order No." value="2" />
          <el-option label="Tel" value="3" />
        </el-select>
      </template>
    </el-input>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const input3 = ref('')
const select = ref('')
</script>
<style>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
.search {
  margin-bottom: 20px;
}
.pd5 {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
