<template lang="pug">
  div.con-box
    div.wrap
      div.box-header
      div.body-box
        div.row
          div.form-group.col-md-4
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 多工位模板名称： 
              input.form-control(type="text" v-model="info.key" placeholder="请输入key")
        div.row
          div.form-group.col-md-4
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 多工位模板分类： 
              select.form-control(v-on:change="selectType(typeid)" v-model="typeid")
                option(value="0") 请选择材质分类
                option(v-for="item in workstations" v-bind:value="item.id") {{item.pt_type_name}}
        div.form-group.col-md-12
          div.input-group
            span.input-group-prepend
              span.input-group-text 
                | 多张： 
            img(:src="img.url" v-if="imgurlarr.length > 0" v-for="img in imgurlarr")
            <vueuploadumgarr flag="moreimg" v-model="imgurlarr"></vueuploadumgarr>
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
        title: '新增工位模板'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        info: {
          key: '',
          name: '',
          remark: ''
        },
        typeid: 0,
        imgurlarr: [],  //  多张上传图片数组  
        workstations: []  // 下拉框数据
      }
    },
    created () {
        model = this
        model.init()
    },
    methods: {
      //  初始化
      init: function () {
        model.getWorkStationList()
      },
      ww: function (obj) {

      },
      //  选择模板分类
      selectType: function (obj) {
        model.typeid = obj
        API.GET('classes/office_part_types',{id: obj}).then((msg) => {
          console.log('----', msg)
        })
      },
      //  获取多工位模板分类
      getWorkStationList: async function () {
        await API.GET('classes/office_part_types').then((msg) => {
          model.workstations = msg.data.items
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
input,select {
  margin-left: 50px;
}
</style>
