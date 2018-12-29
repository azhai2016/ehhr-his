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
    <Spin size="large" fix v-if="spinShow"></Spin>


   <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top">
     <span>商品名称：</span><Input @on-change="handleClear" clearable placeholder="输入商品名称" class="search-input" v-model="searchNameValue" />
     <span style="padding-left:10px;">批号：</span><Input @on-change="handleClear" clearable placeholder="输入批号" class="search-input" v-model="searchLotValue" />
     <Button @click="loaddata" class="search-btn">
       <Icon type="search" />&nbsp;&nbsp;搜索</Button>
   </div>
   <Table stripe border size="small" searchable searchPlace="top" ref="selection" :columns="columns5" :data="data1" >
   </Table>
  </div>

</template>
<style lang="less">
.search-con {
    padding: 10px 0;
    .search {
        &-col {
            display: inline-block;
            width: 200px;
        }
        &-input {
            display: inline-block;
            width: 200px;
            margin-left: 2px;
        }
        &-btn {
            margin-left: 2px;
        }
    }
}

.selectedinfo {
  padding:5px 10px;
  height:30px;
  line-height: 30px;
  font-size:14px;

}



.selectedinfo span {
  padding-left:20px;
  padding-right:20px;
  color:red;
}

.selectedinfo button span{
  color:#000;
  padding-left:2px;
  padding-right:2px;
  float:left;
}

</style>

<script>
export default {
  data(){
    return {
    loading: false,
    value3:false,
    spinShow: false,
    imgdata:[],
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

                   var that = this;
                   this.spinShow=true;
                   this.$ajax({
                       method: "get",
                       header:{"content-type":"javascript/json;charset=utf-8"},
                       url: this.$baseUrl + '/api/getqcimg',
                       params: {'p':params.row.ProductID,'l':params.row.Lot}
                     }).then((res) => {
                       that.value3=true;
                       that.spinShow=false;
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
    data1:[]
   }
  },
  props: {
    searchable: {
      type: Boolean,
      default: true
    },
    searchPlace: {
      type: String,
      default: 'top'
    }
  },
  methods:{
    gernerateImg: function (img){
      console.log(img);
      return this.$baseUrl+'/'+img //"data:image/png;base64," +img
    },
    loaddata() {
      console.log(this.searchNameValue);
        console.log(this.searchLotValue);
      let that = this;
      this.dataloading = true;
      this.$ajax({
        url: this.$baseUrl + '/api/history/', //测试地址
        method: 'GET',
        params: {
          p:this.searchNameValue,
          l:this.searchLotValue
        },
        responseType: 'json'
      }).then((res) => {

        that.data1 = res.data[0];
        console.log(that.data1);
        that.dataloading = false;
      }).catch((res) => {
        console.log(res);
      });
    }
  }
}
</script>
