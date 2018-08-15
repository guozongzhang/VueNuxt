<template lang="pug">
 div.con-box
    div.nav-self-box
      <crumbs-vue obj="industrytype"></crumbs-vue>
      div.info-body
        div.wrap
          div.box-header.row
            div.col-md-12
              div.col-md-9
                nuxt-link.btn.btn-success(to="/goodsclassify/newindustry"  role="button")
                  i.fe.fe-plus.mr-2
                  | 新增
              div.col-md-3
                <searchbasic flag="industrylistsearch" :obj="basicdata" @getsearchdate="getListData"></searchbasic>
          div.body-box
            div.table-responsive
              table.table.card-table.table-striped.table-vcenter
                thead
                  tr
                    th(v-for="sub in tableheaders") {{sub.name}}
                tbody
                  tr(v-for="(item, num) in dataArr")
                    td {{num+1}}
                    td {{item.name}}
                    td {{(item.ftt_id_poi_furniture_top_type || {}).ftt_name}}
                    td {{item.order}}
                    td *
                    td(style="max-width: 200px;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;" v-bind:title="item.desc") {{item.desc || '暂无'}}
                    td.opers
                      nuxt-link(:to="'/goodsclassify/editindustry?id=' + item.id" title="编辑" )
                        i.fa.fa-pencil
                      a(href="javascript:;" title="删除" @click="deleteListItem('professions', item, dataArr)")
                        i.fa.fa-trash
            div.loading-box(v-if="loadingState")
              vueloading
            pagination(flag="industrylist" v-bind:total="basicdata.pagetotal" v-bind:size="basicdata.pagesize" v-on:callback="getListData")
</template>

<script>
  let model
  let _ = require('underscore')
  import API from '~/plugins/axios'
  import crumbsVue from '~/components/goodsclassify/crumbs.vue'
  let rel = {
    include: [
      {
        table: 'ftt_id_poi_furniture_top_type',
        keys: 'id,ftt_name'
      }
    ]
  }
  export default {
    head () {
      return {
        title: '行业分类列表'
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
            key: '',
          },
          {
            name: '名称',
            key: ''
          },
          {
            name: '用途',
            key: ''
          },
          {
            name: '排序',
            key: '',
          },
          {
            name: '启用/总数',
            key: ''
          },
          {
            name: '备注',
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
    components: {
      'crumbs-vue': crumbsVue
    },
    methods: {
      // 初始化数据
      // 2018-07-09 yuguo
      init: async function () {
        await model.getListData()
      },

      // 初始化基础数据
      // 2018-07-09 yuguo
      // obj(object) query信息
      initbasicData: function (obj) {
        model.dataArr = []
        model.basicdata = {
          searchkey: obj ? (!_.isEmpty(obj.searchkey) ?  obj.searchkey : '') : '',
          pages: (obj || {}).pages || model.$route.query.pages || 1,
          placeholder: '行业名称',
          pagetotal: 1,
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
      },

      // 获取列表数据
      // 2018-07-09 yuguo
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
          result = await API.GET('classes/professions', condition)
        } else {
          // 搜索
          let searchpar = {
            table: 'professions',
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
      padding: 20px 10px;
    }
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
