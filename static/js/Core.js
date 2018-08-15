window.Core = {
  /**
   * 弹出提示框
   * @param  {string} typ 消息类型：success, info, warning, danger
   * @param  {string} msg 消息内容
   * @param  {object} position 位置 top-center  top-left  top-right
   */
  alert: (typ, msg, position = 'top-center') => {
    let delay = 1000
    let top = 10
    let box = $('<div class="alert alert-' + typ +
    ' alert-tip alert-' + position +
    '" role="alert" style="max-width: 280px;position: fixed;top: 20px;left: 50%; z-index: 9999; -webkit-transform:translate(-50%, 0);-moz-transform:translate(-50%, 0);"-o-transform:translate(-50%, 0);transform:translate(-50%, 0);><button type="button" style="margin-left: 8px" class="close" data-dismiss="alert" aria-label="Close"></button>' +
    msg + '</div>')
    $('body').append(box)
    box.animate({top: top}, () => {
      setTimeout(() => {
        box.remove()
      }, delay)
    })
  },

  /**
   * 检查字段值是否-1
   * @param {object} obj 需要检测的对象
   * @memberof List
   * @return {object} tmp 过滤后的对象
   */
  checkKey (obj) {
    let tmp = {}
    for (var key in obj) {
      if (obj[key] > 0) {
        tmp[key] = obj[key]
      }
    }
    return tmp
  },

  // 获取当前页面的pagesize
  getPageSize: function () {
    return store.get(window.location.pathname + '_pagsize') || 15
  }
}
