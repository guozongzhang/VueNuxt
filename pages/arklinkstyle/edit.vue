<template lang="pug">
  div.con-box
    div.wrap(v-if="!loadingState")
      div.box-header.row
        div.col-md-12
          div.col-md-4
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 方案名称： 
                input.form-control(type="text" v-model="info.name" placeholder="请输入连接方案名称")
                span.input-group-append
                  button.search-btn.btn.btn-primary(type="button" @click="getName()") 
                    | 获取名称
        div.col-md-12
          div.col-md-3
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text
                    | 连接条件： 
                input.form-control(type="text" v-model="info.min_value" @blur="checkNumber()")
                select.form-control(v-model="info.left_operator")
                  option(value="-1") 请选择
                  option(v-for="item in compareOneArr" v-bind:value="item.name") {{item.alias}}
          div.col-md-1
            span.text-center(style="display: inline-block;height: 38px;line-height: 38px;width: 100%;") D 
          div.col-md-2
            div.form-group
              div.input-group
                select.form-control(v-model="info.right_operator")
                  option(value="-1") 请选择
                  option(v-for="item in compareOneArr" v-bind:value="item.name") {{item.alias}}
                input.form-control(type="text" v-model="info.max_value" @blur="checkNumber()")
          div.col-md-4
            strong(style="display: inline-block;height: 38px;line-height: 38px;width: 100%;margin-left: 10px;") 注：D 表示两两相连接的面或边的实际长度
        div.col-md-3
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 布置方向：
              select.form-control(v-model="info.distribute_direction")
                option(value="-1") 请选择
                option(v-for="item in DirectionArr" v-bind:value="item.name") {{item.alias}}
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 安装个数：
              select.form-control(v-model="info.setup_count" @change="changeNumber(info)" disabled="true")
                option(value="-1") 请选择
                option(v-for="item in installArr" v-bind:value="item") {{item}}
        div.col-md-3
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 递增基数： 
              input.form-control(type="text" v-model="info.progressive_base" placeholder="请输入连接方案名称")
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 孔边距： 
              input.form-control(type="text" v-model="info.hole_edge_distance" placeholder="请输入连接方案名称")
        div.col-md-12
          div.body-box
            div.table-responsive
              table.table.card-table.table-striped.table-vcenter
                thead
                  tr
                    th 序号
                    th 连接件类别
                    th 连接件分布距离标注
                    th 分布间距
                tbody
                  tr(v-for="(sub, num) in dataArr")
                    td {{num + 1}}
                    td 
                      select.form-control(style="width: 130px;float: left;margin-right: 20px;" v-model="sub.type_poi_hardware_second_parts_type" @change="changeType(sub)")
                        option(value="-1") 请选择
                        template(v-for="item in hardSecondTypeArr")
                          option(v-bind:value="item.id") {{item.name}}
                      select.form-control(style="width: 130px;" v-model="sub.type_poi_hardware_third_parts_type")
                        option(value="-1") 请选择
                        template(v-for="tmp in sub.subArr")
                          option(v-bind:value="tmp.id") {{tmp.name}}
                    td L{{num}}
                    td
                      input.form-control(style="width: 100px;" type="text" v-model="sub.distance")
        div.col-md-12(style="margin: 20px 0;")
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 示意图： 
              
              img(:src="sub.preview_url" v-if="sub.setup_count == info.setup_count" v-for="sub in imagesArr")
      div.footer-box
        button.btn.btn-success.ok-btn(type="button" @click="commitBtn()") 提交
        a.btn.btn-secondary.cancel-btn(@click="getCancel()") 取消
    div.loading-box(v-if="loadingState")
      vueloading
</template>

