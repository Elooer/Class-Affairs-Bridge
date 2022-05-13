<template>
  <view class="container">
    <uni-nav-bar title="登录" statusBar backgroundColor="#127ddb" color="#ffffff" fixed="true"></uni-nav-bar>
    <swiper class="swiper" autoplay interval="1500" circular duration="500">
      <swiper-item class="swiper_item">
        <image class="swipter_img" src="http://43.138.133.249:8080/pictures/notice.png" mode=""></image>
        <view class="text">班级通知一键送达</view>
      </swiper-item>
      <swiper-item class="swiper_item">
        <image class="swipter_img" src="http://43.138.133.249:8080/pictures/list.png" mode=""></image>
        <view class="text">待办事项清晰明了</view>
      </swiper-item>
      <swiper-item class="swiper_item">
        <image class="swipter_img" src="http://43.138.133.249:8080/pictures/file.png" mode=""></image>
        <view class="text">文件上传快捷方便</view>
      </swiper-item>
      <swiper-item class="swiper_item">
        <image class="swipter_img" src="http://43.138.133.249:8080/pictures/complete.png" mode=""></image>
        <view class="text">任务完成效率提高</view>
      </swiper-item>
      <swiper-item class="swiper_item">
        <image class="swipter_img" src="http://43.138.133.249:8080/pictures/contact.png" mode=""></image>
        <view class="text">班级联系更加紧密</view>
      </swiper-item>
    </swiper>
    <button class="btn" @click="getUserProfile">微信一键登录</button>
    <mpopup ref="mpopup" :isdistance="true"></mpopup>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
 import mpopup from '../../components/xuan-popup/xuan-popup.vue'
   export default {
     components: {
       mpopup
     },
     onLoad() {
       this.getCode()
     },
    data() {
      return {
        msgType: '',
        sessionId: ''
      };
    },
    methods: {
      ...mapMutations('my_user', ['updateUserInfo', 'updateToken', 'updateId']),
      // 用户授权之后,获取用户的基本信息
      getUserProfile() {
        uni.getUserProfile({
          desc: '你的授权信息',
          success: (res) => {
            // 将信息存到 vuex 中
            this.updateUserInfo(res.userInfo)
            this.getToken(res)
          },
          fail: (res) => {
            return uni.$showMsg('您取消了登录授权')
          }
        })
      },
      // 获取code对应的值
      async getCode() {
        const [err, res] = await uni.login().catch(err => err)
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败!')
        this.code = res.code
      },
      // 获取用户的token
      async getToken(info) {
        uni.$http.get(`/user/getSessionId`, {code: this.code}).then(res => {
          this.sessionId = res.data.data.sessionId
          uni.setStorageSync('sessionId', res.data.data.sessionId)
          // 准备登录对象
          const query = {
            encryptedData: info.encryptedData,                    
            vi: info.iv,
            sessionId: uni.getStorageSync("sessionId")
          }
          
          // 登录请求
          uni.$http.post('/user/authLogin', query).then(res1=> {
            if(res1.statusCode == 200) {
              // 更新 vuex 中的 token
              this.updateToken(res1.data.data.token)
              // 更新vuex中的id
              this.updateId(res1.data.data.id)
              this.$refs.mpopup.open({
                type: 'success',
                content: '登录成功！',
                timeout: 1000,
              })
              setTimeout(() => {
                uni.switchTab({
                  url: '../../pages/class/class'
                })
              }, 1000)
            } else {
              this.$refs.mpopup.open({
                type: 'err',
                content: '服务器异常，登录失败！',
                timeout: 1500,
              })
            }
            
          })
        }).catch(err => err)
        
        
      },
    }
  }
</script>

<style lang="scss">
  .container {
    background-color: #fff;

    .swiper {
      height: 60vh;

      .swiper_item {
        height: 100%;
        width: 100%;

        .swipter_img {
          height: 90%;
          width: 100%;
        }

        .text {
          height: 10%;
          text-align: center;
          font-size: 25px;
          color: #058ce5;
        }
      }
    }

    .btn {
      background-color: #007AFF;
      color: #fff;
      border-radius: 30px;
      margin: 70px 20rpx;
    }
  }
</style>
