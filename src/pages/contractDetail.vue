<template>
  <Header></Header>
  <Search></Search>
  <div class="container box">
    <br />
    <prism-editor class="my-editor height-300" v-model="detail.modules" aria-disabled :highlight="highlighter" :readonly="false" :tabSize="4"></prism-editor>
    <br />
  </div>
  <Footer></Footer>
</template>
<script lang="ts">
import { ref, toRefs, reactive, defineComponent, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../components/header.vue'
import Search from '../components/search.vue'
import Footer from '../components/footer.vue'
import { contractAddressDetail } from '@/http/api/index.ts'
// code show
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";


export default defineComponent({
  name: 'new page',
  components: {
    Header,
    Search,
    Footer,
    PrismEditor
  },
  setup() {
    const router = useRouter(),
      route = useRoute()
    const data = reactive({
      detail: ref({}),
      msg: ref(),
      init: () => {
        data.msg = '功能开发中,敬请期待'
      },
      isDark: (dark) => {
        return dark ? 'color:#2ef1a7' : 'color:#715cff'
      },
      highlighter(code) {
        return highlight(code, languages.js); //returns html
      },
      getContractAddressDetail: (address: any) => {
        contractAddressDetail({ address: address })
          .then((res: any) => {
            console.log('contract Address', res)
            data.detail = res
          })
          .catch((e) => {
            console.log(e)
          })
      },
    })

    const refData = toRefs(data)
    onMounted(() => {
      data.getContractAddressDetail(route.query.address)
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
/* required class */
.my-editor {
    background: #2d2d2d;
    color: #ccc;
    border-radius: 10px;
   
    line-height: 1.5;
    padding: 20px 0;
  }

  .height-300 {
    min-height: 300px;
    width: 96%;
    padding: 2%;
  }
</style>
