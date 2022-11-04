<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <div class="block-title">{{ $t('lang.Coin') }}</div>
    <div class="blocks-data-wrap">
      <div class="blocks_overview blocks_list_overview">
        <div class="">
          <div class="card">
            <div class="card-body" id="txcont">
              <h2 class="d-flex">
                <span>{{ $t('lang.TotalCoins') }}</span>
              </h2>
              <div class="d-flex align-items-center">
                <div class="d-flex flex-column">
                  <span class="num">
                    <span>{{ total }}</span>
                  </span>
                </div>
                <!-- <div class="d-flex flex-column">
                  <span class="num">
                    <span>
                      +
                      <span>28,786</span>
                    </span>
                  </span>
                  <div class="d-flex" style="margin-top: 6px">
                    <span class="txt"><span>新增</span></span>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="blocks_overview blocks_list_overview">
        <div class="">
          <div class="card">
            <div class="card-body" id="txcont">
              <h2 class="d-flex"><span>通证分布</span></h2>
              <div class="d-flex align-items-center">
                <div class="d-flex flex-column">
                  <span class="num">
                    <span><a href="#">44540035</a></span>
                  </span>
                  <div class="d-flex" style="margin-top: 6px">
                    <span class="txt">TRC20</span>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <span class="num">
                    <span>55.6</span>
                  </span>
                  <div class="d-flex" style="margin-top: 6px">
                    <span class="txt"><span>TRC721</span></span>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <span class="num">
                    <span>55.6</span>
                  </span>
                  <div class="d-flex" style="margin-top: 6px">
                    <span class="txt"><span>TRC1155</span></span>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <span class="num">
                    <span>55.6</span>
                  </span>
                  <div class="d-flex" style="margin-top: 6px">
                    <span class="txt"><span>TRC10</span></span>
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
            <div class="card-body" id="txcont">
              <h2 class="d-flex"><span>链上资产</span></h2>
              <div class="d-flex align-items-center">
                <div class="d-flex flex-column">
                  <span class="num">
                    <span><a href="#">44540035</a></span>
                  </span>
                  <div class="d-flex" style="margin-top: 6px">
                    <span class="txt">日活跃账户</span>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <span class="num">
                    <span>
                      +
                      <span>10.63%</span>
                    </span>
                  </span>
                  <div class="d-flex" style="margin-top: 6px">
                    <span class="txt"><span>环比</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="table">
      <!-- <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="全部" name="first">全部</el-tab-pane>
        <el-tab-pane label="TRC20" name="second">TRC20</el-tab-pane>
        <el-tab-pane label="TRC721" name="third">TRC721</el-tab-pane>
        <el-tab-pane label="TRC1155" name="TRC1155">TRC1155</el-tab-pane>
        <el-tab-pane label="TRC10" name="TRC10">TRC10</el-tab-pane>
      </el-tabs> -->

      <div>{{ $t('lang.LatestList') }}</div>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="coin_id" :label="$t('lang.CoinID')" width="400" :show-overflow-tooltip="true">
          <template #default="scope">
            <router-link :to="'/coinDetail?tag=' + scope.row.coin_id">
              {{ scope.row.coin_id }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="create_at" :label="$t('lang.CreateAt')">
          <template #default="scope">
            <span v-if="scope.row.create_at != null">{{ timestampToTime(scope.row.create_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creator" :label="$t('lang.Creator')" width="200">
          <template #default="scope">
            <router-link v-if="scope.row.creator !== null" :to="'/accountDetail?address=' + scope.row.creator">
              {{ scope.row.creator.length < 10 ? scope.row.creator : setSubstring(scope.row.creator) }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="holders" :label="$t('lang.HolderAmount')" />
        <el-table-column prop="max_amount" :label="$t('lang.MaxSupply')" />
        <!-- <el-table-column prop="supply" label="供应量" /> -->
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
import type { TabsPaneContext } from 'element-plus'
import Header from '../components/header.vue'
import Search from '../components/search.vue'
import Footer from '../components/footer.vue'
import { getCoinList } from '@/http/api/index.ts'
import { timestampToTimeLong, substring } from '@/utils/public.ts'

export default defineComponent({
  name: 'Coin',
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
      activeName: ref('first'),
      tableData: [],
      getCoin: () => {
        getCoinList({ page: data.currentPage, count: data.pageSize })
          .then((res: any) => {
            console.log('coin', res)
            data.tableData = res.contents
            data.total = res.total
            data.loading = false
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
        data.getCoin()
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
      data.getCoin()
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
