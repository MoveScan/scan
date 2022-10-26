<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <div class="block-title">{{ $t('lang.Transfer') }}</div>

    <!-- <el-row>
      <el-col :span="12">
        <div class="blocks-data-wrap">
          <div class="blocks_overview blocks_list_overview">
            <div class="">
              <div class="card">
                <div class="card-body" id="txcont">
                  <h2 class="d-flex"><span>账户数</span></h2>
                  <div class="d-flex align-items-center">
                    <div class="d-flex flex-column">
                      <span class="num">
                        <span><a href="/">44540035</a></span>
                      </span>
                      <div class="d-flex" style="margin-top: 6px">
                        <span class="txt"><span>累计数</span></span>
                      </div>
                    </div>
                    <div class="d-flex flex-column">
                      <span class="num">
                        <span>
                          +
                          <span>28,786</span>
                        </span>
                      </span>
                      <div class="d-flex" style="margin-top: 6px">
                        <span class="txt"><span>昨日新增</span></span>
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
                <div class="card-body" id="tradingAmount">
                  <h2 class="d-flex justify-content-between">
                    <span class="d-flex"><span>转账额</span></span>
                    <a class="block-more" href="#">
                      <span>更多</span>
                      <i class="iconfont icon-more"></i>
                    </a>
                  </h2>
                  <div class="d-flex align-items-center">
                    <div class="d-flex flex-column">
                      <span class="num">
                        <span><a>6.02 b TRX</a></span>
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
                        <span class="txt"><span>累计数</span></span>
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
                        <span class="txt"><span>昨日新增</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card box">
          <div id="chart"></div>
        </div>
      </el-col>
    </el-row> -->

    <div class="table">
      <!-- <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="TRC720转账" name="first">TRC720转账</el-tab-pane>
        <el-tab-pane label="TRX & TRC转账" name="second">TRX & TRC转账</el-tab-pane>
        <el-tab-pane label="TRC1115转账" name="third">TRC1115转账</el-tab-pane>
      </el-tabs> -->

      <div>下面是区块列表，最新的10000条，每页20条</div>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="type_tag" label="通证标识" width="400" :show-overflow-tooltip="true">
          <template #default="scope">
            <router-link :to="'/coinDetail?tag=' + scope.row.type_tag">
              {{ scope.row.type_tag }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="数量" />
        <el-table-column prop="create_at" label="创建时间">
          <template #default="scope">
            {{ timestampToTime(scope.row.create_at) }}
          </template>
        </el-table-column>
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
import { EChartsOption, init } from 'echarts'
import Header from '../components/header.vue'
import Search from '../components/search.vue'
import Footer from '../components/footer.vue'
import { getTransferList } from '@/http/api/index.ts'
import { timestampToTimeLong, substring } from '@/utils/public.ts'

export default defineComponent({
  name: 'transfer',
  components: {
    Header,
    Search,
    Footer
  },
  setup() {
    const data = reactive({
      loading: ref(true),
      currentPage: ref(1),
      pageSize: ref(20),
      total: ref(0),
      background: ref(false),
      disabled: ref(false),
      tableData: [],
      getTransfer: () => {
        getTransferList({ page: data.currentPage, count: data.pageSize, query_type: '' })
          .then((res: any) => {
            console.log('transfer', res)
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
        data.getTransfer()
      },
      initChart() {
        // 获取dom，断言HTMLElement类型，否则会报错
        const chartEle: HTMLElement = document.getElementById('chart') as HTMLElement
        const chart = init(chartEle)
        const option: EChartsOption = {
          title: {
            text: '转账类型分部'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '30%',
            right: 'right'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
              ]
            }
          ]
        }
        option && chart.setOption(option)

        // 大小自适应窗口大小变化
        window.onresize = function () {
          chart.resize()
        }
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
      data.getTransfer()
      // data.initChart()
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

.table div:nth-child(1) {
  line-height: 40px;
  color: #ccc;
}

.blocks-data-wrap {
  /* display: flex; */
  margin-right: 20px;
  margin-bottom: 30px;
}

.blocks-data-wrap .blocks_overview {
  flex: 1 1;
  margin: 20px 0;
}

.blocks_overview:last-child {
  margin-right: 0;
}

.card {
  background: rgba(180, 180, 180, 0.05);
  border-radius: 10px;
}

.box {
  margin: 20px 0;
  height: 270px;
  padding: 15px;
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
  color: green;
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

/*  */
#chart {
  width: 100%;
  height: 270px;
}
</style>
