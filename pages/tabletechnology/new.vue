<template lang="pug">
  div.con-box
    div.wrap
      div.box-header
      div.body-box
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
</template>
<script>
  let model
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '新增板件样式'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
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
        let res = await API.GET('classes/table_part_types', {order: '-id'})
        model.typeArr = res.data.items
      },

      // 新增提交信息
      // 2018-06-29 yuguo
      commitBtn: function () {
        model.clickBtnAndDisable($('.ok-btn'), true)
        API.POST('classes/table_board_style', model.info).then(function (response) {
          Core.alert('success', '新增成功')
          setTimeout(function () {
            window.history.back(-1)
          }, 1000)
        })
        .catch(function () {
          Core.alert('danger', '新增失败')
          model.clickBtnAndDisable($('.ok-btn'), false)
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
