<template lang="pug">
  div.con-box
    div.wrap
      div.box-header
      div.body-box(v-if="!loadingState")
        div.row
          div.col-md-4.col-lg-4
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 板件名称： 
                    span.nut-null *
                input.form-control(type="text" v-model="info.name" placeholder="请输入板件名称")
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 示意图： 
                    span.nut-null *
                img(:src="info.image_url" v-if="info.image_url")
                <vueuploadumg flag="signleimg" v-model="info.image_url"></vueuploadumg>
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 样式类型：
                    span.nut-null *
                select.form-control(v-model="info.type_poi_table_part_types")
                  option(value="-1") 请选择
                  option(v-for="item in typeArr" v-bind:value="item.id") {{item.name}}
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 外形尺寸：
                    span.nut-null *
                input.form-control(type="text" v-model="info.bounds" placeholder="请输入尺寸")
            
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 备注：
                textarea.form-control(type="text" v-model="info.remark" rows="3" placeholder="请输入备注")
        div.footer-box
          button.btn.btn-success.ok-btn(type="button" @click="commitBtn()") 提交
          a.btn.btn-secondary.cancel-btn(@click="getCancel()") 取消
      div.loading-box(v-if="loadingState")
          vueloading
</template>
<script>
  let model
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '编辑板件样式'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        loadingState: true,
        typeArr: [],
        info: {
          name: '',
          image_url: '',
          type_poi_table_part_types: -1,
          bounds: '',
          remark: ''
        }
      }
    },
    methods: {
      // 初始化数据（获取分类数据）
      // 2018-06-29 yuguo
      init: async function () {
        model.loadingState = true
        let res = await API.GET('classes/table_part_types', {order: '-id'})
        model.typeArr = res.data.items
        let id = this.$route.query.id || 0
        API.GET('classes/table_board_style', {id: id}).then(function (response) {
          let res = response.data
          model.loadingState = false
          model.info = {
            id: res.id,
            name: res.name || '',
            image_url: res.image_url || '',
            type_poi_table_part_types:res.type_poi_table_part_types || '',
            bounds: res.bounds || '',
            remark: res.remark || ''
          }
        })
        .catch(function (error) {
          Core.alert('danger', '数据加载失败')
        })
      },

      // 编辑提交信息
      // 2018-06-29 yuguo
      commitBtn: function () {
        model.clickBtnAndDisable($('.ok-btn'), true)
        API.PUT('classes/table_board_style', model.info).then(function (response) {
          Core.alert('success', '编辑成功')
          setTimeout(function () {
            window.history.back(-1)
          }, 1000)
        })
        .catch(function (error) {
          model.clickBtnAndDisable($('.ok-btn'), false)
          Core.alert('danger', '编辑失败')
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
