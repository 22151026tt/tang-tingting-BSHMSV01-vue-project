const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  devServer:{
    port:10000,//ポート番号の変更
    proxy:{ //プロキシを設定してクロスドメインの問題を解決する
      '/api':{
        target:"http://localhost:9090",
        changeOrigin:true,
        pathRewrite:{
          '/api':''
        }
      }
    }
  }
}

