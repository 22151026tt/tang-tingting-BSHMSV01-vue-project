<template>
  <div>
    <Aside style="margin-left: 10px;margin-top: 10px;margin-bottom: 30px"/>
    <h3 style="text-align: center;margin-bottom: 20px">借主一覧</h3>

    <el-form :inline="true" :model="form1" class="demo-form-inline">
      <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
        <el-form-item label="借主氏名" prop="karinushimei" style="margin-left: 50px">
          <el-input v-model.lazy="form1.karinushimei"
                    @blur="form1.karinushimei = form1.karinushimei ? form1.karinushimei.trim() : ''"
                    style="width: 200px"/>
        </el-form-item>

        <el-form-item label="性別" prop="seibetu">
          <el-select
              v-model="form1.seibetu"
              placeholder=""
              clearable
              style=" width: 200px"
              @change="handleForm1GenderSelectChange"
          >
            <el-option label="男" value="男"/>
            <el-option label="女" value="女"/>
            <el-option label="その他" value="その他"/>
            <el-option label="不明" value="不明"/>
          </el-select>
        </el-form-item>

        <el-form-item label="国籍" prop="kokuseki">
          <el-input v-model.lazy="form1.kokuseki" @blur="form1.kokuseki = form1.kokuseki ? form1.kokuseki.trim() : ''"
                    style=" width: 200px"/>
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
        <el-form-item label="住所" prop="jusyo" style="margin-left: 50px">
          <el-input v-model.lazy="form1.jusyo" @blur="form1.jusyo = form1.jusyo ? form1.jusyo.trim() : ''"
                    style=" width: 200px"/>
        </el-form-item>
        <el-form-item label="勤務先名称" prop="kinmusaki">
          <el-input v-model.lazy="form1.kinmusaki"
                    @blur="form1.kinmusaki = form1.kinmusaki ? form1.kinmusaki.trim() : ''"
                    style=" width: 200px"/>
        </el-form-item>
      </div>

      <!--    検索    -->
      <div style="margin-top: 10px">
        <el-button style="margin-left: 50px;width: 2cm" type="primary" @click="list">検索</el-button>
      </div>

      <!--    新規   -->
      <div style="margin-top: 20px">
        <el-button type="primary" @click="add" style="margin-left: 88%">新規</el-button>
      </div>
    </el-form>

    <!--    テーブルデーター    -->
    <el-table :data="tableData" border stripe style="width: 90%;display: flex;margin-top: 10px;margin-left: 50px">
      <el-table-column sortable prop="karinushiId" label="ID"></el-table-column>
      <el-table-column prop="karinushimei" label="借主氏名"></el-table-column>
      <el-table-column prop="seibetu" label="性別"></el-table-column>
      <el-table-column prop="kokuseki" label="国籍"></el-table-column>
      <el-table-column prop="age" label="年齢"></el-table-column>
      <el-table-column prop="syokugyou" label="職業"></el-table-column>
      <el-table-column prop="kinmusaki" label="勤務先名称"></el-table-column>
      <el-table-column prop="yubinbango" label="郵便番号"></el-table-column>
      <el-table-column prop="jusyo" label="住所"></el-table-column>
      <el-table-column prop="denwabango" label="電話番号"></el-table-column>
      <el-table-column prop="mail" label=" メールアドレス"></el-table-column>

      <el-table-column fixed="right" label="操作" min-width="100">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" type="text">更新</el-button>
          <el-popconfirm :title=" '以下のIDを持つ借主情報を削除しますが、よろしいですか？借主ID:' + scope.row.karinushiId"
                         @confirm="handleDel(scope.row.karinushiId)">
            <template #reference>
              <el-button type="text">削除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--    ページングナビゲーションコンポーネントの導入-->
    <div style="margin-left: 50px;margin-top: 5px">
      <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentChange"
          v-model:current-page="currentPage"
          :page-sizes="[5,10]"
          :page-size="pageSize"
          layout="total,sizes, prev, pager, next,jumper"
          :total="total">
      </el-pagination>
    </div>
    <!--    借主登録・更新画面 ポップアップ   -->
    <el-dialog v-model="dialogVisible" title="借主情報登録(更新)" width="80%">
      <h3 style="text-align: center;margin-bottom: 20px">借主情報登録(更新)画面</h3>
      <p style="margin-left: 35px;margin-bottom: 20px;font-weight: bolder">借主情報</p>

      <div class="form-container">
        <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="form-layout">
          <el-row :gutter="50">
            <el-col :span="12">
              <el-form-item label="借主氏名(必須)" prop="karinushimei">
                <el-input v-model.lazy="form.karinushimei"
                          @blur="form.karinushimei = form.karinushimei ? form.karinushimei.trim() : ''"
                          style="width: 200px"/>
                <!--          返されたバックエンド検証情報を表示する-->
                {{ validMsg.karinushimei }}
              </el-form-item>
              <el-form-item label="借主氏名(カナ(必須)" prop="meifurikana">
                <el-input v-model.lazy="form.meifurikana"
                          @blur="form.meifurikana = form.meifurikana ? form.meifurikana.trim() : ''"
                          style="width: 200px"/>
                <!--          返されたバックエンド検証情報を表示する-->
                {{ validMsg.meifurikana }}
              </el-form-item>
              <el-form-item label="性別" prop="seibetu" style="width: 200px">
                <el-select v-model="form.seibetu" placeholder="" @change="handleGenderSelectChange">
                  <el-option label="男" value="男"/>
                  <el-option label="女" value="女"/>
                  <el-option label="その他" value="その他"/>
                  <el-option label="不明" value="不明"/>
                </el-select>
                {{ validMsg.seibetu }}
              </el-form-item>
              <el-form-item label="国籍(必須)" prop="kokuseki">
                <el-input v-model.lazy="form.kokuseki"
                          @blur="form.kokuseki = form.kokuseki ? form.kokuseki.trim() : ''"
                          style="width: 200px"/>
                {{ validMsg.kokuseki }}
              </el-form-item>
              <el-form-item label="誕生日" prop="tanjyoubi">
                <el-col :span="11" style="width: 150px">
                  <el-date-picker
                      v-model="form.tanjyoubi"
                      type="date"
                      placeholder=""
                      style="width: 200px"
                  />
                </el-col>
                {{ validMsg.tanjyoubi }}
              </el-form-item>
              <el-form-item label="職業" prop="syokugyou">
                <el-input v-model.lazy="form.syokugyou"
                          @blur="form.syokugyou = form.syokugyou ? form.syokugyou.trim() : ''"
                          style="width: 200px"/>

                {{ validMsg.syokugyou }}
              </el-form-item>
              <el-form-item label="勤務先名称" prop="kinmusaki">
                <el-input v-model.lazy="form.kinmusaki"
                          @blur="form.kinmusaki = form.kinmusaki ? form.kinmusaki.trim() : ''"
                          style="width: 200px"/>

                {{ validMsg.kinmusaki }}
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="郵便番号(必須)" prop="yubinbango">
                <el-input v-model.lazy="form.yubinbango"
                          @blur="form.yubinbango = form.yubinbango ? form.yubinbango.trim() : ''"
                          style="width: 200px"/>
                {{ validMsg.yubinbango }}
              </el-form-item>

              <el-form-item label="住所(必須)" prop="jusyo">
                <el-input v-model.lazy="form.jusyo"
                          @blur="form.jusyo = form.jusyo ? form.jusyo.trim() : ''"
                          style="width: 200px"/>
                {{ validMsg.jusyo }}
              </el-form-item>

              <el-form-item label="電話番号(必須)" prop="denwabango">
                <el-input v-model.lazy="form.denwabango"
                          @blur="form.denwabango = form.denwabango ? form.denwabango.trim() : ''"
                          style="width: 200px"/>
                {{ validMsg.denwabango }}
              </el-form-item>

              <el-form-item label="メールアドレス" prop="mail">
                <el-input v-model.lazy="form.mail"
                          @blur="form.mail = form.mail ? form.mail.trim() : ''"
                          style="width: 200px"/>
                {{ validMsg.mail }}
              </el-form-item>

              <el-form-item label="身分証明書" prop="mibunsyoumesyo">
                <el-input v-model.lazy="form.mibunsyoumesyo"
                          @blur="form.mibunsyoumesyo = form.mibunsyoumesyo ? form.mibunsyoumesyo.trim() : ''"
                          style="width: 200px"/>
                {{ validMsg.mibunsyoumesyo }}
              </el-form-item>

              <el-form-item label="緊急連絡先名称" prop="kinkyurenrakusaki">
                <el-input v-model.lazy="form.kinkyurenrakusaki"
                          @blur="form.kinkyurenrakusaki = form.kinkyurenrakusaki ? form.kinkyurenrakusaki.trim() : ''"
                          style="width: 200px"/>

                {{ validMsg.kinkyurenrakusaki }}
              </el-form-item>

              <el-form-item label="緊急連絡先電話番号" prop="kinkyurenrakusakidenwa">
                <el-input v-model.lazy="form.kinkyurenrakusakidenwa"
                          @blur="form.kinkyurenrakusakidenwa = form.kinkyurenrakusakidenwa ? form.kinkyurenrakusakidenwa.trim() : ''"
                          style="width: 200px"/>

                {{ validMsg.kinkyurenrakusakidenwa }}
              </el-form-item>
            </el-col>
          </el-row>

          <div style="margin-left: 220px;margin-top: 30px">
            <el-button type="primary" @click="save" style="width: 2cm">登録(更新)</el-button>
            <el-button @click="cancel" type="primary" style="width: 2cm;margin-left: 30%">キャンセル</el-button>
          </div>
        </el-form>
      </div>

    </el-dialog>


  </div>

