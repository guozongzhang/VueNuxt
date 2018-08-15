<template lang="pug">
  div.con-box
    div.wrap
      div.box-header.row
        div.col-md-12
          div.col-md-9
            nuxt-link.btn.btn-success(to="/arkpunchstyle/new" role="button")
              i.fe.fe-plus.mr-2
              | 新增
          div.col-md-3
            <searchbasic flag="arkpunchstylesearch" :obj="basicdata" @getsearchdate="getListData"></searchbasic>
      div.body-box
        div.table-responsive
          table.table.card-table.table-striped.table-vcenter
            thead
              tr
                th(v-for="sub in tableheaders") {{sub.name}}
            tbody
              tr(v-for="(item, num) in dataArr")
                td {{num + 1}}
                td {{item.name}}
                td {{item.scheme_count}}
                td {{item.otherName}}
                td 
                  span.switch-plug(:data-content="item.switch_state == 'on' ? '启用' : '禁用'" :data-switch="item.switch_state" @click="switchStateBtn('technology_hole', item, 'switch_state')")
                td.opers
                  nuxt-link(:to="'/arkpunchstyle/edit?id=' + item.id" title="编辑" )
                    i.fa.fa-pencil
                  a(href="javascript:;" title="删除" @click="deleteListItem('technology_hole', item, dataArr)")
                    i.fa.fa-trash
        div.loading-box(v-if="loadingState")
          vueloading
        pagination(flag="hardwarelist" v-bind:total="basicdata.pagetotal" v-bind:size="basicdata.pagesize" v-on:callback="getListData")
</template>

<script>
  let model
  let _ = require('underscore')
  import API from '~/plugins/axios'
  let rel = {
     relation: [
      {
        table: 'technology_hole_condition',
        key: 'tech_poi_technology_hole',
        include: [
          {
            table: 'type_poi_c2m_part_simple_type',
            keys: 'id, name'
          },
          {
            table: 'type_poi_c2m_part_type',
            keys: 'id, name'
          }
        ]
      },
      {
        table: 'technology_hole_connections',
        key: 'tech_poi_technology_hole'
      }
    ]
  }
  export default {
    head () {
      return {
        title: '打孔工艺列表'
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
            key: 'id'
          },
          {
            name: '适用场景',
            key: ''
          },
          {
            name: '连接方案个数',
            key: ''
          },
          {
            name: '适用场景别名',
            key: ''
          },
          {
            name: '状态',
            key: ''
          },
          {
            name: '操作',
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
        dataArr: []
      }
    },
    methods: {
      // 初始化数据
      // 2018-07-02 yuguo
      init: async function () {
        await model.getListData()
      },

      // 初始化基础数据
      // 2018-07-02 yuguo
      // obj(object) query信息
      initbasicData: function (obj) {
        let result = !_.isEmpty(obj) ? obj : (this.$route.query || {})
        model.dataArr = []
        model.basicdata = {
          searchkey: result.searchkey ?  result.searchkey : '',
          pages: result.pages || 1,
          pagetotal: 1,
          placeholder: '适用场景名称',
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
      },

      // 获取列表数据
      // 2018-07-02 yuguo
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
          result = await API.GET('classes/technology_hole', condition)
        } else {
          // 搜索
          let searchpar = {
            table: 'technology_hole',
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
        result.data.items.forEach((sub) => {
          sub.otherName = model.getOtherName(sub.tech_rel_technology_hole_condition.items)
        })
        model.dataArr = result.data.items
        model.basicdata.pagetotal = result.data.count
      },

      // 获取场景别名
      // 2018-07-02 yuguo
      // arr(array) 获取别名的数组
      getOtherName: function (arr) {
        let motherStr = []
        let sonStr = []
        arr.forEach((item) => {
          if (item.type_poi_c2m_part_type) {
            if (item.is_parent == 1) {
              motherStr.push(item.type_poi_c2m_part_type.name)
            } else {
              sonStr.push(item.type_poi_c2m_part_type.name)
            }
          }
        })
        return motherStr.join('/') + '+' + sonStr.join('/')
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
