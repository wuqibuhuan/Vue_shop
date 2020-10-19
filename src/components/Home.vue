<template>
  <el-container class="homeContainer">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse? '64px': '200px'">
        <div class="toggle-button" @click="tooggleCollapse">|||</div>
        <el-menu background-color="rgb(70, 68, 68)" text-color="#fff" active-text-color="#409eff" unique-opened
          :collapse="isCollapse" :collapse-transition="false">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id +''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="subitem.id + ''" v-for="subitem in item.children" :key="subitem.id">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>

          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconObj: {
        '125': 'iconfont icon-shengdanjie-lazhu',
        '103': 'iconfont icon-shengdanjie-lingdang',
        '101': 'iconfont icon-shengdanjie-shengdanwa',
        '102': 'iconfont icon-shengdanjie-xueqiao',
        '145': 'iconfont icon-shengdanjie-shoutao',
      },
      // 是否折叠
      isCollapse: false,
    }
  },
  created () {
    this.getMenuList();
  },
  methods: {
    loginout () {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有菜单
    async getMenuList () {
      const { data } = await this.$http.get("menus");
      console.log(data)
      if (data.meta.status === 200) {
        this.menulist = data.data;
      } else {
        this.$message({
          type: "error",
          message: data.meta.msg
        });
      }

    },
    // 点击按钮 缩侧边栏事件
    tooggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  },
};
</script>

<style lang="less" scoped>
.homeContainer {
  height: 100%;
}
.el-header {
  background-color: rgb(20, 22, 21);
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: aliceblue;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  img {
    width: 50px;
    height: 50px;
  }
}
.el-aside {
  background-color: rgb(70, 68, 68);
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: rgb(234, 231, 236);
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: rgb(75, 76, 77);
  font-size: 10px;
  line-height: 24px;
  color: aliceblue;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>