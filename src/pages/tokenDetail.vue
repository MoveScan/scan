<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <!-- <div style="display: flex">
      <img class="logo-img" src="https://static.tronscan.org/production/logo/usdtlogo.png" />
      <div class="block-title">
        Tether USD (USDT)
        <div class="overview-desc">USDT is the official stablecoin issued by Tether on the TRON network.</div>
      </div>
    </div> -->
    <div class="block-title">
      {{ detail.type_tag }}
      <el-icon @click="copy(detail.type_tag)"><DocumentCopy /></el-icon>
    </div>
    <br />
    <el-row>
      <el-col :span="8">
        <el-card class="list">
          <span class="title">概况</span>
          <!-- <div>
            <span style="font-size: 18px; font-weight: 700">$1.000035</span>
            <span>≈ 16.385058 TRX</span>
          </div> -->
          <div>
            <span>发行量：</span>
            <span>{{ detail.max_amount }}</span>
          </div>
          <div>
            <span>流通量：</span>
            <span>{{ detail.supply }}</span>
          </div>
          <div>
            <span>总市值：</span>
            <span></span>
          </div>
          <div>
            <span>流通市值：</span>
            <span></span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="list">
          <span class="title">基础信息</span>
          <div>
            <span>创建时间：</span>
            <span>{{ timestampToTime(detail.create_at) }}</span>
          </div>
          <div>
            <span>创建者：</span>
            <span>
              {{ detail.creator }}
              <el-icon @click="copy(detail.creator)"><DocumentCopy /></el-icon>
            </span>
          </div>
          <div>
            <span>持币地址数：</span>
            <span>{{ detail.holders }}</span>
          </div>
          <!-- <div>
            <span>最大发行量：</span>
            <span>{{ detail.max_amount }}</span>
          </div> -->
          <!-- <div>
            <span>供应量：</span>
            <span>{{ detail.supply }}</span>
          </div> -->
          <!-- <div>
            <span>通证标识：</span>
            <span>{{ detail.type_tag }}</span>
          </div> -->
        </el-card>
      </el-col>
      <el-col :span="8">
        <!-- <el-card class="list" style="margin-right: 0">
          <span class="title">更多</span>
          <div>
            <span>持有地址数：</span>
            <span>15,654,012 地址</span>
          </div>
          <div>
            <span>累计转账数：</span>
            <span>615,954,807 笔</span>
          </div>
          <div>
            <span>转账数 ( 24h )：</span>
            <span>1,388,819 笔</span>
          </div>
          <div>
            <span>交易额 ( 24h )：</span>
            <span>$52.57b</span>
          </div>
          <div>
            <span>流动性：</span>
            <span>$258.03m</span>
          </div>
        </el-card> -->
      </el-col>
    </el-row>

    <div class="table">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="通证持有者" name="second">
          <div class="">共{{ total }}个</div>
          <el-table :data="tableData" v-loading="loading">
            <el-table-column prop="address" label="账户" width="660">
              <template #default="scope">
                <router-link v-if="scope.row.address !== null" :to="'/accountDetail?address=' + scope.row.address">
                  {{ scope.row.address }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="数量" />
            <el-table-column prop="supply" label="供应量" />
          </el-table>
          <div class="page">
            <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :disabled="disabled" :background="background" layout="prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="通证转账" name="first">
          <div class="">共{{ total_ }}个</div>
          <el-table :data="tableData_" v-loading="loading_">
            <el-table-column prop="amount" label="数量" />
            <el-table-column prop="amount_value" label="数量值" />
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
            <el-table-column prop="type_tag" label="通证标识" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/tokenDetail?tag=' + scope.row.type_tag">
                  {{ scope.row.type_tag }}
                </router-link>
              </template>
            </el-table-column>

            <el-table-column prop="create_at" label="创建时间">
              <template #default="scope">
                {{ timestampToTime(scope.row.create_at) }}
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination v-model:currentPage="currentPage_" v-model:page-size="pageSize" :disabled="disabled" :background="background" layout="prev, pager, next, jumper" :total="total_" @size-change="handleSizeChange" @current-change="handleCurrentChange_" />
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="交易" name="second">交易</el-tab-pane> -->
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
import { getTokenInfo, getTokenHoldersList, getTransferListTag } from '@/http/api/index.ts'
import { timestampToTimeLong, substring } from '@/utils/public.ts'
import { ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'

export default defineComponent({
  name: 'token Detail',
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
      loading: ref(true),
      loading_: ref(true),
      currentPage: ref(1),
      currentPage_: ref(1),
      pageSize: ref(20),
      background: ref(false),
      disabled: ref(false),
      total: ref(0),
      total_: ref(0),
      detail: ref({}),
      activeName: ref('second'),
      tableData: [],
      tableData_: [],
      getTokenDetail: (tag: any) => {
        getTokenInfo({ tag: tag })
          .then((res: any) => {
            console.log('token Detail', res)
            data.detail = res
          })
          .catch((e) => {
            console.log(e)
          })
      },
      getTokenHolders: (tag: any) => {
        getTokenHoldersList({ type_tag: tag, page: data.currentPage, count: data.pageSize })
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
      getTransferList: (tag: any) => {
        getTransferListTag({ type_tag: tag, page: data.currentPage, count: data.pageSize })
          .then((res: any) => {
            console.log('TransferList', res)
            data.tableData_ = res.contents
            data.total_ = res.total
            data.loading_ = false
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
        data.getTokenHolders(route.query.tag)
      },
      handleCurrentChange_: (val: number) => {
        console.log(`current page: ${val}`)
        data.loading_ = true
        data.currentPage_ = val
        data.getTransferList(route.query.tag)
      },
      setSubstring: (str: any) => {
        return substring(str)
      },
      copy: async (val) => {
        try {
          await toClipboard(val)
          ElMessage.success('复制成功')
        } catch (e) {
          console.log(e)
          e.text == undefined ? ElMessage.error('复制失败') : ElMessage.error(e)
        }
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
      data.getTokenDetail(route.query.tag)
      data.getTokenHolders(route.query.tag)
      data.getTransferList(route.query.tag)
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
  color: #464646;
  line-height: 45px;
  border-bottom: 1px dotted rgba(58, 58, 58, 0.3);
  width: 100%;
  display: flex;
  justify-content: space-between;
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
