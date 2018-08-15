import Vue from 'vue'
import storage from '~/plugins/storage'
import API from '~/plugins/axios'
let _ = require('underscore')
let moment = require('moment')

Vue.use({
  install: function (Vue, options) {
    // 常量表过滤器
    // 2018-04-25 yuguo
    // value(string)需要转化的常量字段, typ(string)常量类型
    Vue.prototype.refcd = function (value, typ) {
      let Refcds = storage.get('selecttable') || []
      let ref = _.filter(Refcds, (item) => {
        return item.state_types == typ && (item.old_value == value || item.name == value)
      })[0]
      return ref ? ref.alias : value
    }

    // 时间转换器
    // 2018-04-25 yuguo
    // value(number)需要转化的时间戳, typ(string)事件格式，默认YYYY-MM-DD HH:mm:ss
    Vue.prototype.localDate = function (value, typ) {
      if (_.isEmpty(value) || parseInt(value) === 0) { return '' }
      moment.locale('Chinese (Simplified)')
      return typ ? moment(parseInt(value)).format(typ) : moment(parseInt(value)).format('YYYY-MM-DD HH:mm:ss')
    }

    // 图片CND裁剪
    // 2018-04-25 yuguo
    // value(url)需要转化的图片地址, width(number)图片宽度, height(number)图片高度，默认等于宽度
    Vue.prototype.resizeIMG = function (value, width, height) {
      if (!height) {
        height = width
      }
      let val = value ? value : 'http://cimg.dpjia.com/images/b_art_img.jpg'
      return val + '?x-oss-process=image/resize,m_fill,h_' + height + ',w_' + width
    }

    // 删除列表单条数据(仅支持万能接口删除)
    // 2018-06-02 yuguo
    // table(string)数据表名称, item(object)需要删除的数据对象, ObjArr(arrray)当前列表的数据数组
    Vue.prototype.deleteListItem = function (table, item, ObjArr) {
      if (!confirm('确定删除该记录')) {
        return false
      }
      API.DELETE('classes/' + table, {id: item.id}).then(function (response) {
        Core.alert('success', '删除成功')
        ObjArr.splice($.inArray(item, ObjArr, 0), 1)
      })
      .catch(function () {
        Core.alert('danger', '删除失败')
      })
    }

    // 启用禁用列表单条数据(仅支持万能接口单表数据)
    // 2018-06-02 yuguo
    // table(string)数据表名称, item(object)需要删除的数据对象, str(string)当前表的字段名称
    Vue.prototype.switchStateBtn = function (table, item, str) {
      let opt = {}
      opt.id = item.id
      opt[str] = String(item[str]) === 'on' ? 'off' : 'on'
      API.PUT('classes/' + table, opt).then(function (response) {
        Core.alert('success', (String(opt[str]) === 'on' ? '启用' : '禁用') + '成功')
        item[str] = opt[str]
      })
      .catch(function () {
        Core.alert('danger', '操作失败')
      })
    }

    // 新增、编辑页面的取消按钮
    // 2018-06-02 yuguo
    Vue.prototype.getCancel = function () {
      if (!confirm('确定放弃当前当前操作吗？')) {
        return false
      }
      window.history.back(-1)
    }

    // 左右按钮提交后，显示‘xx中...’
    // 2018-06-04 yuguo
    // DOM(dom)当前dom结构, flag(boolen) 是否可以点击
    Vue.prototype.clickBtnAndDisable = function (DOM, flag) {
      // 判断是否需要可以点击
      if (flag) {
        $(DOM).text($(DOM).text() + '中...')
      } else {
        $(DOM).text(String($(DOM).text()).split('中...')[0])
      }
      $(DOM).attr('disabled', flag)
    }
  }
})
