<template>
 <div>
  <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top">
    <Select v-model="searchKey" class="search-col">
      <Option v-for="item in columns" v-if="item.key !== 'handle'" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
    </Select>
    <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue" />
    <Button @click="handleSearch" class="search-btn">
      <Icon type="search" />&nbsp;&nbsp;搜索</Button>
  </div>
  <Table stripe border size="small" searchable searchPlace="top" ref="selection" :columns="columns4" :data="data1" @on-selection-change="selected">
  </Table>

  <div v-if="selectedcount > 0" class="selectedinfo">选择商品数:<span>{{selectedcount}}</span> 总数量:<span>{{selectedqty}}</span>  总金额:<span>{{selectedje}}</span>
    <Button :loading="loading" @click="toLoading">
      <span v-if="!loading">导出选中</span>
      <span v-else>Loading...</span>
    </Button>
  </div>
  <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>


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

.main .content-wrapper {
    padding: 10px 5px;
}

.ivu-table-small td {
    height: 30px;
}
.paging {
    margin-top: 10px;
    padding-left:12px;
    float:right;
}

.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    color: #078028;
}

.ivu-tag-primary,
.ivu-tag-primary.ivu-tag-dot .ivu-tag-dot-inner {
    background: #078028;
}

.ivu-checkbox-checked .ivu-checkbox-inner {
    border-color: #078028;
    background-color: #078028;
}

.ivu-page-item-active {
    border-color: #078028;
}
</style>
<script>
export default {
  data() {
    return {
      dataCount: 0,
      selectedje:0,
      selectedqty:0,
      selectedcount:0,
      // 每页显示多少条
      /*  ReceiveID,DateReceived,ReceiveLineID,ProductID,
      MedicineName,ProductStyle,UOM,ProductSpec,CertificateNo,Manufacturer,
      Lot,GuaranteeDate,ProductionDate,Price,Qty,hsje,jlgg,bzgg,jiansh
      */
      pageSize: 10,
      page: 1,
      loading: false,
      columns4: [{
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '装箱件数',
          width: 70,
          key: 'jiansh'
        },
        {
          title: '单据编号',
          width: 138,
          key: 'ReceiveID'
        },
        {
          title: '日期',
          width: 100,
          key: 'DateReceived'
        },
        {
          title: '行号',
          width: 70,
          key: 'ReceiveLineID'
        },
        {
          title: '剂型',
          width: 80,
          key: 'ProductStyle'
        },
        {
          title: '商品名称',
          width: 200,
          key: 'MedicineName'
        },
        {
          title: '规格',
          width: 120,
          key: 'ProductSpec'
        }, {
          title: '生产厂商',
          width: 200,
          key: 'Manufacturer'
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
    searchable: {
      type: Boolean,
      default: true
    },
    searchPlace: {
      type: String,
      default: 'top'
    }
  },
  methods: {
    loaddata(page) {
      let that = this;
      this.$ajax({
        url: _const.baseUrl+'/api/plans/' + page, //测试地址
        method: 'GET',
        params: {

        },
        responseType: 'json'
      }).then((res) => {
        console.log(res);
        that.dataCount = res.data[1][0]['totalpage'];
        that.data1 = res.data[0];
      }).catch((res) => {
        console.log(res);
      });
    },
    toLoading() {
      this.loading = true;
    },
    handleSearch(){
       console.log(searchKey);
       console.log(searchValue);
    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    changepage(index) {
      this.loaddata(index);
    },
    selected(a) {
      var qty = 0;
      var je = 0;

      for (var i = 0;i < a.length; i++) {
        je +=parseFloat(a[i].hsje);
        qty +=parseInt(a[i].Qty);
      }

      this.selectedje = je;
      this.selectedqty = qty;
      this.selectedcount= i;
    }
  },
  created() {
    this.loaddata(1);
  }


}
</script>
