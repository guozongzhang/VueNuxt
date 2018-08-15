<template lang="pug">
  div.con-box
    div.wrap
      div.box-header
      div.body-box
        div.row(v-if="!loadingState")
          div.col-md-4.col-lg-4
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 系列名称： 
                span.text-control {{info.companys_self_series_name}}
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 系列用途： 
                span.text-control {{(info.ftt_id_poi_furniture_top_type || {}).ftt_name || '暂无'}}
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 文字说明：
                span.text-control {{info.companys_self_series_explain || '暂无'}}
          div.col-md-4.col-lg-4
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 系列排序： 
                span.text-control {{info.order}}
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 所属品牌：
                span.text-control {{(info.com_brand_id_poi_companys_brand || {}).com_brand_name}}
          div.col-md-12
            div.row
              div.col-md-5
                div.table-responsive
                  table.table.card-table.table-striped.table-vcenter
                    thead
                      tr
                        th 编号
                        th 商品分类
                        th 用途
                        th 状态
                    tbody
                      tr(v-for="(item, num) in goodsTypeArr")
                        td {{num + 1}}
                        td {{item.type_name}}
                        td {{(item.ftt_id_poi_furniture_top_type || {}).ftt_name}}
                        td 启用
              div.col-md-5
                div.table-responsive
                  table.table.card-table.table-striped.table-vcenter
                    thead
                      tr
                        th 编号
                        th 商品分类
                        th 用途
                        th 状态
                    tbody
                      tr(v-for="(item, num) in spaceArr")
                        td {{num + 1}}
                        td {{item.field_name}}
                        td {{(item.ftt_id_poi_furniture_top_type || {}).ftt_name}}
                        td 启用
      div.loading-box(v-if="loadingState")
          vueloading
</template>
<script>
  let model
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '系列详情'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        loadingState: true,
        info: {},
        goodsTypeArr: [],
        spaceArr: []
      }
    },
    methods: {
      // 初始化数据
      // 2018-07-05 yuguo
      init: function () {
        model.loadingState = true
        let rel = {
          include: [
            {
              table: 'ftt_id_poi_furniture_top_type',
              keys: 'id,ftt_name'
            },
            {
              table: 'com_brand_id_poi_companys_brand',
              keys: 'id,com_brand_name'
            }
          ]
        }
        let id = this.$route.query.id || 0
        API.GET('classes/companys_self_series', {id: id, with: rel}).then(async function (response) {
          let res = response.data
          model.info = response.data
          let rel1 = {
            include: [
              {
                table: 'ftt_id_poi_furniture_top_type',
                keys: 'id,ftt_name'
              }
            ]
          }
          // 获取空间分类数据
          let field = await API.GET('classes/furniture_field_types', {with: rel1, where: {id: {'$in': res.field_type.split(',')}}})
          model.spaceArr = field.data.items

          // 获取商品分类数据
          let furtype = await API.GET('classes/furniture_types', {with: rel1, where: {id: {'$in': res.furniture_types.split(',')}}})
          model.goodsTypeArr = furtype.data.items
          model.loadingState = false
        })
        .catch(function (error) {
          Core.alert('danger', '数据加载失败')
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
</style>
