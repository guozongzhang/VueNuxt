<template lang="pug">
  div.basicsearch-box
    div.form-group(:id="'search_' + flag")
      div.input-group
        input.form-control(type="text" v-model="searchObj.searchkey" :placeholder="searchObj.placeholder")
        span.input-group-append
          button.search-btn.btn.btn-primary(type="button" @click="clickBasicFreshBtn('search')") 
            i.fe.fe-search.mr-2
            | 搜索
        span.input-group-append(style="margin-left: 10px;")
          button.search-btn.btn.btn-primary.bg-azure(type="button" @click="clickBasicFreshBtn('fresh')") 
            i.fe.fe-refresh-cw.mr-2
            | 刷新
            
</template>
<script>
  let model
  let _ = require('underscore')
  export default {
    props: ['flag', 'obj'],
    data () {
      return {
        searchObj: {
          searchkey: '',
          placeholder: ''
        }
      }
    },
    methods: {
      // 初始化数据
      // 2018-06-05 yuguo
      init: function () {
        model.searchObj = {
          searchkey: (model.obj || {}).searchkey || '',
          placeholder: (model.obj || {}).placeholder || '请输入搜索内容...',
        }
      },

      // 点击搜索、刷新
      // 2018-06-05 yuguo
      // str(string) search:搜索 fresh:刷新
      clickBasicFreshBtn: function (str) {
        let _query = {}
        let obj = {
          pages: 1
        }
        if (str === 'fresh') {
          // 刷新
          model.searchObj.searchkey = ''
          for (let key in model.$route.query) {
            if (!_.isEmpty(model.$route.query[key]) && key == 'pages') {
              _query[key] = model.$route.query[key]
            }
          }
        } else {
          // 搜索
          for (let key in model.$route.query) {
            if (!_.isEmpty(model.$route.query[key])) {
              _query[key] = model.$route.query[key]
            }
          }
          if (!_.isEmpty(model.searchObj.searchkey)) {
            _query.searchkey = model.searchObj.searchkey
            obj.searchkey = model.searchObj.searchkey
          } else {
            delete _query.searchkey
          }
        }
        _query.pages = 1
        model.$router.push({path: model.$route.path, query: _query})
        model.$emit('getsearchdate', _query || {})
      }
    },
    mounted () {
      model = this
      model.init()
    }
  }
</script>
<style lang="scss" scoped>
  .basicsearch-box {
    padding: 10px 20px 0 0;
    .search-btn{
      height: 38px !important;
      font-weight: 400 !important;
    }
    .form-group{
      margin: 0;
    }
  }
</style>