<script>
  let model
  let _ = require('underscore')
  import API from '~/plugins/axios'
  import storage from '~/plugins/storage'
  export default {
    head () {
      return {
        title: '编辑连接方案'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        loadingState: true,
        compareOneArr: [],
        DirectionArr: [],
        hardSecondTypeArr: [],
        hardThirdTypeArr: [],
        imagesArr: [],
        installArr: [1, 2, 3, 4, 5, 6, 7, 8, 9], // 安装数量
        info: {
          name: '',
          min_value: 0,
          left_operator: -1,
          right_operator: -1,
          max_value: 1,
          distribute_direction: 'SingleDirBybasic',
          progressive_base: 32,
          setup_count: -1,
          hole_edge_distance: 0
        },
        dataArr: [],
        amount: 0
      }
    },
    methods: {
      // 初始化数据
      // 2018-07-02 yuguo
      init: async function () {
        model.loadingState = true
        let obj = storage.get('selecttable')
        // 获取条件常量
        model.compareOneArr = _.filter(obj, (sub) => {
          return (sub.name == 'less_then' || sub.name == 'less_equal')
        })
        // 获取布置方向常量
        model.DirectionArr = _.filter(obj, (sub) => {
          return sub.state_types == 'link_layout_plan'
        })

        // 获取二级分类
        let res = await API.GET('classes/hardware_second_parts_type', {order: '-id', where: {switch_state: 'on'}})
        model.hardSecondTypeArr = res.data.items
         // 获取三级分类
        let thirsData = await API.GET('classes/hardware_third_parts_type', {order: '-id', where: {switch_state: 'on'}})
        model.hardThirdTypeArr = thirsData.data.items

        // 获取孔位示意图
        let picdata = await API.GET('classes/technology_connection_setup_preview', {})
        model.imagesArr = picdata.data.items


        // 获取连接布置方案数据
        let id = this.$route.query.id || 0
        let rel = {
          relation: [
            {
              table: 'technology_connection_detail',
              key: 'connection_poi_technology_connection'
            }
          ]
        }
        let linkdata = await API.GET('classes/technology_connection', {id: id, with: rel})
        model.info = linkdata.data
        let tmparr = ((linkdata.data || {}).connection_rel_technology_connection_detail || {}).items || []
        tmparr.forEach(async (sub) => {
          sub.subArr = []
          model.changeType(sub, sub.type_poi_hardware_third_parts_type)
        })
        model.dataArr = tmparr
        model.loadingState = false
      },


      // 选择安装个数
      // 2018-07-02 yuguo
      // obj(object) 当前对象
      changeNumber (obj) {
        model.amount = 0
        model.dataArr = []
        for (var i = 0; i < obj.setup_count; i++) {
          let linkobj = {
            id: 0,
            type_poi_hardware_second_parts_type: -1,
            type_poi_hardware_third_parts_type: -1,
            distance: 0,
            subArr: []
          }
          model.dataArr.push(linkobj)
        }
      },

      // 检测筛选条件
      // 2018-07-02 yuguo
      checkNumber: function () {
        if (parseInt(model.info.min_value) >= parseInt(model.info.max_value)) {
          Core.alert('danger', '区间值输入错误')
          model.info.max_value = parseInt(model.info.min_value) + 1
        }
      },

      // 获取连接方案名称
      // 2018-07-02 yuguo
      getName: function () {
        let arr = []
        if (model.dataArr.length > 0) {
          model.dataArr.forEach((item) => {
            model.hardThirdTypeArr.forEach((sub) => {
              if (item.type_poi_hardware_third_parts_type == sub.id) {
                arr.push(sub.name)
              }
            })
          })
          model.info.name = String(model.dataArr.length) + arr.join('+')
        } else {
          Core.alert('danger', '还没有现在连接件呢！')
          return
        }
      },

      // 选择二级分类获取三级分类数据
      // 2018-07-02 yuguo
      // obj(object) 当前数据对象; val(number)三级分类的值
      changeType: function (obj, val) {
        obj.subArr = []
        obj.type_poi_hardware_third_parts_type = val || -1
        model.hardThirdTypeArr.forEach((sub) => {
          if (sub.second_poi_hardware_second_parts_type == obj.type_poi_hardware_second_parts_type) {
            obj.subArr.push(sub)
          }
        })
      },

      // 获取链接件孔位距离信息
      getDetail (arr, flag) {
        let objs = {
          detail: [],
          division: []
        }
        arr.forEach((item, index) => {
          let obj = {
            id: item.id,
            index: index,
            hardware_poi_hardware_parts: 0,
            type_poi_hardware_second_parts_type: item.type_poi_hardware_second_parts_type,
            type_poi_hardware_third_parts_type: item.type_poi_hardware_third_parts_type,
            distance: item.distance
          }
          objs.detail.push(obj)
          objs.division.push(obj.distance)
        })
        return objs
      },

      // 编辑数据提交
      // 2018-07-02 yuguo
      commitBtn: function () {
        model.clickBtnAndDisable($('.ok-btn'), true)
        model.info = _.extend(model.info, {
          hole_distribution: ((model.getDetail(model.dataArr)).division).join(','),
          details: (model.getDetail(model.dataArr)).detail,
        })
        API.PUT('functions/connection/technology_connection', {data: JSON.stringify(model.info)}).then((msg) => {
          model.clickBtnAndDisable($('.ok-btn'), false)
          Core.alert('success', '编辑成功')
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
