<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <div class="block-title">{{ $t('lang.BlockDetail') }}</div>
    <div class="blocks-data-wrap table list">
      <div style="width: 100%">
        <span>{{ $t('lang.BlockAccumulatorRoot') }}：</span>
        <span>{{ detail.block_accumulator_root }}</span>
        <el-icon v-if="detail.block_accumulator_root != null" @click="copy(detail.block_accumulator_root)">
          <DocumentCopy />
        </el-icon>
      </div>
      <div style="width: 100%">
        <span>{{ $t('lang.BlockHash') }}：</span>
        <span>{{ detail.block_hash }}</span>
        <el-icon v-if="detail.block_hash != null" @click="copy(detail.block_hash)">
          <DocumentCopy />
        </el-icon>
      </div>
      <div style="width: 100%">
        <span>{{ $t('lang.BodyHash') }}：</span>
        <span>{{ detail.body_hash }}</span>
        <el-icon v-if="detail.body_hash != null" @click="copy(detail.body_hash)">
          <DocumentCopy />
        </el-icon>
      </div>
      <div style="width: 100%">
        <span>{{ $t('lang.StateRoot') }}：</span>
        <span>{{ detail.state_root }}</span>
        <el-icon v-if="detail.state_root != null" @click="copy(detail.state_root)">
          <DocumentCopy />
        </el-icon>
      </div>
      <div style="width: 100%">
        <span>{{ $t('lang.TxnAccumulatorRoot') }}：</span>
        <span>{{ detail.txn_accumulator_root }}</span>
      </div>

      <div>
        <span>{{ $t('lang.Creator') }}：</span>
        <span>{{ detail.author }}</span>
        <el-icon v-if="detail.author != null" @click="copy(detail.author)">
          <DocumentCopy />
        </el-icon>
      </div>
      <div>
        <span>{{ $t('lang.ChainID') }}：</span>
        <span>{{ detail.chain_id }}</span>
      </div>
      <div>
        <span>{{ $t('lang.CreateAt') }}创建时间：</span>
        <span v-if="detail.create_at != null">{{ timestampToTime(detail.create_at) }}</span>
      </div>
      <div>
        <span>{{ $t('lang.Difficulty') }}：</span>
        <span>{{ detail.difficulty }}</span>
      </div>
      <div>
        <span>{{ $t('lang.Extra') }}：</span>
        <span>{{ detail.extra }}</span>
      </div>
      <div>
        <span>{{ $t('lang.FirstVersion') }}：</span>
        <span>{{ detail.first_version }}</span>
      </div>
      <div>
        <span>{{ $t('lang.GasUsed') }}：</span>
        <span>{{ detail.gas_used }}</span>
      </div>
      <div>
        <span>{{ $t('lang.Height') }}：</span>
        <span>{{ detail.height }}</span>
      </div>
      <div>
        <span>{{ $t('lang.LastVersion') }}</span>
        <span>{{ detail.last_version }}</span>
      </div>
      <div>
        <span>nonce</span>
        <span>{{ detail.nonce }}</span>
      </div>
      <div>
        <span>{{ $t('lang.ParentHash') }}</span>
        <span>{{ detail.parent_hash }}</span>
      </div>

      <div>
        <span>{{ $t('lang.Txns') }}</span>
        <span>{{ detail.transactions }}</span>
      </div>
    </div>
    <div class="table">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane :label="$t('lang.Transaction')" name="first">{{ total }} {{ $t('lang.Txns') }}</el-tab-pane>
        <!-- <el-tab-pane label="转账" name="second">Config</el-tab-pane> -->
      </el-tabs>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="global_index" :label="$t('lang.Index')" />
        <el-table-column prop="create_at" :label="$t('lang.CreateAt')">
          <template #default="scope">
            <span v-if="scope.row.create_at != null">{{ timestampToTime(scope.row.create_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="success" :label="$t('lang.IsSuccess')">
          <template #default="scope">
            {{ scope.row.success ? $t('lang.Yes') : $t('lang.No') }}
          </template>
        </el-table-column>
        <el-table-column prop="gas_used" :label="$t('lang.GasUsed')" />
        <el-table-column prop="txn_type" :label="$t('lang.TxnType')" />
        <el-table-column prop="txn_hash" :label="$t('lang.TxnHash')" :show-overflow-tooltip="true" width="300">
          <template #default="scope">
            <router-link :to="'/transactionDetail?hash=' + scope.row.txn_hash">
              {{ scope.row.txn_hash }}
            </router-link>
          </template>
        </el-table-column>
      </el-table>

      <div class="page">
        <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :disabled="disabled" :background="background" layout="prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
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
import { getBlockHeight, getBlockHash, getBlockTransaction } from '@/http/api/index.ts'
import { timestampToTimeLong } from '@/utils/public.ts'
import useClipboard from 'vue-clipboard3'

export default defineComponent({
  name: 'blocksDetail',
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
      activeName: ref('first'),
      currentPage: ref(1),
      pageSize: ref(20),
      total: ref(0),
      background: ref(false),
      disabled: ref(false),
      tableData: [],
      detail: ref({}),
      blockHeight: (height: any) => {
        getBlockHeight({ height: height })
          .then((res: any) => {
            console.log('heightDetail', res)
            data.detail = res
          })
          .catch((e) => {
            console.log(e)
          })
      },
      blockHash: (hash: any) => {
        getBlockHash({ id: hash })
          .then((res: any) => {
            console.log('hashDetail', res)
            data.detail = res
          })
          .catch((e) => {
            console.log(e)
          })
      },
      blockTransaction: (hash: any) => {
        getBlockTransaction({ hash: hash })
          .then((res: any) => {
            console.log('BlockTransaction', res)
            data.tableData = res.contents
            data.total = res.total
            data.loading = false
          })
          .catch((e) => {
            console.log(e)
          })
      },
      handleSizeChange: (val: number) => {
        console.log(`${val} items per page`)
      },
      handleCurrentChange: (val: number) => {
        console.log(`current page: ${val}`)
        data.loading = true
        data.currentPage = val
        data.blockTransaction(route.query.hash)
      },
      handleClick: (tab: TabsPaneContext, event: Event) => {
        console.log(tab, event)
      },
      timestampToTime: (time: number) => {
        return timestampToTimeLong(time)
      },
      copy: async (val) => {
        try {
          await toClipboard(val)
          ElMessage.success('copy success')
        } catch (e) {
          console.log(e)
          e.text == undefined ? ElMessage.error('copy failed') : ElMessage.error(e)
        }
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
      if (route.query.height != undefined) data.blockHeight(route.query.height)
      if (route.query.hash != undefined) {
        data.blockHash(route.query.hash)
        data.blockTransaction(route.query.hash)
      }
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

.list div {
  color: #464646;
  line-height: 45px;
  font-size: 14px;
  border-bottom: 1px dotted rgba(58, 58, 58, 0.3);
  width: 48%;
  /* display: flex;
  justify-content: space-between; */
}

.list div span:nth-child(1) {
  width: 150px;
}

.list div span:nth-child(2) {
  color: #73787b;
}
</style>
