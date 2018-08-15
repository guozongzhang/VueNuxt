<template lang="pug">
 div.con-box
  div.nav-self-box
    ul.nav-tab.clear
      li.active
        a 模型库
    div.info-body
      div.card
        div.box-header
        div.body-box
          div.table-responsive
            table.table.card-table.table-striped.table-vcenter
              thead
                tr
                  th(v-for="sub in tableheaders") {{sub.name}}
              tbody
                tr(v-for="(item, num) in metolist")
                  td {{num + 1}}
                  td {{item.pd_name}}
                  td 
                    a.fancybox(rel="group" :href="item.pd_image_url") 
                      img(:src="resizeIMG(item.pd_image_url, 20, 20)" style="width:20px;height:20px")
                  td {{item.com_id_poi_companys == null ? '平台创建' : item.com_id_poi_companys.com_name }}
                  td {{(item.ftt_id_poi_furniture_top_type || {}).ftt_name}}
                  td 墙面
                  td {{(item.plane_detail_type_poi_plane_detail_types || {}).name}}
                  td {{refcd(item.switch_state, 'plane_state')}}
                  td {{(item.uid_poi_company_admin || {}).username}}
                  td {{localDate(item.update_time)}}
                  td.opers
                    a(href="javascript:;" title="查看原因" )
                      i.fe.fe-eye
                  td
                    span.switch-plug(v-if="item.switch_state == 'passed'" :data-content="item.switch_state == 'passed' ? '启用' : '禁用'" :data-switch="item.switch_state == 'passed' ? 'on' : 'off'")
          div.loading-box(v-if="loadingState")
            vueloading
          pagination(flag="metolist" v-bind:total="pagetotal" v-bind:size="pagesize" v-on:callback="")
</template>
<script>
  let model
  let _ = require('underscore')
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '模型库列表'
      }
    },
    layout: 'layout',
    data () {
      return {
        loadingState: true,
        tableheaders: [
          {
            name: '序号',
            key: 'id',
            order: '-'
          },
          {
            name: '预览图',
            key: ''
          },
          {
            name: '名称',
            key: ''
          },
          {
            name: '型号',
            key: ''
          },
          {
            name: '分类',
            key: ''
          },
          {
            name: '状态',
            key: ''
          },
          {
            name: '下载',
            key: ''
          },
          {
            name: '模型面数',
            key: ''
          },
          {
            name: '启用/禁用',
            key: ''
          },
          {
            name: '前端显示',
            key: ''
          },
          {
            name: '操作',
            key: ''
          }
        ],
        metolist: [],
        pagetotal: 1,
        pagesize: store.get(location.pathname + '_pagsize') || 15
      }
    },
    methods: {
      // 初始化数据
      // 2018-07-04 yuguo
      init: async function () {
        await model.getListData()
      },

      // 初始化基础数据
      // 2018-07-04 yuguo
      // obj(object) query信息
      initbasicData: function (obj) {
        let result = !_.isEmpty(obj) ? obj : (this.$route.query || {})
        model.dataArr = []
        model.basicdata = {
          searchkey: result.searchkey ?  result.searchkey : '',
          pages: result.pages || 1,
          pagetotal: 1,
          placeholder: '封边方案名称',
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
      },

      // 获取列表数据
      // 2018-07-04 yuguo
      // obj(object) query信息
      getListData: async  function (obj) {
        model.initbasicData(obj)
        let result = {}
        if (_.isEmpty(model.basicdata.searchkey)) {
          // 正常请求
          let condition = {
            skip: (model.basicdata.pages - 1) * model.basicdata.pagesize,
            limit: model.basicdata.pagesize,
            order: 'id',
            with: JSON.stringify(rel)
          }
          result = await API.GET('classes/technology_edge_style', condition)
        } else {
          // 搜索
          let searchpar = {
            table: 'technology_edge_style',
            like: JSON.stringify(['name']),
            search: $.trim(model.basicdata.searchkey),
            new_where: JSON.stringify({}),
            with: JSON.stringify(rel),
            limit: model.basicdata.pagesize,
            skip: model.basicdata.pagesize * (model.basicdata.pages - 1),
            order: 'id'
          }
          result = await API.GET('functions/search/search_vague', searchpar)
        }
        model.loadingState = false
        model.dataArr = result.data.items
        model.basicdata.pagetotal = result.data.count
      }
    },
    created () {
      model = this
      model.init()
    }
  }
</script>
<style lang="scss" scoped>
  .con-box{
    padding: 0;
    .info-body{
      padding: 10px;
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
  }
</style>
