<template>
  <div>

    <!--    物件一覧    -->
    <Aside style="margin-left: 10px;margin-top: 10px;margin-bottom: 30px"/>

    <h3 style="text-align: center;margin-bottom: 20px">物件一覧</h3>

    <el-form :inline="true" :model="form1" class="demo-form-inline">
      <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
        <el-form-item label="物件名" prop="bukenmei" style="margin-left: 50px">
          <el-input v-model.lazy="form1.bukenmei"
                    @blur="form1.bukenmei = form1.bukenmei ? form1.bukenmei.trim() : ''"
                    style="width: 200px"/>
        </el-form-item>

        <el-form-item label="状態" prop="bukenjyoutai" >
          <el-select
              v-model="form1.bukenjyoutai"
              placeholder=""
              clearable
              style="width: 200px"
          >
            <el-option label="未契約" value="未契約"/>
            <el-option label="契約中" value="契約中"/>
          </el-select>
        </el-form-item>
        <el-form-item label="種類" prop="syurui">
          <el-select
              v-model="form1.syurui"
              placeholder=""
              clearable
              style="width: 200px"
          >
            <el-option label="マンション" value="マンション"/>
            <el-option label="アパート" value="アパート"/>
            <el-option label="戸建て" value="戸建て"/>
          </el-select>
        </el-form-item>
      </div>
      <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
        <el-form-item label="住所" prop="jyusyo" style="margin-left: 50px">
          <el-input v-model.lazy="form1.jyusyo" @blur="form1.jyusyo = form1.jyusyo ? form1.jyusyo.trim() : ''"
                    style=" width: 200px"/>
        </el-form-item>
        <el-form-item label="最寄り駅" prop="moyorieki">
          <el-input v-model.lazy="form1.moyorieki" @blur="form1.moyorieki = form1.moyorieki ? form1.moyorieki.trim() : ''"
                    style=" width: 200px"/>
        </el-form-item>
      </div>



      <!--    検索    -->
      <div style="margin-top: 10px">
        <el-button  style="margin-left: 50px;width: 2cm" type="primary" @click="list">検索</el-button>
      </div>

      <!--    新規   -->
      <div style="margin-top: 20px">
        <el-button type="primary" @click="add" style="margin-left: 88%">新規</el-button>
      </div>
    </el-form>

    <el-table :data="tableData" border stripe style="width: 90%;display: flex;margin-top: 10px;margin-left: 50px">
      <el-table-column sortable prop="bukenId" label="ID"></el-table-column>
      <el-table-column prop="bukenmei" label="物件名"></el-table-column>
      <el-table-column prop="bukenjyoutai" label="状態"></el-table-column>
      <el-table-column prop="syurui" label="種類"></el-table-column>
      <el-table-column prop="yubinbango" label="郵便番号"></el-table-column>
      <el-table-column prop="jyusyo" label="住所"></el-table-column>
      <el-table-column prop="moyorieki" label="最寄り駅"></el-table-column>
      <el-table-column prop="tohojikan" label="駅徒歩"></el-table-column>
      <el-table-column prop="yakin" label="家賃"></el-table-column>
      <el-table-column prop="kanrihi" label="管理費"></el-table-column>

      <el-table-column fixed="right" label="操作" min-width="100">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" type="text">更新</el-button>
          <el-popconfirm :title=" '以下のIDを持つ物件情報を削除しますが、よろしいですか？物件ID:' + scope.row.bukenId"
                         @confirm="handleDel(scope.row.bukenId)">
            <template #reference>
              <el-button type="text">削除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--    ページングナビゲーションコンポーネントの導入
          total="total" はデータの合計数を示す
          page-size="pageSize" は、各ページに表示されるデータの数を示す
          Vue は、合計と pageSize の計算に基づいてナビゲーション バーを形成できる これら 2 つのデータはバックエンドから取得する必要があります。
          current-page="currentPage" は現在のページを示す
          レイアウトは、ページング ナビゲーションに表示されるコンテンツを決定する
    -->
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


    <!--    物件情報登録(更新)画面 ポップアップ   -->
    <el-dialog v-model="dialogVisible" title="物件情報登録(更新)" width="80%">
      <h3 style="text-align: center;margin-bottom: 20px">物件情報登録(更新)画面</h3>
      <p style="margin-left: 35px;margin-bottom: 30px;font-weight: bolder">物件情報</p>

      <el-form :model="form" :rules="rules" ref="form" :inline="true"
               style="margin-top: 10px;width: 80%;margin-left: 20%">
        <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
          <el-form-item label="物件名(必須)" prop="bukenmei">
            <el-input v-model.lazy="form.bukenmei"
                      @blur="form.bukenmei = form.bukenmei ? form.bukenmei.trim() : ''"
                      style="width: 200px"/>
            <!--          返されたバックエンド検証情報を表示する-->
            {{validMsg.bukenmei}}
          </el-form-item>
          <el-form-item label="状態(必須)" prop="bukenjyoutai">
            <el-select v-model="form.bukenjyoutai" placeholder="" @change="handleStateSelectChange"
                       style="width: 200px">
              <el-option label="未契約" value="未契約"/>
              <el-option label="契約中" value="契約中"/>
            </el-select>
            {{validMsg.bukenjyoutai}}
          </el-form-item>
        </div>

        <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
          <el-form-item label="建設日(必須)" prop="kensetsubi">
            <el-col>
              <el-date-picker
                  v-model="form.kensetsubi"
                  type="date"
                  placeholder=""
                  style="width: 200px"
              />
            </el-col>
            {{validMsg.kensetsubi}}
          </el-form-item>
          <el-form-item label="種類" prop="syurui">
            <el-select
                v-model="form.syurui"
                placeholder=""
                @change="handleHouseSelectChange"
                clearable
                style="width: 200px"
            >
              <el-option label="マンション" value="マンション"/>
              <el-option label="アパート" value="アパート"/>
              <el-option label="戸建て" value="戸建て"/>
            </el-select>
          </el-form-item>
        </div>

        <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
          <el-form-item label="郵便番号(必須)" prop="yubinbango" >
            <el-input v-model.lazy="form.yubinbango"
                      @blur="form.yubinbango = form.yubinbango ? form.yubinbango.trim() : ''"
                      style="width: 150px"/>
            {{validMsg.yubinbango}}
          </el-form-item>
          <el-form-item label="最寄り駅" prop="moyorieki">
            <el-input v-model.lazy="form.moyorieki"
                      @blur="form.moyorieki = form.moyorieki ? form.moyorieki.trim() : ''"
                      style="width: 150px"/>
          </el-form-item>
          <el-form-item label="徒歩" prop="tohojikan">
            <el-input v-model.lazy="form.tohojikan"
                      @blur="form.tohojikan = form.tohojikan ? form.tohojikan.trim() : ''"
                      style="width: 100px"/>
            分
            {{validMsg.tohojikan}}
          </el-form-item>
        </div>
        <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
          <el-form-item label="住所(必須)" prop="jyusyo" >
            <el-input v-model.lazy="form.jyusyo"
                      @blur="form.jyusyo = form.jyusyo ? form.jyusyo.trim() : ''"
                      style="width:200px"/>
            {{validMsg.jyusyo}}
          </el-form-item>
          <!--        INT(11) COMMENT 'ペット可否      ペット可：1    ペット不可：2-->
          <el-form-item label="ペット可否" prop="pettokahi">
            <el-checkbox
                :true-label="1"
                :false-label="2"
                v-model="form.pettokahi"
            >
              ※ 有場合にチェック
            </el-checkbox>
          </el-form-item>
        </div>
        <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
          <!--        INT(11)  COMMENT 'エレベーター有無 有：1 無：2',-->
          <el-form-item label="エレベーター有無" prop="elevator">
            <el-checkbox
                :true-label="1"
                :false-label="2"
                v-model="form.elevator"
            >
              ※ 有場合にチェック
            </el-checkbox>
          </el-form-item>
          <el-form-item label="階層" prop="kaiso">
            <el-input v-model.lazy="form.kaiso"
                      @blur="form.kaiso = form.kaiso ? form.kaiso.trim() : ''"
                      style="width: 80px"/>
            階
            {{validMsg.kaiso}}
          </el-form-item>
          <el-form-item label="面積" prop="menseki">
            <el-input v-model.lazy="form.menseki"
                      @blur="form.menseki = form.menseki ? form.menseki.trim() : ''"
                      style="width: 80px"/>
            ㎡
            {{validMsg.menseki}}
          </el-form-item>
        </div>

        <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
          <el-form-item label="固定資産税" prop="koteishizanzei">
            <el-input v-model.lazy="form.koteishizanzei"
                      @blur="form.koteishizanzei = form.koteishizanzei ? form.koteishizanzei.trim() : ''"
                      style="width: 120px"/>
            円
            {{validMsg.koteishizanzei}}
          </el-form-item>
          <el-form-item label="修繕積立金" prop="shuzentstmitatekin">
            <el-input v-model.lazy="form.shuzentstmitatekin"
                      @blur="form.shuzentstmitatekin = form.shuzentstmitatekin ? form.shuzentstmitatekin.trim() : ''"
                      style="width: 120px"/>
            円
            {{validMsg.shuzentstmitatekin}}
          </el-form-item>
          <el-form-item label="家賃" prop="yakin">
            <el-input v-model.lazy="form.yakin"
                      @blur="form.yakin = form.yakin ? form.yakin.trim() : ''"
                      style="width: 120px"/>
            円
            {{validMsg.yakin}}
          </el-form-item>
        </div>
        <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
          <el-form-item label="敷金" prop="shikikin">
            <el-input v-model.lazy="form.shikikin"
                      @blur="form.shikikin = form.shikikin ? form.shikikin.trim() : ''"
                      style="width: 120px"/>
            円
            {{validMsg.shikikin}}
          </el-form-item>
          <el-form-item label="管理費" prop="kanrihi">
            <el-input v-model.lazy="form.kanrihi"
                      @blur="form.kanrihi = form.kanrihi ? form.kanrihi.trim() : ''"
                      style="width: 120px"/>
            円
            {{validMsg.kanrihi}}
          </el-form-item>
          <el-form-item label="礼金" prop="reikin">
            <el-input v-model.lazy="form.reikin"
                      @blur="form.reikin = form.reikin ? form.reikin.trim() : ''"
                      style="width: 120px"/>
            円
            {{validMsg.reikin}}
          </el-form-item>
        </div>
        <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
          <el-form-item label="その他費用" prop="sonota">
            <el-input v-model.lazy="form.sonota"
                      @blur="form.sonota = form.sonota ? form.sonota.trim() : ''"
                      style="width: 120px"/>
            円
            {{validMsg.sonota}}
          </el-form-item>
        </div>

        <div style="margin-left: 150px;margin-top: 30px">
          <el-button type="primary" @click="save" style="width: 2cm">登録(更新)</el-button>
          <el-button @click="cancel" type="primary" style="width: 2cm;margin-left: 30%">キャンセル</el-button>
        </div>
      </el-form>
    </el-dialog>


  </div>
