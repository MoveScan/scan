<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <div class="flex">
      <div class="block-title">
        {{ $t('lang.Overview') }}
      </div>
    </div>
    <br />
    <div class="table" :style="store.switchDark ? 'background:#202020' : 'background:#f2f2f2'">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane :label="$t('lang.VerificationPassed')" name="transaction">
          <el-table :class="store.switchDark ? 'black' : 'white'" :data="tableData" v-loading="loading">
            <el-table-column prop="account" :label="$t('lang.Account')" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/contractDetail?address=' + scope.row.account" :style="isDark(store.switchDark)">
                  {{ scope.row.address }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="audit_info" label="审核信息" ></el-table-column>
            <el-table-column prop="audited" label="审计">
              <template #default="scope">
                {{ scope.row.audited ? $t('lang.Yes') : $t('lang.No') }}
              </template>
            </el-table-column>
            <!-- <el-table-column prop="modules" label="模块"></el-table-column> -->
            <el-table-column prop="create_at" label="创建时间"></el-table-column>
            <el-table-column prop="move_version" label="版本"></el-table-column>
          </el-table>
          <div class="page">
            <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :disabled="disabled"
              :background="background" layout="prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
              @current-change="handleCurrentChange" />
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('lang.All')" name="transfer">
          <el-table :class="store.switchDark ? 'black' : 'white'" :data="tableData2" v-loading="loading">
            <el-table-column prop="amount" :label="$t('lang.Amount')" />
            <!-- <el-table-column prop="amount_value" label="数额" /> -->
            <el-table-column prop="create_at" :label="$t('lang.CreateAt')">
              <template #default="scope">
                <span v-if="scope.row.create_at != null">{{ timestampToTime(scope.row.create_at) }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="identifier" label="标识符" /> -->
            <el-table-column prop="sender" :label="$t('lang.Sender')" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/accountDetail?address=' + scope.row.sender" :style="isDark(store.switchDark)">
                  {{ scope.row.sender }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="receiver" :label="$t('lang.Receiver')" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/accountDetail?address=' + scope.row.receiver" :style="isDark(store.switchDark)">
                  {{ scope.row.receiver }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="txn_hash" :label="$t('lang.TxnHash')" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/transactionDetail?hash=' + scope.row.txn_hash" :style="isDark(store.switchDark)">
                  {{ scope.row.txn_hash }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="type_tag" :label="$t('lang.CoinID')" width="400" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/coinDetail?tag=' + scope.row.type_tag" :style="isDark(store.switchDark)">
                  {{ scope.row.type_tag }}
                </router-link>
              </template>
            </el-table-column>
          </el-table>
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
import { ElMessage } from 'element-plus'
import Header from '../components/header.vue'
import Search from '../components/search.vue'
import Footer from '../components/footer.vue'
import { contractAddress, nftTokenList } from '@/http/api/index.ts'
import { timestampToTimeLong, substring } from '@/utils/public.ts'
import useClipboard from 'vue-clipboard3'
import { useStore } from '../store/store'

export default defineComponent({
  name: 'address Detail',
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
      total: ref(0),
      background: ref(false),
      disabled: ref(false),
      activeName: ref('transaction'),
      tableData: ref([]),
      tableData2: ref([]),
      getContractAddress: () => {
        // data.tableData = [
        //   { account: '0x67317139dd574d091549e67ba130f4ca8b374b4de57331bb47429656bff772e0',contractName:'合约' }
        // ]
        contractAddress({
          page: data.currentPage,
          count: data.pageSize,
        })
          .then((res: any) => {
            console.log('合约地址', res)
            data.tableData = res.contents
            // data.total = res.total
            data.loading = false
          })
          .catch((e) => {
            console.log(e)
          })
      },
      getTransferList: (address: any) => {

      },
      setSubstring: (str: any) => {
        return substring(str)
      },
      jsonParse(signature) {
        return JSON.parse(signature)
      },
      handleClick: (tab: TabsPaneContext, event: Event) => {
        // console.log(tab, event, data.activeName)
        console.log(data.activeName)
        // if (data.activeName == 'transaction') data.getTransactionList(route.query.address)
        // if (data.activeName == 'transfer') data.getTransferList(route.query.address)
      },
      timestampToTime: (time: number) => {
        return timestampToTimeLong(time)
      },
      handleSizeChange: (val: number) => {
        console.log(`${val} items per page`)
      },
      handleCurrentChange: (val: number) => {
        console.log(`current page: ${val}`)
        data.loading = false
        data.currentPage = val
        data.getTransactionList(route.query.address)
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
      let network: any = route.query.network
      console.log('其它网络', network)
      data.getContractAddress()
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
  background: rgba(180, 180, 180, 0.1);
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

.txt2 {
  color: #73787b;
  font-size: 12px;
}

.flex {
  display: flex;
  justify-content: space-between;
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

.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.overview-desc {
  font-size: 18px;
  font-weight: 700;
}

.list {
  margin-right: 20px;
  font-size: 14px;
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
  display: flex;
  justify-content: space-between;
}

.list div span:nth-child(2) {
  color: #73787b;
}

.list_m {
  margin-right: 20px;
  font-size: 14px;
}

.list_m .title {
  font-size: 18px;
  font-weight: 700;
  line-height: 18px;
}

.list_m div {
  padding: 8px 0;
  line-height: 14px;
  border-bottom: 1px dotted rgba(58, 58, 58, 0.3);
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
