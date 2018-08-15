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
                    | 场景名称： 
                input.form-control(type="text" v-model="info.name" placeholder="请输入场景名称")
        div.col-md-12(v-for="(mo, num) in motherArr")
          div.col-md-4
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text(v-if="num == 0")
                    | 母件条件： 
                select.form-control(v-model="mo.type")
                  option(value="0") 类别
                select.form-control(v-model="mo.compare")
                  option(value="0") 等于
          div.col-md-3
            div.form-group
              div.input-group
                select.form-control(v-model="mo.type_poi_c2m_part_simple_type" @change="getThirdType(mo, true)")
                  option(value="-1") 请选择
                  option(v-for="item in twoArr" v-bind:value="item.id") {{item.name}}
                select.form-control(v-model="mo.type_poi_c2m_part_type")
                  option(value="-1") 请选择
                  option(v-for="item in mo.twoArr" v-bind:value="item.id") {{item.name}}
          div.col-md-2.icons
            span.subadd.fa.fa-plus(v-if="num == 0" @click="addSubItem('mo')")
            span.subdel.fa.fa-minus(v-else @click="delSubItem('mo', mo)")
        div.col-md-12(v-for="(son, num) in sonArr")
          div.col-md-4
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text(v-if="num == 0")
                    | 子件条件： 
                select.form-control(v-model="son.type")
                  option(value="0") 类别
                select.form-control(v-model="son.compare")
                  option(value="0") 等于
          div.col-md-3
            div.form-group
              div.input-group
                select.form-control(v-model="son.type_poi_c2m_part_simple_type" @change="getThirdType(son, true)")
                  option(value="-1") 请选择
                  option(v-for="item in twoArr" v-bind:value="item.id") {{item.name}}
                select.form-control(v-model="son.type_poi_c2m_part_type")
                  option(value="-1") 请选择
                  option(v-for="item in son.twoArr" v-bind:value="item.id") {{item.name}}
          div.col-md-2.icons
            span.subadd.fa.fa-plus(v-if="num == 0" @click="addSubItem('son')")
            span.subdel.fa.fa-minus(v-else @click="delSubItem('son', son)")
        div.col-md-8(style="padding: 0 15px 20px 15px;border: 1px solid #ccc")
          div.body-box
            div.header 可用方案：
            div.table-responsive
              table.table.card-table.table-striped.table-vcenter
                thead
                  tr
                    th 序号
                    th 条件
                    th 方案名称
                    th 操作
                tbody
                  tr(v-for="(sub, num) in dataArr")
                    td {{num + 1}}
                    td {{sub.min_value}} {{sub.left_operator == 'less_then' ? '<' : '<='}} FixL {{sub.right_operator == 'less_then' ? '<' : '<='}} {{sub.max_value}}
                    td {{sub.name}}
                    td.opt
                      a(href="javascript:;" title="编辑" @click="editSub(sub)")
                        i.fa.fa-edit
                      a(href="javascript:;" title="删除" @click="delSub(sub)")
                        i.fa.fa-trash
        div.col-md-8(style="padding: 0 15px 20px 15px;border: 1px solid #ccc;margin: 20px 0;")
          div.header 编辑方案：
          div.col-md-5
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text
                    | 条件： 
                input.form-control(type="text" v-model="sub.min_value" @blur="checkNumber()")
                select.form-control(v-model="sub.left_operator")
                  option(value="-1") 请选择
                  option(v-for="item in compArr" v-bind:value="item.id") {{item.name}}
          div.col-md-2
            span.text-center(style="display: inline-block;height: 38px;line-height: 38px;width: 100%;") FixL
          div.col-md-5
            div.form-group
              div.input-group
                select.form-control(v-model="sub.right_operator")
                  option(value="-1") 请选择
                  option(v-for="item in compArr" v-bind:value="item.id") {{item.name}}
                input.form-control(type="text" v-model="sub.max_value" @blur="checkNumber()")
          div.col-md-12
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 方案：
                select.form-control(v-model="sub.tech_poi_technology_connection")
                  option(value="-1") 请选择
                  option(v-for="item in projectArr" v-bind:value="item.id") {{item.name}}
          div.footer-box.subcommit
            a.btn.btn-secondary(type="button" @click="subCommit()") 提交
            a.btn.btn-secondary.cancel-btn(@click="initSub()") 取消
      div.footer-box
        button.btn.btn-success.ok-btn(type="button" @click="commitBtn()") 提交
        a.btn.btn-secondary.cancel-btn(@click="getCancel()") 取消
    div.loading-box(v-if="loadingState")
      vueloading
