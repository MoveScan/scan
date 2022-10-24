<template>
  <Header></Header>
  <Search></Search>
  <div class="container">
    <!-- <el-row>
      <el-col :span="8">1</el-col>
      <el-col :span="8">2</el-col>
      <el-col :span="8">3</el-col>
    </el-row> -->
    <div class="block-title">{{ $t('lang.Account') }}</div>
    <div class="blocks-data-wrap">
      <div class="blocks_overview blocks_list_overview">
        <div class="">
          <div class="card">
            <div class="card-body" id="txcont">
              <h2 class="d-flex"><span>账户数</span></h2>
              <div class="d-flex align-items-center">
                <div class="d-flex flex-column">
                  <span class="num">
                    <span>{{ total }}</span>
                  </span>
                  <div class="d-flex" style="margin-top: 6px">
                    <span class="txt">最新账户</span>
                  </div>
                </div>
                <div class="d-flex flex-column">
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
              <h2 class="d-flex"><span>持有TRX账户</span></h2>
              <div class="d-flex align-items-center">
                <div class="d-flex flex-column">
                  <span class="num">
                    <span><a href="#/block/44540035">44540035</a></span>
                  </span>
                  <div class="d-flex" style="margin-top: 6px">
                    <span class="txt">持有TRX账户数</span>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <span class="num">
                    <span>55.6%</span>
                  </span>
                  <div class="d-flex" style="margin-top: 6px">
                    <span class="txt"><span>持有用户占比</span></span>
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
              <h2 class="d-flex"><span>活跃账户</span></h2>
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
      <div>下面是账户列表，最新的{{ total }}条，每页20条</div>
      <el-table :data="tableData">
        <el-table-column prop="address" label="账户" width="600">
          <template #default="scope">
            <router-link :to="'/accountDetail?address=' + scope.row.address">
              {{ scope.row.address }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="create_at" label="创建时间">
          <template #default="scope">
            {{ timestampToTime(scope.row.create_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="hold_amount" label="持币数量">
            <template #default="scope">
             {{scope.row.hold_amount}}
            </template>
        </el-table-column>
        <el-table-column prop="sequence_number" label="序列号">
            <template #default="scope">
              {{scope.row.sequence_number}}
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
import Header from '../components/header.vue'
import Search from '../components/search.vue'
import Footer from '../components/footer.vue'
import { getAddressList } from '@/http/api/index.ts'
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
      tableData: [],
      getAddress: () => {
        getAddressList({ page: data.currentPage, count: data.pageSize })
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
        data.getAddress()
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
      data.getAddress()
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
</style>
