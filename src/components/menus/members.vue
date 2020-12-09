<template>
  <div id="menu-content">
    <div class="member-home drug-class">
      <span class="member-logo"><i class="iconfont-icon hospital-icon">&#xe617;</i></span>
    </div>
    <div class="member-list">
      <ul class="member-items">
        <li class="member-item" :class="{'member-item-active ':currentDept===index}" v-for="(item,index) in deptList" :key="item.deptCode" @click="selectDept(item,index)">
          <span class="member-icon">
            <i class="iconfont-icon">&#xe622;</i>
          </span>
          <span class="member-name">{{item.deptName}}</span>
          <span class="member-point"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import baseInfo from '@/utils/config'
export default {
  name: 'member',
  data () {
    return {
      HOSPITAL_NAME: baseInfo.HOSPITAL_NAME,
      deptList: [],
      currentDept: ''
    }
  },
  created () {
    this.getDeptList()
  },
  methods: {
    getDeptList () {
    },
    selectDept (item, index) {
      this.currentDept = index
      let params = {
        deptId: item.deptId,
        nickName: ''
      }
    }
  }

}
</script>
<style lang="less" scoped>
.member-home {
  box-sizing: border-box;
  padding: 10px 10px 10px 15px;
  border-bottom: 1px solid #e8eaed;
  font-size: 0;
  cursor: pointer;
  .member-logo {
    display: inline-block;
    width: 45px;
    height: 45px;
    line-height: 45px;
    border-radius: 100%;
    vertical-align: middle;
    background: #1d93a8;
    font-size: 16px;
    text-align: center;
    .hospital-icon {
      color: #fff;
      font-size: 18px;
    }
  }
  .member-home-info {
    display: inline-block;
    vertical-align: middle;
    .member-name {
      display: inline-block;
      width: 165px;
      font-size: 16px;
      margin: 0 5px;
      vertical-align: middle;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .member-icon {
      display: inline-block;
      vertical-align: middle;
      color: #b3b3b3;
      cursor: pointer;
    }
  }
}
.member-list {
  height: 80%;
  overflow: hidden;
  .member-items {
    height: 100%;
    overflow-y: scroll;
    .member-item {
      cursor: pointer;
      padding: 10px;
      height: 60px;
      line-height: 30px;
      box-sizing: border-box;
      border-bottom: 1px solid #e8eaed;
      font-size: 0;
      position: relative;
      span {
        display: inline-block;
        vertical-align: middle;
      }
      .member-icon {
        font-size: 12px;
        margin: 0 10px;
        color: #d7d7d9;
      }
      .member-name {
        font-size: 16px;
        color: #333333;
      }
    }
    .member-item-active {
      .member-icon {
        color: #1d93a8;
      }
      .member-name {
        font-size: 16px;
        color: #1d93a8;
      }
      .member-point {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        right: 10px;
        top: 20px;
        background: #ff6565;
      }
    }
  }
}
</style>