</template>
<script>
import Aside from "@/components/Aside";
import request from "@/utils/request";

export default {
  name: "BukenView",
  components: {Aside},
  data() {
    return {
      validMsg: {},//関連するバックエンド検証情報
      currentPage: 1,//現在のページ、初期値 1
      pageSize: 5,//各ページに表示されるレコードの数、初期値は 5
      total: 7,//物件情報の合計 初期値は 10件
      dialogVisible: false,//ポップアップ  デフォルト false
      form1: {},//検索用のフォーム
      form: {
        bukenjyoutai: "",//VARCHAR(255) NOT NULL  COMMENT '物件状態 未契約:0 契約中:1'
        pettokahi: 2,//INT(11) COMMENT 'ペット可否 ペット可：1 ペット不可：2'
        syurui: "",//` VARCHAR(100)  COMMENT '物件種類 マンション:1 アパート:2 戸建:3',
        elevator: 2// INT(11)  COMMENT 'エレベーター有無 有：1 無：2',
      },//フォームデータ
      tableData: [],
      rules: {
        bukenmei: [{required: true, message: '物件名が未入力です。', trigger: 'blur'},
          {pattern: /^.{0,100}$/, message: '物件名は100文字以内で入力してください。', trigger: 'blur'}],
        bukenjyoutai: [{required: true, message: '状態が未入力です。', trigger: 'blur'}],
        kensetsubi: [{required: true, message: '建設日が未入力です。', trigger: 'blur'}],
        syurui: [{message: '', trigger: 'blur'}],
        yubinbango: [{required: true, message: '郵便番号が未入力です。', trigger: 'blur'},
          {pattern: /^[0-9]{3}[0-9]{4}$/, message: '郵便番号は7桁数値で入力してください。', trigger: 'blur'}],
        moyorieki: [{message: '', trigger: 'blur'}],
        tohojikan: [{message: ''},
          {pattern: /^(0|[1-9]\d{0,9})$/, message: '徒歩時間は10桁数値以内で入力してください。', trigger: 'blur'}],
        jyusyo: [{required: true, message: '住所が未入力です', trigger: 'blur'},
          {pattern: /^.{0,100}$/, message: '住所は100文字以内で入力してください。', trigger: 'blur'}],
        kaiso: [{message: '', trigger: 'blur'},
          {pattern: /^(([1-9]\d*)|0)$/, message: '階層は数値で入力してください。', trigger: 'blur'}],
        menseki: [{message: ''},
          {pattern: /^(0|[1-9]\d{0,9})$/, message: '面積は10桁数値以内で入力してください。', trigger: 'blur'}],
        koteishizanzei: [{message: ''},
          {pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/, message: '固定資産税は10桁数値以内で入力してください。', trigger: 'blur'}],
        shuzentstmitatekin: [{message: ''},
          {pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/, message: '修繕積立金は10桁数値以内で入力してください。', trigger: 'blur'}],
        yakin: [{message: ''},
          {pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/, message: '家賃は10桁数値以内で入力してください。', trigger: 'blur'}],
        shikikin: [{message: ''},
          {pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/, message: '敷金は10桁数値以内で入力してください。', trigger: 'blur'}],
        kanrihi: [{message: ''},
          {pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/, message: '管理費は10桁数値以内で入力してください。', trigger: 'blur'}],
        reikin: [{message: ''},
          {pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/, message: '礼金は10桁数値以内で入力してください。', trigger: 'blur'}],
        sonota: [{message: ''},
          {pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/, message: 'その他費用は10桁数値以内で入力してください。', trigger: 'blur'}]
      }

    }
  },
  created() {
    this.list()
  },
  methods: {
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.list()
    },
    handleCurrentChange(pageNum) {
      this.currentPage = pageNum
      this.list()
    },


    list() { //bukenリストを示す
      // request.get("/api/bukens").then(res =>{
      //   console.log("res",res)
      //   //返されたデータを tableData にバインドする
      //   this.tableData = res.data
      // })
      request.get("/api/bukensByConditionPage", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          bukenmei: this.form1.bukenmei,
          bukenjyoutai: this.form1.bukenjyoutai,
          syurui: this.form1.syurui,
          jyusyo: this.form1.jyusyo,
          tohojikan: this.form1.tohojikan

        }
      }).then(res => {
        //console.log("res",res)
        this.tableData = res.data.records
        //返された物件総計数を更新する
        this.total = res.data.total
      })


    },

    handleHouseSelectChange(selectValue) {//VARCHAR(100) '物件種類 マンション:1 アパート:2 戸建:3',
      if (selectValue === "マンション") {
        this.syurui = "1";// マンション
      } else if (selectValue === "アパート") {
        this.syurui = "2"; // アパート
      } else if (selectValue === "戸建て") {
        this.syurui = "3"; // 戸建
      } else {
        this.syurui = ""; // 未選択
      }
    },
    handleStateSelectChange(selectValue) {//VARCHAR(255) NOT NULL '物件状態 未契約:0 契約中:1'
      console.log("selectValue", selectValue)
      if (selectValue === "契約中") {
        this.bukenjyoutai = "1"; // 契約中
      } else if (selectValue === "未契約") {
        this.bukenjyoutai = "0"; // 未契約
      } else {
        this.bukenjyoutai = ""; // 未選択
      }
    },


    handleEdit(row) {

      //this.$router.push('/bukenlogin')

      // console.log("row",row)
      // console.log("row2",JSON.stringify(row))
      // console.log("row3",JSON.parse(JSON.stringify(row)))
      // this.form = JSON.parse(JSON.stringify(row))
      // this.dialogVisible = true

      this.$nextTick(() => {
        this.$refs['form']?.resetFields();//前回のフォーム検証の情報をクリアする
      })
      //DBからbukenId経由で物件情報を取得し、ダイアログポップに表示する。
      request.get("/api/find/" + row.bukenId).then(res => {
        console.log("row.bukenId", row.bukenId)
        if (res.code === "200") {//成功
          this.form = res.data
        } else {//エラー
          this.$message({
            type: "error",
            message: res.msg //エラーメッセージを示す
          })
        }
      })
      this.dialogVisible = true
    },
    handleDel(bukenId) {
      request.delete("/api/del/" + bukenId).then(res => {
        //alert("以下のIDを持つ物件情報を削除しますが、よろしいですか？物件ID:" + bukenId)
        if (res.code === "200") {
          this.$message({
            type: "success",
            message: "物件情報を削除しました。"
          })
        } else {
          this.$message({
            type: "error",
            message: res.msg //返されたエラーメッセージを示す
          })
        }
      })
      this.list()//bukenリストを更新する
    },

    add() {//新規登録

      this.dialogVisible = true//ポップアップを開く
      this.form = {} //フォームデータをクリア
      //this.$refs['form'].resetFields()
      //フォームをリセットする前に、ポップアップが完全にレンダリングされるまで待つ!!!!!!!!!!
      this.$nextTick(() => {
        this.$refs['form']?.resetFields();//前回のフォーム検証の情報をクリアする
      })
      this.validMsg = {}

    },
    //  物件の新規登録/物件情報の更新
    save() {
      if (this.form.bukenId) { //物件情報の更新
        request.put("/api/update", this.form).then(
            res => {
              if (res.code === "200") {
                //成功メッセージボックス
                this.$message({
                  type: "success",
                  message: "物件情報を更新しました。"
                })
              } else {
                this.$message({
                  type: "error",
                  message: res.msg
                })
              }
              this.list()//bukenリストを更新する
              this.dialogVisible = false
            }
        )

      } else {//物件の新規登録
        // request.post("/api/save",this.form).then(
        //     res => {
        //       console.log("res=",res)
        //       this.dialogVisible = false
        //       this.list()//bukenリストを更新する
        //     }
        // )
        this.$refs['form'].validate(valid => {
          //alert(valid)
          if (valid) {//フロントエンド検証に合格した
            request.post("/api/save", this.form).then(
                res => {

                  if (res.code === "200") {//バックエンド検証に合格した
                    console.log("res=", res)
                    this.dialogVisible = false
                    this.list()//bukenリストを更新する
                    this.$message({
                      type: "success",
                      message: "物件を登録しました。"
                    })
                  } else if (res.code === "400") {//バックエンド検証に失敗した

                    this.validMsg.bukenmei = res.data.bukenmei
                    this.validMsg.bukenjyoutai = res.data.bukenjyoutai
                    this.validMsg.kensetsubi = res.data.kensetsubi
                    this.validMsg.yubinbango = res.data.yubinbango
                    this.validMsg.tohojikan = res.data.tohojikan
                    this.validMsg.jyusyo = res.data.jyusyo
                    this.validMsg.kaiso = res.data.kaiso
                    this.validMsg.menseki = res.data.menseki
                    this.validMsg.koteishizanzei = res.data.koteishizanzei
                    this.validMsg.shuzentstmitatekin = res.data.shuzentstmitatekin
                    this.validMsg.yakin = res.data.yakin
                    this.validMsg.shikikin = res.data.shikikin
                    this.validMsg.kanrihi = res.data.kanrihi
                    this.validMsg.reikin = res.data.reikin
                    this.validMsg.sonota = res.data.sonota
                  }
                }
            )
          } else {//フロントエンド検証に不合格
            this.$message({
              type: "error",
              message: "入力エラーがあります。"
            })
            return false;
          }
        })
      }
    },
    cancel() {
      this.dialogVisible = false//ポップアップを閉じる
    }


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
</style>

<!--<div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">-->

<!--</div>-->


