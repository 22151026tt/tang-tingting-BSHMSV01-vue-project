<template>
  <div>
    <!--    契約一覧    -->
    <Aside style="margin-left: 10px;margin-top: 10px;margin-bottom: 30px"/>
    <h3 style="text-align: center;margin-bottom: 20px">契約一覧</h3>
    <el-form :inline="true" :model="form1" style="width:100%" class="demo-form-inline">
      <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 10px">
        <el-form-item label="借主ID" prop="karinushiId" style="margin-left: 50px">
          <el-input v-model.lazy="form1.karinushiId"
                    @blur="form1.karinushiId = form1.karinushiId ? form1.karinushiId.trim() : ''"
                    style="width: 200px"/>
        </el-form-item>

        <el-form-item label="契約状態" prop="keiyakujyoutai" style="width: 200px">
          <el-select
              v-model="form1.keiyakujyoutai"
              placeholder=""
              clearable
              @change="handleStateSelectChangeForm1"

          >
            <el-option label="正常" value="正常"/>
            <el-option label="終了" value="終了"/>
          </el-select>
        </el-form-item>
      </div>

      <div style="display: flex;justify-content: flex-start;align-items: center;gap: 20px;margin-bottom: 20px">
        <el-form-item label="物件ID" prop="bukenId" style="margin-left: 50px">
          <el-input v-model.lazy="form1.bukenId" @blur="form1.bukenId = form1.bukenId ? form1.bukenId.trim() : ''"
                    style=" width: 200px"/>
        </el-form-item>

        <el-form-item label="開始日" prop="kaishibi">
          <el-col  >
            <el-date-picker
                v-model="form1.kaishibi"
                type="date"
                placeholder=""
                style="width: 150px"

            />
          </el-col>
        </el-form-item>

        <el-form-item label="終了日" prop="syuryoubi">
          <el-col  >
            <el-date-picker
                v-model="form1.syuryoubi"
                type="date"
                placeholder=""
                style="width: 150px"
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
      <el-table-column sortable prop="keiyakuId" label="ID"></el-table-column>
      <el-table-column prop="karinushimei" label="借主名"></el-table-column>
      <el-table-column prop="bukenmei" label="物件名"></el-table-column>
      <el-table-column prop="kaishibi" label="開始日"></el-table-column>
      <el-table-column prop="syuryoubi" label="終了日"></el-table-column>
      <el-table-column prop="keiyakujyoutai" label="契約状態"></el-table-column>
      <el-table-column prop="shiharaihouhou" label="支払い方法"></el-table-column>
      <el-table-column prop="yatin" label="家賃"></el-table-column>
      <el-table-column prop="kanrihi" label="管理費"></el-table-column>

      <el-table-column fixed="right" label="操作" min-width="100">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" type="text">更新</el-button>
          <el-popconfirm :title=" '以下のIDを持つ契約情報を削除しますが、よろしいですか？契約ID:' + scope.row.keiyakuId"
                         @confirm="handleDel(scope.row.keiyakuId)">
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
    <!--    契約登録・更新画面	 ポップアップ   -->
    <el-dialog v-model="dialogVisible" title="契約情報登録(更新)" width="80%">
      <h3 style="text-align: center;margin-bottom: 20px">契約情報登録(更新)画面</h3>
      <p style="margin-left: 35px;margin-bottom: 30px;font-weight: bolder">契約情報</p>

      <div class="form-container">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="form-layout">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="物件ID(必須)" prop="bukenId" style="width:400px">
                <el-input v-model.lazy="form.bukenId"
                          @blur="form.bukenId = form.bukenId ? form.bukenId.trim() : ''"
                          style="width: 80%"/>
                <!--          返されたバックエンド検証情報を表示する-->
                {{ validMsg.bukenId }}
              </el-form-item>

              <el-form-item label="開始日" prop="kaishibi" style="width: 600px">
                <el-col :span="11" style="width: 150px">
                  <el-date-picker
                      v-model="form.kaishibi"
                      type="date"
                      placeholder=""
                      style="width: 80%"
                      @change="getStartDate"
                  />
                </el-col>
                {{ validMsg.kaishibi }}
              </el-form-item>
              <el-form-item label="契約状態" prop="keiyakujyoutai" style="width: 200px">
                <el-select v-model="form.keiyakujyoutai" placeholder="" @change="handleStateSelectChange">
                  <el-option label="正常" value="正常"/>
                  <el-option label="終了" value="終了"/>
                </el-select>
                {{ validMsg.keiyakujyoutai }}
              </el-form-item>
              <el-form-item label="家賃" prop="yatin">
                <el-input v-model.lazy="form.yatin"
                          @blur="form.yatin = form.yatin ? form.yatin.trim() : ''"
                          style="width: 120px"/>
                円
                {{ validMsg.yatin }}
              </el-form-item>

              <el-form-item label="礼金" prop="reikin">
                <el-input v-model.lazy="form.reikin"
                          @blur="form.reikin = form.reikin ? form.reikin.trim() : ''"
                          style="width: 120px"/>
                円
                {{ validMsg.reikin }}
              </el-form-item>
              <el-form-item label="敷金" prop="shikikin">
                <el-input v-model.lazy="form.shikikin"
                          @blur="form.shikikin = form.shikikin ? form.shikikin.trim() : ''"
                          style="width: 120px"/>
                円
                {{ validMsg.shikikin }}
              </el-form-item>
              <el-form-item label="更新料" prop="kousinryou">
                <el-input v-model.lazy="form.kousinryou"
                          @blur="form.kousinryou = form.kousinryou ? form.kousinryou.trim() : ''"
                          style="width: 120px"/>
                円
                {{ validMsg.kousinryou }}
              </el-form-item>
              <el-form-item label="清掃費" prop="seisouhi">
                <el-input v-model.lazy="form.seisouhi"
                          @blur="form.seisouhi = form.seisouhi ? form.seisouhi.trim() : ''"
                          style="width: 120px"/>
                円
                {{ validMsg.seisouhi }}
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="借主ID(必須)" prop="karinushiId" style="width:400px">
                <el-input v-model.lazy="form.karinushiId"
                          @blur="form.karinushiId = form.karinushiId ? form.karinushiId.trim() : ''"
                          style="width: 80%"/>
                <!--          返されたバックエンド検証情報を表示する-->
                {{validMsg.karinushiId}}
              </el-form-item>

              <el-form-item label="終了日" prop="syuryoubi" style="width: 600px">
                <el-col :span="11" style="width: 150px">
                  <el-date-picker
                      v-model="form.syuryoubi"
                      type="date"
                      placeholder=""
                      style="width: 80%"
                  />
                </el-col>
                {{ validMsg.syuryoubi }}
              </el-form-item>

              <el-form-item label="支払い方法" prop="shiharaihouhou" style="width: 200px">
                <el-select v-model="form.shiharaihouhou" placeholder="" @change="handlePaySelectChange">
                  <el-option label="振込" value="振込"/>
                  <el-option label="現金" value="現金"/>
                </el-select>
                {{ validMsg.shiharaihouhou }}
              </el-form-item>

              <el-form-item label="修繕積立金" prop="shuzentsumitatekin">
                <el-input v-model.lazy="form.shuzentsumitatekin"
                          @blur="form.shuzentsumitatekin = form.shuzentsumitatekin ? form.shuzentsumitatekin.trim() : ''"
                          style="width: 120px"/>
                円
                {{ validMsg.shuzentsumitatekin }}
              </el-form-item>

              <el-form-item label="管理費" prop="kanrihi">
                <el-input v-model.lazy="form.kanrihi"
                          @blur="form.kanrihi = form.kanrihi ? form.kanrihi.trim() : ''"
                          style="width: 120px"/>
                円
                {{ validMsg.kanrihi }}
              </el-form-item>

              <el-form-item label="保証料" prop="hosyoryou">
                <el-input v-model.lazy="form.hosyoryou"
                          @blur="form.hosyoryou = form.hosyoryou ? form.hosyoryou.trim() : ''"
                          style="width: 120px"/>
                円
                {{ validMsg.hosyoryou }}
              </el-form-item>

              <el-form-item label="振込手数料" prop="furikomitesuuryou" style="margin-top: 20px">
                <el-input v-model.lazy="form.furikomitesuuryou"
                          @blur="form.furikomitesuuryou = form.furikomitesuuryou ? form.furikomitesuuryou.trim() : ''"
                          style="width: 120px"/>
                円
                {{ validMsg.furikomitesuuryou }}
              </el-form-item>
            </el-col>
          </el-row>

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
  name: "KeiyakuView",
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
        bukenId:[{required:true,message:"物件IDが未入力です。",trigger:'blur'},
          {pattern:/^\d{1,100}$/,message:"物件IDは数値で入力してください。",trigger:'blur'}],
        karinushiId: [{required:true,message:'借主IDが未入力です。',trigger:'blur'},
          {pattern:/^\d{1,100}$/,message:'借主IDは数値で入力してください。',trigger:'blur'}],
        yatin:[{pattern:/^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:'家賃は10桁数値以内で入力してください。',trigger:'blur'}],
        reikin:[{pattern:/^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:'礼金は10桁数値以内で入力してください。',trigger:'blur'}],
        shikikin:[{pattern:/^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:'敷金は10桁数値以内で入力してください。',trigger:'blur'}],
        shuzentsumitatekin:[{pattern:/^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:'修繕積立金は10桁数値以内で入力してください。',trigger:'blur'}],
        kanrihi:[{pattern:/^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:'管理費は10桁数値以内で入力してください。',trigger:'blur'}],
        hosyoryou:[{pattern:/^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:'保証料は10桁数値以内で入力してください。',trigger:'blur'}],
        kousinryou:[{pattern:/^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:'更新料は10桁数値以内で入力してください。',trigger:'blur'}],
        furikomitesuuryou:[{pattern:/^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:'振込手数料は10桁数値以内で入力してください。',trigger:'blur'}],
        seisouhi:[{pattern:/^(([1-9]\d{0,9})|0)(\.\d{1,10})?$/,message:'清掃費は10桁数値以内で入力してください。',trigger:'blur'}],

      },
      validMsg: {},


    }
  },
  created(){
    this.list()
  },
  methods: {
    getStartDate(value){
      console.log("startDate=",value)
      //startDate= Wed Jan 01 2025 00:00:00 GMT+0900 (日本标准时间)
    },
    list() {
      let formattedDateStart = null
      if (this.form1.kaishibi) {
        // 将日期格式化为 yyyy-MM-dd
        let date1 = new Date(this.form1.kaishibi);
       formattedDateStart = `${date1.getFullYear()}-${String(date1.getMonth() + 1).padStart(2, '0')}-${String(date1.getDate()).padStart(2, '0')}`;
      }

      let formattedDateEnd =  null
      if (this.form1.syuryoubi) {
        // 将日期格式化为 yyyy-MM-dd
        let date2 = new Date(this.form1.syuryoubi);
        formattedDateEnd = `${date2.getFullYear()}-${String(date2.getMonth() + 1).padStart(2, '0')}-${String(date2.getDate()).padStart(2, '0')}`;
      }
      request.get("/api/keiyaku/keiyakuByConditionPage", {
        params:{
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          karinushiId:this.form1.karinushiId,
          keiyakujyoutai:this.form1.keiyakujyoutai,
          bukenId:this.form1.bukenId,
          kaishibi:formattedDateStart,
          syuryoubi:formattedDateEnd,

          // _t:new Date().getTime(),
        }
      }).then(res => {
        console.log("res=",res)
        const statemap = {
          1:'正常',
          2:'終了',
        }
        const paymap = {
          1:'振込',
          2:'現金'
        }
        var updateRecords = [];
        for (var i = 0;i < res.data.records.length;i++) {
          var item = res.data.records[i]
          var newItem = {}
          for(var key in item){
            newItem[key] = item[key]
          }
          newItem.keiyakujyoutai = statemap[item.keiyakujyoutai] ? statemap[item.keiyakujyoutai] : item.keiyakujyoutai;
          newItem.shiharaihouhou = paymap[item.shiharaihouhou] ? paymap[item.shiharaihouhou] : item.shiharaihouhou;
          updateRecords.push(newItem);
        }
        this.tableData = updateRecords
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
      request.get("/api/keiyaku/find/" + row.keiyakuId).then(res => {
        if(res.code === "200"){
          console.log("res=",res)
          this.form = res.data
        }else{
          this.$message({
            type:"error",
            message:res.msg
          })
        }
      })
    },
    handleDel(keiyakuId) {
      request.delete("/api/keiyaku/del/" +keiyakuId).then(res => {
        if(res.code === "200"){
          this.$message({
            type:"success",
            message:"契約情報を削除しました。"
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
      console.log("pageNum=",pageNum)
      this.currentPage = pageNum
      this.list()

    },
    handleStateSelectChangeForm1(selectValue) {
      //<el-option label="正常" value="正常"/>
      //<el-option label="終了" value="終了"/>
      if(selectValue === "正常"){
        this.form1.keiyakujyoutai = 1
      }else if(selectValue === "終了"){
        this.form1.keiyakujyoutai = 2
      }else{
        this.form1.keiyakujyoutai = null
      }

    },
    handleStateSelectChange(selectValue) {
      //<el-option label="正常" value="正常"/>
      //<el-option label="終了" value="終了"/>
      if(selectValue === "正常"){
        this.form.keiyakujyoutai = 1
      }else if(selectValue === "終了"){
        this.form.keiyakujyoutai = 2
      }else{
        this.form.keiyakujyoutai = null
      }

    },
    onDateChange(value){
      console.log("日付値：", value);
      let date = new Date(value);
      this.form1.kaishibi = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      console.log("フォーマットされた日付値：", this.form1.kaishibi);
      console.log("フォーマットされた日付タイプ：", typeof this.form1.kaishibi);

    },
    handlePaySelectChange(selectValue){
      //<el-option label="振込" value="振込"/>
      //<el-option label="現金" value="現金"/>
      if(selectValue === "振込"){
        this.form.shiharaihouhou = 1
      }else if(selectValue === "現金"){
        this.form.shiharaihouhou = 2
      }else{
        this.form.shiharaihouhou = null
      }
    },

    save() {
      if(this.form.keiyakuId){//契約情報を更新
        request.put("/api/keiyaku/update",this.form).then(res => {
          if(res.code === "200"){
            this.$message({
              type:"success",
              message:"契約情報を更新しました。"
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

      }else{//契約情報を新規登録
        this.$refs['form'].validate(valid => {
          if(valid){//フロントエンド検証に合格した
            request.post("/api/keiyaku/save",this.form).then(res => {
              if(res.code === "200"){
                this.$message({
                  type:"success",
                  message:"契約を登録しました。"
                })
                this.list()
                this.dialogVisible = false
              }else if(res.code === "400"){//バックエンド検証に失敗した
                this.$message({
                  type:"error",
                  message:res.msg
                })
                this.validMsg.bukenId = res.data.bukenId
                this.validMsg.karinushiId = res.data.karinushiId
                this.validMsg.yatin = res.data.yatin
                this.validMsg.reikin = res.data.reikin
                this.validMsg.shikikin = res.data.shikikin
                this.validMsg.shuzentsumitatekin = res.data.shuzentsumitatekin
                this.validMsg.kanrihi = res.data.kanrihi
                this.validMsg.hosyoryou = res.data.hosyoryou
                this.validMsg.kousinryou = res.data.kousinryou
                this.validMsg.furikomitesuuryou = res.data.furikomitesuuryou
                this.validMsg.seisouhi = res.data.seisouhi
              }else if(res.code === "500"){//バックエンド検証でkarinushiまたはbukenが存在しない場合
                console.log("res = ",res)
                // this.$message({
                //   type:"error",
                //   message:res.msg
                // })
                this.validMsg.bukenId = res.data.bukenId
                this.validMsg.karinushiId = res.data.karinushiId
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

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-left: 10%;
}
</style>
