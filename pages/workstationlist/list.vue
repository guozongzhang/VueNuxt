<template lang="pug">
  div.con-box
    div.wrap
      div.box-header.row
        div.col-md-12
          div.col-md-9
            nuxt-link.btn.btn-success(to="/workstationlist/new" role="button")
              i.fe.fe-plus.mr-2
              | 新增
          div.col-md-3
            <searchbasic flag="arkhardwaresearch" :obj="basicdata" @getsearchdate="getListData"></searchbasic>
      div.body-box
        div.table-responsive
          table.table.card-table.table-striped.table-vcenter
            thead
              tr
                th(v-for="sub in tableheaders") {{sub.name}}
            tbody
              tr(v-for="(item, num) in workstations")
                td {{num + 1}}
                td 
                  a(href="javascript:;") {{item.name}}
                td {{(item.uid_poi_admin || {}).username || ''}}
                td
                  a.fancybox(rel="group" :href="item.preview_url")
                    img(:src="resizeIMG(item.tmp_preview_url, 20, 20)" style="width:20px;height:20px")
                td {{item.amount}}
                td {{localDate(item.create_time)}}
                td
                  span.switch-plug(:data-content="item.switch_state == 'on' ? '启用' : '禁用'" :data-switch="item.switch_state == 'on' ? 'on' : 'off'" @click="switchState(item)")
                td.opers
                  nuxt-link(:to="'/arkhardware/edit?id=' + item.id" title="编辑" )
                    i.fa.fa-pencil
                  a(href="javascript:;" title="删除" @click="deleteListItem(item)")
                    i.fa.fa-trash
        div.loading-box(v-if="loadingState")
          vueloading
        pagination(flag="workstationslist" v-bind:total="basicdata.pagetotal" v-bind:size="basicdata.pagesize" v-on:callback="getListData")
</template>

<script>
  let model
  let switchObj = {}
  let _ = require('underscore')
  let rel = {
    include: [
      {
        table: 'uid_poi_admin',
        keys: 'username'
      }
    ],
    relation: [
      {
        table: 'office_unit_design_template_item',
        key: 'template_poi_office_unit_design_template'
      }
    ]
  }
  import API from '~/plugins/axios'

  export default {
    head () {
      return {
        title: '工位模板列表'
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
            name: '名称',
            key: ''
          },
          {
            name: '创建人',
            key: ''
          },
          {
            name: '预览图',
            key: ''
          },
          {
            name: '单工位数量',
            key: ''
          },
          {
            name: '创建时间',
            key: ''
          },
          {
            name: '启用/禁用',
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
        workstations: []  //  工位模板列表
      }
    },
    methods: {
      // 初始化数据
      // 2018-06-30 yuguo
      init: async function () {
        await model.getListData()
      },

      // 删除
      deleteListItem: function (obj) {
        if(confirm('是否要删除？')) {
          API.DELETE('classes/office_unit_design_template', {id: obj.id}).then((msg) => {
            Core.alert('success', '删除成功')
            model.init()
            _.without(model.workstations, obj)
          })
        }
      },
      // 启用/禁用
      switchState: function (obj) {
        let param = {
          id: obj.id,
          switch_state: obj.switch_state == 'on' ? 'off' : 'on'
        }
        API.PUT('classes/office_unit_design_template', param).then((msg) => {
          obj.switch_state = param.switch_state
        })
      },

      // 初始化基础数据
      // 2018-06-30 yuguo
      // obj(object) query信息
      initbasicData: function (obj) {
        let result = !_.isEmpty(obj) ? obj : (this.$route.query || {})
        model.workstations = []
        model.basicdata = {
          searchkey: result.searchkey ?  result.searchkey : '',
          pages: result.pages || 1,
          pagetotal: 1,
          placeholder: '工位模板名称',
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
      },

      // 获取列表数据
      // 2018-06-30 yuguo
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
          result = await API.GET('classes/office_unit_design_template', condition)
        } else {
          // 搜索
          let searchpar = {
            table: 'office_unit_design_template',
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
        model.workstations = result.data.items
        console.log('str', JSON.stringify(model.workstations))
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
