<template>
  <view>
    <uni-nav-bar :title="title" statusBar backgroundColor="#127ddb" color="#ffffff" fixed="true" left-icon="left"
      left-text="返回" @clickLeft="back"></uni-nav-bar>
    <!-- 发布板块 -->
    <view class="main" v-if="title === '发布任务' || title === '发布作业'">
      <view class="header">
        <view class="title">标题</view>
        <input class="t_content" type="text" placeholder="请输入作业或任务标题" v-model="taskTitle">
      </view>
      <view class="discribe">
        <textarea placeholder="请输入详细描述" class="content" show-confirm-bar="false" v-model="taskDetail"></textarea>
      </view>
      <view class="bottom">
        <text style="font-size: 12px;color: #db472c;">注：选择图片和文件时每次选择一份，可分多次选择</text>
        <uni-file-picker v-model="images" :image-styles="imageStyles" title="添加图片" @select="select" @delete="delFile">
          <view class="chose">+</view>
        </uni-file-picker>
        <uni-file-picker v-model="value" file-mediatype="all" title="添加文件" @select="select" @delete="delFile">
          <button class="chose_btn">选择文件</button>
        </uni-file-picker>
      </view>
    </view>
    <!-- 任务或作业详情 -->
    <view class="main" v-else>
      <view class="header">
        <view class="title">标题</view>
        <view class="t_content" style="color: #414141" v-if="title === '我的任务'">
          {{taskList[index].title || '无'}}
        </view>
        <view class="t_content" style="color: #414141" v-if="title === '我的作业'">
          {{workList[index].title || '无'}}
        </view>
      </view>
      <view class="" style="position: absolute;right: 0;margin: 10px;"><text>发布者：</text><text
          style="background-color: #ec8641;color: #fff;padding: 3px;border-radius: 3px;">{{pubPerson}}</text></view>
      <view class="" style="color: #666;margin-top: 40px;">描述：</view>
      <view class="discribe"
        style="border: 0px solid #127ddb;border-radius: 0;color: #666;background-color: #f7f7f7;margin-bottom: 20px;"
        v-if="title === '我的任务'">
        {{taskList[index].detail || '空'}}
      </view>
      <view class="" v-if="title === '我的任务' && (filesArr.length || imgFiles.length)"
        style="font-size: 14px;color: #666;">附件及图片</view>
      <image :src="'https://lapichang.top/' + item" v-if="title === '我的任务'" mode=""
        style="width: 50px;height: 50px;margin: 15px 2px;" v-for="(item, index) in imgFiles" :key="index"
        @click="previewImg(item)">
      </image>
      <!-- 附件 -->
      <view class="" style="display: flex;">
        <view v-if="title === '我的任务'" class="files_style" v-for="(item, index) in filesArr" :key="index"
          @click="viewFile(item)">附件{{index+1}}
        </view>
      </view>
      <view class="discribe"
        style="border: 0px solid #127ddb;border-radius: 0;color: #666;background-color: #f7f7f7;margin-bottom: 20px;"
        v-if="title === '我的作业'">
        {{workList[index].detail || '空'}}
      </view>
      <view class="" v-if="title === '我的作业' && (filesArr.length || imgFiles.length)"
        style="font-size: 14px;color: #666;">附件及图片</view>
      <image :src="'https://lapichang.top/' + item" v-if="title === '我的作业'" mode=""
        style="width: 50px;height: 50px;margin: 15px 2px;" v-for="(item, index) in imgFiles" :key="index"
        @click="previewImg(item)">
      </image>
      <!-- 附件 -->
      <view class="" style="display: flex;">
        <view v-if="title === '我的作业'" class="files_style" v-for="(item, index) in filesArr" :key="index"
          @click="viewFile(item)">附件{{index+1}}
        </view>
      </view>
      <view class="" v-if="title === '我的任务'" style="position: absolute;right: 10px;bottom: 5px;"><text>截止时间：</text><text
          style="color: #127ddb;">{{taskList[index].endtime || '未设定'}}</text>
      </view>
      <view class="" v-if="title === '我的作业'" style="position: absolute;right: 10px;bottom: 5px;"><text>截止时间：</text><text
          style="color: #127ddb;">{{workList[index].endtime || '未设定'}}</text>
      </view>
    </view>
    <view class="" v-if="title === '我的任务' && id === pubId"
      style="margin-left: 560rpx;background-color: #5e9bdb;color: #fff;padding: 5px;" @click="taskUnFinished">查看未完成
    </view>
    <view class="" v-if="title === '我的作业' && id === pubId"
      style="margin-left: 560rpx;background-color: #5e9bdb;color: #fff;padding: 5px;" @click="workUnFinished">查看未完成
    </view>
    <!-- 提交的操作面板 -->
    <view class="bottom" v-if="title === '我的任务' && id !== pubId || title === '我的作业' && id !== pubId">
      <textarea style="background-color: #f7f7f7;padding: 10px;" placeholder="在此键入内容"></textarea>
      <text style="font-size: 12px;color: #db472c;">注：不可同时选择图片和选择文件，若要上传多图或多文件请打包好从选择文件按上传</text>
      <uni-file-picker v-model="images" :image-styles="imageStyles" title="添加图片" @select="select" @delete="delFile"
        :limit="1">
        <view class="chose">+</view>
      </uni-file-picker>
      <uni-file-picker v-model="value" file-mediatype="all" title="添加文件" @select="select"
        @delete="delFile" :limit="1">
        <button class="chose_btn">选择文件</button>
      </uni-file-picker>
    </view>
    <!-- 这是给发布展示的一些操作组件 -->
    <view class="publish_bottom" v-if="title === '发布任务' || title === '发布作业'">
      <view class="end_date">
        <view class="set">设置截止时间：</view>
        <uni-datetime-picker type="datetime" v-model="datetimesingle" @change="changeLog" :border="false"
          :clear-icon="false" />
      </view>
      <button class="pub_btn" v-if="title === '发布任务'" @click="upload(1, 0)" hover-class="press_style"
        hover-stay-time=100>发布</button>
      <button class="pub_btn" v-else @click="upload(2, 0)" hover-class="press_style" hover-stay-time=100>发布</button>
    </view>

    <button class="sub_btn" v-if="title === '我的任务' && id !== pubId" @click="submitTask" hover-class="press_style"
      hover-stay-time=100>提交任务</button>
    <button class="sub_btn" v-if="title === '我的作业' && id !== pubId" @click="submitWork" hover-class="press_style"
      hover-stay-time=100>提交作业</button>
    <!-- 获取提交文件 -->
    <view class="get_files" v-if="title === '我的任务' && id === pubId" @click="copyFilesUrl(taskList[index].id)"
      hover-class="press_style" hover-stay-time=100>
      <image src="http://43.138.133.249:8080/pictures/folder.png" mode="" style="width: 30px;height: 30px;margin-top: 15px;margin-left: 50px;">
      </image>
      <view class="text">获取已提交文件</view>
    </view>
    <view class="get_files" v-if="title === '我的作业' && id === pubId" @click="copyFilesUrl(workList[index].id)"
      hover-class="press_style" hover-stay-time=100>
      <image src="http://43.138.133.249:8080/pictures/folder.png" mode="" style="width: 30px;height: 30px;margin-top: 15px;margin-left: 50px;">
      </image>
      <view class="text">获取已提交文件</view>
    </view>
    <!-- 结束任务 -->
    <button class="end_btn" v-if="title === '我的任务' && id === pubId" @click="endTask" hover-class="press_style"
      hover-stay-time=100>结束任务</button>
    <button class="end_btn" v-if="title === '我的作业' && id === pubId" @click="endWork" hover-class="press_style"
      hover-stay-time=100>结束作业</button>
    <mpopup ref="mpopup" :isdistance="true"></mpopup>
    <!-- 查看未完成人数 -->
    <wyb-popup class="pop" ref="unfi" type="center" height="800" width="500" radius="6" duration="200" scrollY>
      <view class="" v-if="title === '我的任务'">
        <view class="unfinshied_list" style="color: #db472c;">未完成人数({{taskUnFinishedList.length}})</view>
        <view class="unfinshied_list" v-for="(item, index) in taskUnFinishedList" :key="item.sid">
          {{item.sname}}
        </view>
      </view>
      <view class="" v-if="title === '我的作业'">
        <view class="unfinshied_list" style="color: #db472c;">未完成人数({{workUnFinishedList.length}})</view>
        <view class="unfinshied_list" v-for="(item, index) in workUnFinishedList" :key="item.sid">
          {{item.sname}}
        </view>
      </view>
    </wyb-popup>
    <!-- 结束时查看的未完成人数 -->
    <wyb-popup class="pop" ref="unfi1" type="center" height="800" width="500" radius="6" duration="200" scrollY
      @hide="endBack(title.slice(2))">
      <view class="" v-if="title === '我的任务'">
        <view class="unfinshied_list" style="color: #db472c;">未完成人数({{taskUnFinishedList.length}})必要时请截图</view>
        <view class="unfinshied_list" v-for="(item, index) in taskUnFinishedList" :key="item.sid">
          {{item.sname}}
        </view>
      </view>
      <view class="" v-if="title === '我的作业'">
        <view class="unfinshied_list" style="color: #db472c;">未完成人数({{workUnFinishedList.length}})必要时请截图</view>
        <view class="unfinshied_list" v-for="(item, index) in workUnFinishedList" :key="item.sid">
          {{item.sname}}
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
  import badegeMix from '@/mixins/tabbar-badge.js'
  import mpopup from '../../components/xuan-popup/xuan-popup.vue'
  import wybPopup from '@/components/wyb-popup/wyb-popup.vue'
  export default {
    components: {
      mpopup,
      wybPopup
    },
    mixins: [badegeMix],
    onLoad(option) {
      this.getTaskList()
      this.getWorkList()
      this.title = option.title
      if (option.cid) {
        this.cid = option.cid
        this.getStuList()
      }
      if (option.index) {
        this.index = option.index
      }
    },
    onShow() {
      this.getTaskList()
      this.getWorkList()
    },
    data() {
      return {
        title: '',
        // 任务或作业标题
        taskTitle: '',
        // 任务或作业描述
        taskDetail: '',
        // 班级号
        cid: '',
        // 学生列表
        stuList: [],
        // 当前发布者姓名
        pubPerson: '',
        // 发布者id
        pubId: 0,
        imageStyles: {
          width: 84,
          height: 84,
        },
        // 默认显示的图片
        images: [],
        datetimesingle: '',
        value: [],
        // 点击了的任务或作业的索引
        index: 0,
        taskUnFinishedList: [],
        workUnFinishedList: [],
        // 待上传的文件列表
        uploadFilesPath: [],
        // 上传成功返回的具体路径用于作为发布的参数
        pubUrlArray: [],
        // 班级学生提交的所有文件打包好的下载路径
        allStuSumbitUrl: '',
        // 常见图片类型
        imgType: ['jpg', 'png', 'jpeg', 'gif', 'bmp'],
        // 附图数组
        imgFiles: [],
        // 附件数组
        filesArr: [],
        // 用于预览图片时指定的数组
        imgFiles2: []
      };
    },
    computed: {
      ...mapState('my_user', ['id']),
    },
    methods: {
      back() {
        uni.navigateBack({
          delta: 1
        })
      },
      changeLog(e) {
      },
      select(e) {
        this.uploadFilesPath = [...this.uploadFilesPath, e.tempFilePaths[0]]
      },
      delFile(e) {
        this.uploadFilesPath.pop(this.uploadFilesPath.find(item => item === e.path))
      },
      // 上传文件
      upload(flag, currentIndex) {
        if (!this.uploadFilesPath.length && flag === 1) {
          return this.addTask()
        } else if (!this.uploadFilesPath.length && flag === 2) {
          return this.addWork()
        }
        var t = this
        wx.uploadFile({
          url: 'https://www.lapichang.top/qiniu/upload',
          name: 'file',
          filePath: t.uploadFilesPath[currentIndex],
          success: function(res) {
            t.pubUrlArray.push(JSON.parse(res.data).data)
            // 判断是否还有需要上传的图片
            if (currentIndex + 1 < t.uploadFilesPath.length) {
              // 继续上传下一张图片
              if (flag === 1) {
                t.upload(1, currentIndex + 1)
              } else {
                t.upload(2, currentIndex + 1)
              }
            } else {
              if (flag === 1) {
                t.addTask()
              } else {
                t.addWork()
              }

            }
          },
          fail: function(res) {
            console.log('第' + (currentIndex + 1) + '张图片上传失败')
          }
        })
      },
      // 获取任务列表
      async getTaskList(cb) {
        const res = await uni.$http.get('/bwThings/getTaskList', {
          cid: this.current,
          sid: this.id
        })
        this.taskList = res.data.data
        this.getPubPerson()
        this.imgFiles.forEach(item => {
          if (this.imgFiles2.indexOf('https://lapichang.top/' + item) === -1) {
            this.imgFiles2.push('https://lapichang.top/' + item)
          }
        })
      },
      // 获取作业列表
      async getWorkList() {
        const res = await uni.$http.get('/bwThings/getWorkList', {
          cid: this.current,
          sid: this.id
        })
        this.workList = res.data.data
        this.getPubPerson()
        this.imgFiles.forEach(item => {
          if (this.imgFiles2.indexOf('https://lapichang.top/' + item) === -1) {
            this.imgFiles2.push('https://lapichang.top/' + item)
          }
        })
      },
      // 获取学生列表并标识学生身份
      async getStuList() {
        const res = await uni.$http.get('/bwClass/getStudentList', {
          cid: this.cid
        })
        this.stuList = res.data.data
        this.srole = this.stuList.find(item => item.sid === this.id).srole
      },
      // 获取当前任务发布者的姓名和id
      getPubPerson() {
        this.updateTotal(this.taskList.length + this.workList.length)
        if (this.title === '我的任务') {
            this.pubPerson = this.stuList.find(stu => stu.sid === this.taskList[this.index].sid).sname
            this.pubId = this.stuList.find(stu => stu.sid === this.taskList[this.index].sid).sid
          // 附件分类
          this.taskList[this.index].fileList.forEach(item => {
            if (this.imgType.indexOf(item.file.split('.')[1]) !== -1 && this.imgFiles.indexOf(item.file) === -1) {
              this.imgFiles.push(item.file)
            } else if (this.imgType.indexOf(item.file.split('.')[1]) === -1 && this.filesArr.indexOf(item.file) ===
              -1) {
              this.filesArr.push(item.file)
            }
          })
        } else if (this.title === '我的作业') {
            this.pubPerson = this.stuList.find(stu => stu.sid === this.workList[this.index].sid).sname
            this.pubId = this.stuList.find(stu => stu.sid === this.workList[this.index].sid).sid
            // 附件分类
          this.workList[this.index].fileList.forEach(item => {
            if (this.imgType.indexOf(item.file.split('.')[1]) !== -1 && this.imgFiles.indexOf(item.file) === -1) {
              this.imgFiles.push(item.file)
            } else if (this.imgType.indexOf(item.file.split('.')[1]) === -1 && this.filesArr.indexOf(item.file) ===
              -1) {
              this.filesArr.push(item.file)
            }
          })
        }
      },
      // 获取任务未完成名单
      async taskUnFinished() {
        const res = await uni.$http.get('/bwThings/getTaskFinishList', {
          tid: this.taskList[this.index].id
        })
        this.taskUnFinishedList = res.data.data
        this.$refs.unfi.show()
      },
      // 获取作业未完成名单
      async workUnFinished() {
        const res = await uni.$http.get('/bwThings/getWorkFinishList', {
          wid: this.workList[this.index].id
        })
        this.workUnFinishedList = res.data.data
        this.$refs.unfi.show()
      },
      // 预览图片
      previewImg(item) {
        uni.previewImage({
          current: 'https://lapichang.top/' + item, // 图片的地址url
          urls: this.imgFiles2 // 预览的地址url
        })
      },
      // 预览附件
      viewFile(item) {
        wx.downloadFile({
          url: 'https://lapichang.top/' + item, // 地址已打码，自己换个其他的地址（"https://www.xxxxx.com/file/测试通知.pdf"）
          success: function(res) {
            if (res.statusCode != 200) {
              return false
            }
            var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
            wx.openDocument({
              filePath: Path,
              showMenu: true,
              success: function(res) {
                util.hideLoading()
              }
            })
          }
        })
      },
      // 提交任务
      async submitTask() {
        const [err, res] = await uni.showModal({
          title: '提示',
          content: '确定提交该任务吗？'
        }).catch(err => err)
        if (res && res.confirm) {
          if (!this.uploadFilesPath.length) {
            return uni.$showMsg('请选择需要上传的文件')
          }
          uni.uploadFile({
            url: `https://www.lapichang.top/bwThings/downloadFile/${this.taskList[this.index].id}`,
            name: 'file',
            filePath: this.uploadFilesPath[0],
            success: (res) => {
              console.log('成功', res)
            }
          })
          const res = await uni.$http.delete('/bwThings/toFinishTask', {
            sid: this.id,
            id: this.taskList[this.index].id
          })
          if (!res.data.flag) {
            return this.$refs.mpopup.open({
              type: 'err',
              content: '提交任务失败！',
              timeout: 1000,
            })
          }
          this.$refs.mpopup.open({
            type: 'success',
            content: `提交任务成功！`,
            timeout: 1000,
          })
          setTimeout(() => {
            this.back()
          }, 1000)
        }
      },
      // 提交作业
      async submitWork() {
        const [err, res] = await uni.showModal({
          title: '提示',
          content: '确定提交该作业吗？'
        }).catch(err => err)
        if (res && res.confirm) {
          if (!this.uploadFilesPath.length) {
            return uni.$showMsg('请选择需要上传的文件')
          }
          uni.uploadFile({
            url: `https://www.lapichang.top/bwThings/downloadFile/${this.workList[this.index].id}`,
            name: 'file',
            filePath: this.uploadFilesPath[0],
            success: (res) => {
              console.log('成功', res)
            }
          })
          const res = await uni.$http.delete('/bwThings/toFinishWork', {
            sid: this.id,
            id: this.workList[this.index].id
          })
          if (!res.data.flag) {
            return this.$refs.mpopup.open({
              type: 'err',
              content: '提交作业失败！',
              timeout: 1000,
            })
          }
          this.$refs.mpopup.open({
            type: 'success',
            content: `提交作业成功！`,
            timeout: 1000,
          })
          setTimeout(() => {
            this.back()
          }, 1000)
        }
      },
      // 获得已提交文件的下载地址
      async copyFilesUrl(id) {
        console.log('获取文件', id);
        const res = await uni.$http.get('/bwThings/getFinishFile', {
          id: id
        })
        if (!res.data.flag) {
          return uni.$showMsg('目前没有已提交文件')
        }
        this.allStuSumbitUrl = 'https://lapichang.top/' + res.data.data

        uni.setClipboardData({
          data: this.allStuSumbitUrl,
          success: function(res) {
            uni.getClipboardData({
              success: function(res) {
                uni.$showMsg('下载链接已复制到剪切板')
              }
            })
          }
        })
      },
      // 结束任务
      async endTask() {
        const [err, res] = await uni.showModal({
          title: '提示',
          content: '确定结束该任务吗？'
        }).catch(err => err)
        if (res && res.confirm) {
          this.copyFilesUrl(this.taskList[this.index].id)
          const res = await uni.$http.delete(`/bwThings/endTask/${this.taskList[this.index].id}`)
          if (!res.data.flag) {
            return this.$refs.mpopup.open({
              type: 'err',
              content: '结束任务失败！',
              timeout: 1000,
            })
          }
          this.taskUnFinishedList = res.data.data
          this.$refs.unfi1.show()
        }
      },
      // 结束作业
      async endWork() {
        const [err, res] = await uni.showModal({
          title: '提示',
          content: '确定结束该作业吗？'
        }).catch(err => err)
        if (res && res.confirm) {
          this.copyFilesUrl(this.workList[this.index].id)
          this.copyFilesUrl()
          const res = await uni.$http.delete(`/bwThings/endWork/${this.workList[this.index].id}`)
          if (!res.data.flag) {
            return this.$refs.mpopup.open({
              type: 'err',
              content: '结束作业失败！',
              timeout: 1000,
            })
          }
          this.workUnFinishedList = res.data.data
          this.$refs.unfi1.show()
        }
      },
      // 结束关闭弹窗后返回
      endBack(name) {
        this.$refs.mpopup.open({
          type: 'success',
          content: `${name}已结束！`,
          timeout: 1000,
        })
        setTimeout(() => {
          this.back()
        }, 1000)
      },
      // 发布任务
      async addTask() {
        const taskObj = {
          cid: this.cid,
          sid: this.id,
          title: this.taskTitle,
          detail: this.taskDetail,
          endtime: this.datetimesingle,
          files: JSON.parse(JSON.stringify(this.pubUrlArray)).toString()
        }
        const res = await uni.$http.post('/bwThings/addNewTask', taskObj)
        // console.log(res)
        if (!res.data.flag) {
          return this.$refs.mpopup.open({
            type: 'err',
            content: '发布失败！',
            timeout: 1000,
          })
        }
        // 重新得到任务列表以获得数量
        this.getTaskList()
        this.$refs.mpopup.open({
          type: 'success',
          content: '发布成功！',
          timeout: 1000,
        })
        setTimeout(() => {
          uni.switchTab({
            url: '../../pages/class/class'
          })
        }, 1000)
      },
      // 发布作业
      async addWork() {
        const workObj = {
          cid: this.cid,
          sid: this.id,
          title: this.taskTitle,
          detail: this.taskDetail,
          endtime: this.datetimesingle,
          files: JSON.parse(JSON.stringify(this.pubUrlArray)).toString()
        }
        const res = await uni.$http.post('/bwThings/addNewWork', workObj)
        // console.log(res)
        if (!res.data.flag) {
          return this.$refs.mpopup.open({
            type: 'err',
            content: '发布失败！',
            timeout: 1000,
          })
        }
        // 重新得到任务列表以获得数量
        this.getTaskList()
        this.$refs.mpopup.open({
          type: 'success',
          content: '发布成功！',
          timeout: 1000,
        })
        setTimeout(() => {
          uni.switchTab({
            url: '../../pages/class/class'
          })
        }, 1000)
      }
    }
  }
