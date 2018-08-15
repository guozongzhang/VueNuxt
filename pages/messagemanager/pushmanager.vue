<template lang="pug">
  div.con-box
    div.wrap
      div.box-header.row
        div.col-md-12
          div.col-md-9
          div.col-md-3
            <searchbasic flag="pushs" :obj="basicdata" @getsearchdate="getListData"></searchbasic>
      div.body-box
        div.table-responsive
          table.table.card-table.table-striped.table-vcenter
            thead
              tr
                th(v-for="sub in tableheaders") {{sub.name}}
            tbody
              tr(v-for="(item, num) in pushmanagers")
                td {{num + 1}}
                td {{item.event_name}}
                td {{item.event_key}}
                td
                  span.switch-plug(:data-content="item.inmail_status == 'on' ? '启用' : '禁用'" :data-switch="item.inmail_status == 'on' ? 'on' : 'off'" @click="switchState(item)")
                td
                  span.switch-plug(:data-content="item.appinmail_status == 'on' ? '启用' : '禁用'" :data-switch="item.appinmail_status == 'on' ? 'on' : 'off'" @click="switchState(item)")
                td
                  span.switch-plug(:data-content="item.sms_status == 'on' ? '启用' : '禁用'" :data-switch="item.sms_status == 'on' ? 'on' : 'off'" @click="switchState(item)")
                td
                  span.switch-plug(:data-content="item.email_status == 'on' ? '启用' : '禁用'" :data-switch="item.email_status == 'on' ? 'on' : 'off'" @click="switchState(item)")
                td {{localDate(item.update_time)}}
                td.opers
                  nuxt-link(:to="'/arkhardware/edit?id=' + item.id" title="编辑" )
                    i.fa.fa-cog
        div.loading-box(v-if="loadingState")
          vueloading
        pagination(flag="pushs" v-bind:total="basicdata.pagetotal" v-bind:size="basicdata.pagesize" v-on:callback="getListData")
</template>

<script>
let model;
let switchObj = {};
let _ = require("underscore");

import API from "~/plugins/axios";

export default {
  head() {
    return {
      title: "平台消息类型列表"
    };
  },
  layout: "layout",
  components: {},
  data() {
    return {
      loadingState: true,
      tableheaders: [
        {
          name: "序号",
          key: "id"
        },
        {
          name: "消息类型",
          key: ""
        },
        {
          name: "事件key",
          key: ""
        },
        {
          name: "web站内信开关",
          key: ""
        },
        {
          name: "pad站内信开关",
          key: ""
        },
        {
          name: "手机短信开关",
          key: ""
        },
        {
          name: "电子邮件开关",
          key: ""
        },
        {
          name: "最后修改时间",
          key: ""
        },
        {
          name: "操作",
          key: ""
        }
      ],
      basicdata: {
        searchkey: "",
        placeholder: "",
        pagetotal: 1,
        pagesize: 15,
        pages: 1
      },
      pushmanagers: [] //  平台消息类型列表
    };
  },
  methods: {
    // 初始化数据
    // 2018-07-11 wy
    init: async function() {
      await model.getListData();
    },

    // 启用/禁用
    switchState: function(obj) {
      let param = {
        id: obj.id,
        switch_state: obj.switch_state == "on" ? "off" : "on"
      };
      API.PUT("classes/office_unit_design_template", param).then(msg => {
        obj.switch_state = param.switch_state;
      });
    },

    // 初始化基础数据
    // 2018-06-30 yuguo
    // obj(object) query信息
    initbasicData: function(obj) {
      let result = !_.isEmpty(obj) ? obj : this.$route.query || {};
      model.workstations = [];
      model.basicdata = {
        searchkey: result.searchkey ? result.searchkey : "",
        pages: result.pages || 1,
        pagetotal: 1,
        placeholder: "名称",
        pagesize: Core.getPageSize()
      };
      model.loadingState = true;
    },

    // 获取列表数据
    // 2018-06-30 yuguo
    // obj(object) query信息
    getListData: async function(obj) {
      model.initbasicData(obj);
      let result = {};
      if (_.isEmpty(model.basicdata.searchkey)) {
        // 正常请求
        let condition = {
          skip: (model.basicdata.pages - 1) * model.basicdata.pagesize,
          limit: model.basicdata.pagesize,
          with: ""
        };
        result = await API.GET("functions/messages/messages_event", condition);
        console.log(result);
      } else {
        // 搜索
        let searchpar = {
          table: "messages_event",
          like: JSON.stringify(["event_name"]),
          search: $.trim(model.basicdata.searchkey),
          new_where: JSON.stringify({}),
          with: "",
          limit: model.basicdata.pagesize,
          skip: model.basicdata.pagesize * (model.basicdata.pages - 1)
        };
        result = await API.GET("functions/search/search_vague", searchpar);
        console.log(result)
      }
      model.loadingState = false;
      model.pushmanagers = result.data.items;
      model.basicdata.pagetotal = result.data.count;
    }
  },
  created() {
    model = this;
    model.init();
  }
};
</script>
<style lang="scss" scoped>
.con-box {
  .box-header {
    .btn {
      a {
        color: #fff;
      }
    }
  }
  table {
    white-space: nowrap;
    thead {
      th {
        color: #333;
        font-weight: 500;
      }
    }
    tbody {
      td {
        border: 1px solid #f4f4f4;
      }
    }
  }
}
</style>
