<template>
<div>
  <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top">
    <Input @on-change="handleClear" clearable placeholder="输入商品名称" class="search-input" v-model="searchValue" />
    <Button @click="handleSearch" class="search-btn">
      <Icon type="search" />&nbsp;&nbsp;搜索</Button>
  </div>
  <Table stripe border size="small" searchable searchPlace="top" ref="selection" :columns="columns4" :data="data1" @on-selection-change="selected">
  </Table>
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
    padding: 5px 10px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;

}

.selectedinfo span {
    padding-left: 20px;
    padding-right: 20px;
    color: red;
}

.selectedinfo button span {
    color: #000;
    padding-left: 2px;
    padding-right: 2px;
    float: left;
}

.main .content-wrapper {
    padding: 10px 5px;
}

.ivu-table-small td {
    height: 30px;
}
.paging {
    margin-top: 10px;
    padding-left: 12px;
    float: right;
}

.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    color: #078028;
}

.ivu-table-small .ivu-table-cell-with-expand {
    height: 30px;
    line-height: 30px;
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
      appname: this.$config.appname,
      dataCount: 0,
      pageSize: 10,
      page: 1,
      loading: false,
      columns:[{
          title: '发票号',
          key: 'piaohao'
        },
        {
          title: '单据编号',
          key: 'ReceiveID'
        }
      ],
      columns4: [{
          type: 'expand',
          width: 50,
          render: (h, params) => {
            var self = this;
            return h(expandRow, {
              props: {
                orderid: params.row.ReceiveID,
                showPanel:false
              },
              on:{
                doReload:(res)=>{

                  self.reloaddata()
                }
              }

            })
          }
        },
        {
          title: '剂型',
          width: 70,
          key: 'jixing'
        },
        {
          title: '商品信息',
          width: 500,
          key: 'spinfo'
        },
        {
          title: '单位',
          width: 100,
          key: 'dw'
        },
        {
          title: '批准文号',
          width: 140,
          key: 'pzwh'
        }
      ],
      data1: [],
      searchKey:'',
      searchValue:''
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
        url: this.$baseUrl + '/api/product/' + page, //测试地址
        method: 'GET',
        params: {
          n:this.searchKey,
          v:this.searchValue
        },
        responseType: 'json'
      }).then((res) => {
        console.log(res);
        that.dataCount = parseInt(res.data[1][0]['totalpage']);
        that.data1 = res.data[0];
      }).catch((res) => {
        console.log(res);
      });
    }
  },
  created() {
    this.loaddata(1);
  }


}
</script>
