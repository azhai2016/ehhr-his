<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData:[]
    }
  },
  mounted (){
  },
  methods: {
    loaddata(page){
      let that = this;
      this.$ajax({
        url: this.$baseUrl + '/api/plans/' + page, //测试地址
        method: 'GET',
        params: {
        },
        responseType: 'json'
      }).then((res) => {
        console.log(res);
        let totalcount = parseInt(res.data[1][0]['totalpage'])
        this.inforCardData = [
          { title: '未处理单据', icon: 'md-bulb', count:totalcount, color: '#17b23a' },
        ]
      }).catch((res) => {
        console.log(res);
      });
    }
    //
  },
  created(){
    this.loaddata(1)
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
