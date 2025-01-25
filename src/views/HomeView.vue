<template>

  <div>

    <el-form :model="form" :rules="rules" ref="form" label-width="100px" style="margin:0 auto;max-width:800px">
      <el-form-item label="ユーザー名:" prop="userName">
        <el-input v-model.lazy="form.userName"
                  @blur="form.userName = form.userName ? form.userName.trim() : ''"/>
        {{ validMsg.userName }}
      </el-form-item>
      <el-form-item label="パスワード:" prop="password" style="margin-top: 20px">
        <el-input v-model.lazy="form.password"
                  @blur="form.password = form.password ? form.password.trim() : ''"
                  type="password" autocomplete="off"/>
        {{ validMsg.password }}
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small">登録</el-button>
        <el-button type="primary" size="small" @click="cancel">キャンセル</el-button>
      </el-form-item>
    </el-form>
  </div>


</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import request from "@/utils/request";

export default {

  name: 'HomeView',
  components: {},
  data() {
    return {
      validMsg: {},
      form: {},
      rules: {
        userName: [{required: true, message: 'ユーザー名が未入力です。', trigger: 'blur'},
          {pattern: /^.{0,100}$/, message: 'ユーザー名は100文字以内で入力してください。', trigger: 'blur'}],
        password: [{required: true, message: 'パスワードが未入力です。', trigger: 'blur'},
          {pattern: /^.{0,100}$/, message: 'パスワードは100文字以内で入力してください。', trigger: 'blur'}]
      }
    }
  },
  methods: {
    onSubmit() {

      this.$refs['form'].validate(valid => {
        if (valid) {//フロントエンド検証に合格した
          request.post("/api/user/find", this.form).then(res => {
            console.log("res", res)

            if (res.code === "200") {//バックエンド検証に合格した
              this.$message({
                type: "success",
                message: "ログイン成功!"
              })
              this.form = res.data
              this.$router.push('/buken')
              console.log("res.data", res.data)
            } else if (res.code === "400") {//バックエンド検証に失敗した
              console.log("res=", res)
              this.validMsg.userName = res.data.userName
              this.validMsg.password = res.data.password
            }else if(res.code === "404"){//バックエンド検証に成功したが、登録ユーザーは存在しない
              this.$message({
                type: "error",
                message: "ユーザー名またパスワードが違います。"
              })
            }

          })
        } else {//フロントエンド検証に失敗した
          return false;//登録しない
        }
      })

    },
    cancel() {
      this.$nextTick(() => {
        this.$refs['form']?.resetFields();//前回のフォーム検証の情報をクリアする
      });
    }


  }

}
</script>
<style scoped>
.el-form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
