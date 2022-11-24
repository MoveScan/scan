<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <div class="block-title" :style="isDark(store.switchDark)">{{ $t('lang.TransactionDetail') }}</div>
    <div class="blocks-data-wrap table list">
      <div>
        <span>{{ $t('lang.TxnHash') }}：</span>
        <span>{{ detail.txn_hash }}</span>
        <el-icon v-if="detail.txn_hash != null" @click="copy(detail.txn_hash)">
          <DocumentCopy />
        </el-icon>
      </div>
      <div>
        <span>{{ $t('lang.IsSuccess') }}：</span>
        <span>{{ detail.success ? $t('lang.Yes') : $t('lang.No') }}</span>
      </div>
      <div>
        <span>{{ $t('lang.TxnType') }}：</span>
        <span>{{ detail.txn_type }}</span>
      </div>
      <div>
        <span>{{ $t('lang.AccumulatorRootHash') }}：</span>
        <span>{{ detail.accumulator_root_hash }}</span>
        <el-icon v-if="detail.accumulator_root_hash != null" @click="copy(detail.accumulator_root_hash)">
          <DocumentCopy />
        </el-icon>
      </div>
      <div>
        <span>{{ $t('lang.BlockHash') }}：</span>
        <span>{{ detail.block_hash }}</span>
        <el-icon v-if="detail.block_hash != null" @click="copy(detail.block_hash)">
          <DocumentCopy />
        </el-icon>
      </div>
      <div>
        <span>{{ $t('lang.Block') + $t('lang.Height') }}：</span>
        <span>{{ detail.block_number }}</span>
      </div>
      <div>
        <span>{{ $t('lang.CreateAt') }}：</span>
        <span v-if="detail.create_at != null">{{ timestampToTime(detail.create_at) }}</span>
      </div>
      <div>
        <span>{{ $t('lang.EventRootHash') }}：</span>
        <span>{{ detail.event_root_hash }}</span>
        <el-icon v-if="detail.event_root_hash != null" @click="copy(detail.event_root_hash)">
          <DocumentCopy />
        </el-icon>
      </div>
      <div>
        <span>{{ $t('lang.GasUsed') }}：</span>
        <span>{{ detail.gas_used }}</span>
      </div>
      <div>
        <span>{{ $t('lang.GlobalIndex') }}：</span>
        <span>{{ detail.global_index }}</span>
      </div>
      <div>
        <span>{{ $t('lang.Payload') }}：</span>
        <!-- <span>{{ detail.payload }}</span> -->
        <span v-if="detail.payload != null" style="width: 90%">
          <json-viewer :value="detail.payload" :expand-depth="5" copyable boxed sort></json-viewer>
        </span>
      </div>
      <div>
        <span>{{ $t('lang.StateRoot') }}：</span>
        <span>{{ detail.state_root_hash }}</span>
        <el-icon v-if="detail.state_root_hash != null" @click="copy(detail.state_root_hash)">
          <DocumentCopy />
        </el-icon>
      </div>
      <div>
        <span>{{ $t('lang.VMState') }}：</span>
        <span>{{ detail.vm_status }}</span>
      </div>
    </div>
    <div v-if="['user_transaction', 'ScriptFunction', 'Script'].includes($route.query.txn_type)">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane :label="$t('lang.ResourceChanges')" name="first">
          <el-table :class="store.switchDark ? 'black' : 'white'" :data="detail.changes">
            <el-table-column prop="change_type" :label="$t('lang.ChangeType')" />
            <el-table-column prop="create_at" :label="$t('lang.CreateAt')">
              <template #default="scope">
                <span v-if="scope.row.create_at != null">{{ timestampToTime(scope.row.create_at) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" :label="$t('lang.Account')" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/accountDetail?address=' + scope.row.address" :style="isDark(store.switchDark)">
                  {{ scope.row.address }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column :label="$t('lang.StateKeyHash')" :show-overflow-tooltip="true">
              <template #default="scope">{{ scope.row.change_id.state_key_hash }}</template>
            </el-table-column>
            <el-table-column :label="$t('lang.TxnHash')" :show-overflow-tooltip="true">
              <template #default="scope">
                {{ scope.row.change_id.txn_hash }}
              </template>
            </el-table-column>

            <el-table-column type="expand" :label="$t('lang.ChangeData')" width="100">
              <template #default="props">
                <json-viewer :value="JSON.parse(props.row.change_data)" :expand-depth="5" copyable boxed sort></json-viewer>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="$t('lang.Event')" name="second">
          <el-table :class="store.switchDark ? 'black' : 'white'" :data="detail.events">
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="create_at" :label="$t('lang.CreateAt')">
              <template #default="scope">
                <span v-if="scope.row.create_at != null">{{ timestampToTime(scope.row.create_at) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" :label="$t('lang.Account') + $t('lang.Address')" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/accountDetail?address=' + scope.row.account_address" :style="isDark(store.switchDark)">
                  {{ scope.row.account_address }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="creation_number" :label="$t('lang.CreationNumber')" />
            <el-table-column prop="event_sequence_number" :label="$t('lang.EventSequenceNumber')" />
            <el-table-column prop="txn_hash" :label="$t('lang.TxnHash')" :show-overflow-tooltip="true">
              <template #default="scope">
                {{ scope.row.txn_hash }}
              </template>
            </el-table-column>
            <el-table-column prop="type_tag" :label="$t('lang.CoinID')" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/coinDetail?tag=' + scope.row.type_tag" :style="isDark(store.switchDark)">
                  {{ scope.row.type_tag }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column type="expand" :label="$t('lang.EventData')" width="100">
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
import { getTransactionHash, getTransactionAggregated } from '@/http/api/index.ts'
import { timestampToTimeLong, substring } from '@/utils/public.ts'
import { ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'
import { useStore } from '../store/store'

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
      store: useStore(),
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
  color: #959595;
  line-height: 45px;
  font-size: 14px;
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
