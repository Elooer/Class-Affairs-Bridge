<template>
  <view class="container">
    <uni-nav-bar title="我的" statusBar backgroundColor="#127ddb" color="#ffffff" fixed="true"></uni-nav-bar>
    <view class="top" @click="toUserInfo" hover-class='press-style' hover-stay-time=100>
      <view class="left">
        <image :src="userInfo.avatarUrl" class="avatar"></image>
        <view class="name">
          <view class="nickName">{{userInfo.nickName}}</view>
          <view class="realName">{{stuInfo.username}}</view>
        </view>
      </view>
      <view class="right">
        <view class="change_info">修改资料</view>
        <uni-icons class="right_icon" type="forward" size="20"></uni-icons>
      </view>
    </view>
    <view class="manage">
      <view class="item" hover-class='press-style' hover-stay-time=100>
        <view class="item_left">
          <image class="item_left_img" src="http://43.138.133.249:8080/pictures/share.png" mode=""></image>
          <view class="text">推荐给好友<button class="share" open-type="share" title="分享" hover-class="none"></button></view>
        </view>
        <view class="item_right">
          <uni-icons class="right_icon" type="forward" size="25"></uni-icons>
        </view>
      </view>
      <view class="item" hover-class='press-style' hover-stay-time=100>
        <view class="item_left">
          <image class="item_left_img" src="http://43.138.133.249:8080/pictures/invite.png" mode=""></image>
          <view class="text">邀请同学加入</view>
        </view>
        <view class="item_right">
          <uni-icons class="right_icon" type="forward" size="25"></uni-icons>
        </view>
      </view>
      <view class="item" hover-class='press-style' hover-stay-time=100>
        <view class="item_left">
          <image class="item_left_img" src="http://43.138.133.249:8080/pictures/feedback.png" mode=""></image>
          <view class="text">意见反馈</view>
        </view>
        <view class="item_right">
          <uni-icons class="right_icon" type="forward" size="25"></uni-icons>
        </view>
      </view>
      <view class="item" hover-class='press-style' hover-stay-time=100>
        <view class="item_left">
          <image class="item_left_img" src="http://43.138.133.249:8080/pictures/about.png" mode=""></image>
          <view class="text">关于班务Bridge</view>
        </view>
        <view class="item_right">
          <uni-icons class="right_icon" type="forward" size="25"></uni-icons>
        </view>
      </view>
    </view>
    <view class="version">
      <view class="left">
        <image class="version_image" src="http://43.138.133.249:8080/pictures/version.png" mode=""></image>
        <view class="text">当前版本</view>
      </view>
      <view class="right">1.0.0</view>
    </view>
    <button class="logout" hover-class='press-style' hover-stay-time=100 @click="logout">退出登录</button>
    <mpopup ref="mpopup" :isdistance="true"></mpopup>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
import mpopup from '../../components/xuan-popup/xuan-popup.vue'
import badegeMix from '@/mixins/tabbar-badge.js'
  
  export default {
    mixins: [badegeMix],
    components: {
      mpopup
    },
    onShareAppMessage: function(res) {
      if (res.from == 'button') {
      }
      return {
        title: '班务Bridge|班级事务管理帮手',
        path: '/pages/class/class', //这里是被分享的人点击进来之后的页面
        imageUrl: 'http://43.138.133.249:8080/pictures/contact.png' //这里是图片的路径
      }
    },
    data() {
      return {
        
      };
    },
    computed: {
      ...mapState('my_user', ['userInfo', 'stuInfo'])
    },
    methods: {
      ...mapMutations('my_user', ['updateUserInfo', 'updateToken', 'updateId']),
      toUserInfo() {
        uni.navigateTo({
          url: '../../subpkg/user_info/user_info'
        })
      },
      // 退出登录
      async logout() {
        const [err, res] = await uni.showModal({
          title: '提示',
          content: '确定退出登录吗？'
        }).catch(err => err)

        if (res && res.confirm) {
          // 用户确认了退出登录的操作
          // 需要清空 vuex 中的 userinfo和token和id
          this.updateUserInfo({})
          this.updateToken('')
          this.updateId('')
          
          this.$refs.mpopup.open({
            type: 'success',
            content: '退出登录成功！',
            timeout: 1500,
          })
          setTimeout(() => {
            uni.reLaunch({
              url: '../../subpkg/login/login'
            })
          }, 1500)
        }
      }
    }
  }
</script>

<style lang="scss">
  .container {
    padding: 0 30rpx;

    .top {
      display: flex;
      justify-content: space-between;
      height: 100px;
      margin-top: 30rpx;
      padding: 0 20rpx;
      background-color: #ffffff;
      border: 1px soled #eeeeee;
      border-radius: 15rpx;
      box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.1);

      .left {
        display: flex;
        justify-content: space-around;
        height: 100%;

        .avatar {
          display: block;
          height: 70px;
          width: 70px;
          margin-top: 15px;
          margin-right: 15rpx;
          border-radius: 35px;
          border: 1px solid #ffffff;
        }

        .name {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          box-sizing: border-box;
          height: 100%;
          padding: 10px 0;

          .nickName {
            font-weight: bold;
            font-size: 18px;
          }

          .realName {
            color: #888888;
            
          }
        }
      }

      .right {
        display: flex;
        justify-content: space-between;
        line-height: 100px;
        color: #5d5d5d;

        .change_info {
          font-size: 16px;
        }
      }
    }

    .manage {
      margin-top: 20px;
      background-color: #ffffff;
      border: 1px soled #eeeeee;
      border-radius: 15rpx;
      box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.1);

      .item {
        display: flex;
        justify-content: space-between;
        height: 60px;
        padding-left: 20rpx;
        box-sizing: border-box;
        border-bottom: 1px solid #eeeeee;
        line-height: 60px;

        .item_left {
          display: flex;
          justify-content: start;

          .item_left_img {
            width: 35px;
            height: 35px;
            margin-top: 12px;
            margin-right: 10rpx;
          }

          .text {
            position: relative;
            height: 100%;

            .share {
              position: absolute;
              top: 0;
              left: -50px;
              width: 690rpx;
              height: 100%;
              border: 0;
              opacity: 0;
            }
          }
        }

        .item_right {
          margin-right: 20rpx;
          color: #eeeeee;
        }
      }
    }

    .version {
      display: flex;
      justify-content: space-between;
      height: 60px;
      padding-left: 20rpx;
      box-sizing: border-box;
      line-height: 60px;
      margin-top: 15px;
      background-color: #ffffff;
      border-radius: 15rpx;
      border: 1px soled #eeeeee;
      box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.1);

      .left {
        display: flex;
        justify-content: start;

        .version_image {
          width: 35px;
          height: 35px;
          margin-top: 12px;
          margin-right: 10rpx;
        }

        .text {
          height: 100%;
        }
      }

      .right {
        margin-right: 20rpx;
        color: #bfbfbf;
      }
    }

    .logout {
      margin-top: 50px;
      background-color: #e66069;
      color: #ffffff;
      border-radius: 20px;
    }

    .press-style {
      transform: scale(0.99, 0.99);
      /*缩放*/
      background: #eeeeee;
    }
  }
</style>
