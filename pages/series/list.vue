<template lang="pug">
  div.con-box
    div.wrap
      div.box-header.row
        div.col-md-12
          div.col-md-9
          div.col-md-3
            <searchbasic flag="arksealingsearch" :obj="basicdata" @getsearchdate="getListData"></searchbasic>
      div.body-box
        div.table-responsive
          table.table.card-table.table-striped.table-vcenter
            thead
              tr
                th(v-for="sub in tableheaders") {{sub.name}}
            tbody
              tr(v-for="(item, num) in dataArr")
                td {{num + 1}}
                td 
                  nuxt-link(:to="'/series/detail?id=' + item.id") {{item.companys_self_series_name}}
                td 
                  nuxt-link(:to="'/brand/detail?id=' + (item.com_brand_id_poi_companys_brand || {}).id") {{(item.com_brand_id_poi_companys_brand || {}).com_brand_name}}
                td {{(item.ftt_id_poi_furniture_top_type || {}).ftt_name}}
                td {{(item.com_id_poi_companys || {}).com_name}}
                td {{localDate(item.create_time)}}
                td {{refcd(item.switch_state, 'series_state')}}
                td 
                  span.switch-plug(:data-content="item.switch_state == 'on' ? '启用' : '禁用'" :data-switch="item.switch_state == 'on' ? 'on' : 'off'" @click="switchBtn(item)")
                td.opers
                  a(href="javascript:;" title="查看原因" @click="seeReason(item)")
                    i.fe.fe-eye
        div.loading-box(v-if="loadingState")
          vueloading
        pagination(flag="countlist" v-bind:total="basicdata.pagetotal" v-bind:size="basicdata.pagesize" v-on:callback="getListData")
    forbidden(v-bind:info="forbiddendata" v-on:forbiddenItem="getforbiddenData")
    seereason(v-bind:info="reason")
</template>

<script>
  let model
  let tmpInfo = {}
  let _ = require('underscore')
  import API from '~/plugins/axios'
  let rel = {
    include: [
      {
        table: 'ftt_id_poi_furniture_top_type',
        keys: 'ftt_name'
      },
      {
        table: 'com_brand_id_poi_companys_brand',
        keys: 'id,com_brand_name'
      },
      {
        table: 'com_id_poi_companys',
        keys: 'com_name'
      }
    ]
  }
  export default {
    head () {
      return {
        title: '系列列表'
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
            name: '所属品牌',
            key: ''
          },
          {
            name: '用途',
            key: ''
          },
          {
            name: '所属公司',
            key: ''
          },
          {
            name: '创建时间',
            key: ''
          },
          {
            name: '状态',
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
        dataArr: [],
        reason: {
          title: '',
          handle_id: 0,
          flow_poi_flow: 0,
          state: 0
        },
        forbiddendata: {
          title: '',
          state: 0
        }
      }
    },
    methods: {
      // 初始化数据
      // 2018-07-05 yuguo
      init: async function () {
        await model.getListData()
      },

      // 初始化基础数据
      // 2018-07-05 yuguo
      // obj(object) query信息
      initbasicData: function (obj) {
        let result = !_.isEmpty(obj) ? obj : (this.$route.query || {})
        model.dataArr = []
        model.basicdata = {
          searchkey: result.searchkey ?  result.searchkey : '',
          pages: result.pages || 1,
          pagetotal: 1,
          placeholder: '系列名称',
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
      },

      // 获取列表数据
      // 2018-07-05 yuguo
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
          result = await API.GET('classes/companys_self_series', condition)
        } else {
          // 搜索
          let searchpar = {
            table: 'companys_self_series',
            like: JSON.stringify(['companys_self_series_name']),
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
        model.dataArr = result.data.items
        model.basicdata.pagetotal = result.data.count
      },

      // 启用禁用
      // 2018-07-05 yuguo
      // obj(object) 当前对象
      switchBtn: function (obj) {
        tmpInfo = obj
        let state = obj.switch_state
        if (state == 'on') { // 违规下架
          model.forbiddendata = {
            title: '系列',
            state: Math.random()
          }
        } else { // 恢复
          if (confirm('确定启用该品牌？')) {
            let ms = {
              flow: 'series',
              version: '1.0',
              id: obj.id,
              status: 'on',
              _method: 'PUT',
              flow_poi_flow: 9,
              flow_remark: ''
            }
            API.POST('functions/flow/flow', ms).then((data) => {
              obj.switch_state = 'on'
              Core.alert('success', '启用系列成功')
            })
          }
        }
      },

      // 禁用模态框提交后获取数据
      // 2018-07-05 yuguo
      // obj(object) 模态框提交的数据
      getforbiddenData: function (obj) {
        let ms = {
          flow: 'series',
          version: '1.0',
          id: tmpInfo.id,
          status: 'dstop',
          _method: 'PUT',
          flow_poi_flow: 9,
          flow_remark: obj.reason || ''
        }
        API.POST('functions/flow/flow', ms).then((data) => {
          tmpInfo.switch_state = 'dstop'
          Core.alert('success', '禁用系列成功')
          $('#forbidden').modal('hide')
        })
      },

      // 查看原因
      // 2018-07-05 yuguo
      // obj(object) 当前对象
      seeReason: function (obj) {
        model.reason = {
          title: '系列',
          handle_id: obj.id,
          flow_poi_flow: 9,
          state: Math.random()
        }
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
