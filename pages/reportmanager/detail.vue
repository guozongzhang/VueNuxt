<template lang="pug">
  div.con-box
    div.loading-box(v-if="loadingState")
      vueloading
    div(v-if="!loadingState")
      div.row
        div.col-md-12
          div.form-group
            div.input-group
              span.input-group-text.title 项目信息
        div.col-md-4.col-lg-4
          div.form-group
            div.input-group
              span.input-group-text 
                | 项目名称： 
              span.text-control {{basicinfo.name}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 所属公司： 
              span.text-control {{(basicinfo.com_id_poi_companys || {}).com_name}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 项目编号： 
              span.text-control {{basicinfo.number}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 项目类型： 
              span.text-control {{refcd(basicinfo.category, 'report_projecttype')}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 项目地址： 
              span.text-control {{(basicinfo.province_poi_province || {}).ProvinceName}}{{(basicinfo.city_poi_city || {}).CityName}}{{(basicinfo.district_poi_district || {}).DistrictName}}{{basicinfo.address}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 产品类型： 
              span.text-control 
                span(v-for="(tmp, index) in (basicinfo.project_rel_project_furniture_types || {}).items") 
                  span {{tmp.type_poi_furniture_types.type_name}}
                  span(v-show="index < ((basicinfo.project_rel_project_furniture_types || {}).items || []).length-1") 、
          div.form-group
            div.input-group
              span.input-group-text 
                | 预计金额(万元)： 
              span.text-control {{basicinfo.amount}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 项目介绍： 
              span.text-control {{basicinfo.intro}}
        div.col-md-4.col-lg-4
          div.form-group
            div.input-group
              span.input-group-text 
                | 有效时间：  
              span.text-control {{refcd(basicinfo.validity, 'report_valtime')}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 招标时间：
              span.text-control {{localDate(basicinfo.invitation_time, 'YYYY-MM-DD')}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 交付时间：  
              span.text-control {{localDate(basicinfo.delivery_time, 'YYYY-MM-DD')}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 可行性：
              span.text-control
                span.fa(v-for="obj in [1,2,3,4,5]" v-bind:class="obj <= basicinfo.feasibility ? 'fa-star' : 'fa-star-o'")
          div.form-group
            div.input-group
              span.input-group-text 
                | 风险分析：  
              span.text-control {{basicinfo.risk_analysis}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 简单描述：
              span.text-control {{basicinfo.sketch}}
        div.col-md-4.col-lg-4
          div.form-group
            div.input-group
              span.input-group-text 
                | 附件：  
              span.text-control 
                a.fancybox(rel="group" :href="sub.file_url" v-for="sub in (basicinfo.project_rel_project_attachment || {}).items" style="padding: 5px;")
                  img(:src="sub.file_url" style="width: 40px; height: 40px;")
        div.col-md-12(style="margin-bottom: 10px;")
        div.col-md-4
          div.form-group
            div.input-group
              span.input-group-text.title 报备人信息
          div.form-group
            div.input-group
              span.input-group-text 
                | 报备人姓名： 
              span.text-control {{reportman.name}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 与项目关系： 
              span.text-control {{reportman.project_relation}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 期望提成： 
              span.text-control {{reportman.royalties_expectation ? reportman.royalties_expectation + '%': ''}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 项目优势： 
              span.text-control {{reportman.strengths}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 联系电话： 
              span.text-control {{reportman.tel}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 联系邮箱： 
              span.text-control {{reportman.email}}
        div.col-md-4
          div.form-group
            div.input-group
              span.input-group-text.title 竞争信息
          div.form-group
            div.input-group
              span.input-group-text 
                | 乙方对手： 
              span.text-control {{basicinfo.second_party_competitor}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 项目亮点： 
              span.text-control {{basicinfo.competitor_strengths}}
          div.form-group
            div.input-group
              span.input-group-text 
                | 形势预测： 
              span.text-control {{basicinfo.competitor_projections}}
        div.col-md-4
          div.form-group
            div.input-group
              span.input-group-text.title 甲方信息
          div.form-group
            div.input-group
              span.input-group-text 
                | 公司名称： 
              span.text-control {{basicinfo.first_party_name}}
          div.form-group(v-if="linkmanArr.length == 0") 
            div.input-group
              span.input-group-text(v-if="linkmanArr.length == 0") 
                | 联系人： 
              span.text-control 暂无
          div.form-group(v-for="(link, index) in linkmanArr")
            div.input-group
              span.input-group-text 
                | 第{{index+1}}联系人： 
              span.text-control {{link.name}} / {{link.job}} / {{link.tel}}
</template>
<script>
  let model
  let _ = require('underscore')
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '报备详情'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        loadingState: true,
        basicinfo: {},
        reportman: {},
        linkmanArr: []
      }
    },
    methods: {
      // 初始化数据
      // 2018-06-21 yuguo
      init: function () {
        if (_.isEmpty(this.$route.query.id)) {
          Core.alert('danger', '数据缺失')
          return
        }
        model.getDetailData(this.$route.query.id)
      },

      // 获取详情数据
      getDetailData: function (id) {
        let rel = {
          include: [
            {
              table: 'first_party_province_poi_province',
              keys: 'id,ProvinceName'
            },
            {
              table: 'first_party_city_poi_city',
              keys: 'id,CityName'
            },
            {
              table: 'first_party_district_poi_district',
              keys: 'id,DistrictName'
            },
            {
              table: 'province_poi_province',
              keys: 'id,ProvinceName'
            },
            {
              table: 'city_poi_city',
              keys: 'id,CityName'
            },
            {
              table: 'district_poi_district',
              keys: 'id,DistrictName'
            },
            {
              table: 'com_id_poi_companys',
              keys: 'id,com_name'
            }
          ],
          relation: [
            {
              table: 'project_reportman',
              key: 'project_poi_projects'
            },
            {
              table: 'project_first_party_linkman',
              key: 'project_poi_projects'
            },
            {
              table: 'project_attachment',
              key: 'project_poi_projects'
            },
            {
              table: 'project_furniture_types',
              key: 'project_poi_projects',
              include: [
                {
                  table: 'type_poi_furniture_types',
                  keys: 'id,type_name'
                }
              ]
            }
          ]
        }
        let condition = {
          with: JSON.stringify(rel),
          where: JSON.stringify({id: id})
        }
        API.GET('classes/projects', condition).then((msg) => {
          model.loadingState = false
          model.basicinfo = msg.data.items[0]
          model.reportman = model.basicinfo.project_rel_project_reportman.items.length > 0 ? model.basicinfo.project_rel_project_reportman.items[0] : {}
          model.linkmanArr = model.basicinfo.project_rel_project_first_party_linkman.items
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
  .con-box{
    height: 100%;
    .title{
      font-size: 18px;
    }
    .row{
      .form-group{
        margin-bottom: 0px;
        .input-group-text {
          border: none;
        }
      }
    }
  }
</style>
