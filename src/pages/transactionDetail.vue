<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <div class="block-title">{{ $t('lang.TransactionDetail') }}</div>
    <div class="blocks-data-wrap table list">
      <div>
        <span>交易哈希：</span>
        <span>{{ detail.txn_hash }}</span>
        <el-icon @click="copy(detail.txn_hash)"><DocumentCopy /></el-icon>
      </div>
      <div>
        <span>是否成功：</span>
        <span>{{ detail.success ? '是' : '否' }}</span>
      </div>
      <div>
        <span>交易类型：</span>
        <span>{{ detail.txn_type }}</span>
      </div>
      <div>
        <span>累加器根哈希：</span>
        <span>{{ detail.accumulator_root_hash }}</span>
        <el-icon @click="copy(detail.accumulator_root_hash)"><DocumentCopy /></el-icon>
      </div>
      <div>
        <span>块哈希：</span>
        <span>{{ detail.block_hash }}</span>
        <el-icon @click="copy(detail.block_hash)"><DocumentCopy /></el-icon>
      </div>
      <div>
        <span>块高度：</span>
        <span>{{ detail.block_number }}</span>
      </div>
      <div>
        <span>创建时间：</span>
        <span>{{ timestampToTime(detail.create_at) }}</span>
      </div>
      <div>
        <span>事件根哈希：</span>
        <span>{{ detail.event_root_hash }}</span>
        <el-icon @click="copy(detail.event_root_hash)"><DocumentCopy /></el-icon>
      </div>
      <div>
        <span>GAS消耗量：</span>
        <span>{{ detail.gas_used }}</span>
      </div>
      <div>
        <span>全局索引号：</span>
        <span>{{ detail.global_index }}</span>
      </div>
      <div>
        <span>负载：</span>
        <!-- <span>{{ detail.payload }}</span> -->
        <span v-if="detail.payload != null" style="width: 90%">
          <json-viewer :value="detail.payload" :expand-depth="5" copyable boxed sort></json-viewer>
        </span>
      </div>
      <div>
        <span>状态根哈希：</span>
        <span>{{ detail.state_root_hash }}</span>
        <el-icon @click="copy(detail.state_root_hash)"><DocumentCopy /></el-icon>
      </div>
      <div>
        <span>虚拟机状态：</span>
        <span>{{ detail.vm_status }}</span>
      </div>
    </div>
    <div v-if="$route.query.txn_type == 'user_transaction'">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="资源变化" name="first">
          <el-table :data="detail.changes">
            <el-table-column prop="change_type" label="变化类型" />
            <el-table-column prop="create_at" label="创建时间">
              <template #default="scope">
                {{ timestampToTime(scope.row.create_at) }}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="账户" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/accountDetail?address=' + scope.row.address">
                  {{ scope.row.address }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="状态标记哈希" :show-overflow-tooltip="true">
              <template #default="scope">{{ scope.row.change_id.state_key_hash }}</template>
            </el-table-column>
            <el-table-column label="交易哈希" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/transactionDetail?hash=' + scope.row.change_id.txn_hash">
                  {{ scope.row.change_id.txn_hash }}
                </router-link>
              </template>
            </el-table-column>

            <el-table-column type="expand" label="变化数据" width="100">
              <template #default="props">
                <json-viewer :value="JSON.parse(props.row.change_data)" :expand-depth="5" copyable boxed sort></json-viewer>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="事件" name="second">
          <el-table :data="detail.events">
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="create_at" label="创建时间">
              <template #default="scope">
                {{ timestampToTime(scope.row.create_at) }}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="账户地址" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/accountDetail?address=' + scope.row.account_address">
                  {{ scope.row.account_address }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="creation_number" label="创建者序号" />
            <el-table-column prop="event_sequence_number" label="事件序列号" />
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
            <el-table-column type="expand" label="事件数据" width="100">
              <template #default="props">
                <json-viewer :value="JSON.parse(props.row.event_data)" :expand-depth="5" copyable boxed sort></json-viewer>
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
import Header from '../components/header.vue'
import Search from '../components/search.vue'
import Footer from '../components/footer.vue'
import {getTransactionAggregated } from '@/http/api/index.ts'
import { timestampToTimeLong, substring } from '@/utils/public.ts'
import { ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'
export default defineComponent({
  name: 'transactionHash',
  components: {
    Header,
    Search,
    Footer
  },
  setup() {
    interface Tree {
      label: string
      children?: Tree[]
    }

    const router = useRouter(),
      route = useRoute()
    const { toClipboard } = useClipboard()
    const data = reactive({
      activeName: ref('first'),
      tableData: ref([]),
      detail: ref({ payload: '' }),
      defaultProps: ref({
        children: 'children',
        label: 'label'
      }),
      // transactionHash: (hash: any) => {
      //   getTransactionHash({ hash: hash })
      //     .then((res: any) => {
      //       console.log('Hash', res)
      //       data.detail = res
      //     })
      //     .catch((e) => {
      //       console.log(e)
      //     })
      // },
      transactionAggregated: (hash: any) => {
        getTransactionAggregated({ hash: hash })
          .then((res: any) => {
            console.log('Aggregated', res)
            data.detail = res
            data.detail.payload = JSON.parse(res.payload)
          })
          .catch((e) => {
            console.log(e)
          })
      },
      timestampToTime: (time: number) => {
        return timestampToTimeLong(time)
      },
      handleNodeClick: (data: Tree) => {
        console.log(data)
      },
      handleClick: (tab: TabsPaneContext, event: Event) => {
        console.log(tab, event)
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
      // data.transactionHash(route.query.hash)
      data.transactionAggregated(route.query.hash)
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
  align-items: center;
  color: #464646;
  line-height: 45px;
  border-bottom: 1px dotted rgba(58, 58, 58, 0.3);
  width: 100%;
}

.list div span:nth-child(1) {
  width: 150px;
}

.list div span:nth-child(2) {
  color: #73787b;
}
</style>
