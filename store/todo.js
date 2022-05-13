export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    total: uni.getStorageSync('total') || '',
  }),

  // 模块的 mutations 方法
  mutations: {
    // 更新total
    updateTotal(state, total) {
      state.total = total
      // 通过 this.commit() 方法，调用 my_todo 模块下的 saveTokenToStorage 方法，将 total 字符串持久化存储到本地
      this.commit('my_todo/saveTotalToStorage')
    },
    saveTotalToStorage(state) {
      uni.setStorageSync('total', state.total)
    },
  },

  // 模块的 getters 属性
  getters: {
    
  },
}
