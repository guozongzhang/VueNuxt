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
                input.form-control(type="text" v-model="info.name" placeholder="请输入模板名称")
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
                    | 所属公司：
                    span.nut-null *
                select.form-control(v-model="info.com_id_poi_companys")
                  option(value="-1") 请选择
                  option(v-for="item in comArr" v-bind:value="item.id") {{item.com_name}}
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 描述：
                textarea.form-control(type="text" v-model="info.desc" rows="3" placeholder="请输入描述")
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
        title: '新增产品模板'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        comArr: [],
        info: {
          name: '',
          image_url: '',
          com_id_poi_companys: -1,
          desc: ''
        }
      }
    },
    methods: {
      // 初始化数据（获取公司数据）
      // 2018-06-29 yuguo
      init: async function () {
        let res = await API.GET('classes/companys', {order: '-id', where: {switch_state: 'on'}})
        model.comArr = res.data.items
      },

      // 新增提交信息
      // 2018-06-29 yuguo
      commitBtn: function () {
        model.clickBtnAndDisable($('.ok-btn'), true)
        API.POST('classes/table_product_templates', model.info).then(function (response) {
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
