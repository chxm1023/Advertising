var ddm = JSON.parse($response.body);

// ===== URL 全量清空规则 =====
const fullClearRules = /(top_notice|version)/;
if (fullClearRules.test($request.url)) {
  ddm = {};
  $done({ body: JSON.stringify(ddm) });
  return;
}

// ===== 精确匹配/多值数组匹配规则 =====
const keywords = {
  // 精确匹配空字符串
  "sub_title": "",

  // 数组匹配
  "keyName": [
    "config.main.dialog",
    "config.ad.setting",
    "config.ad.popup" ],
  "type": [
    "ads",
    "ad",
    "advert"
  ],
  "layout": [
    "advert_self",
    "banner_ad",
    "feed_ad"
  ]
};

// ===== 正则匹配规则 =====
const regexRules = {
  "type": /ad|advert|推广|广告/i, // 匹配广告相关字段值
  "module": /^ad_/i, // 匹配模块名
  "slot": /(splash|开屏)/i // 匹配开屏相关
};

// ===== 字段改值/禁用广告 =====
const kvlist = {
  "is_auth": 1,
  "try_see": 1,
  "is_subscribe": 1,
  "switch": 0,
  "google": 0,
  "adtype": 0,
  "mian_ad": 0,
  "main_ad": 0,
  "splash_img": "",
  "config_vip_advert": "0",
  "advert_sdk_open": "0",
  "config_support_reward_id": "",
  "config_video_start_day_num": "0",
  "advert_sdk_app_id": "",
  "config_index_alert": "0",
  "startad": false,
  "slideshowad": false,
  "popad": false,
  "btnad": false,
  "excitationAd": "0",
  "is_top": 0,
  "Ad": "0",
  "ad": false,
  "ads": [],
  "AdId": "",
  "adid": "",
  "videoAdId": "",
  "listAdId": "",
  "interstitialAdId": "",
  "detailAd": 0,
  "fr_videp_if": "0",
  "fr_video_if": "0",
  "isbuy": 0,
  "islock": 0,
  "price": 0,
  "download_price": 0,
  "showAd": 0,
  "adRead": false,
  "adSwitch": false,
  "jiliAd": ""
};

// ===== 清空指定字段 =====
const fieldsToClear = [
  "quad",
  "upgradenew"
];

// ===== 特殊项目处理配置，可扩展 =====
const specialHandlers = [
  {
    name: "置顶公告",
    match: obj => obj?.msg === "置顶公告" && obj.data,
    action: obj => null // 返回 null 表示删除该对象
  },
  {
    name: "首页横幅 banners",
    match: obj => obj?.msg === "首页推荐" && Array.isArray(obj.data?.banners),
    action: obj => { obj.data.banners = []; return obj; } // 清空横幅数组
  }
  // 后续可添加新的特殊项目
];

// ====== 判断是否命中精确/数组匹配规则 =====
function matchKeywordRule(item) {
  if (typeof item !== "object" || item === null) return false;
  return Object.keys(item).some(key => {
    if (!(key in keywords)) return false;
    const rule = keywords[key];
    if (Array.isArray(rule)) return rule.includes(item[key]); // 数组匹配
    return item[key] === rule; // 单值匹配
  });
}

// ===== 判断是否命中正则规则 =====
function matchRegexRule(item) {
  if (typeof item !== "object" || item === null) return false;
  return Object.keys(item).some(key => {
    if (!(key in regexRules)) return false;
    const reg = regexRules[key];
    if (typeof item[key] === "string" || typeof item[key] === "number") {
      return reg.test(String(item[key]));
    }
    return false;
  });
}

// ===== 特殊项目处理 =====
function handleSpecial(obj) {
  for (const handler of specialHandlers) {
    if (handler.match(obj)) {
      return handler.action(obj);
    }
  }
  return obj;
}

// ===== 主递归处理函数 =====
function filterAndModify(obj) {
  if (Array.isArray(obj)) {
    return obj
      .map(filterAndModify)
      .filter(item => item !== null); // specialHandler返回null的对象删除
  } else if (typeof obj === "object" && obj !== null) {
    // 先处理特殊项目
    obj = handleSpecial(obj);
    if (!obj) return null;
    for (const key in obj) {
      // 清空指定字段
      if (fieldsToClear.includes(key)) {
        obj[key] = {};
        continue;
      }
      // 命中精确匹配/正则匹配 → 删除字段
      if (matchKeywordRule(obj[key]) || matchRegexRule(obj[key])) {
        delete obj[key];
        continue;
      }
      // 递归处理
      if (typeof obj[key] === "object" && obj[key] !== null) {
        obj[key] = filterAndModify(obj[key]);
        continue;
      }
      // 强制改值字段
      if (key in kvlist) {
        obj[key] = kvlist[key];
      }
    }
    return obj;
  }
  return obj;
}

ddm = filterAndModify(ddm);

$done({ body: JSON.stringify(ddm) });