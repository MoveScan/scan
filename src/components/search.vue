<template>
  <div class="search" id="search">
    <div class="mt-4">
      <el-input v-model="input" size="large" :placeholder="$t('lang.SearchPlaceholder')" @keyup.enter.native="searchHash()" class="input-with-select" clearable @clear="clearSearch()" @focus="tipsTxt(true)" @blur="tipsTxt(false)">
        <template #append>
          <el-button type="primary" :style="store.switchDark ? 'background: #2ef1a7' : 'background: #715cff'" :icon="icon.sc" @click="searchHash()">{{ $t('lang.Search') }}</el-button>
        </template>
      </el-input>
      <div class="tips-txt"><span v-show="isTxt">Account Address / Txn Hash or Version / Block Height</span></div>

      <div class="sc-content" v-show="isShow">
        <div v-if="show.account">
          Account:
          <span v-if="dataAccount.address == 'No Data'">{{ dataAccount.address }}</span>
          <router-link v-else :to="'/accountDetail?address=' + dataAccount.address" :style="isDark(store.switchDark)">
            {{ setSubstring(dataAccount.address) }}
          </router-link>
        </div>
        <div v-if="show.blockHash">
          Block:
          <span v-if="dataBlock.block_hash == 'No Data'">{{ dataBlock.block_hash }}</span>
          <router-link v-else :to="'/blocksDetail?hash=' + dataBlock.block_hash" :style="isDark(store.switchDark)">
            {{ setSubstring(dataBlock.block_hash) }}
          </router-link>
        </div>
        <div v-if="show.blockHeight">
          Block:
          <span v-if="dataBlockHeight.height == 'No Data'">{{ dataBlockHeight.height }}</span>
          <router-link v-else :to="'/blocksDetail?height=' + dataBlockHeight.height" :style="isDark(store.switchDark)">{{ dataBlockHeight.height }}</router-link>
        </div>
        <div v-if="show.transaction">
          Transaction:
          <span v-if="dataTransaction.hash == 'No Data'">{{ dataTransaction.hash }}</span>
          <router-link v-else :to="'/transactionDetail?hash=' + dataTransaction.hash + '&txn_type=' + dataTransaction.txn_type" :style="isDark(store.switchDark)">
            {{ setSubstring(dataTransaction.hash) }}
          </router-link>
        </div>
      </div>
      <!-- <el-alert v-if="network == 'aptos_testnet'" :title="$t('lang.Tips')" type="warning" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { ref, toRefs, markRaw, reactive, defineComponent, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getAddressInfo, getBlockHash, getBlockHeight, getTransactionAggregated, getTransactionVersion } from '@/http/api/index.ts'
import { substring } from '@/utils/public.ts'
import { useI18n } from 'vue-i18n'
import { useStore } from '../store/store'

export default defineComponent({
  name: 'Search',
  setup() {
    const { t, locale } = useI18n()
    const data = reactive({
      store: useStore(),
      switchDark: '',
      show: ref({
        account: false,
        blockHash: false,
        blockHeight: false,
        transaction: false
      }),
      network: localStorage.getItem('network'),
      isTxt: ref(false),
      isShow: ref(true),
      dataAccount: ref({ address: 'No Data' }),
      dataBlock: ref({ block_hash: 'No Data' }),
      dataBlockHeight: ref({ height: 'No Data' }),
      dataTransaction: ref({ hash: 'No Data' }),
      dataVersion: ref({}),
      input: ref(''),
      icon: markRaw({
        sc: Search
      }),
      setSubstring: (str: any) => {
        if (str == undefined) {
          return
        } else {
          return substring(str)
        }
      },
      tipsTxt: (status: boolean) => {
        data.isTxt = status
        // data.isShow = status
      },
      searchHash: () => {
        data.isTxt = data.show.account = data.show.blockHash = data.show.blockHeight = data.show.transaction = false
        let hash = data.input
        if (hash == '') {
          data.isShow = false
          ElMessage.error('请输入搜索内容')
          return
        }
        data.isShow = true
        if (hash.length == 66) {
          // hash search
          data.account(hash)
          data.transaction(hash, false)
          data.block(hash)
        } else {
          // height search
          data.version(hash)
          data.height(hash)
        }
      },
      clearSearch: () => {
        data.input = ''
        data.isShow = false
      },
      account: (hash: any) => {
        getAddressInfo({ address: hash })
          .then((res: any) => {
            console.log('Aaccount', res)
            if (res == '' || res.status == 500 || res.status == 400 || res.status == 404) {
              data.show.account = true
              return
            }
            if (res !== '') {
              data.dataAccount = res
              data.show.account = true
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      block: (hash: any) => {
        getBlockHash({ id: hash })
          .then((res: any) => {
            console.log('Block', res.status)
            if (res == '' || res.status == 500 || res.status == 400 || res.status == 404) {
              data.show.blockHash = true
              return
            }
            if (res !== '') {
              data.dataBlock = res
              data.show.blockHash = true
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      height: (height: any) => {
        getBlockHeight({ height: height })
          .then((res: any) => {
            console.log('Block height', res)
            if (res == '' || res.status == 500 || res.status == 400 || res.status == 404) {
              data.show.blockHeight = true
              return
            }
            if (res !== '') {
              data.dataBlockHeight = res
              data.show.blockHeight = true
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      transaction: (hash: any, isNum: boolean) => {
        getTransactionAggregated({ hash: hash })
          .then((res: any) => {
            console.log('Transaction', res)
            if (res == '' || res.status == 500 || res.status == 400 || res.status == 404) {
              data.show.transaction = true
              return
            }
            if (res !== '') {
              res.hash = isNum ? hash : data.input // isNum: true是height version返hash, false是input框返hash
              data.dataTransaction = res
              data.show.transaction = true
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      version: (version: any) => {
        getTransactionVersion({ version: version })
          .then((res: any) => {
            console.log('version', res)
            data.dataVersion = res
            if (res.txn_hash != undefined) data.transaction(res.txn_hash, true)
          })
          .catch((e) => {
            console.log(e)
          })
      },
      closeSearchList: () => {
        document.addEventListener('click', (event) => {
          let box: any = document.getElementById('search')
          if (box.contains(event.target)) {
            // console.log('box内')
          } else {
            // console.log('box外')
            data.clearSearch()
          }
        })
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
      data.closeSearchList()
      if (data.network == 'aptos_testnet' || data.network == 'starcoin_barnard') ElMessage({ message: t('lang.Tips'), type: 'warning' })
    })

    return {
      ...refData
    }
  }
})
</script>
<style>
@media (min-width: 1200px) {
  .search {
    max-width: 1140px;
  }
}

@media (min-width: 1400px) {
  .search {
    max-width: 1370px;
  }
}
.search {
  margin: 0 auto;
  margin-bottom: 20px;
  line-height: 3rem;
  position: relative;
}

.tips-txt {
  font-size: 12px;
  color: #999;
  line-height: 1rem;
  height: 1rem;
}

.sc-content {
  background: rgb(247 247 247);
  width: 97.6%;
  border-radius: 10px;
  position: absolute;
  z-index: 1;
  top: 64px;
}

.sc-content div {
  margin: 0 15px;
}
.el-input-group__append {
  color: #fff;
}
.el-input-group__append button {
  height: -webkit-fill-available;
}
</style>
