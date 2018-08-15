<template lang="pug">
  div.con-box
    div.wrap(v-if="!loadingState")
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
                input.form-control(type="text" v-model="info.name" placeholder="请输入名称")
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
                input.form-control(type="text" v-model="info.order" placeholder="请输入排序号")
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 备注：
                textarea.form-control(type="text" v-model="info.desc" rows="3" placeholder="请输入备注")
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
        title: '编辑行业分类'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        loadingState: true,
        topArr: [],
        info: {
          name: '',
          ftt_id_poi_furniture_top_type: -1,
          order: 0,
          desc: ''
        }
      }
    },
    methods: {
      // 初始化数据
      // 2018-07-09 yuguo
      init: async function() {
        model.loadingState = true
        let res = await API.GET('classes/furniture_top_type')
        model.topArr = res.data.items

        let id = this.$route.query.id || 0
        API.GET('classes/professions', {id: id}).then(function (response) {
          let res = response.data
          model.loadingState = false
          model.info = {
            id: res.id,
            name: res.name || '',
            ftt_id_poi_furniture_top_type: res.ftt_id_poi_furniture_top_type || '',
            order: res.order || 0,
            desc: res.desc || ''
          }
        })
        .catch(function (error) {
          Core.alert('danger', '数据加载失败')
        })
      },

      // 新增提交信息
      // 2018-07-09 yuguo
      commitBtn: function () {
        model.clickBtnAndDisable($('.ok-btn'), true)
        API.PUT('classes/professions', model.info).then(function (response) {
          Core.alert('success', '编辑成功')
          setTimeout(function () {
            window.history.back(-1)
          }, 1000)
        })
        .catch(function () {
          Core.alert('danger', '编辑失败')
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
