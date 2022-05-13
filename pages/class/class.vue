<template>
  <view class="container">
    <uni-nav-bar title="班级" statusBar backgroundColor="#127ddb" color="#ffffff" fixed="true"></uni-nav-bar>
    <view class="active" v-if="classList.length">
      <view class="class_card">
        <view class="top">
          <view class="header" @click="toCLassInfo">
            <view class="" style="overflow: hidden;"><text style="color: #414141;">班级：</text>{{classList[currentCid].cname}}</view>
            <uni-icons type="forward" size="20"></uni-icons>
          </view>
          <view class="class_number">班级号：{{classList[currentCid].cid}}</view>
          <view class="class_info">
            <view class="">班级成员：{{classList[currentCid].pnumber}}人</view>
            <view class="switch">
              <image class="switch_icon" src="http://43.138.133.249:8080/pictures/switch.png" mode=""></image>
              <view class="" @click="switchClass">切换班级</view>
            </view>
          </view>
        </view>
        <view class="bottom">
          <button class="lbtn" @click="gotoCreate" hover-class='press-style' hover-stay-time=100>创建班级</button>
          <button class="rbtn" @click="gotoJoin" hover-class="press-style" hover-stay-time=100>加入班级</button>
        </view>
      </view>
      <view class="btn" hover-class='press-style' hover-stay-time=100 @click="open">
        <uni-icons type="plusempty" color="#ffffff" size="30"></uni-icons>
      </view>
    </view>
    <view class="inactive" v-else>
      <view class="discribe">
        <image class="default_img" src="http://43.138.133.249:8080/pictures/without-class.png" mode="aspectFill">
        </image>
        <p class="tip">您还未加入任何班级...</p>
      </view>
      <view class="operate">
        <operate-btn name="创建班级" src="http://43.138.133.249:8080/pictures/join-class.png" @click="gotoCreate">
        </operate-btn>
        <operate-btn name="加入班级" src="http://43.138.133.249:8080/pictures/create-class.png" @click="gotoJoin">
        </operate-btn>
      </view>
    </view>
    <!-- 发布任务的弹窗 -->
    <wyb-popup class="pop" ref="popup" type="bottom" height="250" width="500" radius="6" duration="200">
      <view class="box">
        <view class="task" @click="toPublish('发布任务')">
          <image class="task_image" src="http://43.138.133.249:8080/pictures/task.png" mode=""></image>
          <view class="text">发布任务</view>
        </view>
        <view class="task" @click="toPublish('发布作业')">
          <image class="task_image" src="http://43.138.133.249:8080/pictures/work.png" mode=""></image>
          <view class="text">发布作业</view>
        </view>
      </view>
    </wyb-popup>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import wybPopup from '@/components/wyb-popup/wyb-popup.vue'
  import badegeMix from '@/mixins/tabbar-badge.js'

  export default {
    mixins: [badegeMix],
    components: {
      wybPopup
    },
    onLoad() {
      this.getClassList()
      this.getStuList()
    },
    onShow() {
      this.getClassList()
      this.getStuList()
    },
    data() {
      return {
        index: 0,
        // 班级列表
        classList: [],
        currentCid: 0,
        // 成员列表
        stuList: [],
        // 学生在班级的身份
        srole: 2,
      };
    },
    computed: {
      ...mapState('my_user', ['id']),
      ...mapState('my_class', ['current'])
    },
    methods: {
      ...mapMutations('my_class', ['updateCurrent']),
      open() {
        if (this.srole === 2) {
          return uni.$showMsg('只有班委才能发布作业或者任务哦')
        }
        this.$refs.popup.show()
      },
      // 获取班级列表
      async getClassList() {
        const res = await uni.$http.get('/bwClass/getClassList', {
          id: this.id
        })
        this.classList = res.data.data
        this.getNewClassId(res.data.data)
        this.getCurrentClass(res.data.data)
      },
      // 获取学生列表并标识学生身份
      async getStuList() {
        const res = await uni.$http.get('/bwClass/getStudentList', {
          cid: this.current
        })
        this.stuList = res.data.data
        this.srole = this.stuList.find(item => item.sid === this.id).srole
      },
      toCLassInfo() {
        uni.navigateTo({
          url: `../../subpkg/operate_class/operate_class?title=班级成员&cid=${this.classList[this.currentCid].cid}`
        })
      },
      // 切换班级
      switchClass() {
        uni.navigateTo({
          url: `../../subpkg/operate_class/operate_class?title=班级列表&classList=${JSON.stringify(this.classList)}`
        })
      },
      getNewClassId() {
        let that = this
        const result = this.classList.findIndex(item => item.cid === that.current)
        this.currentCid = result === -1 ? 0 : result
      },
      getCurrentClass() {
        let that = this
        this.currentClass = this.classList.find(item => item.cid === that.current)
      },
      gotoCreate() {
        uni.navigateTo({
          url: '../../subpkg/operate_class/operate_class?title=创建班级'
        })
      },
      gotoJoin() {
        uni.navigateTo({
          url: '../../subpkg/operate_class/operate_class?title=加入班级'
        })
      },
      toPublish(title) {
        uni.navigateTo({
          url: `../../subpkg/publish/publish?title=${title}&cid=${this.current}`
        })
        this.$refs.popup.hide()
      }
    }
  }
