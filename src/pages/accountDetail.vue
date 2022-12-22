<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <div class="flex">
      <div class="block-title" :style="isDark(store.switchDark)">
        {{ $t('lang.Account') }}
        <div class="overview-desc">
          {{ detail.address }}
          <el-icon v-if="detail.address != null" @click="copy(detail.address)">
            <DocumentCopy />
          </el-icon>
        </div>
      </div>
      <div style="font-size: 14px" :style="isDark(store.switchDark)">
        {{ $t('lang.CreateAt') }}：
        <span v-if="detail.create_at != null">{{ timestampToTime(detail.create_at) }}</span>
      </div>
    </div>
    <br />
    <el-row>
      <el-col :span="12">
        <el-card class="list">
          <span class="title">{{ $t('lang.TotalAssets') }}</span>
          <!-- <div>
            <span style="font-size: 18px; font-weight: 700">$1.000035</span>
            <span>≈ 16.385058 TRX</span>
          </div> -->
          <div>
            <span>{{ $t('lang.AuthenticationKey') }}：</span>
            <span>{{ detail.authentication_key }}</span>
          </div>
          <div>
            <span>{{ $t('lang.CreateAt') }}：</span>
            <span v-if="detail.create_at != null">{{ timestampToTime(detail.create_at) }}</span>
          </div>
          <div>
            <span>{{ $t('lang.HoldAmount') }}：</span>
            <span>{{ detail.hold_amount }}</span>
          </div>
          <div>
            <span>{{ $t('lang.SequenceNumber') }}：</span>
            <span>{{ detail.sequence_number }}</span>
          </div>
          <!-- <div>
            <span>供应量：</span>
            <span>{{ detail.supply }}</span>
          </div> -->
        </el-card>
      </el-col>
      <el-col :span="12">
        <!-- <el-card style="margin-right: 0">
          <span class="title">钱包</span>
          <el-scrollbar height="365px">
            <div class="list_m">
              <div v-for="item in 10">
                <span>
                  SUN(SUN)
                  <br />
                  <span class="txt2">asdfasdfasdfadfad34wdsdss</span>
                </span>
                <span>
                  1.0002
                  <br />
                  <span class="txt2">≈ $1.00</span>
                </span>
              </div>
            </div>
          </el-scrollbar>
        </el-card> -->
      </el-col>
    </el-row>

    <div class="table" :style="store.switchDark ? 'background:#202020' : 'background:#f2f2f2'">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane :label="$t('lang.TransactionList')" name="transaction">
          <el-table :class="store.switchDark ? 'black' : 'white'" :data="tableData" v-loading="loading">
            <el-table-column prop="chainTime" :label="$t('lang.ChainTime')">
              <template #default="scope">
                {{ timestampToTime(scope.row.chainTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="sender" :label="$t('lang.Sender')" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/accountDetail?address=' + scope.row.sender" :style="isDark(store.switchDark)">
                  {{ scope.row.sender }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="txn_hash" :label="$t('lang.TxnHash')" :show-overflow-tooltip="true" width="300">
              <template #default="scope">
                <router-link :to="'/transactionDetail?hash=' + scope.row.txn_hash + '&txn_type=user_transaction'" :style="isDark(store.switchDark)">
                  {{ setSubstring(scope.row.txn_hash) }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column :label="$t('lang.SignType')">
              <template #default="props">{{ jsonParse(props.row.signature).type }}</template>
            </el-table-column>
            <el-table-column type="expand" :label="$t('lang.Signature')" width="100">
              <template #default="props">
                <json-viewer :value="JSON.parse(props.row.signature)" :expand-depth="5" copyable boxed sort></json-viewer>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :disabled="disabled" :background="background" layout="prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('lang.TransferList')" name="transfer">
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
        <el-tab-pane :label="$t('lang.ResourceList')" name="resources">
          <el-table :class="store.switchDark ? 'black' : 'white'" :data="tableData3" v-loading="loading">
            <el-table-column prop="key" :label="$t('lang.Key')" />
            <el-table-column prop="value" :label="$t('lang.Value')">
                <template v-if="network == 'aptos_mainnet' || network == 'aptos_testnet' || network == 'aptos_devnet'" #default="props">
                  <json-viewer :value="JSON.parse(props.row.value)" :expand-depth="5" copyable boxed sort></json-viewer>
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
import { getAddressInfo, getTransactionListAddress, getTransferListAddress, getAddressResources } from '@/http/api/index.ts'
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
      detail: ref({}),
      activeName: ref('transaction'),
      tableData: ref([]),
      tableData2: ref([]),
      tableData3: ref([]),
      network:  localStorage.getItem('network'),
      getAddress: (address: any) => {
        getAddressInfo({ address: address })
          .then((res: any) => {
            console.log('address Detail', res)
            data.detail = res
          })
          .catch((e) => {
            console.log(e)
          })
      },
      getTransactionList: (address: any) => {
        getTransactionListAddress({
          address: address,
          page: data.currentPage,
          count: data.pageSize,
          with_event: ''
        })
          .then((res: any) => {
            console.log('交易记录', res)
            data.tableData = res.contents
            data.total = res.total
            data.loading = false
          })
          .catch((e) => {
            console.log(e)
          })
      },
      getTransferList: (address: any) => {
        getTransferListAddress({
          address: address,
          page: data.currentPage,
          count: data.pageSize,
          query_type: ''
        })
          .then((res: any) => {
            console.log('转账记录', res)
            data.tableData2 = res.contents
          })
          .catch((e) => {
            console.log(e)
          })
      },
      getResources: (address: any) => {
        getAddressResources({
          address: address,
          page: data.currentPage,
          count: data.pageSize,
          query_type: ''
        })
          .then((res: any) => {
            console.log('资源列表', res)
            data.tableData3 = res
          })
          .catch((e) => {
            console.log(e)
          })
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
        // if (data.activeName == 'resources') data.getResources(route.query.address)
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
      if (network !== undefined) localStorage.setItem('network', network)
      data.getAddress(route.query.address)
      data.getTransactionList(route.query.address)
      data.getTransferList(route.query.address)
      data.getResources(route.query.address)
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

.demo-tabs > .el-tabs__content {
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
