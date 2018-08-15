<template lang="pug">
  div.component-paination
    div.pagenationid(:id="'pagid-' + flag")
</template>


<script>
  let _ = require('underscore')
  import $ from '~/static/js/jquery-vendor'
  require('~/static/js/jquery.twbsPagination.js')
  export default {
    props: ['flag', 'size', 'total'],
    data () {
      return {
      }
    },
    watch: {
      '$route': function () {
        this.initPage()
      },
      'total': function () {
        this.initPage()
      }
    },
    methods: {
      initPage: function () {
        let $wraper = $(`#pagid-${this.flag}`)
        if ($wraper.find('ul')) {
          $wraper.twbsPagination('destroy')
        }
        let self = this
        let startPageNum = self.$route.query.pages ? Number(self.$route.query.pages) : Number(1)
        let pages = Math.ceil(this.total / this.size)
        if (pages < 1) { pages = 1 }
        $wraper.twbsPagination({
          totalPages: pages,
          visiblePages: 5,
          startPage: startPageNum,
          initiateStartPageClick: false,
          first: '首页',
          prev: '«',
          next: '»',
          last: '末页',
          inputtext: startPageNum,
          goto: '跳转',
          selectable: 15,
          onPageClick: function (event, pageNumber) {
            let _query = {}
            for (let key in self.$route.query) {
              if (!_.isEmpty(self.$route.query[key])) {
                _query[key] = self.$route.query[key]
              }
            }
            _query.pages = pageNumber
            self.$router.push({path: self.$route.path, query: _query})
            self.$emit('callback', _query)
          }
        })
      }
    },
    mounted () {
      this.initPage()
    }
  }
</script>

<style lang="scss" scoped>
  .component-paination {
    margin: 20px 0 10px 0;
    height: 40px;
    .pagenationid{
      height: 40px;
      position: relative;
      ul{
        height: 38px;
        float: right;
      }
      li {
        height: 38px;
        list-style: none;
        display: inline-block;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        &.active {
          span {
            color: #da552f
          }
        }
        & > a, & > span {
          position: relative;
          display: inline-block;
          padding: 5px 16px;
          margin-left: -1px;
          line-height: 2;
          color: #777;
          background-color: #fff;
          border: 1px solid #ddd;
        }
        & > span {
          color: #CCC
        }
      }
    }
  }
</style>