
const {
  tunnel
} = require('../qcloud')
const { mysql } = require('../qcloud')

const debug = require('debug')('koa-weapp-demo')

var CHAT_MESSAGE = '1'
/**
 * 这里实现一个简单的聊天室
 * userMap 为 tunnelId 和 用户信息的映射
 * 实际使用请使用数据库存储
 */
const userMap = {}

const uidMap = {}

// 保存 当前已连接的 WebSocket 信道ID列表
const connectedTunnelIds = []

/**
 * 调用 tunnel.broadcast() 进行广播
 * @param  {String} type    消息类型
 * @param  {String} content 消息内容
 */

const $broadcast = async (type, content) => {
  if (!(content['word']['to'] in uidMap)) {
    //toDo : 接送方不在线时的处理
    console.log('target is not online')
    try{
      await mysql('messageHistory').insert({
        fromUid: content['word']['from'],
        toUid: content['word']['to'],
        content: JSON.stringify(content)
      })
    }catch(e){
      console.log(e)
      ctx.body = {
        code: -1,
        data: 'failed' + e.sqlMessage
      }
      return
    }
    

    return
  }

  //尝试3次发送，如果仍然失败则清理信道
  for (i = 0; i < 3; ++i) {
    var invalidTunnelIds = []

    tunnel.broadcast([uidMap[content['word']['to']]], type, content)
      .then(result => {
        invalidTunnelIds = result.data && result.data.invalidTunnelIds || []
      })

    if (!invalidTunnelIds.length) {
      break
    } else {
      console.log('检测到无效的信道 IDs =>', invalidTunnelIds)

      // 从 uidMap,userMap 和 connectedTunnelIds 中将无效的信道记录移除
      invalidTunnelIds.forEach(tunnelId => {
        delete uidMap[userMap[tunnelId].openId]
        delete userMap[tunnelId]

        const index = connectedTunnelIds.indexOf(tunnelId)
        if (~index) {
          connectedTunnelIds.splice(index, 1)
        }
      })
    }

  }


}

/**
 * 调用 TunnelService.closeTunnel() 关闭信道
 * @param  {String} tunnelId 信道ID
 */
const $close = (tunnelId) => {

  tunnel.closeTunnel(tunnelId)

}

/**
 * 实现 onConnect 方法
 * 在客户端成功连接 WebSocket 信道服务之后会调用该方法，
 * 此时通知所有其它在线的用户当前总人数以及刚加入的用户是谁
 */



async function onConnect(tunnelId) {
  console.log(`[onConnect] =>`, {
    tunnelId
  })

  if (tunnelId in userMap) {
    connectedTunnelIds.push(tunnelId)

    $broadcast('people', {
      'total': connectedTunnelIds.length,
      'enter': userMap[tunnelId]
    })

    try{
      msgs = await mysql('messageHistory').select().where({ 'isSent': 0, 'toUid': userMap[tunnelId].openId })
      await mysql('messageHistory').where({ 'isSent': 0, 'toUid': userMap[tunnelId].openId }).del()
      for (var n in msgs) {
        $broadcast('speak', JSON.parse(msgs[n]['content']))
      }

    }catch(e){
      console.log(e)
      ctx.body = {
        code: -1,
        data: 'failed' + e.sqlMessage
      }
      return
    }


  } else {
    console.log(`Unknown tunnelId(${tunnelId}) was connectd, close it`)
    $close(tunnelId)
  }

}

/**
 * 实现 onMessage 方法
 * 客户端推送消息到 WebSocket 信道服务器上后，会调用该方法，此时可以处理信道的消息。
 * 在本示例，我们处理 `speak` 类型的消息，该消息表示有用户发言。
 * 我们把这个发言的信息广播到所有在线的 WebSocket 信道上
 */

async function onMessage(tunnelId, type, content) {
  console.log(`[onMessage] =>`, {
    tunnelId,
    type,
    content
  })

  switch (type) {
    case 'speak':
      if (tunnelId in userMap) {
        if (content.word['isGroup']) {
          var uuid = content.word['from']
          content.word['from'] = content.word['to']
          
          try {
            var chatMems = await mysql('userAct').select('uid').where('aid', content.word['to'])
            for (var n in chatMems) {
              if (chatMems[n]['uid'] != uuid)
              content.word['to'] = chatMems[n]['uid']
              $broadcast('speak', {
                'who': userMap[tunnelId],
                'word': content.word
              })
            }
          }catch(e){
            console.log(e)
            ctx.body = {
              code: -1,
              data: 'failed' + e.sqlMessage
            }
            return
          }

        }
        else{
          $broadcast('speak', {
            'who': userMap[tunnelId],
            'word': content.word
          })
        }
        
      } else {
        $close(tunnelId)
      }
      break

    default:
      break
  }

}

/**
 * 实现 onClose 方法
 * 客户端关闭 WebSocket 信道或者被信道服务器判断为已断开后，
 * 会调用该方法，此时可以进行清理及通知操作
 */

function onClose(tunnelId) {
  console.log(`[onClose] =>`, {
    tunnelId
  })

  if (!(tunnelId in userMap)) {
    console.log(`[onClose][Invalid TunnelId]=>`, tunnelId)
    $close(tunnelId)
    return
  }

  const leaveUser = userMap[tunnelId]
  delete userMap[tunnelId]

  const index = connectedTunnelIds.indexOf(tunnelId)
  if (~index) {
    connectedTunnelIds.splice(index, 1)
  }

  // 聊天室没有人了（即无信道ID）不再需要广播消息
  if (connectedTunnelIds.length > 0) {
    $broadcast('people', {
      'total': connectedTunnelIds.length,
      'leave': leaveUser
    })
  }
}

module.exports = {
  // 小程序请求 websocket 地址
  get: async ctx => {
    const data = await tunnel.getTunnelUrl(ctx.req)
    const tunnelInfo = data.tunnel

    userMap[tunnelInfo.tunnelId] = data.userinfo
    uidMap[data.userinfo.openId] = tunnelInfo.tunnelId

    ctx.state.data = tunnelInfo
  },

  // 信道将信息传输过来的时候
  post: async ctx => {
    const packet = await tunnel.onTunnelMessage(ctx.request.body)

    debug('Tunnel recive a package: %o', packet)

    switch (packet.type) {
      case 'connect':
        onConnect(packet.tunnelId)
        break
      case 'message':
        onMessage(packet.tunnelId, packet.content.messageType, packet.content.messageContent)
        break
      case 'close':
        onClose(packet.tunnelId)
        break
    }
  }
}

//flag
