<template lang="pug">
 div.con-box
  div.nav-self-box
    div.nav-tabs-custom
      ul.nav.nav-tabs
        li.active
          nuxt-link(to="/messagemanager/mailinbox") 收信箱列表
        li
          nuxt-link(to="/messagemanager/deletedmailinbox") 已删除信息
    div.info-body
      div.box-header
        div.col-md-9
        div.col-md-3
          <searchbasic flag="mailsearch" :obj="basicdata" @getsearchdate="getListData"></searchbasic>        
        div.body-box
          div.table-responsive
            table.table.card-table.table-striped.table-vcenter
              thead
                tr
                  th(v-for="sub in tableheaders") {{sub.name}}
              tbody
                tr(v-for="(item, num) in mails")
                  td {{num + 1}}
                  td 
                    img(:src="resizeIMG(item.image_url, 20, 20)" style="width:20px;height:20px")
                  td {{item.name}}
                  td {{item.code}}
                  td {{(item.type_poi_product_top_types || {}).name || ''}}-{{(item.type_poi_product_second_types || {}).name || ''}}-{{(item.type_poi_product_third_types || {}).name || ''}}
                  td {{(item.top_poi_products_group || {}).name || ''}}/{{(item.second_poi_products_group || {}).name || ''}}/{{(item.third_poi_products_group || {}).name || ''}}
                  td {{refcd(item.state, 'plane_state')}}
                  td
                    span.switch-plug(v-if="item.switch_state == 'passed'" :data-content="item.switch_state == 'passed' ? '启用' : '禁用'" :data-switch="item.switch_state == 'passed' ? 'on' : 'off'")
          div.loading-box(v-if="loadingState")
            vueloading
          pagination(flag="maillist" v-bind:total="basicdata.pagetotal" v-bind:size="basicdata.pagesize" v-on:callback="getListData")
</template>
<script>
  let model
  import API from '~/plugins/axios'
  let _ = require('underscore')
  export default {
    head () {
      return {
        title: '收信箱列表'
      }
    },
    layout: 'layout',
    data () {
      return {
        loadingState: true,
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
            name: '标题',
            key: 'name'
          },
          {
            name: '内容',
            key: 'image_url'
          },
          {
            name: '类型',
            key: 'product_model'
          },
          {
            name: '状态',
            key: ''
          },
          {
            name: '发布人',
            key: ''
          },
          {
            name: '发布时间',
            key: 'state'
          },
          {
            name: '操作',
            key: 'state'
          }
        ],
        mails: [],
        pagetotal: 1,
        pagesize: store.get(location.pathname + '_pagsize') || 15
      }
    },
    methods: {
      // 初始化数据
      // 2018.7.11 王翀
      init: function () {
        let pages = this.$route.query.page || 1
        model.getListData(1)
      },
      // 获取列表数据
      // 2018-7-4 王翀
      initbasicData: async function (obj) {
        let result = !_.isEmpty(obj) ? obj : (this.$route.query || {})
        model.basicdata = {
          searchkey: result.searchkey ?  result.searchkey : '',
          pages: result.pages || 1,
          pagetotal: 1,
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
        model.mails = []
      },
      
      //  获取列表数据
      getListData: async function (obj) {
        model.initbasicData(obj)
        let result = {}
        if (_.isEmpty(model.basicdata.searchkey)) {
          let condition = {
            skip: (model.basicdata.pages - 1) * model.basicdata.pagesize,
            limit: model.basicdata.pagesize,
            order: '-id',
            with: '',
            where: ''
          }
          result = await API.GET('functions/messages/messages_inmail')
        } else {
          //  搜索
          let searchpar = {
            table: 'products',
            like: JSON.stringify(['name']),
            search: $.trim(model.basicdata.searchkey),
            new_where: JSON.stringify(Core.checkKey(model.wardrobe)),
            with: JSON.stringify(rel),
            limit: model.basicdata.pagesize,
            skip: model.basicdata.pagesize * (model.basicdata.pages - 1),
            order: '-id'
          }
          result = await API.GET('functions/search/search_vague', searchpar)
        }
        model.loadingState = false
        model.mails = result.data.items
        model.basicdata.pagetotal = result.data.count
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
