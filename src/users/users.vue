<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" clearable @clear="getUserList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->

      <el-table :data="userlist" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 编辑用户 -->
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showEditDialog(scope.row.id)">
            </el-button>
            <!-- 删除用户 -->
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeUserById(scope.row.id)">
            </el-button>
            <!-- 分配角色 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" circle size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <!-- 添加用户-->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close=" addDiaolog">
        <!-- 内容区域 -->
        <el-form :model="addForm" :rules="addRules" ref="ruleForm" label-width="100px" class="demo-addForm">
          <el-form-item label="用户名:" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>

          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机：" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>

        </el-form>
        <!-- 按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户 -->
      <el-dialog title="修改用户的信息" :visible.sync="editDialogVisible" width="50%" @close="editFromvicise">
        <!-- 内容区域 -->

        <el-form :model="editForm" :rules="editRules" ref="ruleForm" label-width="100px" class="demo-addForm">
          <el-form-item label="用户名:" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机：" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>

</template>


<script>
export default {
  data () {
    // 自定义邮箱校验规则
    var checkEmail = (rule, value, cb) => {
      const regEail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    // 自定义手机号校验规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      // 获取用户列表 参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,


      // 添加用户验证规则
      addRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            require: true,
            min: 3,
            max: 10,
            message: "用户名长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        password: [

          { required: true, message: "请输入密码", trigger: "blur" },
          {
            require: true,
            min: 6,
            max: 15,
            message: "用户名长度在 6 到 15 个字符",
            trigger: "blur"
          }

        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },

      // 修改用户信息验证规则
      editRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 添加用户表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },

      // 修改用户表单数据
      editForm: {
        // email: "",
        // mobile: ""
      },


      // 这是控制用户添加对话框的显示和隐藏
      addDialogVisible: false,
      // 这是控制用户修改对话框的显示和隐藏
      editDialogVisible: false
    }
  },
  created () {
    this.getUserList()
  },

  methods: {
    // 获取列表内容
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败")
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    // 分页传值
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 修改状态
    async userStateChanged (userinfo) {
      const { data } = await this.$http.put(
        `/users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (data.meta.status !== 200) {
        this.$message.error("获取信息失败！");
      }
    },
    // 清空添加表单
    addDiaolog () {
      this.$refs.ruleForm.resetFields()
    },
    // 添加用户
    addUser () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return;
        const { data } = await this.$http.post("users", this.addForm);
        if (data.meta.status !== 201) {
          this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        this.addDialogVisible = false
        this.getUserList()
      });
    },

    // 删除用户
    removeUserById (id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data } = await this.$http.delete('users/' + id);
          if (data.meta.status !== 200) {
            this.$message.error(data.meta.msg);
          } else {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getUserList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 展示编辑的对话框
    async showEditDialog (id) {
      const { data } = await this.$http.get('users/' + id)
      if (data.meta.status !== 200) {
        this.$message.error("查询不成功！")
      }
      console.log(data)
      this.editForm = data.data

      this.editDialogVisible = true
      // this.getUserList()
    },
    // 监听对话框对话事件
    editFromvicise () {
      this.$refs.ruleForm.resetFields()
    }

  }
}
</script>

<style lang="less" scoped>
</style>