<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <el-row>
      <el-col :span="17">
        <el-card class="box-card" style="margin-right: 15px; height: 282px">
          <div class="ant-row card-body row home-stats pt-0 pb-0 mainnet-data m-0">
            <div class="ant-col data-item ant-col-xs-12 ant-col-md-12 ant-col-lg-12">
              <a href="#">
                <div class="data-item-left">
                  <el-icon>
                    <Coin />
                  </el-icon>
                  <div class="data-item-center">
                    <p class="m-0 panel-title"><span>总区块数</span></p>
                    <h2 class="m-0">
                      <span>{{ summary.total_blocks }}</span>
                    </h2>
                  </div>
                </div>
                <!-- <div class="data-item-right">
                  <p class="m-0 right-24h"><span>24h</span></p>
                  <p class="m-0 number"><span class="green">+1</span></p>
                </div> -->
              </a>
            </div>
            <div class="ant-col data-item ant-col-xs-12 ant-col-md-12 ant-col-lg-12">
              <a href="#">
                <div class="data-item-left">
                  <el-icon>
                    <User />
                  </el-icon>
                  <div class="data-item-center">
                    <p class="m-0 panel-title"><span>总账户数</span></p>
                    <h2 class="m-0">
                      <span>{{ summary.total_accounts }}</span>
                    </h2>
                  </div>
                </div>
                <!-- <div class="data-item-right">
                  <p class="m-0 right-24h"><span>24h</span></p>
                  <p class="m-0 number"><span class="red">+0.01%</span></p>
                </div> -->
              </a>
            </div>
            <div class="ant-col data-item ant-col-xs-12 ant-col-md-12 ant-col-lg-12">
              <a href="#">
                <div class="data-item-left">
                  <el-icon>
                    <Finished />
                  </el-icon>
                  <div class="data-item-center">
                    <p class="m-0 panel-title"><span>总交易数</span></p>
                    <h2 class="m-0">
                      <span>{{ summary.total_transfers }}</span>
                    </h2>
                  </div>
                </div>
                <!-- <div class="data-item-right">
                  <p class="m-0 right-24h"><span>24h</span></p>
                  <p class="m-0 number"><span class="green">+1</span></p>
                </div> -->
              </a>
            </div>
            <div class="ant-col data-item ant-col-xs-12 ant-col-md-12 ant-col-lg-12">
              <a href="#/">
                <div class="data-item-left">
                  <el-icon>
                    <Switch />
                  </el-icon>
                  <div class="data-item-center">
                    <p class="m-0 panel-title"><span>总转账数</span></p>
                    <h2 class="m-0">
                      <span>{{ summary.total_txns }}</span>
                    </h2>
                  </div>
                </div>
                <!-- <div class="data-item-right">
                  <p class="m-0 right-24h"><span>24h</span></p>
                  <p class="m-0 number"><span class="green">+$1</span></p>
                </div> -->
              </a>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- <el-col :span="7">
        <el-card class="box-card" style="height: 280px">
          <div class="trxgroup-wrapper-container">
            <div class="trxgroup-left-content">
              <a href="#">
                <div class="market-item">
                  <div class="market-item-left">
                    <el-icon>
                    <User />
                  </el-icon>
                    <div class="market-item-center">
                      <p class="trxgroup-left-title"><span>Market Cap</span></p>
                      <p class="trxgroup-left-number"><span>$5,538,110,223</span></p>
                    </div>
                  </div>
                  <p class="market-item-right green">+0.28 %</p>
                </div>
              </a>
              <a href="#">
                <div class="market-item">
                  <div class="market-item-left">
                    <el-icon>
                    <User />
                  </el-icon>
                    <div class="market-item-center">
                      <p class="trxgroup-left-title"><span>Market Trading Volume (24h)</span></p>
                      <p class="trxgroup-left-number"><span>$352,817,086</span></p>
                    </div>
                  </div>
                  <p class="market-item-right red">-13.5 %</p>
                </div>
              </a>
              <a href="#">
                <div class="market-item">
                  <div class="market-item-left">
                    <el-icon>
                    <User />
                  </el-icon>
                    <div class="market-item-center">
                      <p class="trxgroup-left-title"><span>Total TRX Staked</span></p>
                      <p class="trxgroup-left-number"><span>43,984,956,811</span></p>
                    </div>
                  </div>
                  <div class="market-item-center right-align">
                    <p class="trxgroup-left-title"><span>Staking Rate</span></p>
                    <div class="trxgroup-left-number">43.4 %</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </el-card>
      </el-col> -->
    </el-row>

    <div class="home-block-wrap">
      <div class="block-title">
        <div class="block-title-left">
          <a href="/blocks">
            <span>{{ $t('lang.BlockDisplay') }}</span>
          </a>
        </div>
        <a class="block-more" href="/blocks">
          <span>{{ $t('lang.More') }}</span>
        </a>
      </div>

      <div class="block text-center">
        <el-carousel height="150px">
          <el-carousel-item class="block-box">
            <div class="box" v-for="(item, index) in blockData.slice(0, 4)" :key="index" @click="gotoBlock(item.height)">
              <ul>
                <li class="block-number">高度：{{ item.height }}</li>
                <li>
                  <span class="black">{{ timestampToTime(item.create_at) }}</span>
                </li>
              </ul>
              <span class="gray-time">区块哈希：{{ setSubstring(item.block_hash) }}</span>
              <ul class="block-detail">
                <li class="">交易数：{{ item.transactions }}</li>
                <li>GAS消耗量：{{ item.gas_used }}</li>
              </ul>
            </div>
          </el-carousel-item>
          <el-carousel-item class="block-box">
            <div class="box" v-for="(item, index) in blockData.slice(4, 8)" :key="index" @click="gotoBlock(item.height)">
              <ul>
                <li class="block-number">高度：{{ item.height }}</li>
                <li>
                  <span class="black">{{ timestampToTime(item.create_at) }}</span>
                </li>
              </ul>
              <span class="gray-time">区块哈希：{{ setSubstring(item.block_hash) }}</span>
              <ul class="block-detail">
                <li class="">交易数：{{ item.transactions }}</li>
                <li>GAS消耗量：{{ item.gas_used }}</li>
              </ul>
            </div>
          </el-carousel-item>
          <el-carousel-item class="block-box">
            <div class="box" v-for="(item, index) in blockData.slice(8, 12)" :key="index" @click="gotoBlock(item.height)">
              <ul>
                <li class="block-number">高度：{{ item.height }}</li>
                <li>
                  <span class="black">{{ timestampToTime(item.create_at) }}</span>
                </li>
              </ul>
              <span class="gray-time">区块哈希：{{ setSubstring(item.block_hash) }}</span>
              <ul class="block-detail">
                <li class="">交易数：{{ item.transactions }}</li>
                <li>GAS消耗量：{{ item.gas_used }}</li>
              </ul>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <div class="home-block-wrap">
      <div class="block-title">
        <div class="block-title-left">
          <a href="/transaction">
            <span>{{ $t('lang.TransactionDisplay') }}</span>
          </a>
        </div>
        <a class="block-more" href="/transaction">
          <span>{{ $t('lang.More') }}</span>
        </a>
      </div>

      <el-row>
        <el-col :span="15">
          <el-scrollbar height="400px">
            <div class="transaction">
              <ul>
                <li v-for="(item, index) in transactionData" :key="index" @click="gotoTransaction(item.txn_hash)">
                  <div class="record">
                    <div>块高度:{{ item.height }}</div>
                    <div>GAS消耗量:{{ item.gas_used }}</div>
                    <div>是否成功:{{ item.success ? '是' : '否' }}</div>
                    <div>
                      创建时间:
                      <span v-if="item.create_at != null">{{ timestampToTime(item.create_at) }}</span>
                    </div>
                    <div>全局索引号:{{ item.global_index }}</div>
                    <div>交易类型:{{ item.transaction_type }}</div>
                  </div>
                </li>
              </ul>
            </div>
          </el-scrollbar>
        </el-col>
        <el-col :span="9" style="background: rgba(180, 180, 180, 0.1); border-radius: 10px">
          <!-- <div id="chart"></div> -->
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
import { timestampToTimeLong, substring } from '@/utils/public.ts'
import { ElLoading } from 'element-plus'

