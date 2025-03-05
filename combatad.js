/*************************************

 项目名称：Combat Master-去广告
 下载地址：appstore正版/iosgod破解版
 脚本作者：wood911
 使用声明：⚠️仅供参考，🈲转载与售卖！

 **************************************

 [rewrite_local]
 ^https?:\/\/eafe8\.playfabapi\.com\/Client\/GetTitleData url script-response-body https://raw.githubusercontent.com/wood911/Advertising/main/combatad.js
 [mitm]
 hostname =eafe8.playfabapi.com

 *************************************/
let body = $response.body;
const data = JSON.parse(body);

// 控制广告的接口路径
const adPath = 'GetTitleData';

// 检查当前请求的URL
const currentURL = $request.url;
// 检查需要修改响应的条件
if (currentURL.includes(adPath)) {
    data.data.Data.EnableAdsAfterMatch = "0";
}

body = JSON.stringify(data);
$done({body});
