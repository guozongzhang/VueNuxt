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
                    | 名称： 
                    span.nut-null *
                input.form-control(type="text" v-model="info.style_name" placeholder="请输入名称")
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 用途：
                    span.nut-null *
                select.form-control(v-model="info.ftt_id_poi_furniture_top_type")
                  option(value="-1") 请选择
                  option(v-for="item in topArr" v-bind:value="item.id") {{item.ftt_name}}
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 排序：
                    span.nut-null *
                input.form-control(type="text" v-model="info.style_order" placeholder="请输入排序号")
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 备注：
                textarea.form-control(type="text" v-model="info.desc" rows="3" placeholder="请输入备注")
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
        title: '新增风格分类'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        topArr: [],
        info: {
          style_name: '',
          ftt_id_poi_furniture_top_type: -1,
          style_order: 0,
          desc: ''
        }
      }
    },
    methods: {
      // 初始化数据
      // 2018-07-09 yuguo
      init: async function() {
        let res = await API.GET('classes/furniture_top_type')
        model.topArr = res.data.items
      },

      // 新增提交信息
      // 2018-07-09 yuguo
      commitBtn: function () {
        model.clickBtnAndDisable($('.ok-btn'), true)
        API.POST('classes/furniture_styles', model.info).then(function (response) {
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
