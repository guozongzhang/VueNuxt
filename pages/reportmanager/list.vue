<template lang="pug">
  div.con-box
    div.wrap
      div.box-header.row
        div.col-md-12
          div.col-md-9
          div.col-md-3
            <searchbasic flag="countlistsearch" :obj="basicdata" @getsearchdate="getListData"></searchbasic>
      div.body-box
        div.table-responsive
          table.table.card-table.table-striped.table-vcenter
            thead
              tr
                th(v-for="sub in tableheaders") {{sub.name}}
            tbody
              tr(v-for="(item, num) in reportdata")
                td {{num + 1}}
                td 
                  nuxt-link(:to="'/reportmanager/detail?id=' + item.id") {{item.name}}
                td
                  span.fa(v-for="obj in [1,2,3,4,5]" v-bind:class="obj <= item.feasibility ? 'fa-star' : 'fa-star-o'")
                td {{item.sketch || '暂无'}}
                td
                  span {{item.province_poi_province.ProvinceName}}{{item.city_poi_city.CityName}}{{item.district_poi_district.DistrictName}}{{item.address}}
                td {{item.amount || 0}}
                td {{item.percent ? item.percent + '%' : ''}}
                td {{refcd(item.state, 'report_state')}}
                td {{item.com_id_poi_companys.com_name}}
                td {{localDate(item.submit_time)}} 
                td {{localDate(item.update_time)}}
                td {{item.user_poi_users.username}}({{item.user_poi_users.info_poi_user_info.ui_name}})
        div.loading-box(v-if="loadingState")
          vueloading
        pagination(flag="countlist" v-bind:total="basicdata.pagetotal" v-bind:size="basicdata.pagesize" v-on:callback="getListData")
</template>

<script>
  let model
  let _ = require('underscore')
  import API from '~/plugins/axios'
  let rel = {
    include: [
      {
        table: 'user_poi_users',
        keys: 'id,username,info_poi_user_info',
        include: [
          {
            table: 'info_poi_user_info',
            keys: 'id,ui_name'
          }
        ]
      },
      {
        table: 'province_poi_province',
        keys: 'id,ProvinceName'
      },
      {
        table: 'city_poi_city',
        keys: 'id,CityName'
      },
      {
        table: 'district_poi_district',
        keys: 'id,DistrictName'
      },
      {
        table: 'com_id_poi_companys',
        keys: 'id,com_name'
      }
    ],
    relation: [
      {
        table: 'project_attachment',
        key: 'project_poi_projects'
      }
    ]
  }
  export default {
    head () {
      return {
        title: '报备列表'
      }
    },
    layout: 'layout',
    components: {
    },
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
            name: '项目名称',
            key: ''
          },
          {
            name: '项目可行性',
            key: ''
          },
          {
            name: '简单描述',
            key: ''
          },
          {
            name: '项目地址',
            key: ''
          },
          {
            name: '预计金额(万元)',
            key: ''
          },
          {
            name: '完善程度',
            key: ''
          },
          {
            name: '状态',
            key: ''
          },
          {
            name: '所属公司',
            key: ''
          },
          {
            name: '提交时间',
            key: ''
          },
          {
            name: '更新时间',
            key: ''
          },
          {
            name: '报备人',
            key: ''
          }
        ],
        basicdata: {
          searchkey: '',
          placeholder: '',
          pagetotal: 1,
          pagesize: 15,
          pages: 1
        },
        reportdata: []
      }
    },
    methods: {
      // 初始化数据
      // 2018-06-21 yuguo
      init: async function () {
        await model.getListData()
      },

      // 初始化基础数据
      // 2018-06-21
      // obj(object) query信息
      initbasicData: function (obj) {
        let result = !_.isEmpty(obj) ? obj : (this.$route.query || {})
        model.reportdata = []
        model.basicdata = {
          searchkey: result.searchkey ?  result.searchkey : '',
          placeholder: '项目名称',
          pages: result.pages || 1,
          pagetotal: 1,
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
      },

      // 获取列表数据
      // 2018-06-21 yuguo
      // obj(object) query信息
      getListData: async  function (obj) {
        model.initbasicData(obj)
        let result = {}
        if (_.isEmpty(model.basicdata.searchkey)) {
          // 正常请求
          let condition = {
            skip: (model.basicdata.pages - 1) * model.basicdata.pagesize,
            limit: model.basicdata.pagesize,
            order: '-id',
            with: JSON.stringify(rel)
          }
          result = await API.GET('classes/projects', condition)
        } else {
          // 搜索
          let searchpar = {
            table: 'projects',
            like: JSON.stringify(['name']),
            search: $.trim(model.basicdata.searchkey),
            new_where: JSON.stringify({}),
            with: JSON.stringify(rel),
            limit: model.basicdata.pagesize,
            skip: model.basicdata.pagesize * (model.basicdata.pages - 1),
            order: '-id'
          }
          result = await API.GET('functions/search/search_vague', searchpar)
        }
        model.loadingState = false
        model.reportdata = result.data.items
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
