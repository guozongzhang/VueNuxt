<template lang="pug">
  div.con-box
    div.row
      div.col-md-12
        h4 跳转链接
      div.col-md-4-clo-lg-4
        div.form-group
          <nuxt-link to="/home">返回首页</nuxt-link>
      div.col-md-12
        h4 文本输入
      div.col-md-4.col-lg-4
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 文本1： 
                span.nut-null *
            input.form-control(type="text" placeholder="请输入")
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 文本1： 
                span.nut-null *
            input.form-control(type="text" placeholder="请输入")
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 文本2： 
                span.nut-null *
            textarea.form-control(type="text" rows="3" placeholder="请输入备注")
      div.col-md-4.col-lg-4
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 选择1：  
                span.nut-null *
            select.form-control
              option(value="-1") 请选择
              option(v-for="item in selectArr" v-bind:value="item.id") {{item.name}}
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 选择1：  
                span.nut-null *
            select.form-control
              option(value="-1") 请选择
              option(v-for="item in selectArr" v-bind:value="item.id") {{item.name}}
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 选择2：
                span.nut-null *
            select.form-control
              option(value="-1") 请选择
              option(v-for="item in selectArr" v-bind:value="item.id") {{item.name}}
      div.col-md-4.col-lg-4
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 日期选择：  
                span.nut-null *
            input.form-control.datepicker(type="text" placeholder="开始时间")
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 日期选择：
                span.nut-null *
            input.form-control.datepicker(type="text" placeholder="结束时间")
      
      
      div.col-md-12
        h4 文本显示
      div.col-md-4.col-lg-4
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 文本文本： 
                span.nut-null *
            span.text-control 这里是文字内容
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 文本2： 
                span.nut-null *
            span.text-control 这里是文字内容
      div.col-md-4.col-lg-4
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 文本3：  
                span.nut-null *
            span.text-control 这里是文字内容
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 文本4：
                span.nut-null *
            span.text-control 这里是文字内容
      div.col-md-4.col-lg-4
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 开关1：  
                span.nut-null *
            span.switch-plug(:data-content="'启用'" data-switch="on")
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 开关2：
                span.nut-null *
            span.switch-plug(:data-content="'禁用'" data-switch="off")
      
      div.col-md-12
        h4 图片上传
      div.col-md-4.col-lg-4
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 单张： 
                span.nut-null *
            img(:src="imgurl" v-if="imgurl")
            <vueuploadumg flag="signleimg" v-model="imgurl"></vueuploadumg>
      div.col-md-12
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 可删除： 
                span.nut-null *
            <vueuploadumg flag="signleimgs" v-model="imgurldel" :showimg="'true'"></vueuploadumg>
      div.col-md-12
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 多张： 
                span.nut-null *
            img(:src="img.url" v-if="imgurlarr.length > 0" v-for="img in imgurlarr")
            <vueuploadumgarr flag="moreimg" v-model="imgurlarr"></vueuploadumgarr>
      div.col-md-12
        div.form-group
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 可删除： 
                span.nut-null *
            <vueuploadumgarr flag="moreimgs" v-model="imgurlarrdel" :showimg="'true'"></vueuploadumgarr>
      div.col-md-12
        h4 
          | 图片上传
          span.fa.fa-plus.add-imgs(@click="addImgs()")
        div(v-for="(sub, num) in imgsarr")
          span {{num + 1}}
          span 
            img(:src="sub.img" v-if="sub.img")
            <vueuploadumg :flag="'signleimg_' + num" v-model="sub.img"></vueuploadumg>
      
      div.col-md-12
        h4 基础搜索
      div.col-md-4.col-lg-4
        <searchbasic flag="basicsearch"></searchbasic>

      div.col-md-12(style="margin-top: 10px;")
        h4 高级搜索
      div.col-md-12
        <searchform flag="highsearch" :obj="searchobj" @callback="getsearchdata"></searchform>

      div.col-md-12
        h4 分组及分类
      div.col-md-3
        div.stacked-box
          div.box-header 一级分组
          ul.nav-stacked
            li.item(v-for="one in levelOnes")
              a(@click="getNextLevels(one, 'one')" ) {{one.name}}
                span.switch-plug(v-bind:data-content="one.switch_state == 'on' ? '启用' : '禁用'" v-bind:data-switch="one.switch_state" @click="switchState('one', one)")
                i.fa.fa-pencil(@click="optItems('one', 'edit', one)")
                i.fa.fa-trash(@click="destroyItemo('one', one)")
            li.plus-item(@click="optItems('one', 'add')")
              a
                i.fa.fa-plus  
      div.col-md-3
        div.stacked-box
          div.box-header 二级分组
      div.col-md-3
        div.stacked-box
          div.box-header 三级分组
      <add-edit-model :info="classifyData"></add-edit-model>

      div.col-md-12
        h4 列表及翻页
        div.card
          div.box-header
            div.nav-self-box
              ul.nav-tab.clear
                li.active
                  a 列表1
                li
                  a 列表2
          div.body-box
            div.table-responsive
              table.table.card-table.table-striped.table-vcenter
                thead
                  tr
                    th(v-for="sub in tableheaders") {{sub.name}}
                tbody
                  tr(v-for="(item, num) in testArr")
                    td {{num + 1}}
                    td {{item.name}}
                    td
                      a.fancybox(rel="group" :href="item.url")
                        img(:src="resizeIMG(item.url, 20, 20)" style="width:20px;height:20px")
                    td {{localDate(item.update_time)}}
                    td {{refcd(item.switch_state, 'apt_type_state')}}
            pagination(flag="testlist" v-bind:total="pagetotal" v-bind:size="pagesize" v-on:callback="")

      div.col-md-12
        h4 操作按钮及颜色
      div.col-md-4.col-lg-4
        button.btn.btn-success(type="button")
          nuxt-link(to="/home")
            i.fe.fe-plus.mr-2
            | 新增
        button.btn.btn-success.ok-btn(type="button") 提交
        a.btn.btn-secondary.cancel-btn 取消