</template>

<script>
import Aside from "@/components/Aside";
import request from "@/utils/request";

export default {
  name: "KarinushiView",
  components: {Aside},
  data() {
    return {
      form1: {},
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      dialogVisible: false,
      form: {
      },
      rules: {
        karinushimei: [{required:true,message:'借主氏名が未入力です。',trigger:'blur'},
          {pattern:/^.{0,100}$/,message:'借主氏名は100文字以内で入力してください。',trigger:'blur'}],
        meifurikana: [{required:true,message:'借主氏名(カナ)が未入力です。',trigger:'blur'},
          {pattern:/^.{0,100}$/,message:'借主氏名(カナ)は100文字以内で入力してください。',trigger:'blur'}],
        kokuseki:[{required:true,message:'国籍が未入力です。',trigger:'blur'},
          {pattern:/^.{0,100}$/,message:'国籍は100文字以内で入力してください。',trigger:'blur'}],
        syokugyou:[{pattern:/^.{0,100}$/,message:'職業は100文字以内で入力してください。',trigger:'blur'}],
        kinmusaki:[{pattern:/^.{0,100}$/,message:'勤務先名称は100文字以内で入力してください。',trigger:'blur'}],
        yubinbango:[{required: true, message: '郵便番号が未入力です。', trigger: 'blur'},
          {pattern: /^[0-9]{3}[0-9]{4}$/, message: '郵便番号は7桁数値で入力してください。', trigger: 'blur'}],
        jusyo:[{required:true,message:'住所が未入力です。',trigger:'blur'},
          {pattern:/^.{0,100}$/,message:'住所は100文字以内で入力してください。',trigger:'blur'}],
        denwabango:[{required: true, message: '電話番号が未入力です。', trigger: 'blur'},
          {pattern: /^\d{10,11}$/, message: '電話番号は11桁数値で入力してください。', trigger: 'blur'}],
        mail:[{pattern:/^.{0,100}$/,message:'メールアドレスは100文字以内で入力してください。',trigger:'blur'}],
        mibunsyoumesyo:[{pattern:/^.{0,100}$/,message:'身分証明書は100文字以内で入力してください。',trigger:'blur'}],
        kinkyurenrakusaki:[{pattern:/^.{0,100}$/,message:'緊急連絡先名称は100文字以内で入力してください。',trigger:'blur'}],
        kinkyurenrakusakidenwa:[ {pattern: /^\d{10,11}$/, message: '緊急連絡先電話は10(11)桁数値で入力してください。', trigger: 'blur'}],
      },
      validMsg: {},


    }
  },
  created() {
    this.list()
  },
  methods: {
    list() {
      request.get("/api/karinushiByConditionPage", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          karinushimei: this.form1.karinushimei,
          seibetu: this.form1.seibetu,
          kokuseki: this.form1.kokuseki,
          jusyo: this.form1.jusyo,
          kinmusaki: this.form1.kinmusaki
        }
      }).then(res => {
        console.log("res=", res);
        const genderMap = {
          1: '男',
          2: '女',
          3: 'その他',
          4: '不明'
        };
        // 処理されたデータを保存するための新しい配列を初期化する
        var updatedRecords = [];
        for (var i = 0; i < res.data.records.length; i++) {
          var oldItem = res.data.records[i];
          var newItem = {};  // 更新されたデータを保存する新しいオブジェクトを作成する
          // 古いオブジェクトのすべてのプロパティを新しいオブジェクトにコピー
          for (var key in oldItem) {
            newItem[key] = oldItem[key];
          }
          // 性別フィールドを更新
          newItem.seibetu = genderMap[oldItem.seibetu] ? genderMap[oldItem.seibetu] : oldItem.seibetu;
          // 更新されたオブジェクトを新しい配列に追加する
          updatedRecords.push(newItem);
        }
        this.tableData = updatedRecords;  // 処理されたデータでビューを更新する
        this.total = res.data.total;
      });
    },
    add() {
      this.dialogVisible = true//ポップアップを開く
      this.form = {}
      this.$nextTick(() => {
        this.$refs['form']?.resetFields();//前回のフォーム検証の情報をクリアする
      })
      this.validMsg = {}

    },
    handleEdit(row) {
      this.$nextTick(() => {
        this.$refs['form']?.resetFields();//前回のフォーム検証の情報をクリアする
      });
      request.get("/api/karinushi/find/" + row.karinushiId).then(res => {
        console.log("res=", res)
        if (res.code === "200") {
          this.form = res.data
        } else {
          this.$message({
            type: "error",
            message: res.msg
          })
        }

      })
      this.dialogVisible = true//ポップアップを開く
    },
    handleDel(karinushiId) {
      //    /karinushi/del/
      request.delete("/api/karinushi/del/" + karinushiId).then(res => {
        if(res.code === "200"){
          this.$message({
            type:"success",
            message:"借主情報を削除しました。"
          })
        }else{
          this.$message({
            type:"error",
            message:res.msg
          })
        }
        this.list()

      })


    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.list()
    },
    handleCurrentChange(pageNum) {
      this.currentPage = pageNum
      this.list()
    },
    handleForm1GenderSelectChange(selectValue) {
      if (selectValue === "男") {
        this.form1.seibetu = 1
      } else if (selectValue === "女") {
        this.form1.seibetu = 2
      } else if (selectValue === "その他") {
        this.form1.seibetu = 3
      } else if (selectValue === "不明") {
        this.form1.seibetu = 4
      }
    },
    //`SEIBETU` INT(11) NOT NULL COMMENT '性別 男;1 女:2 その他:3 不明:4',
    handleGenderSelectChange(selectValue) {
      if (selectValue === "男") {
        this.form.seibetu = 1
      } else if (selectValue === "女") {
        this.form.seibetu = 2
      } else if (selectValue === "その他") {
        this.form.seibetu = 3
      } else if (selectValue === "不明") {
        this.form.seibetu = 4
      }
    },
    save() {

      if(this.form.karinushiId){ //更新
        request.put("/api/karinushi/update", this.form).then(res => {
          console.log("res=", res)
          if (res.code === "200") {
            this.$message({
              type: "success",
              message: "借主情報を更新しました。"
            })
          } else {
            this.$message({
              type: "error",
              message: res.msg
            })
          }
          this.list()//借主情報リストをリフレッシュする
          this.dialogVisible = false
        })
      }else{//新規登録

        this.$refs['form'].validate(valid => {

          if(valid){//フロントエンド検証に合格した
            request.post("/api/karinushi/save",this.form).then(res => {
              if(res.code === "200"){
                this.list()
                this.$message({
                  type:"success",
                  message:"借主を登録しました。"
                })
                this.dialogVisible = false;

              }else if(res.code === "400"){
                this.validMsg.karinushimei = res.data.karinushimei;
                this.validMsg.meifurikana = res.date.meifurikana;
                this.validMsg.seibetu = res.date.seibetu;
                this.validMsg.kokuseki = res.date.kokuseki;
                this.validMsg.tanjyoubi = res.date.tanjyoubi;
                this.validMsg.syokugyou = res.date.syokugyou;
                this.validMsg.kinmusaki = res.date.kinmusaki;
                this.validMsg.yubinbango = res.date.yubinbango;
                this.validMsg.jusyo = res.date.jusyo;
                this.validMsg.denwabango = res.date.denwabango;
                this.validMsg.mail = res.date.mail;
                this.validMsg.mibunsyoumesyo = res.date.mibunsyoumesyo;
                this.validMsg.kinkyurenrakusaki = res.date.kinkyurenrakusaki;
                this.validMsg.kinkyurenrakusakidenwa = res.date.kinkyurenrakusakidenwa;
                this.$message({
                  type:"error",
                  message:res.msg
                })
              }
            })
          }else{//フロントエンド検証に不合格
            this.$message({
              type:"error",
              message:"入力エラーがあります。"
            })
            return false

          }
        })



      }


    },
    cancel() {
      this.dialogVisible = false//ポップアップを閉じる
    },

  }
}
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
</style>
