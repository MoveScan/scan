import { defineStore } from 'pinia'

export const useStore = defineStore('storeId', {
  state: () => {
    return {
      counter: 0,
      name: 'Bruce Cao',
      isAdmin: true,
      switchDark: true
    }
  },
  getters: {
    nameLength: (state) => state.name.length
  },
  actions: {
    async insertPost(data: string) {
      // 可以做异步
      // await doAjaxRequest(data);
      this.name = data
    }
  },
  persist: true
})
