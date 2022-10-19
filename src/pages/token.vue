<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <div class="block-title">{{ $t('lang.Token') }}</div>
    <div class="blocks-data-wrap">
      <div class="blocks_overview blocks_list_overview">
        <div class="">
          <div class="card">
            <div class="card-body" id="txcont">
              <h2 class="d-flex"><span>通证总数</span></h2>
              <div class="d-flex align-items-center">
                <div class="d-flex flex-column">
                  <span class="num">
                    <span><a href="#/block/44540035">44540035</a></span>
                  </span>
                  <div class="d-flex" style="margin-top: 6px">
                    <span class="txt">累计</span>
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
                    <span class="txt"><span>新增</span></span>
                  </div>
                </div>
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
                    <span><a href="#/block/44540035">44540035</a></span>
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
                    <span><a href="#/block/44540035">44540035</a></span>
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

      <div>共{{ total }}个通证</div>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="type_tag" label="通证标识" width="400" :show-overflow-tooltip="true">
          <template #default="scope">
            <router-link :to="'/tokenDetail?tag=' + scope.row.type_tag">
              {{ scope.row.type_tag }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="create_at" label="创建时间">
          <template #default="scope">
            {{ timestampToTime(scope.row.create_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建者">
          <template #default="scope">
            <router-link v-if="scope.row.creator !== null" :to="'/accountDetail?address=' + scope.row.creator">
              {{ setSubstring(scope.row.creator) }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="holders" label="持币地址数" />
        <el-table-column prop="max_amount" label="最大发行量" />
        <el-table-column prop="supply" label="供应量" />
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
import type { TabsPaneContext } from 'element-plus'
import Header from '../components/header.vue'
import Search from '../components/search.vue'
import Footer from '../components/footer.vue'
import { getTokenList, getTokenHoldersList } from '@/http/api/index.ts'
import { timestampToTimeLong, substring } from '@/utils/public.ts'

export default defineComponent({
  name: 'Token',
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
      getToken: () => {
        getTokenList({ page: data.currentPage, count: data.pageSize })
          .then((res: any) => {
            console.log('token', res)
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
      setSubstring: (str: number) => {
        return substring(str)
      },

      handleSizeChange: (val: number) => {
        console.log(`${val} items per page`)
      },
      handleCurrentChange: (val: number) => {
        console.log(`current page: ${val}`)
        data.loading = true
        data.currentPage = val
        data.getToken()
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
      data.getToken()
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
