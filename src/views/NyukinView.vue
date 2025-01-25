<template>
  <div>
    <Aside style="margin-left: 10px;margin-top: 10px;margin-bottom: 30px"/>
    <h3 style="text-align: center;margin-bottom: 20px">入金一覧</h3>
    <el-form :inline="true" :model="form1" class="demo-form-inline">
      <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
        <el-form-item label="契約ID" prop="keiyakuId" style="margin-left: 50px">
          <el-input v-model.lazy="form1.keiyakuId"
                    @blur="form1.keiyakuId = form1.keiyakuId ? form1.keiyakuId.trim() : ''"
                    style="width: 200px"/>
        </el-form-item>

        <el-form-item label="入金状態" prop="nyukinjyoutai">
          <el-select
              v-model="form1.nyukinjyoutai"
              placeholder=""
              clearable
              @change="handleForm1StateSelectChange"
          >
            <el-option label="入金済" value="入金済"/>
            <el-option label="入金待ち" value="入金待ち"/>
          </el-select>
        </el-form-item>
      </div>

      <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
        <el-form-item label="請求日" prop="seikyubi" style="margin-left: 50px">
          <el-col>
            <el-date-picker
                v-model="form1.seikyubi"
                type="date"
                placeholder=""
                style="width: 200px"

            />
          </el-col>
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
      <el-table-column sortable prop="nyukinId" label="入金ID"></el-table-column>
      <el-table-column prop="keiyakuId" label="契約ID"></el-table-column>
      <el-table-column prop="nyukinjyoutai" label="状態"></el-table-column>
      <el-table-column prop="seikyubi" label="請求日"></el-table-column>
      <el-table-column prop="nyukinkanryoubi" label="入金完成日"></el-table-column>
      <el-table-column prop="nyukingetu" label="入金月"></el-table-column>
      <el-table-column prop="nyukingaku" label="入金総額"></el-table-column>
      <el-table-column prop="yatin" label="家賃"></el-table-column>
      <el-table-column prop="kanrihi" label="管理費"></el-table-column>

      <el-table-column fixed="right" label="操作" min-width="100">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" type="text">更新</el-button>
          <el-popconfirm :title=" '以下のIDを持つ入金情報を削除しますが、よろしいですか？入金ID:' + scope.row.nyukinId"
                         @confirm="handleDel(scope.row.nyukinId)">
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
    <!--    入金登録・更新画面 ポップアップ   -->
    <el-dialog v-model="dialogVisible" title="入金情報登録(更新)" width="80%">
      <h3 style="text-align: center;margin-bottom: 20px">入金情報登録(更新)画面</h3>
      <p style="margin-left: 30px;margin-bottom: 30px;font-weight: bolder">入金情報</p>

      <div class="dialog-content">
        <el-form :model="form" :rules="rules" ref="form"
                 style="margin-top: 10px;width: 100%;margin-left: 10%">
          <div style="display:flex;flex-wrap: wrap;justify-content: space-between">
            <!--          最初の列-->
            <div style="width: 33.33%;padding-right: 10%">
              <el-form-item label="契約ID(必須)" prop="keiyakuId">
                <el-input v-model.lazy="form.keiyakuId"
                          @blur="form.keiyakuId = form.keiyakuId ? form.keiyakuId.trim() : ''"
                          style="width: 100%"/>
                <!--          返されたバックエンド検証情報を表示する-->
                {{ validMsg.keiyakuId }}
              </el-form-item>

              <el-form-item label="入金状態" prop="nyukinjyoutai">
                <el-select v-model="form.nyukinjyoutai" placeholder="" @change="handleStateSelectChange">
                  <el-option label="入金済" value="入金済"/>
                  <el-option label="入金待ち" value="入金待ち"/>
                </el-select>
                {{ validMsg.nyukinjyoutai }}
              </el-form-item>

              <el-form-item label="管理費" prop="kanrihi">
                <el-input v-model.lazy="form.kanrihi"
                          @blur="form.kanrihi = form.kanrihi ? form.kanrihi.trim() : ''"
                          style="width: 100%"/>

                {{ validMsg.kanrihi }}
              </el-form-item>

              <el-form-item label="礼金" prop="reikin">
                <el-input v-model.lazy="form.reikin"
                          @blur="form.reikin = form.reikin ? form.reikin.trim() : ''"
                          style="width: 100%"/>

                {{ validMsg.reikin }}
              </el-form-item>
              <el-form-item label="振込手数料" prop="sonotaryoukinnaiyou">
                <el-input v-model.lazy="form.sonotaryoukinnaiyou"
                          @blur="form.sonotaryoukinnaiyou = form.sonotaryoukinnaiyou ? form.sonotaryoukinnaiyou.trim() : ''"
                          style="width: 100%"/>

                {{ validMsg.sonotaryoukinnaiyou }}
              </el-form-item>
            </div>
            <!--          2列目-->
            <div style="width: 33.33%;padding-right: 10%">
              <el-form-item label="請求日" prop="seikyubi" >
                <el-col>
                  <el-date-picker
                      v-model="form.seikyubi"
                      type="date"
                      placeholder=""
                      style="width: 100%"/>

                </el-col>
                {{ validMsg.seikyubi }}
              </el-form-item>
              <el-form-item label="入金月" prop="nyukingetu" >
                <el-col >
