<template lang="pug">
  div.con-box
    div.wrap
      div.box-header.row
        div.col-md-4
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 孔位名称： 
                  span.nut-null *
              input.form-control(type="text" v-model="info.name" placeholder="请输入孔位名称")
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 示意图： 
                  span.nut-null *
              img(:src="info.preview_url" v-if="info.preview_url")
              <vueuploadumg flag="signleimg" v-model="info.preview_url"></vueuploadumg>
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 备注：
              textarea.form-control(type="text" v-model="info.remark" rows="3" placeholder="请输入备注")
      div.body-box
        div.table-responsive
          table.table.card-table.table-striped.table-vcenter
            thead
              tr
                th 序号
                th 孔位名称
                th 所属件
                th 别名
                th 孔位类型
                th 孔深(H)默认值
                th 孔直径(D)默认值
                th 孔位方向可选值
                th 主要孔位(基准孔位)
                th 孔心坐标
                th 操作
            tbody
              tr(v-for="(item, num) in hardwareConfig")
                td {{num+1}}
                td 
                  input.form-control(type="text" v-model="item.name")
                td 
                  select.form-control(v-model="item.type")
                    option(value="1") 母件
                    option(value="0") 子件
                td 
                  input.form-control(type="text" v-model="item.alias")
                td 
                  select.form-control(v-model="item.hole_type")
                    option(value="1") 孔
                td 
                  input.form-control(type="number" min="1" v-model="item.depth")
                td 
                  input.form-control(type="number" min="1" v-model="item.diameter")
                td 
                  select.form-control(v-model="item.direction")
                    option(value="-1") 请选择
                    option(v-bind:value="ms.name" v-for="ms in directionArr") {{ms.alias}}
                td 
                  input(type="radio" name="isBase" v-model="radio" v-bind:value="num")
                td 
                  input.form-control(type="text" v-model="item.base_coordinate" v-bind:disabled="item.is_default")
                td 
                  a.icon-styel(href="javascript:;" v-show="hardwareConfig.length != 1" style="margin-right: 10px;"  title="删除" @click="destroy(item)")
                    i.fa.fa-trash
                  a.icon-styel(href="javascript:;" v-show="num == (hardwareConfig.length-1)" title="添加" @click="addConfig()")
                    i.fa.fa-plus
      div.footer-box
        button.btn.btn-success.ok-btn(type="button" @click="commitBtn()") 提交
        a.btn.btn-secondary.cancel-btn(@click="getCancel()") 取消
</template>

<script>
  let model
  let _ = require('underscore')
  import API from '~/plugins/axios'
  import storage from '~/plugins/storage'
  let rel = {
    relation: [
      {
        table: 'hardware_hole_config_detail',
        key: 'config_poi_hardware_hole_config'
      }
    ]
  }
  export default {
    head () {
      return {
        title: '新增五金孔位'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        directionArr: [],
        info: {
          name: '',
          preview_url: '',
          remark: ''
        },
        radio: '0',
        hardwareConfig: [
          {
            id: 0,
            name: '',
            alias: '',
            type: 1,
            hole_type: 1,
            depth: 1,
            diameter: 1,
            is_default: true,
            direction: -1,
            hole_distance: 1,
            is_base: 0, // 主要孔位 1选中 0没有选中
            base_coordinate: '0,0,0',
            isdelete: 0
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
    methods: {
      // 初始化数据
      // 2018-06-30 yuguo
      init: function () {
        let obj = storage.get('selecttable')
        model.directionArr = _.filter(obj, (sub) => {
          return sub.state_types == 'direction'
        })
      },

      // 新增孔位
      // 2018-06-30 yuguo
      addConfig () {
        model.hardwareConfig.push(
          {
            id: 0,
            name: '',
            alias: '',
            type: 1,
            is_default: false,
            hole_type: 1,
            depth: 1,
            diameter: 1,
            direction: -1,
            hole_distance: 1,
            is_base: 0,
            base_coordinate: '0,0,0',
            isdelete: 0
          }
        )
      },

      // 删除孔位
      // 2018-06-30 yuguo
      // item(object) 删除的对象
      destroy (item) {
        if (item.is_default) {
          Core.alert('danger', '不能删除主要孔位')
          return
        }
        if (item.id > 0) {
          item.isdelete = 1
        } else {
          model.hardwareConfig = _.without(model.hardwareConfig, item)
        }
      },

      // 数据提交
      // 2018-06-30 yuguo
      commitBtn: function () {
        model.clickBtnAndDisable($('.ok-btn'), true)
        model.hardwareConfig.forEach((item, index) => {
          if (index == model.radio) {
            item.is_base = 1
          } else {
            item.is_base = 0
          }
        })
        let data = {
          info: JSON.stringify(model.info),
          hardwareConfig: JSON.stringify(model.hardwareConfig)
        }
        API.POST('functions/hardware/hardware_hole', data).then((msg) => {
          model.clickBtnAndDisable($('.ok-btn'), false)
          Core.alert('success', '新增成功')
          setTimeout(function () {
            window.history.back(-1)
          }, 1000)
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
          input{
            width: 100px !important;
          }
        }
      }
    }
  }
</style>
