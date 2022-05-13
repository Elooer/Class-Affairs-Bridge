import { mapState, mapMutations } from 'vuex'

export default {
  onLoad() {
    // 初始化作业和任务列表
    this.getTaskList()
  },
  computed: {
    ...mapState('my_todo', ['total']),
    ...mapState('my_user', ['id']),
    ...mapState('my_class', ['current'])
  },
  data() {
    return {
      // 作业列表
      workList: [],
      // 任务列表
      taskList: []
    }
  },
  watch: {
    total: {
      handler() {
        this.setBadge()
      },
       immediate: true
    }
  },
  onShow() {
    this.getTaskList()
    this.setBadge()
  },
  methods: {
    ...mapMutations('my_todo', ['updateTotal']),
    setBadge() {
      // 为指定tabbar设置徽标
      uni.setTabBarBadge({
        index: 1,
        // 徽标内容必须是字符串
        text: this.total ? this.total + '' : ''
      })
    },
    // 获取任务列表
    async getTaskList(cb) {
      const res = await uni.$http.get('/bwThings/getTaskList', {cid: this.current, sid: this.id})
      cb && cb()
      this.taskList = res.data.data
      this.getWorkList()
    },
    // 获取作业列表
    async getWorkList() {
      const res = await uni.$http.get('/bwThings/getWorkList', {cid: this.current, sid: this.id})
      this.workList = res.data.data
      this.updateTotal(this.taskList.length + this.workList.length)
    },
  }
}