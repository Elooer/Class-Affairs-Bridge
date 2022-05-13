<template>
  <view class="common" @click="btnHandler" hover-class='press-style' hover-stay-time=100>
    <image class="img" :src="src"></image>
    <text class="text">{{name}}</text>
  </view>
</template>

<script>
  export default {
    name: "operate-btn",
    props: {
      name: {
        type: String,
        default: ''
      },
      src: {
        type: String,
        default: ''
      }
    },
    data() {
      return {

      };
    },
    methods: {
      btnHandler() {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .common {
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    width: 525rpx;
    height: 150rpx;
    border: 1px solid #eee;
    line-height: 150rpx;
    background-color: #fff;
    border-radius: 20rpx;
    font-size: 20px;
    box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.1);
    padding: 0 50rpx;

    .img {
      height: 75rpx;
      width: 75rpx;
      margin-top: 35rpx;
    }

    .text {
      margin-right: 20rpx;
    }
  }
  
  .press-style {
    transform: scale(0.99, 0.99);
    /*缩放*/
    background: #eeeeee;
  }
</style>
