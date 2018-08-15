<template lang="pug">
  div.modal.fade#seereason(tabindex="-1" role="dialog" aria-labelledby="myModalLabel")
    div.modal-dialog(role="document")
      div.modal-content
        div.modal-header
          h4.modal-title 产看原因
          button.close(type="button" data-dismiss="modal" aria-label="Close")
        div.modal-body 
          div.form-group
            label {{modelinfo.title}}禁用的原因：
            textarea.form-control(type="text" rows="3" placeholder="请输入禁用原因" v-model="reason" disabled="true") 
        div.modal-footer
          button.btn.btn-flat.bg-olive(data-dismiss="modal" type="button") 关闭
          button.btn.btn-flat.bg-maroon(data-dismiss="modal" type="button") 取消
</template>
<script>
  let model
  import API from '~/plugins/axios'
  export default {
    props: ['info'],
    data () {
      return {
        hadclick: false,
        reason: '',
        modelinfo: {
          title: '',
          handle_id: 0,
          flow_poi_flow: 0,
          state: 0
        }
      }
    },
    watch: {
      info: {
        handler: function () {
          model.hadclick = false
          model.modelinfo = {
            title: this.info.title || '',
            handle_id: this.info.handle_id || 0,
            flow_poi_flow: this.info.flow_poi_flow || 0,
            state: this.info.state
          }
          model.init()
        },
        deep: true
      }
    },
    methods: {
      init: function () {
        API.GET('classes/flow_log', {limit: 1, order: '-id', where: {handle_id: model.modelinfo.handle_id, flow_poi_flow: model.modelinfo.flow_poi_flow}}).then((data) => {
          model.reason = (data.data.items[0] || {}).flow_remark || '暂无原因'
          $('#seereason').modal('show')
        })
      }
    },
    mounted () {
      require('bootstrap')
      model = this
    }
  }
</script>
<style lang="scss" scoped>
</style>
