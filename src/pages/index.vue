<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <div class="total">
      <div>
        <a :class="isBar(store.switchDark)"></a>
        <h3 :style="isDark(store.switchDark)">{{ summary.total_blocks }}</h3>
        <span>{{ $t('lang.TotalBlocks') }}</span>
      </div>
      <div>
        <a :class="isBar(store.switchDark)"></a>
        <h3 :style="isDark(store.switchDark)">{{ summary.total_accounts }}</h3>
        <span>{{ $t('lang.TotalAccounts') }}</span>
      </div>
      <div>
        <a :class="isBar(store.switchDark)"></a>
        <h3 :style="isDark(store.switchDark)">{{ summary.total_txns }}</h3>
        <span>{{ $t('lang.TotalTxns') }}</span>
      </div>
      <div>
        <a :class="isBar(store.switchDark)"></a>
        <h3 :style="isDark(store.switchDark)">{{ summary.total_transfers }}</h3>
        <span>{{ $t('lang.TotalTransfers') }}</span>
      </div>
    </div>

    <div class="home-block-wrap">
      <div class="block-title" :style="isDark(store.switchDark)">
        <div class="block-title-left" :style="store.switchDark ? 'background: url('+setImgUrl('img_2.png')+') center no-repeat' : 'background: url('+setImgUrl('img_1.png')+') center no-repeat'">
          <a href="/blocks" :style="isDark(store.switchDark)">
            <span>{{ $t('lang.Blocks') }}</span>
          </a>
        </div>
      </div>

      <div class="block text-center">
        <el-carousel height="350px">
          <el-carousel-item class="block-box">
            <div :class="store.switchDark ? 'box' : 'box2'" v-for="(item, index) in blockData.slice(0, 5)" :key="index" @click="gotoBlock(item.height, item.block_hash)">
              <p class="txt1" :style="isDark(store.switchDark)">{{ $t('lang.Height') }}：{{ item.height }}</p>
              <p class="txt2">{{ $t('lang.BlockHash') }}</p>
              <p class="txt3">{{ $t('lang.Txns') }}：{{ item.transactions }}</p>
              <p class="txt3">{{ $t('lang.GasUsed') }}：{{ item.gas_used }}</p>
              <p class="txt4">{{ timestampToTime(item.create_at) }}</p>
            </div>
          </el-carousel-item>
          <el-carousel-item class="block-box">
            <div :class="store.switchDark ? 'box' : 'box2'" v-for="(item, index) in blockData.slice(5, 10)" :key="index" @click="gotoBlock(item.height, item.block_hash)">
              <p class="txt1" :style="isDark(store.switchDark)">{{ $t('lang.Height') }}：{{ item.height }}</p>
              <p class="txt2">{{ $t('lang.BlockHash') }}</p>
              <p class="txt3">{{ $t('lang.Txns') }}：{{ item.transactions }}</p>
              <p class="txt3">{{ $t('lang.GasUsed') }}：{{ item.gas_used }}</p>
              <p class="txt4">{{ timestampToTime(item.create_at) }}</p>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <div class="home-block-wrap" :style="store.switchDark ? 'margin: 20px 0; background: #222; border-radius: 20px' : ''">
      <div class="block-title" :style="isDark(store.switchDark)">
        <div class="block-title-left" :style="store.switchDark ? 'background: url('+setImgUrl('img_2.png')+') center no-repeat' : 'background: url('+setImgUrl('img_1.png')+') center no-repeat'">
          <a href="/blocks" :style="isDark(store.switchDark)">
            <span>{{ $t('lang.TransactionDisplay') }}</span>
          </a>
        </div>
      </div>

      <el-row>
        <el-col :span="24">
          <el-scrollbar height="500px" style="border-radius: 10px">
            <el-table :class="store.switchDark ? 'black' : 'white'" :data="transactionData" v-loading="loading">
              <el-table-column prop="txn_hash" :label="$t('lang.TxnHash')" :show-overflow-tooltip="true" width="300">
                <template #default="scope">
                  <router-link :to="'/transactionDetail?hash=' + scope.row.txn_hash + '&txn_type=' + scope.row.txn_type" :style="isDark(store.switchDark)">
                    {{ setSubstring(scope.row.txn_hash) }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column prop="gas_used" :label="$t('lang.GasUsed')"></el-table-column>
              <el-table-column prop="success" :label="$t('lang.IsSuccess')">
                <template #default="scope">
                  {{ scope.row.success ? $t('lang.Yes') : $t('lang.No') }}
                </template>
              </el-table-column>
              <el-table-column prop="create_at" :label="$t('lang.CreateAt')">
                <template #default="scope">
                  <span v-if="scope.row.create_at != null">{{ timestampToTime(scope.row.create_at) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="global_index" :label="$t('lang.GlobalIndex')"></el-table-column>
              <el-table-column prop="txn_type" :label="$t('lang.TxnType')"></el-table-column>
            </el-table>
          </el-scrollbar>
        </el-col>
      </el-row>
    </div>
  </div>
  <Footer></Footer>
</template>

<script lang="ts">
import { ref, toRefs, reactive, defineComponent, onMounted } from 'vue'
import { EChartsOption, init } from 'echarts'
import { useRouter } from 'vue-router'
import Header from '../components/header.vue'
import Search from '../components/search.vue'
import Footer from '../components/footer.vue'
import { getBlockListStartHeight, getTransactionList, getChainSummary } from '@/http/api/index.ts'
import { timestampToTimeLong, substring, getAssetsFile } from '@/utils/public.ts'
import { ElLoading } from 'element-plus'
import { useStore } from '../store/store'

export default defineComponent({
  name: 'Token',
  components: {
    Header,
    Search,
    Footer
  },
  setup() {
    const router = useRouter()
    const data = reactive({
      store: useStore(),
      loading: ref(true),
      currentPage: ref(1),
      pageSize: ref(10),
      total: ref(0),
      background: ref(false),
      disabled: ref(false),
      blockData: ref([]),
      transactionData: ref([]),
      summary: ref({}),
      getBlock: () => {
        getBlockListStartHeight({ page: data.currentPage, count: data.pageSize })
          .then((res: any) => {
            console.log('Block', res)
            data.blockData = res.contents
          })
          .catch((e: any) => {
            console.log(e)
          })
      },
      getTransaction: () => {
        getTransactionList({ page: data.currentPage, count: data.pageSize, start: 0, txn_type: '' })
          .then((res: any) => {
            console.log('transaction', res)
            data.transactionData = res.contents
            data.loading = false
          })
          .catch((e: any) => {
            console.log(e)
          })
      },
      chainSummary: () => {
        getChainSummary({})
          .then((res: any) => {
            console.log('Summary', res)
            data.summary = res
          })
          .catch((e: any) => {
            console.log(e)
          })
      },
      timestampToTime: (time: number) => {
        return timestampToTimeLong(time)
      },
      setSubstring: (str: any) => {
        return substring(str)
      },
      initChart: () => {
        // 获取dom，断言HTMLElement类型，否则会报错
        const chartEle: HTMLElement = document.getElementById('chart') as HTMLElement
        const chart = init(chartEle)
        const option: EChartsOption = {
          title: {
            text: '每日交易数(14天)'
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              interval: 0, //坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
              rotate: 38 //调整数值改变倾斜的幅度（范围-90到90）
            },
            data: ['09/12', '09/13', '09/14', '09/15', '09/16', '09/17', '09/18', '09/19', '09/20', '09/21', '09/22', '09/23', '09/24', '09/25']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [150, 230, 224, 218, 135, 147, 260, 150, 230, 224, 218, 135, 147, 260],
              type: 'line',
              smooth: true
            }
          ]
        }
        option && chart.setOption(option)

        // 大小自适应窗口大小变化
        window.onresize = function () {
          chart.resize()
        }
      },
      gotoBlock: (height: string, hash: string) => {
        router.push('/blocksDetail?height=' + height + '&hash=' + hash)
      },
      gotoTransaction: (hash: string, type: string) => {
        router.push('/transactionDetail?hash=' + hash + '&txn_type=' + type)
      },
      isPageLoad: () => {
        console.log('111')
        document.onreadystatechange = () => {
          if (document.readyState == 'complete') {
            alert('2')
          } else {
            alert('1')
          }
        }
      },
      isDark: (dark) => {
        return dark ? 'color:#2ef1a7' : 'color:#715cff'
      },
      isBar: (dark) => {
        return dark ? 'bar1' : 'bar2'
      },
      setImgUrl: (url)=>{
        return getAssetsFile(url)
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
      data.chainSummary()
      data.getBlock()
      data.getTransaction()
    })

    return {
      ...refData
    }
  }
})
</script>
<style scoped>
.box-card {
  margin-right: 15px;
  height: 282px;
  background: rgba(180, 180, 180, 0.05);
}
.el-row {
  margin: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

/*  */
.home-block-wrap {
  color: #101010;
  overflow: hidden;
}

.block-title {
  color: #101010;
  font-size: 30px;
  font-weight: 700;
  line-height: 4rem;
  margin: 16px 0 13px;
}

.block-title a {
  text-decoration: none;
}

.block-title-left {
  align-items: center;
  display: flex;
  justify-content: space-around;
  background-size: 300px;
}

.block-more {
  align-items: center;
  color: #616568;
  display: flex;
  font-size: 0.875rem;
  font-weight: 400;
  transition: none;
}

/*  */
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.block-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #91979d;
}

.block-box:hover {
  cursor: pointer;
}

.block-box div {
  border-radius: 20px;
  background: rgba(180, 180, 180, 0.1);
  height: 260px;
  width: 212px;
  padding: 15px;
}
.block-box div:nth-child(2n) {
  margin-top: 40px;
}
.box {
  text-align: center;
}
.box:hover {
  color: #fff;
  background: linear-gradient(#111b19, #2ef1a6);
  transform: scale(1.01);
}
.box2 {
  text-align: center;
}
.box2:hover {
  color: #fff;
  background: linear-gradient(#f2f2f2, #715cff);
  transform: scale(1.01);
}

.txt1 {
  color: #2ef1a6;
  font-size: 22px;
  margin-top: 20px;
}
.txt2 {
  font-size: 23px;
  margin-bottom: 40px;
}
.txt3 {
  font-size: 15px;
}
.txt4 {
  font-size: 11px;
}
.box ul {
  font-size: 0.75rem;
  line-height: 1.3rem;
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-between;
}

.block-number {
  font-size: 1rem;
  font-weight: bold;
}

.block-detail {
}

.gray-time {
  font-size: 14px;
}

.can {
  background: rgba(170, 170, 170, 0.2);
  padding: 3px;
  border-radius: 3px;
}

.can:hover {
  color: #f1f1f1;
  background: rgb(97, 97, 97);
}

/*  */
.mainnet-data {
  padding: 0 20px;
}

.card-body {
  position: relative;
}

.pb-0,
.py-0 {
  padding-bottom: 0 !important;
}

.pt-0,
.py-0 {
  padding-top: 0 !important;
}

.m-0 {
  margin: 0 !important;
}

.card-body {
  flex: 1 1 auto;
  min-height: 1px;
  padding: 1.25rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -15px;
  margin-right: -15px;
}

.mainnet-data .data-item {
  border-bottom: 1px solid rgb(100 100 100 / 12%);
  box-sizing: border-box;
  height: 97px;
  padding: 26px 0;
}

.ant-col-xs-12 {
  display: block;
  flex: 0 0 50%;
  max-width: 50%;
}

.ant-col {
  max-width: 100%;
  min-height: 1px;
  position: relative;
}

.mainnet-data .data-item:nth-child(odd) > a {
  position: relative;
}

.mainnet-data .data-item > a {
  color: #91979d;
  display: flex;
  justify-content: space-between;
  padding-right: 20px;
}

.home-stats a {
  color: #fff;
  text-decoration: none;
}

.mainnet-data .data-item > a .data-item-left {
  display: flex;
}

.mainnet-data .data-item:nth-child(2n) > a img {
  margin-left: 20px px;
}

.mainnet-data .data-item > a img {
  height: 40px;
  margin-right: 18px;
  margin-top: 5px;
  width: 40px;
}

img,
svg {
  vertical-align: middle;
}

.mainnet-data .data-item > a .data-item-left .data-item-center {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mainnet-data .data-item > a .panel-title {
  font-family: Lato;
  font-size: 14px;
  margin-bottom: 4px !important;
  text-align: left;
}

.m-0 {
  margin: 0 !important;
}

.mainnet-data .data-item > a .panel-title {
  font-family: Lato;
  font-size: 14px;
  margin-bottom: 4px !important;
}

.mainnet-data .data-item > a .data-item-right .right-24h {
  color: #91979d;
  margin-bottom: 4px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}

.mainnet-data .data-item > a .data-item-left .data-item-center h2 {
  color: #616568;
  white-space: nowrap;
}

.mainnet-data .data-item > a .data-item-left h2 {
  font-family: Lato;
  font-size: 20px;
  font-weight: 700;
  margin-top: 4px;
}

.mainnet-data .data-item:nth-child(odd) > a:after {
  border-right: 1px dashed #e0e4e8;
  bottom: 0;
  content: '';
  height: 36px;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  width: 1px;
}

.mainnet-data .data-item > a .data-item-left {
  display: flex;
}

.mainnet-data .data-item:nth-child(2n) > a img {
  margin-left: 20px;
}

.mainnet-data .data-item > a img {
  height: 40px;
  margin-right: 18px;
  margin-top: 5px;
  width: 40px;
}

.ant-col-lg-12 {
  display: block;
  flex: 0 0 50%;
  max-width: 50%;
}

.mainnet-data .data-item > a .data-item-right .green {
  color: #2d912c;
}

.mainnet-data .data-item > a .data-item-right .right-24h {
  color: #91979d;
  margin-bottom: 4px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mainnet-data .data-item > a .data-item-left .data-item-center {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.red {
  color: #c23631;
}

.green {
  color: #2d912c;
}

/*  */
.trxgroup-left-content {
  padding: 0;
}

.market-item {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
}

.market-item-left {
  display: flex;
}

.market-item-left img {
  margin-right: 14px;
  width: 30px;
}

.market-item-center {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.trxgroup-left-title {
  color: #91979d;
  font-size: 12px;
  margin-bottom: 6px;
  text-align: left;
}

.trxgroup-left-number {
  font-family: Lato;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
}

.trxgroup-left-number:last-child {
  margin-bottom: 0;
}

p {
  margin-bottom: 1rem;
  margin-top: 0;
}

/* transaction */
.transaction {
  color: #91979d;
  font-size: 0.8rem;
  line-height: 2rem;
  background: rgba(180, 180, 180, 0.05);
  border-radius: 10px;
  padding: 10px;
}

.transaction ul {
  margin: 0;
  padding: 0;
}

.transaction ul li {
  list-style: none;
  margin: 0;
  padding: 15px 10px;
}

.transaction ul li {
  height: auto;
}

.transaction ul li:hover {
  background: rgba(160, 160, 160, 0.1);
  cursor: pointer;
}

.record {
  text-align: left;
  display: flex;
  justify-content: space-between;
}

.record div:nth-child(3) {
  text-align: right;
}

/*  */
#chart {
  width: 100%;
  height: 360px;
  padding: 20px;
}

.el-icon {
  margin: 0 15px;
  font-size: 48px;
}

.total {
  display: flex;
  justify-content: space-between;
}
.total div {
  width: 242px;
  height: 242px;
  text-align: center;
  background: rgba(180, 180, 180, 0.1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}
.bar1{ 
  display: block; width: 25%;  height: 4px; background: #2ef1a7;
  opacity: 0.5;
  border-radius: 4px;
  position: absolute;
  top: 0;
  left: 37.5%;
}
.bar2{ 
  display: block; width: 25%;  height: 4px; background: #715cff;
  opacity: 0.5;
  border-radius: 4px;
  position: absolute;
  top: 0;
  left: 37.5%;
}
.total div:hover {
  cursor: pointer;
  background: rgba(180, 180, 180, 0.2);
}
.total h3 {
  font-size: 35px;
}
.total span {
  color: #808080;
  font-size: 22px;
}
</style>
