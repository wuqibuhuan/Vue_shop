<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- !-- 作用域插槽 --> -->
          <template v-slot="scoped">
            <el-row :class="['bbottom',index1===0?'btop':'','vcenter']" v-for="(item1,index1) in scoped.row.children"
              :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="deleteRight(scoped.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过嵌套for循环渲染二级权限 -->
                <el-row :class="[index2===0 ? '' : 'btop','vcenter']" v-for="(item2,index2) in item1.children"
                  :key="item2.id">
                  <el-col :span="8">
                    <el-tag closable type="success" @close="deleteRight(scoped.row,item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="16">
                    <el-tag closable type="warning" v-for="(item3) in item2.children" :key="item3.id"
                      @close="deleteRight(scoped.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{scoped.row}}
            </pre>-->
          </template>

        </el-table-column>
        <!-- 索引 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色姓名" width="180">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 编辑用户 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑
            </el-button>
            <!-- 删除用户 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">删除
            </el-button>
            <!-- 分配角色 -->
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="50%" @close="addRoleDiaolog">
      <!-- 内容区域 -->
      <el-form :model="addRoleForm" :rules="addRoles" ref="roleForm" label-width="100px" hide-required-asterisk>
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:" prop="roleDesc" hide-required-asterisk>
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleVisible" width="50%" @close="editRoleDiaolog">
      <!-- 内容区域 -->
      <el-form :model="editRoleForm" :rules="editRoles" ref="editroleForm" label-width="100px" hide-required-asterisk>
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:" prop="roleDesc" hide-required-asterisk>
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      // 这是控制用户添加角色对话框的显示和隐藏
      addRoleVisible: false,
      // 添加角色表单数据
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      // 添加角色验证规则
      addRoles: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            require: true,
            min: 3,
            max: 10,
            message: "用户名长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        roleDesc: [

          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            require: true,
            min: 3,
            max: 10,
            message: "用户名长度在 3 到 10 个字符",
            trigger: "blur"
          }

        ],

      },
      // 编辑角色对话框显示与隐藏
      editRoleVisible: false,
      // 编辑角色表单
      editRoleForm: {},
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles');
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.status + ' : 获取角色列表失败！');
      }
      this.rolesList = res.data;
      console.log(this.rolesList);
    },


    // 清空添加角色表单
    addRoleDiaolog () {
      this.$refs.roleForm.resetFields()
    },

    // 添加用户
    addUser () {
      this.$refs.roleForm.validate(async valid => {
        if (!valid) return;
        const { data } = await this.$http.post("roles", this.addRoleForm);
        if (data.meta.status !== 201) {
          this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        this.addRoleVisible = false
        this.getRolesList()
      });
    },
    // 删除角色
    removeUserById (id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data } = await this.$http.delete('roles/' + id);
          if (data.meta.status !== 200) {
            this.$message.error(data.meta.msg);
          } else {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getRolesList()
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除角色权限
    async deleteRight (role, rightId) {
      // 弹出确认框
      const delRightConfirm = await this.$confirm(
        '此操作将删除此权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);
      // console.log(delRightConfirm);
      if (delRightConfirm !== 'confirm') return null;

      // 发起删除权限请求
      // console.log(role, rightId);
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.status + ' : 权限删除失败！');
      }
      // 重新赋值权限层列表
      role.children = res.data;
      // 返回成功提示
      return this.$message.success(res.meta.msg);
    },
    // 编辑角色
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('roles/' + id);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.status + ' : 获取角色信息失败');
      }
      this.editRoleForm = res.data;
      this.editRoleVisible = true
    }
  },

}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.btop {
  border-top: 1px solid #eee;
}
.bbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>