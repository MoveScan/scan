<template>
  <Header></Header>
  <Search></Search>
  <div class="container box">
    <br />
    <h2 :style="store.switchDark ? '' : 'color:#715cff'">{{ $t('lang.ComingSoon') }}</h2>
    <br />
    <el-skeleton :rows="5" />
  </div>
  <Footer></Footer>
</template>
<script lang="ts">
import { ref, toRefs, reactive, defineComponent, onMounted } from 'vue'
import Header from '../components/header.vue'
import Search from '../components/search.vue'
import Footer from '../components/footer.vue'
import { useStore } from '../store/store'

export default defineComponent({
  name: 'new page',
  components: {
    Header,
    Search,
    Footer
  },
  setup() {
    const data = reactive({
      store: useStore(),
      msg: ref(),
      init: () => {
        data.msg = '功能开发中,敬请期待'
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
      data.init()
    })

    return {
      ...refData
    }
  }
})
</script>
<style scoped>
.box {
  min-height: 600px;
}
</style>
