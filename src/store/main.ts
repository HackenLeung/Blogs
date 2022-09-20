import { defineStore } from 'pinia'

export const useMainStore = defineStore({
  id: 'mian',
  state: () =>({
    test: '测试pinia',
    runTimeInterval:""
  }),
  // getters
  getters: {
    testLength: (state) => state.test.length,
    runTimeInterval: (state) => state.runTimeInterval,
  },
  actions: {
    async insertPost(data:string){
      // 可以做异步
      // await doAjaxRequest(data);
      this.test = data;
    }
  }
})
