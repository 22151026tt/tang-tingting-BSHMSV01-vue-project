//インポート axios
import axios from "axios";
//axiosでオブジェクトを作成する
const request = axios.create({
    timeout:5000
})

//リクエスト インターセプター処理
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    return config
},error => {
    return Promise.reject(error)
})

//エクスポート リクエストオブジェクト
export  default request

//レスポンス・インターセプターの追加、レスポンス結果の統一処理
request.interceptors.response.use(
    response => {
        console.log("response",response)
        let res =  response.data;
       //ファイルの場合
        if(response.config.responseType === 'blob'){
            return res
        }
        //文字列の場合、json オブジェクトに変換する
        if(typeof res === 'string'){
            res = res ? JSON.parse(res):res
        }
        return res;
    },
    error => {
        console.log("err",error)//エラーメッセージを出力する
        return Promise.reject(error)
    }
)

