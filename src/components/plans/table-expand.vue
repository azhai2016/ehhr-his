<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
<template>
<div>

  <Drawer
              title="图片"
              v-model="value3"
              width="700"
              :mask-closable="false"
              :styles="styles"
          >
  <div v-if="imgdata.length>0">
  <div v-for="imgindex in imgdata" :key="index" :loading="true">
     <img style="height:100%;width:100%;" :src="gernerateImg(imgindex.path)" />
  </div>
  </div>
  <div v-else>
    <p>
      十分抱歉，未找到相关图片。
    </p>
  </div>
  </Drawer>

  <Drawer
              title="商品对码"
              v-model="value4"
              width="700"
              :mask-closable="false"
              :styles="styles"
          >
  <div>
    <div style="padding:10px">
     <span>ERPID：</span>
      <Input readonly class="search-input" v-model="spid" />
    </div>
    <div style="padding:10px">
     <span>索引号1：</span>
      <Input clearable placeholder="输入索引号1" class="search-input" v-model="searchValue1" />
    </div>
    <div style="padding:10px">
      <span>索引号2：</span>
      <Input  clearable placeholder="输入索引号2" class="search-input" v-model="searchValue2" />
    </div>
     <div style="padding:10px">
          <Button @click="submitCode" class="search-btn">
           <Icon type="search" />&nbsp;提交&nbsp;</Button>
      </div>
    </div>

    <div style="padding:10px">
      <div style="padding:10px">
      <span>商品名称：</span><Input style="width:200px" clearable placeholder="查询商品名称"
      class="search-input" v-model="searchValue6" />
        <span>生产企业：</span>
        <Input style="width:200px"  clearable placeholder="查询生产企业"
        class="search-input" v-model="searchValue7" /><Button @click="SearchGoods" class="search-btn">
         <Icon type="search" />&nbsp;查找&nbsp;</Button>
     </div>

      <Table :loading="dataloading" stripe border size="small" no-data-text="暂无数据或已经导出，稍后刷新试试"
      ref="selection" :columns="columns6" :data="data6" @on-row-dblclick="selectedid">
      </Table>
    </div>

  </Drawer>

  <div v-if="showPanel">
    <Table :loading="dataloading" stripe border size="small" no-data-text="暂无数据或已经导出，稍后刷新试试" ref="selection" :columns="columns4" :data="data1" @on-selection-change="selected">
    </Table>
    <div v-if="selectedcount > 0" class="selectedinfo">选择商品数:<span>{{selectedcount}}</span> 总数量:<span>{{selectedqty}}</span> 总金额:<span>{{selectedje}}</span>
      <Button :loading="loading" @click="confirm">
        <span v-if="!loading">导出选中</span>
        <span v-else>Loading...</span>
      </Button>
    </div>
  </div>
  <div v-else>
    <Table :loading="dataloading" stripe border size="small" no-data-text="暂无数据或已经导出，稍后刷新试试" ref="selection" :columns="columns5" :data="data1" @on-selection-change="selected">
    </Table>
  </div>
</div>


