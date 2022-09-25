// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const appid = 'wx620ee7d27787b0e0';
const appsecret = '3fb183e4abd9f9125a0fb7d4253f701a';

// 获取 access_token 值
let tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + appsecret;
// 文本内容检测接口
let checkUrl = 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' ;

// 云函数入口函数
exports.main = async (event, context) => {
  let tokenResponse = await got(tokenUrl); // 通过 got 请求 api
  let token = JSON.parse(tokenResponse.body).access_token; // JSON.parse 将数据转换成对象获取到具体 access_token 值
  console.info("event.text== "+ event.text);
  // 文本内容检测接口拼接 access_token 值, JSON.stringIfy 将值转换成 JSON 字符串
  let checkResponse;
  try {
    checkResponse = await got(checkUrl + token, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'accept':'json',
        'accept-encoding':''
      },
      body: JSON.stringify({
        content: event.text
      })
    });
  } catch (err) {
    console.log(err)
  }
  return checkResponse.body
}