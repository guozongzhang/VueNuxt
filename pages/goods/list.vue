<template lang="pug">
 div.con-box
  div.nav-self-box
    div.nav-tabs-custom
      ul.nav.nav-tabs
        li.active
          nuxt-link(to="/production/list") 企业商品列表
        li
          nuxt-link(to="/production/list") 公共商品列表
    div.info-body
      div.body-box
        div.table-responsive
          table.table.card-table.table-striped.table-vcenter
            thead
              tr
                th(v-for="sub in tableheaders") {{sub.name}}
            tbody
              tr(v-for="(item, num) in goods")
                td {{num + 1}}
                td 
                  img(:src="resizeIMG(item.fur_image, 20, 20)" style="width:20px;height:20px")
                td 
                  nuxt-link(to="/production/list") {{item.fur_name}}
                td {{item.fur_code}}
                td {{(item.ftt_id_poi_furniture_top_type || {}).ftt_name || ''}}
                td {{(item.sp_type_poi_furniture_simple_types || {}).sp_type_name || ''}}
                td {{(item.fur_type_id_poi_furniture_types || {}).type_name || ''}}
                td {{(item.com_brand_id_poi_companys_brand || {}).com_brand_name || ''}}
                td {{(item.fur_series_id_poi_companys_self_series || {}).companys_self_series_name || ''}}
                td 绑定
                td {{refcd(item.fur_states, 'fur_state')}}
                td 操作
                td 
                  span.switch-plug(:data-content="item.fur_states == 'up' ? '启用' : '禁用'" :data-switch="item.fur_states == 'up' ? 'on' : 'off'" v-show="item.fur_states == 'up' || item.fur_states == 'dstop'"  @click="switchClick(item)")
        div.loading-box(v-if="loadingState")
          vueloading
        pagination(flag="goodslist" v-bind:total="basicdata.pagetotal" v-bind:size="basicdata.pagesize" v-on:callback="getListData")
</template>

<script>
  let model
  let objInfo
  let furInfo = ''
  let _ = require('underscore')
  let rel = {
    include: [
      {
        table: 'sp_type_poi_furniture_simple_types',
        keys: 'sp_type_name'
      },
      {
        table: 'fur_type_id_poi_furniture_types',
        keys: 'type_name'
      },
      {
        table: 'com_brand_id_poi_companys_brand',
        keys: 'com_brand_name'
      },
      {
        table: 'com_id_poi_companys',
        keys: 'com_name'
      },
      {
        table: 'ftt_id_poi_furniture_top_type',
        keys: 'ftt_name'
      },
      {
        table: 'fur_series_id_poi_companys_self_series',
        keys: 'companys_self_series_name'
      }
    ],
    relation: [
      {
        table: 'furniture_sku',
        key: 'fur_id_poi_furnitures'
      }
    ]
  }
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '商品列表'
      }
    },
    layout: 'layout',
    components: {
      
    },
    data () {
      return {
        loadingState: true,
        goods: [],  //  列表数组
        basicdata: {
          searchkey: '',
          placeholder: '单位名称',
          pagetotal: 1,
          pagesize: 15,
          pages: 1
        },  //  搜索绑定对象
        tableheaders: [
          {
            name: '序号',
            key: 'id',
            order: '-'
          },
          {
            name: '预览图',
            key: 'fur_image'
          },
          {
            name: '商品名称',
            key: 'fur_name'
          },
          {
            name: '商品型号',
            key: 'fur_code'
          },
          {
            name: '用途',
            key: 'ftt_id_poi_furniture_top_type'
          },
          {
            name: '二级分类',
            key: 'sp_type_poi_furniture_simple_types'
          },
          {
            name: '三级分类',
            key: 'fur_type_id_poi_furniture_types'
          },
          {
            name: '所属品牌',
          },
          {
            name: '所属系列',
            key: 'fur_series_id_poi_companys_self_series'
          },
          {
            name: '模型状态',
            key: ''
          },
          {
            name: '商品状态',
            key: 'fur_states'
          },
          {
            name: '操作',
            key: ''
          },
          {
            name: '启用/禁用',
            key: ''
          }
        ],
      }
    },
    methods: {
      // 初始化数据 2018.6.22 王翀
      init: async function () {
        model.getListData(1)
      },
      // 初始化基础数据 2018.6.22 王翀
      initbasicData: function (obj) {
        let result = !_.isEmpty(obj) ? obj : (this.$route.query || {})
        model.basicdata = {
          searchkey: result.searchkey ?  result.searchkey : '',
          pages: result.pages || 1,
          pagetotal: 1,
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
        model.goods = []
      },
      //  获取列表数据
      getListData: async function (obj) {
        model.initbasicData(obj)
          let condition = {
            skip: (model.basicdata.pages - 1) * model.basicdata.pagesize,
            limit: model.basicdata.pagesize,
            order: '-id',
            with: JSON.stringify(rel),
            where: JSON.stringify({"fur_states":{"$ne":"deleted"}})
          }
          let result = await API.GET('classes/furnitures', condition)
          model.loadingState = false
          model.basicdata.pagetotal = result.data.count
          model.goods = result.data.items
      },
      //  启用/禁用
      switchClick: async function (obj) {
        furInfo = obj
        let state = obj.fur_states
        if (state != 'dstop') { // 违规下架
          $('.inputopinion').val()
          $('#checkopinion').val('')
          $('#checkreason').modal('show')
        } else { // 恢复
          if (confirm('确定启用该商品？')) {
            let ms = {
              flow: 'furnitures',
              version: '1.0',
              id: item.id,
              status: 'waiting',
              _method: 'PUT',
              flow_poi_flow: 6,
              flow_remark: $('#addopinion').val()
            }
            API.post('functions/flow/flow', ms, (data) => {
              furInfo.fur_states = 'waiting'
              Core.alert('success', '修改商品成功')
            })
          }
        }
      }, 
    },
    created () {
      model = this
      model.init()
    }
  }
</script>
<style lang="scss" scoped>
  .con-box{
    .box-header{
      .btn{
        a{
          color: #fff;
        }
      }
    }
    table {
      white-space: nowrap;
      thead{
        th {
          color: #333;
          font-weight: 500;
        }
      }
      tbody{
        td{
          border: 1px solid #f4f4f4;
        }
      }
    }
  }
</style>
