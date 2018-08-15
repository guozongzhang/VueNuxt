<template lang="pug">
  div.component-searchform
    div.row(:id="'search-' + flag")
      div.col-md-3(v-for="(item, index) in data")
        div.form-group
          div.input-group(v-if="item.text")
            span.input-group-prepend
              span.input-group-text 
                | {{item.text}}：
            input.form-control(type="text" placeholder="请输入" v-if="item.typ == 'input'")
            select.form-control(v-if="item.typ == 'select'" v-model="item[item.key]" @change="changeVal(item)")
              option(value="-1") 请选择
              option(v-for="msg in item.options" v-bind:value="msg[item.optionMap.keyId]") {{msg[item.optionMap.keyVal]}}

</template>
<script>
  let model
  let _ = require('underscore')
  import API from '~/plugins/axios'
  export default {
    props: ['flag', 'obj'],
    data () {
      return {
        data:[]
      }
    },
    methods: {
      // 初始化数据，将搜索数据结构复制本组件
      // 2018-06-07 yuguo
      init: function () {
        model.data = this.obj
        model.data.forEach(async (sub) => {
          sub[sub.key] = -1
          if (sub.isinit) {
            sub.options = await model.getData(sub.table, sub.whereobj)
          }
        })
      },

      // 获取数据
      // 2018-06-07 yuguo
      // table(string)表名，conditions(object)查询对象
      getData: async function (table, conditions) {
        let result = await API.GET('classes/'+ table, conditions)
        return (result.status == 200) ? result.data.items : []
      },

      // 获取当前搜索项的值
      // 2018-06-12 yuguo
      getKeyVal: function () {
        let result = {}
        model.data.forEach((sub) => {
          if (_.isEmpty(sub.key)) return
          if (sub[sub.key] > 0) {
            result[sub.key] = sub[sub.key]
          }
        })
        let _query = {}
        for (let key in this.$route.query) {
          if (!_.isEmpty(this.$route.query[key]) && key == 'pages') {
            _query[key] = this.$route.query[key]
          }
        }
        result = _.extend(_query, result)
        return result || {}
      },

      // 修改筛选框的值
      // 2018-06-07 yuguo
      // obj(object)当前操作对象
      changeVal: function (obj) {
        // 根据当前选项，获取关联选项的数据
        obj.linkinfo.forEach((parent) => {
          model.selfRound(parent, obj[obj.key])
        })
        model.$emit('callback', model.getKeyVal())
      },

      // 轮询检查自己关联数据，并且获取数据
      // 2018-06-07 yuguo
      // parent(object)当前操作对象， val(number)当前选项的值（关联选项的筛选条件）
      selfRound: function (parent, val) {
        model.data.forEach(async (sub) => {
          if (parent.subkey == sub.key) {
            let par = {} // 构造自己筛选条件对象
            sub[sub.key] = -1 // 父级修改后，子级的值修改为-1
            par[parent.wherekey] = val // 赋值自己筛选条件
            sub.options = val == -1 ? [] : await model.getData(sub.table, _.extend(sub.whereobj, { where: par }))
            if (sub.linkinfo.length > 0) {
              // linkinfo中是关联选项的数据条件
              sub.linkinfo.forEach((subparent) => {
                // 轮询调用
                model.selfRound(subparent, sub[sub.key])
              })
            }
          }
        })
      }
    },
    mounted () {
      model = this
      model.init()
    }
  }
</script>
<style lang="scss" scoped>
  .component-searchform{
    padding: 10px 20px;
    .input-group-text{
      border: none;
    }
  }
</style>