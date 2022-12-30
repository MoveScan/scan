<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <div class="flex">
      <div class="block-title">
        {{ $t('lang.Data') }}
      </div>
    </div>
    <br />
    <el-row>
      <el-col :span="12">
        <el-card class="list">
          <span class="title">{{ $t('lang.Transaction') }}</span>
          <div class="tab">
            <a v-for="(item, index) in tabs" :key="index" :class="{ active: index == tabsIndex }" @click="tabSwitch(index)">{{ item }}</a>
          </div>
          <div id="transactionChart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="list">
          <span class="title">{{ $t('lang.Address') }}</span>
          <div class="tab">
            <a v-for="(item, index) in tabs" :key="index" :class="{ active: index == tabsIndex2 }" @click="tabSwitch2(index)">{{ item }}</a>
          </div>
          <div id="addressChart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <Footer></Footer>
</template>
<script lang="ts">
import { ref, toRefs, reactive, defineComponent, onMounted } from 'vue'
import { EChartsOption, init } from 'echarts'
import Header from '../components/header.vue'
import Search from '../components/search.vue'
import Footer from '../components/footer.vue'
import { addressDay, addressHour, transactionDay, transactionHour } from '@/http/api/index.ts'

export default defineComponent({
  name: 'address Detail',
  components: {
    Header,
    Search,
    Footer
  },
  setup() {
    const data = reactive({
      tabs: ['24小时', '3日'],
      tabsIndex: 0,
      tabsIndex2: 0,
      tabSwitch(index: number) {
        console.log(index)
        data.tabsIndex = index
        index == 0 ? data.getTransactionDay() : data.getTransactionHour()
      },
      tabSwitch2(index: number) {
        console.log(index)
        data.tabsIndex2 = index
        index == 0 ? data.getAddressDay() : data.getAddressHour()
      },
      tChart: (title: any, dates: any, datas: any) => {
        // 获取dom，断言HTMLElement类型，否则会报错
        const chartEle: HTMLElement = document.getElementById('transactionChart') as HTMLElement
        const chart = init(chartEle)
        const option: EChartsOption = {
          title: {
            text: title
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              interval: 0, //坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
              rotate: 38 //调整数值改变倾斜的幅度（范围-90到90）
            },
            data: dates
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: datas,
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
      aChart: (title: any, dates: any, datas: any) => {
        // 获取dom，断言HTMLElement类型，否则会报错
        const chartEle: HTMLElement = document.getElementById('addressChart') as HTMLElement
        const chart = init(chartEle)
        const option: EChartsOption = {
          title: {
            text: title
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              interval: 0, //坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
              rotate: 38 //调整数值改变倾斜的幅度（范围-90到90）
            },
            data: dates
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: datas,
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
      getTransactionDay: () => {
        transactionDay({ page: '1' })
          .then((res: any) => {
            console.log('transactionDay', res)
            let dates = []
            let datas = []
            res.contents.forEach((item: { stat_date: any; amount: any }) => {
              dates.push(item.stat_date.split(' ')[0])
              datas.push(item.amount)
            })
            data.tChart(data.tabs[0], dates, datas)
          })
          .catch((e: any) => {
            console.log(e)
          })
      },
      getTransactionHour: () => {
        transactionHour({ page: '1' })
          .then((res: any) => {
            console.log('transactionHour', res)
            let dates = []
            let datas = []
            res.contents.forEach((item: { stat_hour: any; amount: any }) => {
              dates.push(item.stat_hour.split(' ')[0])
              datas.push(item.amount)
            })
            data.tChart(data.tabs[0], dates, datas)
          })
          .catch((e: any) => {
            console.log(e)
          })
      },
      getAddressDay: () => {
        addressDay({ page: '1' })
          .then((res: any) => {
            console.log('addressDay', res)
            let dates = []
            let datas = []
            res.contents.forEach((item: { stat_date: any; amount: any }) => {
              dates.push(item.stat_date.split(' ')[0])
              datas.push(item.amount)
            })
            data.aChart(data.tabs[0], dates, datas)
          })
          .catch((e: any) => {
            console.log(e)
          })
      },
      getAddressHour: () => {
        addressHour({ page: '1' })
          .then((res: any) => {
            console.log('addressHour', res)
            let dates = []
            let datas = []
            res.contents.forEach((item: { stat_hour: any; amount: any }) => {
              dates.push(item.stat_hour.split(' ')[0])
              datas.push(item.amount)
            })
            data.aChart(data.tabs[1], dates, datas)
          })
          .catch((e: any) => {
            console.log(e)
          })
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
      data.getAddressDay()
      data.getTransactionDay()
    })

    return {
      ...refData
    }
  }
})
</script>
<style scoped>
#transactionChart,
#addressChart {
  width: 100%;
  height: 360px;
  padding: 20px 0;
}

.flex {
  display: flex;
  justify-content: space-between;
}

.block-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 2rem;
  text-align: left;
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
  color: #959595;
  font-size: 14px;
  border-bottom: 1px dotted rgba(58, 58, 58, 0.3);
  width: 100%;
  margin: 20px 0;
}

.list div span:nth-child(2) {
  color: #73787b;
}
.tab {
  width: 160px;
}
.tab a {
  padding: 3px 10px;
  margin-right: 5px;
  background: #1f2128;
  border-radius: 10px;
  cursor: pointer;
  font-size: 12px;
  width: 80px;
}
.tab .active {
  background: #40444f;
}
</style>
