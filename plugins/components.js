import Vue from 'vue'
import Pagination from '~/components/common/pagination.vue'  // 翻页
import loadingVue from '~/components/common/loading.vue'  // 加载动画
import uploadImgVue from '~/components/common/uploadimg.vue'  // 单张图片上传
import uploadImgArrVue from '~/components/common/uploadimgarr.vue'  // 多张张图片上传
import searchBasicVue from '~/components/common/searchbasic.vue' // 基础搜索
import searchFormVue from '~/components/common/searchform.vue' // 高级搜索
import forbiddenVue from '~/components/common/forbidden.vue' // 禁用模态框
import seereasonVue from '~/components/common/seereason.vue' // 查看原因模态框

Vue.component('pagination', Pagination)
Vue.component('vueloading', loadingVue)
Vue.component('vueuploadumg', uploadImgVue)
Vue.component('vueuploadumgarr', uploadImgArrVue)
Vue.component('searchbasic', searchBasicVue)
Vue.component('searchform', searchFormVue)
Vue.component('forbidden', forbiddenVue)
Vue.component('seereason', seereasonVue)
