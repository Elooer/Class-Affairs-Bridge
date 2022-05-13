<template>
  <view class="container">
    <uni-nav-bar title="待办" statusBar backgroundColor="#127ddb" color="#ffffff" fixed="true"></uni-nav-bar>
    <uni-notice-bar showIcon="true" single="true" text="注意查收任务,要及时完成哦~"></uni-notice-bar>
    <uni-calendar class="calendar" ref="calendar" :insert="false" />
    <view class="openCalendar" @click="open" hover-class="press_style">
      <image class="open_img" src="http://43.138.133.249:8080/pictures/calendar.png" mode=""></image>
    </view>
    <view class="major">
      <view class="tab">
        <uni-segmented-control :current="curr" :values="items" @clickItem="onClickItem" styleType="button"
          activeColor="#127ddb"></uni-segmented-control>
      </view>
      <view class="content">
        <view v-show="curr === 0">
          <!-- 任务列表 -->
          <uni-list>
            <view v-for="(item,index) in taskList" @click="toDetail('我的任务', index)" :key="item.id">
              <uni-list-item :title="taskList[index].title || '无标题'"
                :note="'发布时间: '+(taskList[index].starttime || '未设定')" rightText="待完成" :key="taskList[index].id">
              </uni-list-item>
            </view>
          </uni-list>
        </view>
        <view v-show="curr === 1">
          <!-- 作业列表 -->
          <uni-list>
            <view class="" v-for="(item,index) in workList" @click="toDetail('我的作业', index)" :key="item.id">
              <uni-list-item :title="workList[index].title || '无标题'"
                :note="'发布时间: '+(workList[index].starttime || '未设定')" rightText="待完成" :key="workList[index].id">
              </uni-list-item>
            </view>
          </uni-list>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import badegeMix from '@/mixins/tabbar-badge.js'

  export default {
    mixins: [badegeMix],
    onLoad() {
      // 初始化作业和任务列表
      this.getTaskList()
    },
    onShow() {
      this.getTaskList()
    },
    onPullDownRefresh() {
      // 重置关键数据
      this.total = 0
      this.taskList = []
      this.workList = []
      
      // 重新发起数据请求
      this.getTaskList(() => uni.stopPullDownRefresh())
    },
    data() {
      return {
        filePath: [],
        // tab栏名称
        items: ['任务', '作业'],
        curr: 0,
        uploadFilesPath: []
      };
    },
    methods: {
      // 打开日历
      open() {
        this.$refs.calendar.open();
      },
      // 当前点击的tab项
      onClickItem() {
        this.curr = this.curr === 1 ? 0 : 1
      },
      toDetail(title, index) {
        uni.navigateTo({
          url: `../../subpkg/publish/publish?title=${title}&index=${index}&cid=${this.current}`
        })
      },
    }
  }
</script>

<style lang="scss">
  .container {
    position: relative;
    height: 100vh;

    .openCalendar {
      position: fixed;
      bottom: 20px;
      right: 20px;
      box-sizing: border-box;
      width: 50px;
      height: 50px;
      padding: 10px;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.1);
      border: 1px solid #eeeeee;
      z-index: 9999;

      .open_img {
        height: 30px;
        width: 30px;

      }
    }

    .major {
      padding: 0 20rpx;

      .segmented-control {
        height: 40px;

        .segmented-control__item {
          background-color: #ffffff;
        }
      }

      .content {
        height: 300px;

        // .uni-list-item__container {
        //   padding: 20px 15px;
        //   box-sizing: border-box;
        // }

        .uni-list-item__content-note {
          margin-top: 15px;
        }

        .uni-list-item__extra-text {
          color: #f52105;
        }
      }

    }

    .press_style {
      transform: scale(0.99, 0.99);
      /*缩放*/
      background: #eeeeee;
    }
  }
</style>
