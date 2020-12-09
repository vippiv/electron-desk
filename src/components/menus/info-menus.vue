<template>
  <div id='menu-content'>
    <div v-if="this.msgMemberList.length!==0" style="border-right: 1px solid #eef1f3;">
      <!-- <div> -->
      <div class="search-info drug-class">
        <el-autocomplete class="search-input" v-model="state" :fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
      </div>
      <div class="info-list">
        <ul class="info-content">
          <li class="info-item" :class="{'current-item':item.userId ===currentFriendId}" v-for="(item,index) in this.msgMemberList" :key="index" @click="selectCurrentUser(item)">
            <div class="info-adv">
              {{item.nickName&&item.nickName.split('')[0].toLocaleUpperCase()}}
            </div>
            <span :class="{'info-point':item.msgFlag}"></span>
            <div class="info-sub">
              <p class="info-sub-name">{{item.nickName}}</p>
              <p class="info-sub-content">{{item.content||''}}</p>
            </div>
            <div class="info-time">{{item.updateTime&&item.updateTime.split(' ')[1]}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import baseInfo from '@/utils/config'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'infoMenus',
  data () {
    return {
      keyword: '',
      path: baseInfo.SOCKET_HOST,
      state: '',
      historyMember: [],
      currentUser: {}
    }
  },
  computed: {
    ...mapState({
      msgMemberList: (state) => {
        return state.msgMemberList
      },
      currentFriendId: state => state.friendId,
    }),
    ...mapGetters({
      msgMemberList: 'getMemberList',
      currentFriendId: 'getFriendId'
    })
  },
  mounted () {
    this.currentUser = JSON.parse(localStorage.getItem('userInfo'))
    if (localStorage.getItem(this.currentUser.userId) !== null) {
      this.$store.commit('readCacheMemberList', JSON.parse(localStorage.getItem(this.currentUser.userId)))
      this.historyMember = JSON.parse(localStorage.getItem(this.currentUser.userId))
    }
  },
  methods: {
    querySearch (queryString, cb) {
      this.historyMember.map(item => {
        item.value = item.nickName
      })
      var historyMember = this.historyMember;
      var results = queryString ? historyMember.filter(this.createFilter(queryString)) : historyMember;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter (queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect (item) {
      // 设置当前选中
      this.$store.dispatch('setClickCurrentAction', item)
    },
    getInitData (data) {
      this.$store.dispatch({
        type: 'saveMsgSocketAction',
        amount: data
      })
    },
    async selectCurrentUser (item) {
      this.$store.dispatch('setClickCurrentAction', item)
      let params = {
        friendId: item.userId,
        userId: JSON.parse(localStorage.getItem('userInfo')).userId
      }
      // 修改缓存中当前用户的的msgFlag =false
      await this.historyMember.forEach(item => {
        if (item.userId === item.userId) {
          item.msgFlag = false
        }
      })
      // 更新本地缓存聊天列表
      // await this.$store.commit('readCacheMemberList', this.historyMember)
      // 更新当前聊天对象
      await this.$store.commit('saveCurrentFriendObj', item)

    },
  },
}
</script>
<style lang="less" scoped>
#menu-content {
  background: #fff;
  .search-info {
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    margin: 0 auto;
    padding: 11px 5px;
    border-bottom: 2px solid #fff;
    .search-input {
      width: 95%;
      .el-input__inner {
        height: 35px !important;
      }
    }
  }
  .info-list {
    height: 85vh;
    padding-bottom: 20px;
    overflow: hidden;
    .info-content {
      height: 100%;
      overflow-y: scroll;
      .info-item {
        font-size: 0;
        padding: 15px 10px;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #e8eaed;
        position: relative;
        .info-adv {
          display: inline-block;
          vertical-align: middle;
          width: 45px;
          height: 45px;
          line-height: 45px;
          text-align: center;
          border-radius: 100%;
          background: #1d93a8;
          font-size: 16px;
          font-family: "Source Han Sans CN Regular,Source Han Sans CN Regular-Regular";
          font-weight: 400;
          color: #fff;
        }
        .info-point {
          position: absolute;
          width: 10px;
          height: 10px;
          top: 14px;
          left: 50px;
          background: red;
          border-radius: 100%;
          border: 1px solid #eee;
        }
        .info-sub {
          width: 50%;
          margin: 0 10px;
          display: inline-block;
          vertical-align: middle;
          font-family: "Source Han Sans CN Regular, Source Han Sans CN Regular-Regular";
          font-weight: 400;
          text-align: left;
          .info-sub-name {
            font-size: 18px;
            color: #333333;
          }
          .info-sub-content {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 16px;
            color: #888888;
          }
        }
        .info-time {
          display: inline-block;
          vertical-align: middle;
          font-size: 14px;
          color: #b3b3b3;
        }
      }
      .current-item {
        background: #eef1f3;
      }
    }
  }
}
.info-content::-webkit-scrollbar {
  width: 5px;
  height: 1px;
  position: absolute;
  bottom: 0;
}
.info-content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #007c90;
}
.info-content::-webkit-scrollbar-track {
  border-radius: 0;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.1);
}
</style>