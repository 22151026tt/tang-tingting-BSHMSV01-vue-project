<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">ユーザー登録</el-breadcrumb-item>
    <el-breadcrumb-item>
      <a href="/buken">物件管理</a>
    </el-breadcrumb-item>
    <el-breadcrumb-item>
      <a href="/keiyaku">契約管理</a>
    </el-breadcrumb-item>
    <el-breadcrumb-item>
      <a href="/nyukin">入金管理</a>
    </el-breadcrumb-item>
    <el-breadcrumb-item>
      <a href="/karinushi">借主管理</a>
    </el-breadcrumb-item>
  </el-breadcrumb>

</template>

<script>

export default {
  name: "Aside"
}
</script>

<style scoped>

</style>