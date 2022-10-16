// typescript 只能理解 .ts 文件，无法理解 .vue文件
declare module '@'
declare module '*.ts'
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
