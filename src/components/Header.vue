<template>
  <div style="height: 50px;line-height: 50px;border-bottom: 1px solid #ccc;display:flex">
    <div style="width: 300px;padding-left: 30px;font-weight: bold;">不動産情報管理社内システム</div>

    <div style="flex: 1"></div>
    <div style="width: 100px">
      <el-dropdown>
        <span class="el-dropdown-link" style="font-weight: bold">
          ユーザー<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>個人情報</el-dropdown-item>
            <el-dropdown-item @click="logout">ログアウト</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>


</template>

<script>
import HomeView from "@/views/HomeView";
export default {
  name: "Header",
  components: { HomeView },
  methods:{
    logout(){
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>