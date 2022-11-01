<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="0"><img src="../assets/logo.png" class="logo" /></el-menu-item>
    <el-menu-item index="1">{{ $t('lang.Home') }}</el-menu-item>
    <el-sub-menu index="2">
      <template #title>{{ $t('lang.Blockchain') }}</template>
      <el-menu-item index="2-1">{{ $t('lang.Nodes') }}</el-menu-item>
      <el-menu-item index="2-2">{{ $t('lang.Block') }}</el-menu-item>
      <el-menu-item index="2-3">{{ $t('lang.Transaction') }}</el-menu-item>
      <el-menu-item index="2-4">{{ $t('lang.Transfer') }}</el-menu-item>
      <el-menu-item index="2-5">{{ $t('lang.Account') }}</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>{{ $t('lang.Contract') }}</template>
      <el-menu-item index="3-1">{{ $t('lang.Overview') }}</el-menu-item>
      <el-menu-item index="3-2">{{ $t('lang.Deployment') }}</el-menu-item>
      <el-menu-item index="3-3">{{ $t('lang.Verify') }}</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="4">{{ $t('lang.Coin') }}</el-menu-item>
    <el-menu-item index="5">{{ $t('lang.Data') }}</el-menu-item>
    <el-sub-menu index="6">
      <template #title>{{ $t('lang.More') }}</template>
      <el-menu-item index="6-1">{{ $t('lang.DevelopmentResources') }}</el-menu-item>
      <el-menu-item index="6-2">{{ $t('lang.Tools') }}</el-menu-item>
      <el-sub-menu index="6-3">
        <template #title>{{ $t('lang.Help') }}</template>
        <el-menu-item index="6-3-1">{{ $t('lang.FAQ') }}</el-menu-item>
        <!-- <el-menu-item index="6-3-2">item two</el-menu-item>
        <el-menu-item index="6-3-3">item three</el-menu-item> -->
      </el-sub-menu>
    </el-sub-menu>
    <!-- <el-sub-menu index="7">
      <template #title>{{ $t('lang.Network') }}</template>
      <el-sub-menu index="7-1">
        <template #title>{{ $t('lang.PrimaryNetwork') }}</template>
        <el-menu-item index="7-1-1">starcoin</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="7-2">
        <template #title>{{ $t('lang.TestNetwork') }}</template>
        <el-menu-item index="7-2-1">aptos</el-menu-item>
        <el-menu-item index="7-2-2">sui</el-menu-item>
      </el-sub-menu>
    </el-sub-menu> -->

    <div class="flex-grow">
      <div class="pd5">
        <el-dropdown style="margin: 20px">
          <span class="el-dropdown-link">
            {{ $t('lang.Language') }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changeLang('en')">English</el-dropdown-item>
              <el-dropdown-item @click="changeLang('zh')">中文</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="pd5">
        <el-switch v-model="isDark" :active-icon="Sunny" :inactive-icon="Moon" inline-prompt style="--el-switch-on-color: #f2f2f2; --el-switch-off-color: #75797e" />
      </div>
      <div class="pd5">
        <el-select v-model="value" :placeholder="$t('lang.Network')" @change="switchNetwork(value)" style="width: 150px">
          <el-option-group v-for="group in options" :key="group.label" :label="group.label">
            <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
          </el-option-group>
        </el-select>
      </div>
      <!-- <div class="pd5">
        <router-link to="/Login">{{ $t('lang.Login') }}</router-link>
      </div> -->
    </div>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowDown } from '@element-plus/icons-vue'
import { Moon, Sunny, Search } from '@element-plus/icons-vue'

// 主题
const isDark = useDark()
const toggleDark = useToggle(isDark)

const router = useRouter()
const activeIndex = ref(localStorage.getItem('activeIndex') == null ? '1' : localStorage.getItem('activeIndex'))
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(activeIndex, key, keyPath)
  localStorage.setItem('activeIndex', key)
  if (key == '1') router.push('/')
  if (key == '2-1') router.push('/node')
  if (key == '2-2') router.push('/blocks')
  if (key == '2-3') router.push('/transaction')
  if (key == '2-4') router.push('/transfer')
  if (key == '2-5') router.push('/account')
  if (key == '4') router.push('/coin')

  if (key == '5' || key == '3-1' || key == '3-2' || key == '3-3' || key == '6-1' || key == '6-2' || key == '6-3-1') router.push('/tips')
}

// 国际化
const { t, locale } = useI18n()
const changeLang = (lang: string) => {
  locale.value = lang
  localStorage.setItem('lang', lang)
}

// 切网
let value: any = localStorage.getItem('network') == null ? ref('') : localStorage.getItem('network')
const options = [
  {
    // label: 'Popular cities',
    options: [
      {
        value: 'aptos_mainnet',
        label: 'aptos mainnet'
      },
      {
        value: 'aptos_testnet',
        label: 'aptos testnet'
      },
      {
        value: 'aptos_devnet',
        label: 'aptos devnet'
      }
    ]
  },
  {
    // label: 'City name',
    options: [
      {
        value: 'starcoin_main',
        label: 'starcoin main'
      },
      {
        value: 'starcoin_barnard',
        label: 'starcoin barnard'
      },
      {
        value: 'starcoin_hally',
        label: 'starcoin hally'
      }
    ]
  }
]
const switchNetwork = (network: string) => {
  localStorage.setItem('network', network)
  value = network
  location.reload()
}
// console.log(t('lang.userName'))
</script>
<style>
.flex-grow {
  display: flex;
  line-height: 58px;
  position: absolute;
  right: 10px;
}
.el-switch.is-checked .el-switch__core {
  border-color: black;
  background-color: #666666;
}
.pd5 {
  margin: 0 15px;
}
.logo {
  width: 45px;
  margin: 5px;
  border-radius: 50%;
}
</style>