</template>
<script>
  let model
  let _ = require('underscore')
  require('bootstrap-datepicker/dist/css/bootstrap-datepicker3.css')
  import modelVue from '~/components/test/test.vue'
  export default {
    head () {
      return {
        title: '测试'
      }
    },
    layout: 'layout',
    components: {
      'add-edit-model': modelVue
    },
    data () {
      return {
        pagesize: 15,
        pagetotal: 20,
        imgurl: '',
        imgurldel: '',
        imgurlarr: [],
        imgurlarrdel: [],
        imgsarr: [],
        selectArr: [
          {
            id: 0,
            name: '选择0'
          },
          {
            id: 1,
            name: '选择1'
          },
          {
            id: 2,
            name: '选择2'
          }
        ],
        tableheaders: [
          {
            name: '序号',
            key: 'id'
          },
          {
            name: '名称',
            key: 'name'
          },
          {
            name: '预览图',
            key: 'imgurl',
            order: '-'
          },
          {
            name: '更新时间',
            key: 'update_time'
          },
          {
            name: '状态',
            key: 'switch_state'
          }
        ],
        testArr: [
          {
            id: 0,
            name: '搭配家（Dpjia）F6系列JLF6-BD002办公桌',
            url: 'http://cdn.dpjia.com/files/uploads/images/57137408d500db5578b48d94354a5585.jpg',
            update_time: '1519904001716',
            switch_state: 'on'
          },
          {
            id: 1,
            name: '搭配家（Dpjia）F6系列JLF6-BD001办公桌',
            url: 'http://cdn.dpjia.com/files/uploads/images/90effc7866e749c33cdb1bee8a92fff3.jpg',
            update_time: '1504078145999',
            switch_state: 'on'
          },
          {
            id: 2,
            name: '搭配家（Dpjia）F6系列JLF6-HY002会议桌',
            url: 'http://cdn.dpjia.com/files/uploads/images/f25f48d261703cb10ee6b9c6920b94fb.jpg',
            update_time: '1475031319924',
            switch_state: 'off'
          }
        ],
        searchobj: [
          {
            text: '一级分类', // 选择项名称
            typ: 'select', // 类型
            table: 'product_top_types', // 表名
            options: [], // 数据存储数组
            key: 'type_poi_product_top_types', // 列表关联字段
            val: -1,
            isinit: true, // 是否需要初始化
            whereobj: {}, // 其他条件
            linkinfo: [ // 附属关系（对应附属表）
              {
                subkey: 'type_poi_product_second_types', // 附属表关联字段
                wherekey: 'parent_poi_product_top_types', // 附属表对主表的关联字段
              }
            ],
            optionMap: { // 下拉选项key-value
              keyId: 'id',
              keyVal: 'name'
            }
          },
          {
            text: '二级分类', // 选择项名称
            typ: 'select', // 类型
            table: 'product_second_types', // 表名
            options: [], // 数据存储数组
            key: 'type_poi_product_second_types', // 列表关联字段
            val: -1,
            isinit: false, // 是否需要初始化
            whereobj: {}, // 其他条件
            linkinfo: [ // 附属关系（对应附属表）
              {
                subkey: 'type_poi_product_third_types', // 附属表关联字段
                wherekey: 'parent_poi_product_second_types', // 附属表对主表的关联字段
              }
            ],
            optionMap: { // 下拉选项key-value
              keyId: 'id',
              keyVal: 'name'
            }
          },
          {
            text: '三级分类',
            typ: 'select',
            table: 'product_third_types',
            options: [],
            key: 'type_poi_product_third_types',
            val: -1,
            isinit: false,
            whereobj: {},
            linkinfo: [],
            optionMap: {
              keyId: 'id',
              keyVal: 'name'
            }
          },
          {}
        ],
        classifyData: {
          id: 0,
          level: '',
          name: '',
          type: '',
          switch_state: '',
          state: 0
        },
        levelOnes: [
          {
            id: 1,
            name: '分类1',
            switch_state: 'on'
          },
          {
            id: 2,
            name: '分类2',
            switch_state: 'on'
          },
          {
            id: 3,
            name: '分类3',
            switch_state: 'on'
          },
          {
            id: 4,
            name: '分类4',
            switch_state: 'on'
          }
        ]
      }
    },
    methods: {
      // 初始化数据
      // 2018-06-02 yuguo
      init: function () {
        // 初始化日期选择器
        $('.datepicker').datepicker({
          autoclose: true,
          format: 'yyyy-mm-dd',
          language: 'zh-CN',
          todayHighlight: true
        })
      },

      // 循环添加图片（获取图片地址）
      addImgs: function () {
        model.imgsarr.push({
          id: 0,
          img: ''
        })
      },

      // 添加、编辑分组或者分类
      // 2018-06-11 yuguo
      // level(string)级别，typ(string)类型，obj(object)当前对象
      optItems: function (level, typ, obj) {
        model.classifyData = {
          id: (obj || {}).id || '',
          level: level,
          name: (obj || {}).name || '',
          type: typ,
          switch_state: (obj || {}).switch_state || 'on',
          state: Math.random()
        }
      },

      // 获取搜索数据
      // 2018-06-12 yuguo
      getsearchdata: function (obj) {
        this.$router.push({path: this.$route.path, query: obj})
      }
    },
    mounted () {
      // 引入日期选择器包文件
      require('bootstrap-datepicker')
      require('bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN')
      model = this
      model.init()
    }
  }
</script>
<style lang="scss" scoped>
  .con-box{
    height: 100%;
    .box-header{
      margin: 0;
    }
    img{
      display: inline-block;
      max-width: 120px;
      max-height: 120px;
      margin-right: 20px;
    }
    .add-imgs{
      display: inline-block;
      width: 24px;
      height: 24px;
      text-align: center;
      line-height: 24px;
      margin-left: 20px;
      font-size: 12px;
      border-radius: 100%;
      background-color: #3C6;
      color: #fff;
      cursor: pointer;
    }
    .btn{
      margin-right: 10px;
    }
  }
</style>
