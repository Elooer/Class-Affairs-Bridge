export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    // 当前所在班级
    current: uni.getStorageSync('current') || '',
  }),

  // 模块的 mutations 方法
  mutations: {
    // 更新current
    updateCurrent(state, current) {
      state.current = current
      // 通过 this.commit() 方法，调用 m_user 模块下的 saveTokenToStorage 方法，将 current 字符串持久化存储到本地
      this.commit('my_class/saveCurrentToStorage')
    },
    saveCurrentToStorage(state) {
      uni.setStorageSync('current', state.current)
    },
  },

  // 模块的 getters 属性
  getters: {
  },
}