</script>

<style lang="scss">
  .main {
    position: relative;
    background-color: #fff;
    margin: 15px;
    padding: 15px;

    .header {
      display: flex;
      border-bottom: 1px solid #000;
      padding-bottom: 10px;

      .title {
        width: 20%;
        font-size: 20px;
        height: 26px;
        line-height: 23px;
      }

      .t_content {
        width: 80%;
        font-size: 18px;
        color: #666666;
      }
    }

    .discribe {
      margin-top: 10px;
      border: 1px solid #686868;
      border-radius: 10px;
      padding: 10px;

      .content {
        margin-right: 5px;
      }


    }

    .bottom {
      .chose {
        width: 45px;
        height: 45px;
        margin-top: 10px;
        margin-right: 10px;
        border: 1px solid #7d7d7d;
        border-radius: 5px;
        font-size: 25px;
        text-align: center;
        line-height: 45px;
        color: #666666;
      }

      .chose_btn {
        width: 375rpx;
        background-color: #127ddb;
        color: #ffffff;
      }

      .file-picker__box-content {
        border: 0 !important;
      }
    }
  }

  // 提交作业的面板
  .bottom {
    background-color: #fff;
    margin: 15px;
    padding: 10px;

    .chose {
      width: 45px;
      height: 45px;
      margin-top: 10px;
      margin-right: 10px;
      border: 1px solid #7d7d7d;
      border-radius: 5px;
      font-size: 25px;
      text-align: center;
      line-height: 45px;
      color: #666666;
    }

    .chose_btn {
      width: 375rpx;
      background-color: #127ddb;
      color: #ffffff;
    }

    .file-picker__box-content {
      border: 0 !important;
    }
  }

  .end_date {
    display: flex;
    justify-content: space-between;
    margin: 15px;
    background-color: #fff;
    line-height: 53px;
    font-size: 13px;

    .set {
      padding-left: 10px;
    }
  }

  .sub_btn {
    margin-top: 30px;
    margin-bottom: 30px;
    width: 650rpx;
    background-color: #1050db;
    color: #ffffff;
  }

  .get_files {
    display: flex;
    width: 500rpx;
    height: 60px;
    line-height: 60px;
    background-color: #fff3cf;
    margin: auto;
    margin-top: 20px;
    box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.1);

    .text {
      font-size: 16px;
      margin-left: 10px;
      color: #868686;
    }
  }

  .end_btn {
    margin-top: 30px;
    margin-bottom: 30px;
    width: 650rpx;
    background-color: #db4638;
    color: #ffffff;
  }

  .pub_btn {
    width: 650rpx;
    background-color: #1050db;
    color: #ffffff;
    margin-bottom: 30px;
  }

  .files_style {
    width: 90rpx;
    height: 60px;
    background-color: #fcfff0;
    margin-bottom: 10px;
    line-height: 111px;
    background: url('http://43.138.133.249:8080/pictures/file_logo.png') no-repeat;
    background-size: 45px 50px;
    font-size: 12px;
    text-align: center;
    color: #7c7c7c;
  }

  .unfinshied_list {
    height: 50px;
    text-align: center;
    line-height: 50px;
  }

  .press_style {
    background-color: rgba(17, 124, 217, 0.5)
  }
</style>
