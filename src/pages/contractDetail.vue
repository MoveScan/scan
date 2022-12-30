<template>
  <Header></Header>
  <Search></Search>
  <div class="container box">
    <br />
    <prism-editor class="my-editor height-300" v-model="code" aria-disabled :highlight="highlighter" line-numbers
      :readonly="false" :tabSize="4"></prism-editor>

    <br />
    
  </div>
  <Footer></Footer>
</template>
<script lang="ts">
import { ref, toRefs, reactive, defineComponent, onMounted } from 'vue'
import Header from '../components/header.vue'
import Search from '../components/search.vue'
import Footer from '../components/footer.vue'
import { useStore } from '../store/store'
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
    const data = reactive({
      code: ref(''),
      store: useStore(),
      msg: ref(),
      init: () => {
        data.msg = '功能开发中,敬请期待'
      },
      isDark: (dark) => {
        return dark ? 'color:#2ef1a7' : 'color:#715cff'
      },
      highlighter(code) {
        return highlight(code, languages.js); //returns html
      }
    })

    const refData = toRefs(data)

    onMounted(() => {
      data.code = `[{"abi": {"structs": [{"doc": "", "name": "Exp", "fields": [{"doc": "", "name": "mantissa", "type_abi": {"Struct": {"doc": "", "name": "U256", "fields": [{"doc": "", "name": "bits", "type_abi": {"Vector": "U64"}}], "ty_args": [], "abilities": 7, "module_name": {"name": "U256", "address": "0x00000000000000000000000000000001"}}}}], "ty_args": [], "abilities": 7, "module_name": {"name": "BigExponential", "address": "0x8c109349c6bd91411d6bc962e080c4a3"}}], "module_name": {"name": "BigExponential", "address": "0x8c109349c6bd91411d6bc962e080c4a3"}, "script_functions": []}, "code": "0xa11ceb0b040000000a010006020608030e730581013507b601fa0108b0032006d0034b0a9b04060ca104a7030dc807020000010101020003070002020700000400010000050203000006000100000702030000080201000009030100000a030100000b040100000c050300000d050600000e010400000f02040000100203000011040300001201030002130704000214070400011506060002160304000217050400021807040002190a0b00021a0c030002080008000108000204040104010801000103020801080103010801080102020801020608010608010102010608010302080108010e4269674578706f6e656e7469616c064572726f7273045532353603457870076164645f657870086164645f75313238076469765f657870086469765f75313238036578700a6578705f646972656374116578705f6469726563745f657870616e640d6578705f66726f6d5f75323536096578705f7363616c65126578705f7363616c655f6c696d6974696f6e086d616e7469737361086d756c5f75313238087375625f753132380c746f5f736166655f75313238087472756e63617465036164640364697610696e76616c69645f617267756d656e740966726f6d5f75313238047a65726f036d756c07636f6d7061726507746f5f753132388c109349c6bd91411d6bc962e080c4a3000000000000000000000000000000010201000308650000000000000003086600000000000000030812000000000000000410000064a7b3b6e00d00000000000000000201020201010410ffffffffffffffffffffffffffffffff0002010e08010001000005090e001000140e01100014110f1200020101000005040a000a0116020201000005090e001000140e0110001411101200020301000005130a013200000000000000000000000000000000210305050807011111270a00320000000000000000000000000000000021030d050f3200000000000000000000000000000000020a000a011a0204010000070c0a000704110b0c030b030a01111211100c020b021200020501000005040a0011121200020601000005050a000704110b1200020701000005030b001200020801000005020704020901000005020703020a01000005040e00100014020b010000081b0a0032000000000000000000000000000000002103050508080c02050c0a013200000000000000000000000000000000210c020b02030f05111113020a0011120c030a0111120c040b030b041114020c01000005040a000a0117020d0100000912070711120c020e000e0211150c010a01070521030c050f07021111270e001116020e0100000d190e001000140704111211100c02070711120c030e020e0311150c010a010705210313051607021111270e02111602000000", "module_name": "BigExponential"}]`
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
  }
</style>