</template>

<script>
  let model
  let tmpID = 0
  let _ = require('underscore')
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '编辑打孔工艺'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        loadingState: true,
        info: {
          name: ''
        },
        twoArr: [],
        thirdArr: [],
        motherArr: [
          {
            type: 0,
            compare: 0,
            type_poi_c2m_part_simple_type: -1,
            type_poi_c2m_part_type: -1,
            twoArr: [] // 三级分类
          }
        ],
        sonArr: [
          {
            type: 0,
            compare: 0,
            type_poi_c2m_part_simple_type: -1,
            type_poi_c2m_part_type: -1,
            twoArr: [] // 三级分类
          }
        ],
        dataArr: [],
        sub: {
          type: 'new',
          left_operator: 'less_then',
          min_value: 0,
          right_operator: 'less_then',
          max_value: 1,
          tech_poi_technology_connection: -1
        },
        compArr: [
          {
            id: 'less_then',
            name: '小于'
          },
          {
            id: 'less_equal',
            name: '小于等于'
          }
        ],
        projectArr: []
      }
    },
    methods: {
      // 初始化数据
      // 2018-07-03 yuguo
      init: async function () {
        model.loadingState = true

        // 获取二级分类
        let two = await API.GET('classes/c2m_part_simple_type', {order: '-id'})
        model.twoArr = two.data.items

        // 获取三级分类
        let third = await API.GET('classes/c2m_part_type', {order: '-id', limit: 500})
        model.thirdArr = third.data.items

        // 获取方案数据
        let pro = await API.GET('classes/technology_connection', {order: '-id', where: {switch_state: 'on'}})
        model.projectArr = pro.data.items

        // 获取方案数据
        let rel = {
          relation: [
            {
              table: 'technology_hole_condition',
              key: 'tech_poi_technology_hole'
            },
            {
              table: 'technology_hole_connections',
              key: 'tech_poi_technology_hole'
            }
          ]
        }

        tmpID = this.$route.query.id || 0
        let info = await API.GET('classes/technology_hole', {id: tmpID, with: rel})
        let infodata = info.data
        model.info.name = infodata.name
        model.motherArr = []
        model.sonArr = []
        // 母/子条件
        infodata.tech_rel_technology_hole_condition.items.forEach(async (sub) => {
          sub.type = 0
          sub.compare = 0
          sub.twoArr = []
          await model.getThirdType(sub, false)
          if (sub.is_parent == 1) {
            model.motherArr.push(sub)
          } else {
            model.sonArr.push(sub)
          }
        })

        //可用方案 
        infodata.tech_rel_technology_hole_connections.items.forEach(async (sub) => {
          let tmp = {
            type: 'new',
            tech_poi_technology_connection: sub.tech_poi_technology_connection,
            left_operator: sub.left_operator,
            min_value: sub.min_value,
            right_operator: sub.right_operator,
            max_value: sub.max_value,
            name: model.getProjectName(sub.tech_poi_technology_connection)
          }
          model.dataArr.push(tmp)
        })
        model.loadingState = false
      },

      // 根据二级分类获取三级分类数据
      // 2018-07-03 yuguo
      // obj(object) 当前操作对象
      getThirdType: async function (obj, flag) {
        if (flag) {
          obj.type_poi_c2m_part_type = -1
          obj.twoArr = []
        }
        model.thirdArr.forEach((sub) => {
          if (obj.type_poi_c2m_part_simple_type == sub.sp_type_poi_c2m_part_simple_type) {
            obj.twoArr.push(sub)
          }
        })
      },

      // 新增母、子件条件
      // 2018-07-03 yuguo
      // typ(string)区别类型
      addSubItem: function (typ) {
        let obj = {
          type: 0,
          compare: 0,
          type_poi_c2m_part_simple_type: -1,
          type_poi_c2m_part_type: -1,
          twoArr: [] // 三级分类
        }
        if (typ === 'mo') {
          model.motherArr.push(obj)
        } else {
          model.sonArr.push(obj)
        }
      },

      // s删除母、子件条件
      // 2018-07-03 yuguo
      // typ(string)区别类型，obj(object)当前对象
      delSubItem: function (typ, obj) {
        if (typ === 'mo') {
          model.motherArr = _.without(model.motherArr, obj)
        } else {
          model.sonArr = _.without(model.sonArr, obj)
        }
      },

      // 检测筛选条件
      // 2018-07-03 yuguo
      checkNumber: function () {
        if (parseInt(model.sub.min_value) >= parseInt(model.sub.max_value)) {
          Core.alert('danger', '区间值输入错误')
          model.sub.max_value = parseInt(model.sub.min_value) + 1
        }
      },

      // 编辑方案提交
      // 2018-07-03 yuguo
      subCommit: function () {
        if (model.sub.tech_poi_technology_connection == -1) {
          Core.alert('danger', '请先选择方案')
          return
        }
        let tmp = {
          type: model.sub.type,
          tech_poi_technology_connection: model.sub.tech_poi_technology_connection,
          left_operator: model.sub.left_operator,
          min_value: model.sub.min_value,
          right_operator: model.sub.right_operator,
          max_value: model.sub.max_value,
          name: model.getProjectName(model.sub.tech_poi_technology_connection)
        }
        if (tmp.type == 'new') {
          model.dataArr.push(tmp)
        } else {
          model.dataArr.forEach((sub) => {
            if (sub.type == 'edit') {
              sub.tech_poi_technology_connection = model.sub.tech_poi_technology_connection
              sub.left_operator = model.sub.left_operator
              sub.min_value = model.sub.min_value
              sub.right_operator = model.sub.right_operator
              sub.max_value = model.sub.max_value
              sub.name = model.getProjectName(model.sub.tech_poi_technology_connection)
              sub.type = 'new'
            }
          })
        }
        
        model.initSub()
      },

      // 删除可用方案
      // 2018-07-03 yuguo
      // obj(object) 当前对象
      delSub: function (obj) {
        if (confirm('确定删除该条记录？')) {
          model.dataArr = _.without(model.dataArr, obj)
        }
      },

      // 编辑可用方案
      // 2018-07-03 yuguo
      // obj(object) 当前对象
      editSub: function (obj) {
        obj.type = 'edit'
        model.sub = {
          left_operator: obj.left_operator,
          min_value: obj.min_value,
          right_operator: obj.right_operator,
          max_value: obj.max_value,
          tech_poi_technology_connection: obj.tech_poi_technology_connection
        }
      },

      // 初始化编辑方案的数据
      // 2018-07-03 yuguo
      initSub: function () {
        model.sub = {
          type: 'new',
          left_operator: 'less_then',
          min_value: 0,
          right_operator: 'less_then',
          max_value: 1,
          tech_poi_technology_connection: -1
        }
      },

      // 根据方案id获取方案名称
      // 2018-07-03 yuguo
      // id(number) 方案id
      getProjectName: function (id) {
        let obj = _.find(model.projectArr, (sub) => {
          return sub.id == id
        })
        return (obj || {}).name || ''
      },

      // 提交数据前整理可用连接方案
      // 2018-07-03 yuguo
      getCondition () {
        let arr = []
        model.motherArr.forEach((tmp) => {
          let mo = {
            is_parent: 1,
            type_poi_c2m_part_simple_type: tmp.type_poi_c2m_part_simple_type,
            type_poi_c2m_part_type: tmp.type_poi_c2m_part_type
          }
          arr.push(mo)
        })
        model.sonArr.forEach((sub) => {
          let son = {
            is_parent: 0,
            type_poi_c2m_part_simple_type: sub.type_poi_c2m_part_simple_type,
            type_poi_c2m_part_type: sub.type_poi_c2m_part_type
          }
          arr.push(son)
        })
        return arr
      },

      // 新增数据提交
      // 2018-07-03 yuguo
      commitBtn: function () {
        model.clickBtnAndDisable($('.ok-btn'), true)
        let param = {
          id: tmpID,
          name: model.info.name,
          scheme_count: model.dataArr.length,
          condition: model.getCondition(),
          connections: model.dataArr
        }
        API.PUT('functions/hole/technology_hole', param).then((msg) => {
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
    select{
      margin: 0 5px !important;
      border-radius: 0 !important;
    }
    .subcommit{
      text-align: center;
      .btn{
        margin: 0 5px;
      }
    }
    .icons{
      .fa{
        position: relative;
        top: 7px;
        left: 10px;
        display: inline-block;
        width: 24px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        border-radius: 100%;
        color: #fff;
        cursor: pointer;
      }
      .subadd {
        background-color: #3d9970;
      }
      .subdel{
        background-color: #f00;
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
        .opt{
          .fa{
            font-size: 20px;
            display: inline-block;
            margin: 0 3px;
          }
        }
      }
    }
  }
</style>
