<style scoped>
.expand-row {
  margin-bottom: 16px;
}

</style>
<template>
<div>
  <Table :loading="dataloading" stripe border size="small" no-data-text="暂无数据或已经导出，稍后刷新试试" ref="selection" :columns="columns4" :data="data1" @on-selection-change="selected">
  </Table>
  <div v-if="showPanel">
  <div v-if="selectedcount > 0" class="selectedinfo">选择商品数:<span>{{selectedcount}}</span> 总数量:<span>{{selectedqty}}</span> 总金额:<span>{{selectedje}}</span>
    <Button :loading="loading" @click="confirm">
      <span v-if="!loading">导出选中</span>
      <span v-else>Loading...</span>
    </Button>

  </div>


  </div>
</div>
</template>
<script>
export default {
  inject: ['reload'],
  data() {
    return {
      selecteddata: [],
      selectedje: 0,
      selectedqty: 0,
      selectedcount: 0,
      loading: false,
      dataloading:false,
      modal1: false,
      columns4: [{
          type: (this.showPanel==false)?'html':'selection',
          width: 60,
          align: 'center'
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
    showPanel:{
      type:Boolean,
      default:false
    }
  },
  methods: {
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

        that.$emit("doReload",true);
      })
    },
    tbloaddata() {
      let that = this;
      this.dataloading= true;
      let h = (this.showPanel==false)?'history':'';
      this.$ajax({
        url: this.$baseUrl+ '/api/planslist/' + that.orderid, //测试地址
        method: 'GET',
        params: {
          h:h
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
