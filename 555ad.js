/*************************************

项目名称：555电影-去广告
下载地址：https://555dyy.top
脚本作者：chxm1023
电报频道：https://t.me/chxm1023
使用声明：⚠️仅供参考，🈲转载与售卖！

**************************************

[rewrite_local]
^https?:\/\/vpic\.cms\.qq\.com\/nj_vpic\/.+ url reject
^https?:\/\/a\.weilai555\.com:1000\/api\/v\d\/movie\/(index_recommend.+|detail) url script-response-body https://raw.githubusercontent.com/chxm1023/Advertising/main/555ad.js

[mitm]
hostname = a.weilai555.com, vpic.cms.qq.com

*************************************/


var chxm1023 = $response.body.replace(/\"layout":"advert_self"/g, '\"layout":"chxm1023"').replace(/\"recommendList"/g, '\"chxm1023"');$done(chxm1023);
