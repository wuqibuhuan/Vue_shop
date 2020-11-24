<template>
  <div class="login-conter">
    <div class="login_box">
      <div class="arvt_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form :model="loginForm" class="login_form" :rules="login_rules" ref="loginFromRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-denglu-yonghu"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-denglu-mima"></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="login_ruse">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //这是登录对象的数据绑定
      loginForm: {
        username: 'admin',
        password: '123456',

      },
      login_rules: {
        username: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],

      }
    }

  },
  methods: {
    login_ruse () {
      // console.log(this)
      this.$refs.loginFromRef.resetFields();

    },
    login () {
      this.$refs.loginFromRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('login', this.loginForm)
          if (res.meta.status == 200) {
            this.$message({
              message: '登录成功',
              type: 'success'
            })
            window.sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home') 
          } else {
            this.$message({
              message: res.meta.msg,
              type: 'error'
            })
          }
        } else {
          return false
        }
      })
    }
  }
};
</script>


<style lang="less" scoped>
.login-conter {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: aliceblue;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .arvt_box {
    height: 130px;
    width: 130px;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: aliceblue;
    img {
      width: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #fff;
    }
  }
  .btn {
    display: flex;
    justify-content: flex-end;
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0px 20px;
    box-sizing: border-box;
  }
}
</style>