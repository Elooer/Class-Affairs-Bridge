import Vue from 'vue'
import Vuex from 'vuex'
// 导入用户的vuex模块
import userModule from './user.js'
// 导入待办的vuex模块
import todoModule from './todo.js'
// 导入班级的vuex模块
import classModule from './class.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    my_user: userModule,
    my_todo: todoModule,
    my_class: classModule
  },
})