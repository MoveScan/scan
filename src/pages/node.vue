<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <!-- <el-row>
      <el-col :span="8">1</el-col>
      <el-col :span="8">2</el-col>
      <el-col :span="8">3</el-col>
    </el-row> -->
    <div class="block-title" :style="isDark(store.switchDark)">{{ $t('lang.Nodes') }}</div>
    <div class="blocks-data-wrap">
      <div class="blocks_overview blocks_list_overview">
        <div class="">
          <div class="card">
            <div class="card-body" id="txcont">
              <h2 class="d-flex">
                <span :style="isDark(store.switchDark)">{{ $t('lang.Amount') }}</span>
              </h2>
              <div class="d-flex align-items-center">
                <div class="d-flex flex-column">
                  <span class="num">
                    <span :style="isDark(store.switchDark)">{{ total }}</span>
                  </span>
                  <div class="d-flex" style="margin-top: 6px">
                    <span class="txt">
                      <span>{{ $t('lang.TheNewest') }}</span>
                    </span>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <!-- <span class="num">
                    <span>
                      +
                      <span>28,786</span>
                    </span>
                  </span>
                  <div class="d-flex" style="margin-top: 6px">
                    <span class="txt"><span>昨日出块数</span></span>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="blocks_overview blocks_list_overview">
        <div class="">
          <div class="card">
            <div class="card-body" id="tradingAmount">
              <h2 class="d-flex justify-content-between">
                <span class="d-flex"><span>节点收益</span></span>
                <a class="block-more" href="#">
                  <span>更多</span>
                  <i class="iconfont icon-more"></i>
                </a>
              </h2>
              <div class="d-flex align-items-center">
                <div class="d-flex flex-column">
                  <span class="num">
                    <span>
                      <span>
                        <span>6.02</span>
                        b
                      </span>
                      TRX
                    </span>
                  </span>
                  <div class="d-flex">
                    <span class="txt">
                      <span class="usdValue">
                        ≈$
                        <span>358,586,368.6</span>
                      </span>
                    </span>
                  </div>
                  <div class="d-flex">
                    <span class="txt"><span>累计节点收益</span></span>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <span class="num">
                    <span>
                      <span>5,066,336</span>
                      TRX
                    </span>
                  </span>
                  <div class="d-flex">
                    <span class="txt">
                      <span class="usdValue">
                        ≈$
                        <span>301,892.7</span>
                      </span>
                    </span>
                  </div>
                  <div class="d-flex">
                    <span class="txt"><span>昨日节点收益</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="blocks_overview blocks_list_overview">
        <div class="">
          <div class="card">
            <div class="card-body" id="burn">
              <h2 class="d-flex justify-content-between">
                <span>燃烧TRX统计</span>
                <a class="block-more" href="">
                  <span>更多</span>
                  <i class="iconfont icon-more"></i>
                </a>
              </h2>
              <div class="d-flex align-items-center">
                <div class="d-flex flex-column">
                  <span class="num">
                    <span>
                      <span>
                        <span>3.66</span>
                        b
                      </span>
                      TRX
                    </span>
                  </span>
                  <div class="d-flex">
                    <span class="txt">
                      <span class="usdValue">
                        ≈$
                        <span>218,318,705.22</span>
                      </span>
                    </span>
                  </div>
                  <div class="d-flex">
                    <span class="txt"><span>累计燃烧数</span></span>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <span class="num volumeNum">
                    <span>
                      <span>5,285,601</span>
                      TRX
                    </span>
                  </span>
                  <div class="d-flex">
                    <span class="txt">
                      <span class="usdValue">
                        ≈$
                        <span>314,958.29</span>
                      </span>
                    </span>
                  </div>
                  <div class="d-flex">
                    <span class="txt"><span>昨日燃烧数</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>

    <!-- 
      
     -->
    <div class="table" :style="store.switchDark ? 'background:#202020' : 'background:#f2f2f2'">
      <div>{{ $t('lang.LatestList') }}</div>
      <!-- {{ msg }} -->
      <el-table :class="store.switchDark ? 'black' : 'white'" :data="tableData" v-loading="loading">
        <el-table-column prop="name" :label="$t('lang.NodeName')" />
        <el-table-column prop="address" :label="$t('lang.Address')" :show-overflow-tooltip="true">
          <template #default="scope">
            <router-link :to="'/accountDetail?address=' + scope.row.address" :style="isDark(store.switchDark)">
              {{ setSubstring(scope.row.address) }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="voting_power" :label="$t('lang.VotingPower')" />
        <el-table-column prop="consensus_public_key" :label="$t('lang.ConsensusPubKey')" :show-overflow-tooltip="true">
          <template #default="scope">
            <el-tooltip class="box-item" effect="dark" :content="scope.row.consensus_public_key" placement="top">
              {{ setSubstring(scope.row.consensus_public_key) }}
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="node_address" :label="$t('lang.NodeAddress')" :show-overflow-tooltip="true">
          <template #default="scope">
            <el-tooltip class="box-item" effect="dark" :content="scope.row.node_address" placement="top">
              {{ setSubstring(scope.row.node_address) }}
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="network_address" :label="$t('lang.NetworkAddress')" :show-overflow-tooltip="true">
          <template #default="scope">
            <el-tooltip class="box-item" effect="dark" :content="scope.row.network_address" placement="top">
              {{ setSubstring(scope.row.network_address) }}
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :disabled="disabled" :background="background" layout="prev, pager, next, jumper" :total="total > 1000 ? 1000 : total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>
<script lang="ts">
import { ref, toRefs, reactive, defineComponent, onMounted } from 'vue'
import Header from '../components/header.vue'
import Search from '../components/search.vue'
import Footer from '../components/footer.vue'
import { getNodeList } from '@/http/api/index.ts'
import { timestampToTimeLong, substring } from '@/utils/public.ts'
import { useStore } from '../store/store'

export default defineComponent({
  name: 'Block',
  components: {
    Header,
    Search,
    Footer
  },
  setup() {
    const data = reactive({
      store: useStore(),
      loading: ref(true),
      currentPage: ref(1),
      pageSize: ref(20),
      total: ref(0),
      background: ref(false),
      disabled: ref(false),
      tableData: ref([]),
      getNode: () => {
        getNodeList({ page: data.currentPage, count: data.pageSize })
          .then((res: any) => {
            console.log('Node', res)
            data.tableData = res.contents
            data.total = res.total
            data.loading = false
          })
          .catch((e) => {
            console.log(e)
          })
      },

      timestampToTime: (time: number) => {
        return timestampToTimeLong(time)
      },
      setSubstring: (str: any) => {
        return substring(str)
      },
      handleSizeChange: (val: number) => {
        console.log(`${val} items per page`)
      },
      handleCurrentChange: (val: number) => {
        console.log(`current page: ${val}`)
        data.loading = true
        data.currentPage = val
        data.getNode()
      },
      isDark: (dark) => {
        return dark ? 'color:#2ef1a7' : 'color:#715cff'
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
      data.getNode()
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

.table div:nth-child(1) {
  line-height: 40px;
  color: #ccc;
}

.blocks-data-wrap {
  display: flex;
  margin-top: 20px;
  margin-bottom: 30px;
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

/*  */
.block-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 2rem;
  text-align: left;
}
</style>
