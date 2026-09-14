// AI 流式对话传输层
// 职责：只负责发起/解析/中止 SSE 请求，通过回调向外吐数据
// 不依赖任何 Vue 响应式状态，也不弹任何 UI 提示
import { fetchEventSource, EventStreamContentType } from '@microsoft/fetch-event-source'

// 该版本(2.0.1)的 ESM 构建未导出 FatalError，自行定义：
// 库的机制是 onerror 中只要抛出错误就停止自动重连，自定义子类效果等价
class FatalError extends Error {
  constructor(message) {
    super(message)
    this.name = 'FatalError'
  }
}

const STREAM_URL = '/api/psychological-chat/stream'

/**
 * 发起 AI 流式对话
 * @param {Object} options
 * @param {string} options.sessionId 会话 ID
 * @param {string} options.message 用户本次发送的消息
 * @param {AbortSignal} [options.signal] 外部中止信号（组件卸载/切换会话时传入）
 * @param {(delta: string) => void} [options.onChunk] 每收到一段 AI 文本
 * @param {() => void} [options.onDone] 流式正常结束（收到 done 事件或服务端关闭连接）
 * @param {(message: string) => void} [options.onError] 发生业务或网络错误（消息已格式化为字符串）
 * @returns {Promise<void>} 流结束（正常/失败/中止）后 resolve，不会 reject
 */
export const streamChat = ({ sessionId, message, signal, onChunk, onDone, onError }) => {
  // 内部 controller：abort 它会让 fetch-event-source 静默 resolve（不触发 onerror）
  const controller = new AbortController()
  if (signal) {
    if (signal.aborted) {
      controller.abort()
    } else {
      signal.addEventListener('abort', () => controller.abort(), { once: true })
    }
  }

  // 标记流是否已正常结束，避免结束动作被误判为错误
  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    controller.abort()
    onDone?.()
  }

  return fetchEventSource(STREAM_URL, {
    method: 'POST',
    openWhenHidden: false, // 页面隐藏时暂停，回到页面时由库自动重连
    headers: {
      'Content-Type': 'application/json',
      Accept: EventStreamContentType,
      Token: localStorage.getItem('token') || '',
    },
    body: JSON.stringify({ sessionId, message }),
    signal: controller.signal,
    async onopen(response) {
      if (!response.ok) {
        throw new FatalError(`服务连接失败（HTTP ${response.status}）`)
      }
      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes(EventStreamContentType)) {
        // 不抛普通 Error：必须抛 FatalError 才能阻止库自动重连
        throw new FatalError('服务器返回格式错误，请稍后重试')
      }
    },
    onmessage(event) {
      const raw = event.data?.trim()
      if (!raw) return // 过滤 SSE 心跳/空行

      if (event.event === 'done') {
        finish()
        return
      }

      let payload
      try {
        payload = JSON.parse(raw)
      } catch {
        // 单个坏分片直接跳过，不让整条流崩溃
        return
      }

      if (String(payload.code) === '200') {
        if (payload.data?.content) {
          onChunk?.(payload.data.content)
        }
      } else {
        // 业务错误：抛 FatalError 交给 onerror 统一处理并停止重连
        throw new FatalError(payload.message || 'AI回复失败')
      }
    },
    onclose() {
      // 服务端未发 done 就关闭连接时，兜底按正常结束处理
      finish()
    },
    onerror(err) {
      // 正常结束（done/onclose）或主动中止引发的错误：静默停止，不重连、不提示
      if (finished || controller.signal.aborted) {
        throw new FatalError()
      }
      const errMsg =
        err instanceof FatalError
          ? err.message
          : err?.message || '网络连接中断，请重试'
      onError?.(errMsg)
      // 关键：重新抛出以阻止库自动重连（POST 重连会导致重复提问）
      throw new FatalError(errMsg)
    },
  }).catch((err) => {
    // FatalError 是我们主动停止重连的信号，onerror 中已通知过，这里吞掉
    if (err instanceof FatalError) return
    onError?.(err?.message || 'AI助手处理失败')
  })
}