</template>
<script>
export default {
  inject: ['reload'],
  data() {
    return {
      value3:false,
      value4:false,
      imgdata:[],
      data6:[],
      selecteddata: [],
      selectedje: 0,
      selectedqty: 0,
      selectedcount: 0,
      loading: false,
      dataloading: false,
      modal1: false,
      searchValue1:'',
      searchValue2:'',
      searchValue6:'',
      searchValue7:'',
      spid:'',
      columns4: [{
          type: (this.showPanel == false) ? 'html' : 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '索引ID',
          width: 120,
          align: 'center',
          render: (h, params) => {
            console.log(params);
            if (params.row.hisCode==''){
            this.searchValue6 = params.row.MedicineName.split('/')[0];
            this.spid = params.row.spid;
            return h('div', [
              h('Button', {
                attrs:{
                  style:"color:red;border:1px #ccc solid"
                },
                props: {
                  type: 'text',
                  size: 'small'
                },
                on:{
                  click: () => {
                     let postData = {
                       "p":params.row.hisCode,
                       "l":params.row.Lot
                     };
                     this.value4=true;
                  }
                }
              },'需要对码')])
            }
            else {
             return h('div',params.row.hisCode)
            }
          }
        },
        {
          title: '行号',
          width: 70,
          key: 'ReceiveLineID'
        },
        {
          title: '商品信息',
          width: 300,
          key: 'MedicineName'
        },
        {
          title: '单位',
          width: 50,
          key: 'UOM'
        },
        {
          title: '批号',
          width: 140,
          key: 'Lot'
        },
        {
          title: '数量',
          align: 'right',
          width: 100,
          key: 'Qty'
        },
        {
          title: '单价',
          align: 'right',
          width: 100,
          key: 'Price'
        },
        {
          title: '金额',
          align: 'right',
          width: 100,
          key: 'hsje'
        },
        {
          title: '批准文号',
          width: 150,
          key: 'CertificateNo'
        }
      ],
      columns6:[
        {
          title: '索引1',
          width: 100,
          key: 'hisCode'
        },
        {
          title: '索引2',
          width: 100,
          key: 'hisRowid'
        },
        {
          title: '商品信息',
          width: 350,
          key: 'productinfo'
        },
        {
          title: '单位',
          width: 100,
          key: 'ypdw'
        },
        {
          title: '批准文号',
          width: 100,
          key: 'pzwh'
        }
      ],
      columns5: [{
          title: "质检单",
          width: 80,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on:{
                  click: () => {
                     console.log(params);
                     let postData = {
                       "p":params.row.ProductID,
                       "l":params.row.Lot
                     };
                     console.log(postData);
                     var that = this;
                     this.$ajax({
                         method: "get",
                         header:{"content-type":"javascript/json;charset=utf-8"},
                         url: this.$baseUrl + '/api/getqcimg',
                         params: {'p':params.row.ProductID,'l':params.row.Lot}
                       }).then((res) => {
                         console.log(res);
                         that.value3=true;
                         that.imgdata = res.data;

                       })
                  }
                }
              },'查看')])
            }
          },
        {
          title: '行号',
          width: 70,
          key: 'ReceiveLineID'
        },
        {
          title: '商品信息',
          width: 300,
          key: 'MedicineName'
        },
        {
          title: '单位',
          width: 50,
          key: 'UOM'
        },
        {
          title: '批号',
          width: 140,
          key: 'Lot'
        },
        {
          title: '数量',
          align: 'right',
          width: 100,
          key: 'Qty'
        },
        {
          title: '单价',
          align: 'right',
          width: 100,
          key: 'Price'
        },
        {
          title: '金额',
          align: 'right',
          width: 100,
          key: 'hsje'
        },
        {
          title: '批准文号',
          width: 150,
          key: 'CertificateNo'
        }
      ],
      data1: []
    }
  },
  props: {
    orderid: {
      type: String,
      default: ""
    },
    showPanel: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    submitCode:function(){
      var that = this
      this.$Modal.confirm({
        title: '询问',
        content: '<p>是否确定提交数据？</p>',
        onOk: () => {
          this.loading = true;

          this.$ajax({
              method: "get",
              header:{"content-type":"javascript/json;charset=utf-8"},
              url: this.$baseUrl + '/api/setcode',
              params: {'spid':that.spid,'hiscode':that.searchValue1,'hisrowid':that.searchValue2}
            }).then((res) => {
              if (res.rs==-1)
              {
                this.$Message.info(res.msg);
              }
              else
              that.$emit("doReload", true);
          })
        },
        onCancel: () => {

        }
      });

    },
    selectedid:function(e){

      this.searchValue1=e.hisCode;
      this.searchValue2=e.hisRowid;
    },
    SearchGoods:function(){
      var that = this;

      this.$ajax({
          method: "get",
          header:{"content-type":"javascript/json;charset=utf-8"},
          url: this.$baseUrl + '/api/getcode',
          params: {'n':that.searchValue6,'cd':that.searchValue7}
        }).then((res) => {
          console.log(res);
          that.data6 = res.data[0];
      })

    },
    gernerateImg: function (img){
      return this.$baseUrl+'/'+img ;//"data:image/png;base64," +img
    },
    confirm() {
      this.$Modal.confirm({
        title: '询问',
        content: '<p>是否确定导出以上选择的数据？</p>',
        onOk: () => {
          this.loading = true;
          this.setData();
        },
        onCancel: () => {

        }
      });
    },
    setData() {
      let that = this;

      let postData = this.$qs.stringify(this.selecteddata);

      this.$ajax({
        method: "POST",
        url: this.$baseUrl + '/api/setorderid',
        data: postData
      }).then((res) => {
        console.log(res);
        this.$Message.info("导出成功");
        this.loading = false;
        that.tbloaddata();
        that.selectedcount = 0;

        that.$emit("doReload", true);
      })
    },
    tbloaddata() {
      let that = this;
      this.dataloading = true;
      let h = (this.showPanel == false) ? 'history' : '';
      this.$ajax({
        url: this.$baseUrl + '/api/planslist/' + that.orderid, //测试地址
        method: 'GET',
        params: {
          h: h
        },
        responseType: 'json'
      }).then((res) => {

        that.data1 = res.data[0];
        that.dataloading = false;

      }).catch((res) => {
        console.log(res);
      });
    },
    selected(a) {
      var qty = 0;
      var je = 0;
      this.selecteddata = [];

      for (var i = 0; i < a.length; i++) {
        console.log(a[i]);
        let data = [];
        data['orderid'] = this.orderid;
        data['rowid'] = a[i].ReceiveLineID;
        data['ProductID'] = a[i].ProductID;
        this.selecteddata.push(data);
        je += parseFloat(a[i].hsje);
        qty += parseInt(a[i].Qty);
      }

      this.selectedje = je.toFixed(2);
      this.selectedqty = qty;
      this.selectedcount = i;
    }
  },
  created() {
    this.tbloaddata();
  }

}
</script>