<!--                  <el-date-picker-->
<!--                      v-model="form.nyukingetu"-->
<!--                      type="date"-->
<!--                      placeholder=""-->
<!--                      style="width: 100%"/>-->
                  <el-date-picker
                      v-model="form.nyukingetu"
                      type="month"
                      placeholder=""
                      style="width: 100%"
                  />
                </el-col>
                {{ validMsg.nyukingetu }}
              </el-form-item>
              <el-form-item label="家賃" prop="yatin">
                <el-input v-model.lazy="form.yatin"
                          @blur="form.yatin = form.yatin ? form.yatin.trim() : ''"
                          style="width:100%"/>

                {{ validMsg.yatin }}
              </el-form-item>
              <el-form-item label="敷金" prop="sikikin">
                <el-input v-model.lazy="form.sikikin"
                          @blur="form.sikikin = form.sikikin ? form.sikikin.trim() : ''"
                          style="width:100%"/>

                {{ validMsg.sikikin }}
              </el-form-item>
              <el-form-item label="清掃費" prop="seisouhi">
                <el-input v-model.lazy="form.seisouhi"
                          @blur="form.seisouhi = form.seisouhi ? form.seisouhi.trim() : ''"
                          style="width:100%"/>

                {{ validMsg.seisouhi }}
              </el-form-item>
            </div>
            <!--          3列目-->
            <div style="width: 33.33%;padding-right: 10%">
              <el-form-item label="入金完成日" prop="nyukinkanryoubi">
                <el-col >
                  <el-date-picker
                      v-model="form.nyukinkanryoubi"
                      type="date"
                      placeholder=""
                      style="width:100%"
                  />
                </el-col>
                {{ validMsg.nyukinkanryoubi }}
              </el-form-item>

              <el-form-item label="入金総額" prop="nyukingaku">
                <el-input v-model.lazy="form.nyukingaku"
                          @blur="form.nyukingaku = form.nyukingaku ? form.nyukingaku.trim() : ''"
                          style="width:100%"/>

                {{ validMsg.nyukingaku }}
              </el-form-item>

              <el-form-item label="修繕積立金" prop="syuzentumitatekin">
                <el-input v-model.lazy="form.syuzentumitatekin"
                          @blur="form.syuzentumitatekin = form.syuzentumitatekin ? form.syuzentumitatekin.trim() : ''"
                          style="width: 100%"/>

                {{ validMsg.syuzentumitatekin }}
              </el-form-item>

              <el-form-item label="更新料" prop="sonotaryoukin">
                <el-input v-model.lazy="form.sonotaryoukin"
                          @blur="form.sonotaryoukin = form.sonotaryoukin ? form.sonotaryoukin.trim() : ''"
                          style="width: 100%"/>

                {{ validMsg.sonotaryoukin }}
              </el-form-item>

            </div>

          </div>

          <div style="margin-left: 250px;margin-top: 30px">
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
  name: "NyukinView",
  components: {Aside},
  data() {
    return {
      form1: {},
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      dialogVisible: false,
      form: {},
      rules: {
         keiyakuId : [{required:true,message:"契約IDが未入力です。",trigger:'blur'},
           {pattern: /^(0|[1-9]\d{0,9})$/, message: '契約IDは10桁数値以内で入力してください。', trigger: 'blur'}],
        nyukingaku : [{pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:"入金総額は10桁数値以内で入力してください。",trigger:'blur'}],
        yatin : [{pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:"家賃は10桁数値以内で入力してください。",trigger:'blur'}],
        kanrihi : [{pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:"管理費は10桁数値以内で入力してください。",trigger:'blur'}],
        syuzentumitatekin : [{pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:"修繕積立金は10桁数値以内で入力してください。",trigger:'blur'}],
        reikin : [{pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:"礼金は10桁数値以内で入力してください。",trigger:'blur'}],
        sikikin : [{pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:"敷金は10桁数値以内で入力してください。",trigger:'blur'}],
        sonotaryoukin : [{pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:"更新料は10桁数値以内で入力してください。",trigger:'blur'}],
        sonotaryoukinnaiyou : [{pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:"振込手数料は10桁数値以内で入力してください。",trigger:'blur'}],
        seisouhi : [{pattern: /^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:"清掃費は10桁数値以内で入力してください。",trigger:'blur'}],
      },
      validMsg: {},


    }
  },
  created(){
    this.list()
  },
  methods: {
    onDateSelectChange(dateValue){
      let formattedDate = null
      if(dateValue){
        var date = new Date(dateValue);
        formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
      console.log("dateValue=",formattedDate)
    },
    list() {
      let formattedDate = null
      if(this.form1.seikyubi){
        var date = new Date(this.form1.seikyubi);
        formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
      request.get("/api/nyukin/listNyukinByConditionPage",{
        params:{
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          keiyakuId:this.form1.keiyakuId,
          nyukinjyoutai:this.form1.nyukinjyoutai,
          seikyubi:formattedDate,
          // _t:new Date().getTime(),
        }
      }).then(res => {
        const stateMap = {
          1:'入金済',
          2:'入金待ち'
        }
        var newRecords = []
        for (var i = 0 ; i < res.data.records.length;i++) {
          var item = res.data.records[i]
          var newItem  = {}
          for (var key in  item) {
            newItem[key] = item[key]
          }
          //バックエンドから返された nukingetu の日付形式を yyyy-MM にフォーマットし、
          // テーブルにレンダリングします。
          if(newItem.nyukingetu){
            const nyukingetuWithYearMonth = newItem.nyukingetu
            const nyukingetu = new Date(nyukingetuWithYearMonth)
            const year = nyukingetu.getFullYear();
            const month = nyukingetu.getMonth() + 1;
            const formattedYearMonth = `${year}-${month.toString().padStart(2, '0')}`;
            newItem.nyukingetu = formattedYearMonth
            console.log("formattedYearMonth=",formattedYearMonth)
          }
          newItem.nyukinjyoutai = stateMap[item.nyukinjyoutai] ? stateMap[item.nyukinjyoutai] : item.nyukinjyoutai;
          newRecords.push(newItem)
        }
        this.tableData = newRecords
        this.total = res.data.total
      })
    },
    add() {
      this.$nextTick(() => {
        this.$refs['form']?.resetFields();//前回のフォーム検証の情報をクリアする
      })
      this.dialogVisible = true//ポップアップを開く
      this.form = {}
      this.validMsg = {}
    },
    handleEdit(row) {
      this.$nextTick(() => {
        this.$refs['form']?.resetFields();//前回のフォーム検証の情報をクリアする
      });
      this.validMsg = {}
      this.dialogVisible = true//ポップアップを開く
      request.get("/api/nyukin/find/" + row.nyukinId).then(res => {
        if(res.code === "200"){
          this.form = res.data
        }else{
          this.$message({
            type:"error",
            message:res.msg
          })
        }
      })

    },
    handleDel(nyukinId) {
      request.delete("/api/nyukin/del/" + nyukinId).then(res => {
        if(res.code === "200"){
          this.$message({
            type:"success",
            message:"入金情報を削除しました。"
          })
          this.list()
        }else{
          this.$message({
            type:"error",
            message:res.msg
          })
        }

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
    handleForm1StateSelectChange(stateValue) {
      if(stateValue === "入金済"){
        this.form1.nyukinjyoutai = 1
      }else if(stateValue === "入金待ち"){
        this.form1.nyukinjyoutai = 2
      }else{
        this.form1.nyukinjyoutai = null
      }
    },
    handleStateSelectChange(stateSelectValue){
      // <el-option label="入金済" value="入金済"/>
      // <el-option label="入金待ち" value="入金待ち"/>
      if(stateSelectValue === "入金済"){
        this.form.nyukinjyoutai = 1
      }else if(stateSelectValue === "入金待ち"){
        this.form.nyukinjyoutai = 2
      }else{
        this.form.nyukinjyoutai = null
      }
    },
    save() {
      if(this.form.nyukinId){//入金情報の更新
        request.put("/api/nyukin/update",this.form).then(res => {
          if(res.code === "200"){
            this.$message({
              type:"success",
              message:"入金情報を更新しました。"
            })
            this.list()
            this.dialogVisible = false
          }else{
            this.$message({
              type:"error",
              message:res.msg
            })
          }
        })
      }else{//入金情報の新規登録
        this.$refs['form'].validate(valid => {
          if(valid){//フロントエンド検証に合格した
            request.post("/api/nyukin/save/",this.form).then(res => {
              if(res.code === "200"){
                this.$message({
                  type:"success",
                  message:"入金を登録しました。"
                })
                this.dialogVisible = false;
              }else if(res.code === "500"){//バックエンド検証で契約IDが存在しない場合
                this.$message({
                  type:"error",
                  message:res.msg
                })
                this.validMsg.keiyakuId = res.data.keiyakuId
              }else if(res.code === "400"){//バックエンド検証エラーメッセージ
                this.validMsg.keiyakuId = res.data.keiyakuId
                this.validMsg.nyukingaku = res.data.nyukingaku
                this.validMsg.yatin = res.data.yatin
                this.validMsg.kanrihi = res.data.kanrihi
                this.validMsg.syuzentumitatekin = res.data.syuzentumitatekin
                this.validMsg.reikin = res.data.reikin
                this.validMsg.sikikin = res.data.sikikin
                this.validMsg.sonotaryoukin = res.data.sonotaryoukin
                this.validMsg.sonotaryoukinnaiyou = res.data.sonotaryoukinnaiyou
                this.validMsg.seisouhi = res.data.seisouhi
              }

            })
          }else{//フロントエンド検証に不合格
            this.$message({
              type:"error",
              message:"入力エラーがあります。"
            })
            return false;
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
.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

</style>
