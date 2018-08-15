module.exports = {
  'home/index': {
    name: '',
    back: '/home',
    power: 'dpjia_overview.view'
  },
  'error/404': {
    name: '',
    power: 'dpjia_overview.view'
  },
  'error/error': {
    name: '',
    power: 'dpjia_overview.view'
  },
  'test/index': {
    name: '',
    power: 'dpjia_overview.view'
  },
  'metope/list': {
    name: '墙面列表',
    breadcrumb: [['建材管理', '']],
    power: 'dpjia_metope.view'
  },
  'metope/templist': {
    name: '墙面模板',
    breadcrumb: [['建材管理', '']],
    power: 'dpjia_metopetemp.view'
  },
  'workstationlist/list': {
    name: '工位模板列表',
    breadcrumb: [['工位模板列表 ', '']],
    power: 'dpjia_workstation.view'
  },
  'workstationlist/new': {
    name: '新增工位模板',
    back: '/workstationlist/list',
    breadcrumb: [['工位模板列表', '/workstationlist/list']],
    power: 'dpjia_workstation.create'
  },
  'messagemanager/pushmanager': {
    name: '平台消息类型列表',
    breadcrumb: [['平台消息类型列表', 'messagemanager/pushmanager']],
    power: 'dpjia_pushmanager.view'
  },
  'messagemanager/eventmanager': {
    name: '事件消息类型列表',
    breadcrumb: [['事件消息类型列表', 'messagemanager/eventmanager']],
    power: 'dpjia_eventmanager.view'
  },
  'messagemanager/mailinbox': {
    name: '收件箱列表',
    breadcrumb: [['收件箱列表', 'messagemanager/mailinbox']],
    power: 'dpjia_mailinbox.view'
  },
  'messagemanager/deletedmailinbox': {
    name: '已删除邮件列表',
    breadcrumb: [['已删除邮件列表', 'messagemanager/deletedmailinbox']],
    power: 'dpjia_deletedmail.view'
  },
  'model/list': {
    name: '模型列表',
    breadcrumb: [['模型管理', '']],
    power: 'dpjia_metopetemp.view'
  },
  'brand/list': {
    name: '品牌列表',
    breadcrumb: [['商品管理', '/brand/list']],
    power: 'dpjia_brandlist.view'
  },
  'brand/detail': {
    name: '品牌详情',
    back: '/brand/list',
    breadcrumb: [['商品管理', '/brand/list']],
    power: 'dpjia_brandlist.detail'
  },
  'goods/list': {
    name: '商品列表',
    breadcrumb: [['商品管理', '/goods/list']],
    power: 'dpjia_goodslist.view'
  },
  'series/list': {
    name: '系列列表',
    breadcrumb: [['商品管理', '/series/list']],
    power: 'dpjia_serieslist.view'
  },
  'series/detail': {
    name: '系列详情',
    back: '/series/list',
    breadcrumb: [['商品管理', '/series/list']],
    power: 'dpjia_serieslist.detail'
  },
  'goodsclassify/goodstype': {
    name: '商品分类列表',
    breadcrumb: [['商品管理', '/goodsclassify/goodstype']],
    power: 'dpjia_goodstype.view'
  },
  'goodsclassify/styletype': {
    name: '风格分类列表',
    breadcrumb: [['商品管理', '/goodsclassify/styletype']],
    power: 'dpjia_styletype.view'
  },
  'goodsclassify/newstyle': {
    name: '新增风格分类',
    back: '/goodsclassify/styletype',
    breadcrumb: [['商品管理', '/goodsclassify/styletype']],
    power: 'dpjia_styletype.create'
  },
  'goodsclassify/editstyle': {
    name: '编辑风格分类',
    back: '/goodsclassify/styletype',
    breadcrumb: [['商品管理', '/goodsclassify/styletype']],
    power: 'dpjia_styletype.update'
  },
  'goodsclassify/spacetype': {
    name: '空间分类列表',
    breadcrumb: [['商品管理', '/goodsclassify/spacetype']],
    power: 'dpjia_spacetype.view'
  },
  'goodsclassify/newspace': {
    name: '新增空间分类',
    back: '/goodsclassify/spacetype',
    breadcrumb: [['商品管理', '/goodsclassify/spacetype']],
    power: 'dpjia_spacetype.create'
  },
  'goodsclassify/editspace': {
    name: '编辑空间分类',
    back: '/goodsclassify/spacetype',
    breadcrumb: [['商品管理', '/goodsclassify/spacetype']],
    power: 'dpjia_spacetype.update'
  },
  'goodsclassify/materialtype': {
    name: '材质分类列表',
    breadcrumb: [['商品管理', '/goodsclassify/materialtype']],
    power: 'dpjia_materialtype.view'
  },
  'goodsclassify/newmaterial': {
    name: '新增材质分类',
    back: '/goodsclassify/materialtype',
    breadcrumb: [['商品管理', '/goodsclassify/materialtype']],
    power: 'dpjia_materialtype.create'
  },
  'goodsclassify/editmaterial': {
    name: '编辑材质分类',
    back: '/goodsclassify/materialtype',
    breadcrumb: [['商品管理', '/goodsclassify/materialtype']],
    power: 'dpjia_materialtype.update'
  },
  'goodsclassify/industrytype': {
    name: '行业分类列表',
    breadcrumb: [['商品管理', '/goodsclassify/industrytype']],
    power: 'dpjia_industrytype.view'
  },
  'goodsclassify/newindustry': {
    name: '新增行业分类',
    back: '/goodsclassify/industrytype',
    breadcrumb: [['商品管理', '/goodsclassify/industrytype']],
    power: 'dpjia_industrytype.create'
  },
  'goodsclassify/editindustry': {
    name: '编辑行业分类',
    back: '/goodsclassify/industrytype',
    breadcrumb: [['商品管理', '/goodsclassify/industrytype']],
    power: 'dpjia_industrytype.update'
  },
  'unitmanage/countlist': {
    name: '计数单位列表',
    breadcrumb: [['单位管理', '']],
    power: 'dpjia_countlist.view'
  },
  'unitmanage/newcount': {
    name: '新增计数单位',
    back: '/unitmanage/countlist',
    breadcrumb: [['单位管理', '/unitmanage/countlist']],
    power: 'dpjia_countlist.create'
  },
  'unitmanage/deatilcount': {
    name: '计数单位详情',
    back: '/unitmanage/countlist',
    breadcrumb: [['单位管理', '/unitmanage/countlist']],
    power: 'dpjia_countlist.detail'
  },
  'unitmanage/editcount': {
    name: '编辑计数单位',
    back: '/unitmanage/countlist',
    breadcrumb: [['单位管理', '/unitmanage/countlist']],
    power: 'dpjia_countlist.update'
  },
  'unitmanage/pricelist': {
    name: '计价单位列表',
    breadcrumb: [['单位管理', '']],
    power: 'dpjia_pricelist.view'
  },
  'unitmanage/newprice': {
    name: '新增计价单位',
    back: '/unitmanage/pricelist',
    breadcrumb: [['单位管理', '/unitmanage/pricelist']],
    power: 'dpjia_pricelist.create'
  },
  'unitmanage/detailprice': {
    name: '计价单位详情',
    back: '/unitmanage/pricelist',
    breadcrumb: [['单位管理', '/unitmanage/pricelist']],
    power: 'dpjia_pricelist.detail'
  },
  'unitmanage/editprice': {
    name: '编辑计价单位',
    back: '/unitmanage/pricelist',
    breadcrumb: [['单位管理', '/unitmanage/pricelist']],
    power: 'dpjia_pricelist.update'
  },
  'reportmanager/list': {
    name: '报备列表',
    breadcrumb: [['报备管理', '/reportmanager/list']],
    power: 'dpjia_reportlist.view'
  },
  'reportmanager/detail': {
    name: '报备详情',
    back: '/reportmanager/list',
    breadcrumb: [['报备管理', '/reportmanager/list']],
    power: 'dpjia_reportlist.detail'
  },
  'parts/commonlist': {
    name: '普通零部件列表',
    breadcrumb: [['零部件管理', '/parts/commonlist']],
    power: 'dpjia_commonpart.view'
  },
  'partsclassify/commonclassify': {
    name: '普通零部件分类',
    breadcrumb: [['分类管理', '/partsclassify/commonclassify']],
    power: 'dpjia_commonclassify.view'
  },
  'parts/wardrobelist': {
    name: '衣柜零部件列表',
    breadcrumb: [['零部件管理', '/parts/wardrobelist']],
    power: 'dpjia_wardrobepart.view'
  },
  'partsclassify/wardrobeclassify': {
    name: '衣柜零部件分类',
    breadcrumb: [['分类管理', '/partsclassify/wardrobeclassify']],
    power: 'dpjia_wardrobeclassify.view'
  },
  'parts/hardwarelist': {
    name: '五金零部件列表',
    breadcrumb: [['零部件管理', '/parts/hardwarelist']],
    power: 'dpjia_hardwarepart.view'
  },
  'partsclassify/hardwareclassify': {
    name: '五金零部件分类',
    breadcrumb: [['分类管理', '/partsclassify/hardwareclassify']],
    power: 'dpjia_hardwareclassify.view'
  },
  'parts/tableslist': {
    name: '桌台零部件列表',
    breadcrumb: [['零部件管理', '/parts/tableslist']],
    power: 'dpjia_tablespart.view'
  },
  'partsclassify/tableclassify': {
    name: '桌台零部件分类',
    breadcrumb: [['分类管理', '/partsclassify/tableclassify']],
    power: 'dpjia_tableclassify.view'
  },
  'material/materiallist': {
    name: '原料列表',
    breadcrumb: [['原料管理', '/material/materiallist']],
    power: 'dpjia_materiallist.view'
  },
  'material/materialclassify': {
    name: '原料分类',
    breadcrumb: [['原料分类', '/material/materialclassify']],
    power: 'dpjia_materiallist.view'
  },
  'production/basicsetting': {
    name: '基本配置',
    breadcrumb: [['产品分类配置']],
    power: 'dpjia_metope.view'
  },
  'production/list': {
    name: '产品列表',
    breadcrumb: [['产品列表']],
    power: 'dpjia_metope.view'
  },
  'production/publiclist': {
    name: '公共产品列表',
    breadcrumb: [['产品列表']],
    power: 'dpjia_metope.view'
  },
  'arkboard/list': {
    name: '板件样式列表',
    breadcrumb: [['柜体工艺管理', '/arkboard/list']],
    power: 'dpjia_arkboard.view'
  },
  'arksealing/list': {
    name: '封边工艺列表',
    breadcrumb: [['柜体工艺管理', '/arksealing/list']],
    power: 'dpjia_arksealing.view'
  },
  'arkhardware/list': {
    name: '五金孔位列表',
    breadcrumb: [['柜体工艺管理', '/arkhardware/list']],
    power: 'dpjia_arkhardware.view'
  },
  'arkhardware/new': {
    name: '新增五金孔位',
    back: '/arkhardware/list',
    breadcrumb: [['柜体工艺管理', '/arkhardware/list']],
    power: 'dpjia_arkhardware.create'
  },
  'arkhardware/edit': {
    name: '编辑五金孔位',
    back: '/arkhardware/list',
    breadcrumb: [['柜体工艺管理', '/arkhardware/list']],
    power: 'dpjia_arkhardware.update'
  },
  'arklinkstyle/list': {
    name: '连接件布置方案列表',
    breadcrumb: [['柜体工艺管理', '/arklinkstyle/list']],
    power: 'dpjia_arklinkstyle.view'
  },
  'arklinkstyle/new': {
    name: '新增连接件布置方案',
    back: '/arklinkstyle/list',
    breadcrumb: [['柜体工艺管理', '/arklinkstyle/list']],
    power: 'dpjia_arklinkstyle.create'
  },
  'arklinkstyle/edit': {
    name: '编辑连接件布置方案',
    back: '/arklinkstyle/list',
    breadcrumb: [['柜体工艺管理', '/arklinkstyle/list']],
    power: 'dpjia_arklinkstyle.update'
  },
  'arkpunchstyle/list': {
    name: '打孔工艺列表',
    breadcrumb: [['柜体工艺管理', '/arkpunchstyle/list']],
    power: 'dpjia_arkpunchstyle.view'
  },
  'arkpunchstyle/new': {
    name: '新增打孔工艺',
    back: '/arkpunchstyle/list',
    breadcrumb: [['柜体工艺管理', '/arkpunchstyle/list']],
    power: 'dpjia_arkpunchstyle.create'
  },
  'arkpunchstyle/edit': {
    name: '编辑打孔工艺',
    back: '/arkpunchstyle/list',
    breadcrumb: [['柜体工艺管理', '/arkpunchstyle/list']],
    power: 'dpjia_arkpunchstyle.update'
  },
  'tabletechnology/list': {
    name: '板件样式列表',
    breadcrumb: [['桌台工艺管理', '/tabletechnology/list']],
    power: 'dpjia_tabletechnology.view'
  },
  'tabletechnology/new': {
    name: '新增板件样式',
    back: '/tabletechnology/list',
    breadcrumb: [['桌台工艺管理', '/tabletechnology/list']],
    power: 'dpjia_tabletechnology.create'
  },
  'tabletechnology/edit': {
    name: '编辑板件样式',
    back: '/tabletechnology/list',
    breadcrumb: [['桌台工艺管理', '/tabletechnology/list']],
    power: 'dpjia_tabletechnology.update'
  },
  'producttemp/list': {
    name: '产品模板列表',
    breadcrumb: [['桌台工艺管理', '/producttemp/list']],
    power: 'dpjia_producttemp.view'
  },
  'producttemp/new': {
    name: '新增产品模板',
    back: '/producttemp/list',
    breadcrumb: [['桌台工艺管理', '/producttemp/list']],
    power: 'dpjia_producttemp.create'
  },
  'producttemp/edit': {
    name: '编辑产品模板',
    back: '/producttemp/list',
    breadcrumb: [['桌台工艺管理', '/producttemp/list']],
    power: 'dpjia_producttemp.update'
  }
}
