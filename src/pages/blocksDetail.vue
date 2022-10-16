<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <div class="block-title">{{ $t('lang.BlockDetail') }}</div>
    <div class="blocks-data-wrap table list">
      <div>
        <span>创建者：</span>
        <span>{{ detail.author }}</span>
      </div>
      <div>
        <span>累加器根哈希：</span>
        <span>{{ detail.block_accumulator_root }}</span>
      </div>
      <div>
        <span>块哈希：</span>
        <span>{{ detail.block_hash }}</span>
      </div>
      <div>
        <span>块体哈希：</span>
        <span>{{ detail.body_hash }}</span>
      </div>
      <div>
        <span>链标识：</span>
        <span>{{ detail.chain_id }}</span>
      </div>
      <div>
        <span>创建时间：</span>
        <span>{{ timestampToTime(detail.create_at) }}</span>
      </div>
      <div>
        <span>难度：</span>
        <span>{{ detail.difficulty }}</span>
      </div>
      <div>
        <span>扩展信息：</span>
        <span>{{ detail.extra }}</span>
      </div>
      <div>
        <span>首版本：</span>
        <span>{{ detail.first_version }}</span>
      </div>
      <div>
        <span>GAS消耗量：</span>
        <span>{{ detail.gas_used }}</span>
      </div>
      <div>
        <span>高度：</span>
        <span>{{ detail.height }}</span>
      </div>
      <div>
        <span>最新版本</span>
        <span>{{ detail.last_version }}</span>
      </div>
      <div>
        <span>nonce</span>
        <span>{{ detail.nonce }}</span>
      </div>
      <div>
        <span>父块哈希</span>
        <span>{{ detail.parent_hash }}</span>
      </div>
      <div>
        <span>状态根哈希</span>
        <span>{{ detail.state_root }}</span>
      </div>
      <div>
        <span>交易数</span>
        <span>{{ detail.transactions }}</span>
      </div>
      <div>
        <span>交易累加器根哈希</span>
        <span>{{ detail.txn_accumulator_root }}</span>
      </div>
    </div>
    <div class="table">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="交易" name="first">共{{ total }}个交易</el-tab-pane>
        <!-- <el-tab-pane label="转账" name="second">Config</el-tab-pane> -->
      </el-tabs>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="create_at" label="创建时间">
          <template #default="scope">
            {{ timestampToTime(scope.row.create_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="gas_used" label="GAS消耗量" />
        <el-table-column prop="global_index" label="全局索引号" />
        <el-table-column prop="success" label="是否成功">
          <template #default="scope">
            {{ scope.row.success ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="transaction_type" label="交易类型" />
        <el-table-column prop="txn_hash" label="交易哈希" width="550" />
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
import Header from '../components/header.vue'
import Search from '../components/search.vue'
import Footer from '../components/footer.vue'
import { getBlockHeight, getBlockHash, getBlockTransaction } from '@/http/api/index.ts'
import { timestampToTimeLong } from '@/utils/public.ts'

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
  display: flex;
  color: #464646;
  line-height: 45px;
  border-bottom: 1px dotted rgba(58, 58, 58, 0.3);
  width: 48%;
  justify-content: space-between;
}

.list div span:nth-child(1) {
  width: 150px;
}

.list div span:nth-child(2) {
  color: #73787b;
}
</style>
