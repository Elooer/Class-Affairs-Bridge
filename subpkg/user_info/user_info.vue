<template>
  <view>
    <uni-nav-bar title="个人资料" statusBar backgroundColor="#127ddb" color="#ffffff" fixed="true" left-icon="left"
      left-text="返回" @clickLeft="back"></uni-nav-bar>
    <uni-card>
      <view class="top">
        修改资料
      </view>
    </uni-card>
    <uni-card class="useInfo">
      <view class="item">
        <view class="item_a">姓名</view>
        <input class="inp" type="text" v-model="username" :placeholder="showName" />
        <uni-icons type="forward" color=""></uni-icons>
      </view>
      <view class="item">
        <view class="item_a">学号</view>
        <input class="inp" type="text" v-model="classNumber" />
        <uni-icons type="forward" color=""></uni-icons>
      </view>
      <button @click="change" class="btn" hover-class="press_style">修改</button>
    </uni-card>
    <mpopup ref="mpopup" :isdistance="true"></mpopup>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  import mpopup from '../../components/xuan-popup/xuan-popup.vue'
  import wybPopup from '@/components/wyb-popup/wyb-popup.vue'
  export default {
    components: {
      mpopup,
      wybPopup
    },
    onLoad() {
      this.username = this.stuInfo['username'] || ''
      this.classNumber = this.stuInfo['classNumber'] || ''
    },
    data() {
      return {
        username: '',
        classNumber: '',
        msgType: "success",
        message: "这是一条成功消息提示"
      };
    },
    computed: {
      ...mapState('my_user', ['stuInfo'])
    },
    methods: {
      ...mapMutations('my_user', ['updateStuInfo']),
      back() {
        uni.navigateBack({
          delta: 1
        })
      },
      change() {
        this.updateStuInfo({
          username: this.username,
          classNumber: this.classNumber
        })
        this.$refs.mpopup.open({
          type: 'success',
          content: '修改成功',
          timeout: 1500,
        })
        setTimeout(() => {
          uni.switchTab({
            url: '../../pages/my/my'
          })
        }, 1500)
      }
    }
  }
</script>

<style lang="scss">
  .top {
    box-sizing: border-box;
    height: 30px;
    line-height: 30px;
    font-size: 20px;
  }

  .useInfo {
    .item {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #eeeeee;

      .item_a {
        width: 20%;
        font-size: 18px;
      }

      .inp {
        width: 80%;
        height: 50px;
        font-size: 18px;
      }
    }

    .btn {
      margin-top: 20px;
      background-color: #127ddb;
      color: #ffffff;
      border-radius: 20px;
    }

    .press_style {
      background-color: rgba(17, 124, 217, 0.5)
    }
  }
</style>
