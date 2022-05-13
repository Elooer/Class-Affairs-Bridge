<template>
  <view>
    <uni-nav-bar :title="title" statusBar backgroundColor="#127ddb" color="#ffffff" fixed="true" left-icon="left"
      left-text="返回" @clickLeft="back"></uni-nav-bar>
    <!-- 创建班级 -->
    <view class="create" v-if="title === '创建班级'">
      <uni-card title="班级资料" mode="style" :is-shadow="true">
        <uni-forms ref="form1" :rules="rules" :modelValue="formData">
          <uni-forms-item label="班级号:">
            <uni-easyinput disabled type="text" placeholder="由平台设定" />
          </uni-forms-item>
          <uni-forms-item label="班级名称:" name="className">
            <uni-easyinput type="text" v-model="formData.className" placeholder="请输入班级名例如:软件2010" clearable=false />
          </uni-forms-item>
          <uni-forms-item label="你的姓名:" name="name">
            <uni-easyinput type="text" v-model="formData.name" placeholder="请输入你的姓名" clearable=false />
          </uni-forms-item>
        </uni-forms>
      </uni-card>
      <button class="btn" hover-class="button-hover" @click="createClass">创建</button>
    </view>
    <!-- 加入班级 -->
    <view class="join" v-else-if="title === '加入班级'">
      <uni-card>
        <uni-forms ref="form" :rules="rules" :modelValue="formData">
          <uni-forms-item label="班级号:" name="classNumber">
            <uni-easyinput type="text" v-model="formData.classNumber" placeholder="输入五位班级号" />
          </uni-forms-item>
          <uni-forms-item label="姓名:" name="name">
            <uni-easyinput type="text" v-model="formData.myName" placeholder="请输入你的姓名" clearable=false />
          </uni-forms-item>
        </uni-forms>
      </uni-card>
      <view class="chose">
        <uni-combox :candidates="candidates" placeholder="请选择你的身份" v-model="identity"></uni-combox>
      </view>
      <button class="btn" type="myType" @click="joinClass">加入</button>
    </view>
    <!-- 班级成员 -->
    <view class="m_list" v-else-if="title === '班级成员'">
      <view class="manage">
        <view class="">选项</view>
        <view class="" @click="settingClass">
          <uni-icons type="settings" size="25"></uni-icons>
        </view>
      </view>
      <view class="classify">班委</view>
      <view class="item_com" v-for="(item, index) in stuList" :key="item.id"
        v-if="item.srole === 0 || item.srole === 1">
        <view class="left">
          <img :src="item.portrait" class="avatar">
          <view class="com">班委</view>
          <view class="name">{{item.sname}}</view>
        </view>
        <view class="right" v-if="item.srole !== 0 && srole === 0"
          @click="mangeStudent(item.sid + '', item.srole + '')">
          <uni-icons type="more-filled" size="25" color="#676767"></uni-icons>
        </view>
      </view>
      <view class="classify">学生</view>
      <view class="item_stu" v-for="(item, index) in stuList" :key="item.id" v-if="item.srole === 2">
        <view class="left">
          <img :src="item.portrait" class="avatar">
          <view class="stu">学生</view>
          <view class="name">{{item.sname}}</view>
        </view>
        <!-- 这里的方法传参数据没问题，但必须转成字符串方法内部才能正确拿到 -->
        <view class="right" v-if="srole === 0" @click="mangeStudent(item.sid + '', item.srole + '')">
          <uni-icons type="more-filled" size="25" color="#676767"></uni-icons>
        </view>
      </view>
    </view>
    <!-- 班级列表 -->
    <view class="class_list" v-for="(item, i) in classList" :key="item.cid" @click="switchClass(item.cid)">
      <view class="cname">班级：{{item.cname}}</view>
      <view class="cid">班级号:{{item.cid}}</view>
      <image class="logo" src="http://43.138.133.249:8080/pictures/class_item.png" mode=""></image>
    </view>
    <mpopup ref="mpopup" :isdistance="true"></mpopup>
    <!-- 群主对成员的操作列表 -->
    <wyb-popup class="pop" ref="popup" type="center" height="250" width="350" radius="6" duration="200">
      <view class="mange_stu_box">
        <view class="change" @click="changeIdentity">修改身份</view>
        <view class="remove" @click="removeStudent">移出班级</view>
      </view>
    </wyb-popup>
    <!-- 班级操作列表 -->
    <wyb-popup class="pop" ref="popup1" type="bottom" height="250" width="500" radius="6" duration="200">
      <view class="class_setting">
        <view class="change_student_name" @click="changeMyName">修改我的名称</view>
        <view class="dissolve" v-if="srole === 0" @click="dissolveClass">解散班级</view>
        <view class="change_class_name" v-if="srole === 0" @click="changeClassName">修改班级名称</view>
        <view class="exit" @click="exitClass">退出班级</view>
      </view>
    </wyb-popup>
    <!-- 修改个人名字 -->
    <wyb-popup class="pop" ref="popup2" type="center" height="250" width="400" radius="6" duration="200">
      <view class="change_name">
        <input class="new_name" type="text" v-model="newName">
        <button class="confirm" @click="submitNewName">确定</button>
      </view>
    </wyb-popup>
    <!-- 修改班级名字 -->
    <wyb-popup class="pop" ref="popup3" type="center" height="250" width="400" radius="6" duration="200">
      <view class="change_name">
        <input class="new_name" type="text" v-model="newName">
        <button class="confirm" @click="submitNewClassName">确定</button>
      </view>
    </wyb-popup>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import mpopup from '../../components/xuan-popup/xuan-popup.vue'
  import wybPopup from '@/components/wyb-popup/wyb-popup.vue'
  export default {
    components: {
      mpopup,
      wybPopup
    },
    onLoad(option) {
      this.title = option.title
      if (option.cid) {
        this.cid = option.cid
        this.getStuList()
      }
      if (option.classList) {
        this.classList = JSON.parse(option.classList)
      }
    },
    data() {
      return {
        // 导航栏标题
        title: '',
        // 传过来的班级号
        cid: '',
        // 班级列表
        classList: [],
        formData: {
          name: '',
          className: '',
          myName: '',
          classNumber: 0
        },
        // 组合框数据
        candidates: ['班委', '学生'],
        // 选中的身份数据
        identity: '',
        // 成员列表
        stuList: [],
        // 学生在班级的身份
        srole: 2,
        // 当前被点击学生的id
        currentClickSid: 0,
        // 当前被点击学生的权限
        c_srole: '',
        // 修改名字
        newName: '',
        rules: {
          // 对name字段进行必填验证
          name: {
            rules: [{
                required: true,
                errorMessage: '请输入姓名',
              },
              {
                minLength: 2,
                maxLength: 5,
                errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符',
              }
            ],
            validateTrigger: 'bind'
          },
          // 对className字段进行必填验证
          className: {
            rules: [{
              required: true,
              errorMessage: '请输入班级名称',
            }, {
              minLength: 2,
              maxLength: 12,
              errorMessage: '班级长度在 {minLength} 到 {maxLength} 个字符',
            }],
            validateTrigger: 'bind'
          },
          // 对classNumber字段进行必填验证
          classNumber: {
            rules: [{
              required: true,
              errorMessage: '请输入班级号',
            }, {
              format: 'number',
              errorMessage: '请输入数字'
            }],
            validateTrigger: 'bind'
          }
        }
      };
    },
    computed: {
      ...mapState('my_user', ['id'])
    },
    methods: {
      ...mapMutations('my_class', ['updateCurrent']),
      back() {
        uni.navigateBack({
          delta: 1
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
      // 对班级的一些操作
      settingClass() {
        this.$refs.popup1.show()
      },
      // 修改个人在班级中的名称
      changeMyName() {
        this.$refs.popup1.hide()
        this.$refs.popup2.show()
      },
      // 提交新名字
      async submitNewName() {
        this.$refs.popup2.hide()
        const newNameObj = {
          cid: this.cid,
          sid: this.id,
          newName: this.newName
        }
        const res = await uni.$http.put('/bwClass/replaceSname',newNameObj)
        if (!res.data.flag) {
          return this.$refs.mpopup.open({
            type: 'err',
            content: '修改失败！',
            timeout: 1000,
          })
        }
        this.getStuList()
        this.$refs.mpopup.open({
          type: 'success',
          content: '修改成功！',
          timeout: 1000,
        })
      },
      // 解散班级
      async dissolveClass() {
        this.$refs.popup1.hide()
        const [err, res] = await uni.showModal({
          title: '提示',
          content: '确定解散班级吗？'
        }).catch(err => err)
        if (res && res.confirm) {
          const res = await uni.$http.delete('/bwClass/deleteClass',{
            cid: this.cid,
            sid: this.id
          })
          if (!res.data.flag) {
            return this.$refs.mpopup.open({
              type: 'err',
              content: '解散失败！',
              timeout: 1000,
            })
          }
          this.$refs.mpopup.open({
            type: 'success',
            content: '解散成功！',
            timeout: 1000,
          })
          setTimeout(() => {
            this.back()
          }, 1000)
        }
      },
      // 退出班级
      async exitClass() {
        this.$refs.popup1.hide()
        const [err, res] = await uni.showModal({
          title: '提示',
          content: '确定退出该班级吗？'
        }).catch(err => err)
        if (res && res.confirm) {
          const res = await uni.$http.delete('/bwClass/exitClass',{
            cid: this.cid,
            sid: this.id
          })
          if (!res.data.flag) {
            return this.$refs.mpopup.open({
              type: 'err',
              content: '退出失败！',
              timeout: 1000,
            })
          }
          this.$refs.mpopup.open({
            type: 'success',
            content: '退出班级成功！',
            timeout: 1000,
          })
          setTimeout(() => {
            this.back()
          }, 1000)
        }
      },
      // 修改班级名称
      changeClassName() {
        this.$refs.popup1.hide()
        this.$refs.popup3.show()
      },
      // 提交新班级名
      async submitNewClassName() {
        this.$refs.popup3.hide()
        const newNameObj = {
          cid: this.cid,
          newCname: this.newName
        }
        const res = await uni.$http.put('/bwClass/replaceCname',newNameObj)
        if (!res.data.flag) {
          return this.$refs.mpopup.open({
            type: 'err',
            content: '修改失败！',
            timeout: 1000,
          })
        }
        this.$refs.mpopup.open({
          type: 'success',
          content: '修改成功！',
          timeout: 1000,
        })
        setTimeout(() => {
          this.back()
        }, 1000)
      },
      // 群主对班级成员进行操作
      mangeStudent(sid, c_srole) {
        this.currentClickSid = sid
        this.c_srole = c_srole
        this.$refs.popup.show()
      },
      // 将学生移出班级
      async removeStudent() {
        this.$refs.popup.hide()
        const [err, res] = await uni.showModal({
          title: '提示',
          content: '确定移除该学生吗？'
        }).catch(err => err)
        if (res && res.confirm) {
          const res = await uni.$http.delete('/bwClass/deleteStudent', {
            cid: this.cid,
            sid: this.currentClickSid
          })
          if (!res.data.flag) {
            return this.$refs.mpopup.open({
              type: 'err',
              content: '移除失败！',
              timeout: 1000,
            })
          }
          this.getStuList()
          this.$refs.mpopup.open({
            type: 'success',
            content: '移除成功！',
            timeout: 1000,
          })
        }
      },
      // 修改学生身份
      async changeIdentity() {
        this.$refs.popup.hide()
        // 参数对象
        const changeObj = {
          srole: 0,
          cid: this.cid,
          sid: this.currentClickSid,
          replaceRole: this.c_srole === '2' ? 1 : 2
        }
        const identity = this.c_srole === '2' ? '班委' : '学生'
        const [err, res] = await uni.showModal({
          title: '提示',
          content: `确定将该学生的权限修改为${identity}吗？`
        }).catch(err => err)
        if (res && res.confirm) {
          const res = await uni.$http.put('/bwClass/replaceRole', changeObj)
          if (!res.data.flag) {
            return this.$refs.mpopup.open({
              type: 'err',
              content: '修改失败！',
              timeout: 1000,
            })
          }
          this.getStuList()
          this.$refs.mpopup.open({
            type: 'success',
            content: '修改成功！',
            timeout: 1000,
          })
        }
      },
      // 点击切换班级
      switchClass(cid) {
        this.updateCurrent(cid)
        this.$refs.mpopup.open({
          type: 'success',
          content: '切换成功！',
          timeout: 1000,
        })
        setTimeout(() => {
          uni.switchTab({
            url: '../../pages/class/class'
          })
        }, 1000)
      },
      // 创建班级
      async createClass() {
        const err = await this.$refs.form1.validate().catch(err => {
          return err
        })
        if (err instanceof Array) {
          return uni.$showMsg('请填写完整信息！')
        }
        const createInfo = {
          id: this.id,
          cname: this.formData.className,
          sname: this.formData.name
        }
        const res = await uni.$http.post('/bwClass/addNewClass', createInfo)
        if (res.statusCode !== 200) {
          return this.$refs.mpopup.open({
            type: 'err',
            content: '创建失败！',
            timeout: 1000,
          })
        }
        // 将新的班级号替换当前班级号
        this.updateCurrent(res.data.data.cid)
        this.$refs.mpopup.open({
          type: 'success',
          content: '创建成功！',
          timeout: 1000,
        })
        setTimeout(() => {
          uni.switchTab({
            url: '../../pages/class/class'
          })
        }, 1000)
      },
      // 加入班级
      async joinClass() {
        const err = await this.$refs.form.validate().catch(err => {
          return err
        })
        if (err instanceof Array) {
          return uni.$showMsg('请填写完整信息！')
        }
        if (!this.identity.length) {
          return uni.$showMsg('请填写完整信息！')
        }
        // 加入班级的数据对象
        const joinInfo = {
          id: this.id,
          cid: this.formData.classNumber,
          sname: this.formData.myName,
          srole: this.candidates.findIndex(e => e === this.identity) + 1
        }
        const res = await uni.$http.post('/bwClass/joinNewClass', joinInfo)
        if (res.statusCode !== 200) {
          return this.$refs.mpopup.open({
            type: 'err',
            content: '加入失败！',
            timeout: 1000,
          })
        } else if (!res.data.flag) {
          return uni.$showMsg(res.data.msg)
        }
        // 将新的班级号替换当前班级号
        this.updateCurrent(res.data.data.cid)
        this.$refs.mpopup.open({
          type: 'success',
          content: '加入成功！',
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
  .btn {
    width: 700rpx;
    background-color: #127ddb;
    color: #ffffff;
    border-radius: 20px;
  }

  .chose {
    background-color: #fff;
    padding: 10px;
    margin: 10px;
  }

  .button-hover {
    background-color: rgba(17, 124, 217, 0.5);
  }

  .m_list {
    margin: 15rpx;
    position: relative;

    .manage {
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      background-color: #fff;
      height: 40px;
      font-size: 18px;
      text-align: end;
      line-height: 40px;
    }

    .item_com,
    .item_stu {
      display: flex;
      align-items: center;
      height: 60px;
      background-color: #fff;
      padding: 0 5px;
      border-bottom: 1px solid #eee;

      .left {
        display: flex;
        align-items: center;
        font-size: 18px;

        .avatar {
          width: 40px;
          height: 40px;
          margin-right: 5px;
        }

        .com {
          background-color: orange;
          width: 30px;
          height: 18px;
          font-size: 12px;
          color: #ffffff;
          text-align: center;
        }

        .stu {
          background-color: #a7a7a7;
          width: 30px;
          height: 18px;
          font-size: 12px;
          color: #ffffff;
          text-align: center;
        }

        .name {
          margin-left: 5px;
          color: #676767;
        }
      }

      .right {
        position: absolute;
        right: 10px;
      }
    }

    .classify {
      height: 30px;
      line-height: 30px;
      font-size: 15px;
      color: #666;
    }
  }

  .class_list {
    position: relative;
    height: 100px;
    margin: 10px;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid orange;
    border-radius: 10px;

    .cname {
      font-size: 20px;
      margin-bottom: 20px;
      font-weight: bold;
      color: #1050db;
    }

    .cid {
      color: #666666;
    }

    .logo {
      position: absolute;
      width: 45px;
      height: 45px;
      right: 17px;
      top: 28px;
    }
  }

  .mange_stu_box {
    box-sizing: border-box;
    padding: 10px;
    height: 100%;

    .change {
      border-bottom: 1px solid #ccc;
      color: #127ddb;
    }

    .remove {
      color: #db3a19;
    }

    .remove,
    .change {
      font-size: 18px;
      text-align: center;
      height: 50%;
      line-height: 53px;

    }
  }

  .class_setting {
    box-sizing: border-box;
    height: 100%;
    padding: 10px;
    text-align: center;

    .change_student_name,
    .dissolve,
    .change_class_name,
    .exit {
      height: 50px;
      border-bottom: 1px solid #ccc;
      font-size: 18px;
      line-height: 50px;
    }

    .dissolve {
      color: #e27b30;
    }

    .exit {
      border: 0;
      color: #db3a19;
    }
  }

  .change_name {
    height: 100%;
    padding: 10px;

    .new_name {
      height: 40px;
      border: 1px solid #666;
      padding-left: 10px;
    }

    .confirm {
      margin-top: 10px;
      width: 100px;
      background-color: #127ddb;
      color: #fff;
    }
  }
</style>
