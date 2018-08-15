<template lang="pug">
 div.con-box
  div.nav-self-box
    ul.nav-tab.clear
      li
        nuxt-link(to="/metope/list") 墙面列表
      li.active
        a 墙面模板
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
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '产品库列表'
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
            name: '墙面名称',
            key: 'name'
          },
          {
            name: '墙面预览图',
            key: 'image_url'
          },
          {
            name: '所属公司',
            key: 'product_model'
          },
          {
            name: '用途',
            key: ''
          },
          {
            name: '二级分类',
            key: ''
          },
          {
            name: '三级分类',
            key: 'state'
          },
          {
            name: '状态',
            key: 'state'
          },
          {
            name: '创建人',
            key: 'uid_poi_company_admin'
          },
          {
            name: '更新时间',
            key: 'update_time',
            order: '+'
          },
          {
            name: '操作',
            key: 'state'
          },
          {
            name: '启用/禁用',
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
      // 2018-05-29 yuguo
      init: async function () {
        let pages = this.$route.query.page || 1
        model.getData(1)
      },

      // 获取列表数据
      // 2018-05-29 yuguo
      getData: function (pages) {
        model.pagesize = store.get(location.pathname + '_pagsize') || 15
        model.loadingState = true
        model.metolist = []
        model.pagetotal = 1
        let rel = {
          include: [
            {
              table: 'ftt_id_poi_furniture_top_type',
              keys: 'ftt_name'
            },
            {
              table: 'com_id_poi_companys',
              keys: 'com_name'
            },
            {
              table: 'uid_poi_company_admin',
              keys: 'username'
            },
            {
              table: 'plane_detail_type_poi_plane_detail_types',
              keys: 'name'
            }
          ]
        }
        let condition = {
          skip: (pages - 1) * model.pagesize,
          limit: model.pagesize,
          order: '-id',
          with: JSON.stringify(rel),
          where: JSON.stringify({type: 2, com_id_poi_companys: {'$gt': 0}})
        }
        API.GET('classes/plane_detail', condition).then((msg) => {
          model.loadingState = false
          model.metolist = msg.data.items
          model.pagetotal = msg.data.count
        })
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
