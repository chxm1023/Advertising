/*************************************

项目名称：涩涩视频 —— 去除所有广告
在线观看：https://ssapple.lianfa1.com/
获取地址：kuaiboshipin8568@gmail.com 发送任意内容邮件获取最新下载地址
更新日期：2026-01-11
脚本作者：@ddm1023
电报频道：https://t.me/ddm1023
使用声明：⚠️仅供参考，🈲转载与售卖！

**************************************

[rewrite_local]
^https:\/\/ssapple\.lianfa1\.com\/(?!index\/fire|api|static).* url script-response-body https://raw.githubusercontent.com/chxm1023/Advertising/main/sssp.js

[mitm]
hostname = ssapple.lianfa1.com

*************************************/


var body = $response.body;

// 删除广告合作段落
body = body.replace(/广告合作[\s\S]*?(<\/p>)/g, '$1');

// 删除所有特定广告链接按钮
body = body.replace(/<a[^>]*?href="https?:\/\/[^"]+"[^>]*?data-str="[^"]*"[^>]*?>[\s\S]*?<\/a>/g, '');

// 删除无用滑动和轮播
body = body.replace(/<div class="swiper-slide">[\s\S]*?<\/div>/g, '');
body = body.replace(/<div id="carousel" class="carousel slide" data-ride="carousel">[\s\S]*?(<div class="speaker" style="display: none;">)/g, '$1');

// 删除页面置顶广告
body = body.replace(/<div id="tops">[\s\S]*?(<nav class="navbar navbar-expand navbar-dark bg-dark">)/g, '$1');

// 删除“猜你喜欢”
body = body.replace(/<h3 class="mt-4">猜你喜欢<\/h3>[\s\S]*?(<script type="text\/javascript">)/g, '$1');

// 删除悬浮窗口
body = body.replace(/<div id="float-square"[\s\S]*?(<script>)/g, '$1');

// 去除倒计时
body = body.replace(/<span id="countdown">\d+<\/span> 秒后播放/g, '');

// 删除弹窗广告
body = body.replace(/<div id="popup">[\s\S]*?(<div class="header">)/g, '$1');

// 删除开屏广告
body = body.replace(/<div id="launch">[\s\S]{0,500}<\/div>/g, '');

// 删除多余注释
body = body.replace(/(<!--\s*-->)(\s*\1)+/g, '$1');

// 删除插图广告
body = body.replace(/<div class="col-6 item">[\s\S]{0,10}?<a[^>]*?target="_blank"[^>]*?>[\s\S]{0,300}<\/a>\s*<\/div>/g, '');

$done({ body });