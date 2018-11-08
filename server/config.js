const CONF = {
  port: '5757',
  rootPathname: '',

  // 微信小程序 App ID
  appId: 'wx9564c30c15e103a2',

  // 微信小程序 App Secret
  appSecret: '0c9dcaf86179c6f4a616f11db297bd18',

  qcloudAppId: '1257207887',
  qcloudSecretId: 'AKIDUpyVSG5JYbR4mIE0GCxAHE0jmqiXv4zp',
  qcloudSecretKey: '890vlPrNhqowxmaDetxvhU5Wn3LZcUAi',
  // 是否使用腾讯云代理登录小程序
  useQcloudLogin: false,

  /**
   * MySQL 配置，用来存储 session 和用户信息
   * 若使用了腾讯云微信小程序解决方案
   * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
   */
  mysql: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    db: 'cAuth',
    pass: 'wx9564c30c15e103a2',
    char: 'utf8mb4'
  },

  cos: {
    /**
     * 地区简称
     * @查看 https://cloud.tencent.com/document/product/436/6224
     */
    region: 'ap-chengdu',
    // Bucket 名称
    fileBucket: 'uestc0510',
    // 文件夹
    uploadFolder: ''
  },

  // 微信登录态有效期
  wxLoginExpires: 7200,
  wxMessageToken: 'abcdefgh',
  qcloudAppId: '1257207887',
  qcloudSecretId: 'AKIDUpyVSG5JYbR4mIE0GCxAHE0jmqiXv4zp',
  qcloudSecretKey: '890vlPrNhqowxmaDetxvhU5Wn3LZcUAi',

  //信道服务器
  serverHost: '1qz2ek2e.qcloud.la',
  tunnelServerUrl: "http://120.77.81.121",
  tunnelSignatureKey:'abcdefg'
}

module.exports = CONF