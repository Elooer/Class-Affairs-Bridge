export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    // 登录成功之后的token字符串
    token: uni.getStorageSync('token') || '',
    // 用户基本信息
    userInfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
    // 学生基本信息
    stuInfo: JSON.parse(uni.getStorageSync('stuInfo') || '{}'),
    // 学生id
    id: uni.getStorageSync('id') || ''
  }),

  // 模块的 mutations 方法
  mutations: {
    // 更新用户信息
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo
      this.commit('my_user/saveUserInfoToStorage')
    },
    saveUserInfoToStorage(state) {
      uni.setStorageSync('userinfo', JSON.stringify(state.userInfo))
    },
    // 更新Token
    updateToken(state, token) {
      state.token = token
      // 通过 this.commit() 方法，调用 m_user 模块下的 saveTokenToStorage 方法，将 token 字符串持久化存储到本地
      this.commit('my_user/saveTokenToStorage')
    },
    saveTokenToStorage(state) {
      uni.setStorageSync('token', state.token)
    },
    // 更新学生信息
    updateStuInfo(state, stuInfo) {
      state.stuInfo = stuInfo
      this.commit('my_user/saveStuInfoToStorage')
    },
    saveStuInfoToStorage(state) {
      uni.setStorageSync('stuInfo', JSON.stringify(state.stuInfo))
    },
    // 更新用户id
    updateId(state, id) {
      state.id = id
      this.commit('my_user/saveIdToStorage')
    },
    saveIdToStorage(state) {
      uni.setStorageSync('id', state.id)
    }
  },

  // 模块的 getters 属性
  getters: {
    showName(state) {
      return state.stuInfo['username']
    },
    showNumber(state) {
      return state.sutInfo['classNumber']
    }
  },
}
