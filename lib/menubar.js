module.exports = [

  {
    name: '设计管理',
    menus: [
      {
        name: '建材管理',
        icon: 'fa-dropbox',
        controllar: ['metope'],
        subs: [
          {
            name: '墙面管理',
            href: '/metope/list',
            power: 'dpjia_metope.view'
          }
        ]
      },
      {
        name: '工位模板列表',
        icon: 'fa-dropbox',
        controllar: ['workstationlist'],
        subs: [
          {
            name: '工位模板列表',
            href: '/workstationlist/list',
            power: 'dpjia_workstation.view'
          }
        ]
      },
      {
        name: '模型管理',
        icon: 'fa-bank',
        controllar: ['model'],
        subs: [
          {
            name: '模型列表',
            href: '/model/list',
            power: 'dpjia_metope.view'
          }
        ]
      }
    ]
  },
  {
    name: '工艺管理',
    menus: [
      {
        name: '柜体工艺管理',
        icon: 'fa-magic',
        controllar: ['arkboard', 'arksealing', 'arkhardware', 'arklinkstyle', 'arkpunchstyle'],
        subs: [
          {
            name: '板件样式',
            href: '/arkboard/list',
            power: 'dpjia_arkboard.view'
          },
          {
            name: '封边工艺',
            href: '/arksealing/list',
            power: 'dpjia_arksealing.view'
          },
          {
            name: '五金孔位',
            href: '/arkhardware/list',
            power: 'dpjia_arkhardware.view'
          },
          {
            name: '连接件布置方案',
            href: '/arklinkstyle/list',
            power: 'dpjia_arklinkstyle.view'
          },
          {
            name: '打孔工艺',
            href: '/arkpunchstyle/list',
            power: 'dpjia_arkpunchstyle.view'
          }
        ]
      },
      {
        name: '桌台工艺管理',
        icon: 'fa-magic',
        controllar: ['tabletechnology', 'producttemp'],
        subs: [
          {
            name: '板件样式',
            href: '/tabletechnology/list',
            power: 'dpjia_tabletechnology.view'
          },
          {
            name: '产品模板',
            href: '/producttemp/list',
            power: 'dpjia_producttemp.view'
          }
        ]
      }
    ]
  },
  {
    name: '售前管理',
    menus: [
      {
        name: '项目报备',
        icon: 'fa-file',
        controllar: ['reportmanager'],
        subs: [
          {
            name: '报备列表',
            href: '/reportmanager/list',
            power: 'dpjia_reportlist.view'
          }
        ]
      }
    ]
  },
  {
    name: '销售管理',
    menus: [
      {
        name: '商品管理',
        icon: 'fa-shopping-bag',
        controllar: ['brand', 'series', 'goodsclassify', 'goods'],
        subs: [
          {
            name: '品牌列表',
            href: '/brand/list',
            power: 'dpjia_brandlist.view'
          },
          {
            name: '系列列表',
            href: '/series/list',
            power: 'dpjia_serieslist.view'
          },
          {
            name: '商品列表',
            href: '/goods/list',
            power: 'dpjia_goodslist.view'
          },
          {
            name: '分类列表',
            href: '/goodsclassify/goodstype',
            power: 'dpjia_goodstype.view'
          }
        ]
      },
      {
        name: '单位管理',
        icon: 'fa-newspaper-o',
        controllar: ['unitmanage'],
        subs: [
          {
            name: '计数单位列表',
            href: '/unitmanage/countlist',
            power: 'dpjia_countlist.view'
          },
          {
            name: '计价单位列表',
            href: '/unitmanage/pricelist',
            power: 'dpjia_metope.view'
          }
        ]
      }
    ]
  },
  {
    name: '研发管理',
    menus: [
      {
        name: '产品管理',
        icon: 'fa-cog',
        controllar: ['production'],
        subs: [
          {
            name: '基本配置',
            href: '/production/basicsetting',
            power: 'dpjia_metope.view'
          },
          {
            name: '产品列表',
            href: '/production/list',
            power: 'dpjia_metope.view'
          }
        ]
      },
      {
        name: '零部件管理',
        icon: 'fa-cogs',
        controllar: ['parts', 'partsclassify'],
        subs: [
          {
            name: '零部件列表',
            href: '/parts/commonlist',
            power: 'dpjia_commonpart.view'
          },
          {
            name: '分类管理',
            href: '/partsclassify/commonclassify',
            power: 'dpjia_commonclassify.view'
          }
        ]
      }
    ]
  },
  {
    name: '消息',
    menus: [
      {
        name: '消息设置',
        icon: 'fa-cog',
        controllar: ['production'],
        subs: [
          {
            name: '电子邮件',
            href: '/production/basicsetting',
            power: 'dpjia_metope.view'
          },
          {
            name: '手机短信',
            href: '/production/list',
            power: 'dpjia_metope.view'
          }
        ]
      },
      {
        name: '消息管理',
        icon: 'fa-cogs',
        controllar: ['messagemanager'],
        subs: [
          {
            name: '收信箱',
            href: '/messagemanager/mailinbox',
            power: 'dpjia_mailinbox.view'
          },
          {
            name: '推送管理',
            href: '/messagemanager/pushmanager',
            power: 'dpjia_pushmanager.view'
          },
          {
            name: '事件管理',
            href: '/messagemanager/eventmanager',
            power: 'dpjia_eventmanager.view'
          }
        ]
      }
    ]
  },
  {
    name: '生产管理',
    menus: [
      {
        name: '原料管理',
        icon: 'fa-cog',
        controllar: ['material'],
        subs: [
          {
            name: '原料列表',
            href: '/material/materiallist',
            power: 'dpjia_materiallist.view'
          },
          {
            name: '原料分类',
            href: '/material/materialclassify',
            power: 'dpjia_materialcag.view'
          },
          {
            name: '原料贴图管理',
            href: '/material/materialtexture',
            power: 'dpjia_materialtexture.view'
          }
        ]
      }
    ]
  }
]