</script>

<style lang="scss">
  .container {
    height: 100vh;

    .active {
      position: relative;
      box-sizing: border-box;
      height: 90vh;
      padding: 20rpx;

      .class_card {
        position: relative;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        height: 40%;
        background-color: #ffffff;
        border-radius: 20px;
        box-shadow: 1px 1px 5px 5px rgba(0, 0, 0, 0.1);

        .top {
          height: 60%;
          box-sizing: border-box;
          padding: 0 10px;
          border-bottom: 1px solid #127ddb;

          .header {
            display: flex;
            justify-content: space-between;
            height: 40%;
            line-height: 56px;
            font-size: 25px;
            font-weight: bold;
            color: #185cdb;
          }

          .class_info {
            display: flex;
            justify-content: space-between;
          }

          .class_number {
            height: 30%;
            color: #666666;
          }

          .class_info {
            height: 30%;
            color: #666666;

            .switch {
              display: flex;
              justify-content: space-between;

              .switch_icon {
                width: 23px;
                height: 23px;
              }
            }

          }
        }


      }

      .lbtn {
        position: absolute;
        top: 61%;
        left: 10%;
        height: 50px;
        margin-top: 20px;
        width: 250rpx;
        background-color: #127ddb;
        color: #ffffff;
        border-radius: 0;
      }

      .rbtn {
        position: absolute;
        top: 61%;
        left: 55%;
        height: 50px;
        margin-top: 20px;
        width: 250rpx;
        background-color: #127ddb;
        color: #ffffff;
        border-radius: 0;
      }

      .btn {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #127ddb;
        padding: 15px;
        box-sizing: border-box;
        box-shadow: 5px 4px 5px 0px rgba(0, 0, 0, 0.2);
      }

      .press-style {
        background: #f9f9f9;
      }
    }

    .inactive {
      height: 90vh;

      .discribe {
        height: 50%;

        .default_img {
          width: 100%;
        }

        .tip {
          height: 70px;
          line-height: 70px;
          text-align: center;
          font-size: 22px;
        }
      }

      .operate {
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        align-items: center;
        height: 50%;
      }
    }

    .box {
      display: flex;
      justify-content: space-around;
      box-sizing: border-box;

      .task {
        box-sizing: border-box;
        width: 150rpx;
        height: 150rpx;
        margin-top: 28px;
        text-align: center;

        .task_image {
          width: 100rpx;
          height: 100rpx;
        }

        .text {
          color: #b3b3b3;
        }
      }
    }

    .s_panel {
      position: relative;

      .content {
        text-align: center;
      }

      .btns {
        display: flex;
        justify-content: space-around;
        width: 100%;
        position: fixed;
        bottom: 10px;

        .cancel,
        .confirm {
          width: 200rpx;
        }

        .cancel {
          color: #127ddb;
          background-color: #f3f3f3;
        }

        .confirm {
          background-color: #127ddb;
          color: #fff;
        }
      }
    }
  }
</style>