export default defineComponent({
  name: 'Token',
  components: {
    Header,
    Search,
    Footer
  },
  setup() {
    // const loading = ElLoading.service({
    //   lock: true,
    //   text: 'Loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // })

    const router = useRouter()
    const data = reactive({
      currentPage: ref(1),
      pageSize: ref(15),
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
          .catch((e) => {
            console.log(e)
          })
      },
      getTransaction: () => {
        getTransactionList({ page: data.currentPage, count: data.pageSize, start: 1, txn_type: '' })
          .then((res: any) => {
            console.log('transaction', res)
            data.transactionData = res.contents
          })
          .catch((e) => {
            console.log(e)
          })
      },
      chainSummary: () => {
        getChainSummary({})
          .then((res: any) => {
            console.log('Summary', res)
            data.summary = res
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
      gotoBlock: (height) => {
        router.push('/blocksDetail?height=' + height)
      },
      gotoTransaction: (hash) => {
        router.push('/transactionDetail?hash=' + hash)
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
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
      // data.isPageLoad()
      // data.initChart()
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
.el-row {
  margin-bottom: 20px;
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
  align-items: center;
  color: #101010;
  display: flex;
  font-size: 20px;
  font-weight: 700;
  justify-content: space-between;
  line-height: 2rem;
  margin: 16px 0 13px;
}

.block-title a {
  text-decoration: none;
  color: #91979d;
}

.block-title-left {
  align-items: center;
  display: flex;
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

/* .el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
} */
.block-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #91979d;
}

.block-box:hover {
  color: #409eff;
  cursor: pointer;
}

.block-box div {
  border-radius: 10px;
  background: rgba(180, 180, 180, 0.1);
  height: 100px;
  width: 290px;
  padding: 15px;
}

.box:hover {
  transform: translateY(-5px);
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
  border-bottom: 1px solid #f0f2f3;
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
</style>
