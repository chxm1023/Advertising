/*************************************

项目名称：涩涩视频——去除所有广告
下载地址：https://48478.xyz/
网页在线：https://files.yuchenglw.com
脚本作者：chxm1023
电报频道：https://t.me/chxm1023
使用声明：⚠️仅供参考，🈲转载与售卖！

**************************************

[rewrite_local]
^https:\/\/files\.(yuchenglw|honghufly)\.com url script-response-body https://raw.githubusercontent.com/chxm1023/Advertising/main/sssp.js

[mitm]
hostname = files.*.com

*************************************/


var body=$response.body;

//屏蔽首页广告
body = body.replace(/(<div class="container mt-3">)[\s\S[\d\D]{28,30000}(<div class="banner mt-3">)/g,'<div class="banner mt-3">');

//屏蔽最下方横幅广告
body = body.replace(/(<div class="float-app">)[\s\S[\d\D]{0,500}(<\/div>)/g,'<!--  -->');

//过滤分类里面的跳转广告
body = body.replace(/(<a class="" href="https)[\s\S[\d\D]{0,500}(<!--  -->)/g,'<!chxm1023>');

//过滤分类内的插图
body = body.replace(/(<!chxm1023>)[\s\S[\d\D]{0,10000}(<div class="banner">)/g,'<div class="banner">');

//屏蔽分类，播放，的无用广告
body = body.replace(/(<div class="iconad">)[\s\S[\d\D]{20,5000}(<p>四季体育<\/p>)/g,'<!--  -->');

//屏蔽播放页面下方猜你喜欢
body = body.replace(/(<div class="banner mt-3">)[\s\S[\d\D]{0,20000}(<div class="mt-5 text-center">)/g,'<div class="mt-5 text-center">');

$done({body});
