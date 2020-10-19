<template>
  <el-container class="homeContainer">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- <img src="../assets/logo.png" alt=""> -->
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <el-menu background-color="rgb(70, 68, 68)" text-color="#fff" active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>我是一级菜单</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="1-4-1">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>我是二级菜单</span>
              </template>
            </el-menu-item>
            <el-menu-item index="1-4-1">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>我也是二级菜单</span>
              </template>
            </el-menu-item>

          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    loginout () {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
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
  span {
    font-size: 20px;
    margin-left: 15px;
  }
}

.el-aside {
  background-color: rgb(70, 68, 68);
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: blueviolet;
}
</style>