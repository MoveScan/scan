<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <div class="flex">
      <div class="block-title">
        账户
        <div class="overview-desc">{{ detail.address }}</div>
      </div>
      <div style="font-size: 14px">创建时间：{{ timestampToTime(detail.create_at) }}</div>
    </div>
    <br />
    <el-row>
      <el-col :span="12">
        <el-card class="list">
          <span class="title">总资产</span>
          <!-- <div>
            <span style="font-size: 18px; font-weight: 700">$1.000035</span>
            <span>≈ 16.385058 TRX</span>
          </div> -->
          <div>
            <span>认证密钥：</span>
            <span>{{ detail.authentication_key }}</span>
          </div>
          <div>
            <span>创建时间：</span>
            <span>{{ timestampToTime(detail.create_at) }}</span>
          </div>
          <div>
            <span>持币数量：</span>
            <span>{{ detail.hold_amount }}</span>
          </div>
          <div>
            <span>序列号：</span>
            <span>{{ detail.sequence_number }}</span>
          </div>
          <div>
            <span>供应量：</span>
            <span>{{ detail.supply }}</span>
          </div>
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

    <div class="table">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="交易记录" name="transaction">
          <el-table :data="tableData" v-loading="loading">
            <el-table-column prop="chainTime" label="链上时间">
              <template #default="scope">
                {{ timestampToTime(scope.row.chainTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="sender" label="发送者" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/accountDetail?address=' + scope.row.sender">
                  {{ scope.row.sender }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="txn_hash" label="交易哈希" :show-overflow-tooltip="true" width="300">
              <template #default="scope">
                <router-link :to="'/transactionDetail?hash=' + scope.row.txn_hash">
                  {{ setSubstring(scope.row.txn_hash) }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="类型">
              <template #default="props">{{ jsonParse(props.row.signature).type }}</template>
            </el-table-column>
            <el-table-column type="expand" label="签名" width="100">
              <template #default="props">
                <json-viewer :value="JSON.parse(props.row.signature)" :expand-depth="5" copyable boxed sort></json-viewer>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :disabled="disabled" :background="background" layout="prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="转账记录" name="transfer">
          <el-table :data="tableData2" v-loading="loading">
            <el-table-column prop="amount" label="数量" />
            <!-- <el-table-column prop="amount_value" label="数额" /> -->
            <el-table-column prop="create_at" label="创建时间">
              <template #default="scope">
                {{ timestampToTime(scope.row.create_at) }}
              </template>
            </el-table-column>
            <!-- <el-table-column prop="identifier" label="标识符" /> -->
            <el-table-column prop="sender" label="发送者" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/accountDetail?address=' + scope.row.sender">
                  {{ scope.row.sender }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="receiver" label="接收者" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/accountDetail?address=' + scope.row.receiver">
                  {{ scope.row.receiver }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="txn_hash" label="交易哈希" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/transactionDetail?hash=' + scope.row.txn_hash">
                  {{ scope.row.txn_hash }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="type_tag" label="通证标识" width="400" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/tokenDetail?tag=' + scope.row.type_tag">
                  {{ scope.row.type_tag }}
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="资源列表" name="resources">
          <el-table :data="tableData3" v-loading="loading">
            <el-table-column prop="key" label="键" />
            <el-table-column prop="value" label="值">
              <template #default="props">
                <json-viewer :value="JSON.parse(props.row.value)" :expand-depth="5" copyable boxed sort></json-viewer>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- <div>共100个交易，列表仅展示最新的10000条记录</div> -->
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
import { getAddressInfo, getTransactionListAddress, getTransferListAddress, getAddressResources } from '@/http/api/index.ts'
import { timestampToTimeLong, substring } from '@/utils/public.ts'

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
    const data = reactive({
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
      setSubstring: (str: number) => {
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
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
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
  margin-top: 30px;
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
  color: #73787b;
  font-size: 14px;
  font-weight: 400;
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
  color: #464646;
  line-height: 45px;
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
