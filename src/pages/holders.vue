<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <div class="block-title" :style="isDark(store.switchDark)">{{ $t('lang.TopHolders') }}</div>
    <div class="table" :style="store.switchDark ? 'background:#202020' : 'background:#f2f2f2'">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane :label="$t('lang.PassHolder')" name="second">
          <div class="">total {{ total }}</div>
          <el-table :class="store.switchDark ? 'black' : 'white'" :data="tableData" v-loading="loading">
            <el-table-column prop="address" :label="$t('lang.Account')" width="660">
              <template #default="scope">
                <router-link v-if="scope.row.address !== null" :to="'/accountDetail?address=' + scope.row.address" :style="isDark(store.switchDark)">
                  {{ scope.row.address }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="amount" :label="$t('lang.Amount')" />
            <el-table-column prop="supply" :label="$t('lang.Proportion')">
              <template #default="scope">
                {{ ((scope.row.amount / 100000000000000000) * 100).toFixed(6) + '%' }}
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :disabled="disabled" :background="background" layout="prev, pager, next, jumper" :total="total > 1000 ? 1000 : total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <Footer></Footer>
</template>
<script lang="ts">
import { ref, toRefs, reactive, defineComponent, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { TabsPaneContext } from 'element-plus'
import Header from '../components/header.vue'
import Search from '../components/search.vue'
import Footer from '../components/footer.vue'
import { getCoinHoldersList } from '@/http/api/index.ts'
import { timestampToTimeLong, substring } from '@/utils/public.ts'
import { ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'
import { useStore } from '../store/store'

export default defineComponent({
  name: 'Coin Detail',
  components: {
    Header,
    Search,
    Footer
  },
  setup() {
    const router = useRouter(),
      route = useRoute()
    const { toClipboard } = useClipboard()
    const data = reactive({
      store: useStore(),
      loading: ref(true),
      currentPage: ref(1),
      pageSize: ref(20),
      background: ref(false),
      disabled: ref(false),
      total: ref(0),
      activeName: ref('second'),
      tableData: [],

      getCoinHolders: () => {
        const network = localStorage.getItem('network')
        const config = [
          { network: 'aptos_mainnet', tag: '0x1::aptos_coin::AptosCoin' },
          { network: 'aptos_testnet', tag: '0x1::aptos_coin::AptosCoin' },
          { network: 'aptos_devnet', tag: '0x1::aptos_coin::AptosCoin' },
          { network: 'starcoin_main', tag: '0x00000000000000000000000000000001::STC::STC' },
          { network: 'starcoin_barnard', tag: '0x00000000000000000000000000000001::STC::STC' },
          { network: 'starcoin_halley', tag: '0x00000000000000000000000000000001::STC::STC' }
        ]
        let tag = ''
        config.forEach((item) => {
          if (item.network == network) tag = item.tag
        })
        getCoinHoldersList({ coin_id: tag, page: data.currentPage, count: data.pageSize })
          .then((res: any) => {
            console.log('Holders', res)
            data.tableData = res.contents
            data.total = res.total
            data.loading = false
          })
          .catch((e) => {
            console.log(e)
          })
      },

      handleClick: (tab: TabsPaneContext, event: Event) => {
        console.log(tab, event)
      },
      timestampToTime: (time: number) => {
        return timestampToTimeLong(time)
      },
      handleSizeChange: (val: number) => {
        console.log(`${val} items per page`)
      },
      handleCurrentChange: (val: number) => {
        console.log(`current page: ${val}`)
        data.loading = true
        data.currentPage = val
        data.getCoinHolders()
      },

      setSubstring: (str: any) => {
        return substring(str)
      },
      copy: async (val) => {
        try {
          await toClipboard(val)
          ElMessage.success('copy success')
        } catch (e) {
          console.log(e)
          e.text == undefined ? ElMessage.error('copy failed') : ElMessage.error(e)
        }
      },
      isDark: (dark) => {
        return dark ? 'color:#2ef1a7' : 'color:#715cff'
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
      data.getCoinHolders()
    })

    return {
      ...refData
    }
  }
})
</script>
<style scoped>
.table {
  background: rgba(180, 180, 180, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-top: 20px;
}

.blocks-data-wrap {
  display: flex;
  margin-top: 20px;
  margin-bottom: 30px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.blocks-data-wrap .blocks_overview {
  flex: 1 1;
  margin-right: 20px;
}

.blocks_overview:last-child {
  margin-right: 0;
}

.card {
  word-wrap: break-word;
  background-clip: initial;
  border: 1px solid hsla(37, 25%, 83%, 0.75);
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
}

.card-body {
  flex: 1 1 auto;
  line-height: 22px;
  padding: 1.25rem;
  height: 100px;
}

.blocks-data-wrap h2 {
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  height: 1rem;
  line-height: 1rem;
  margin: 0 0 21px;
  overflow: hidden;
}

.justify-content-between {
  justify-content: space-between !important;
}

.align-items-center {
  align-items: center !important;
}

.flex-column {
  flex-direction: column !important;
}

.d-flex {
  display: flex !important;
  justify-content: space-between;
}

.num {
  font-size: 1.25rem !important;
  font-weight: bold;
}

.txt {
  color: #73787b;
  font-size: 14px;
  margin-right: 0;
  white-space: normal;
}

/*  */
.logo-img {
  border-radius: 50%;
  width: 60px;
  margin-right: 15px;
  vertical-align: middle;
}

.block-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 2rem;
  text-align: left;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.overview-desc {
  color: #73787b;
  font-size: 14px;
  font-weight: 400;
}

.list {
  margin-right: 20px;
  font-size: 12px;
}

.list .title {
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
}

.list div {
  color: #959595;
  line-height: 45px;
  font-size: 14px;
  border-bottom: 1px dotted rgba(58, 58, 58, 0.3);
  width: 100%;
  /* display: flex;
  justify-content: space-between; */
}

.list div span:nth-child(1) {
  width: 150px;
}

.list div span:nth-child(2) {
  color: #73787b;
}

.table div:nth-child(1) {
  line-height: 40px;
  color: #ccc;
}
</style>
