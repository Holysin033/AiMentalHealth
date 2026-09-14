// AI 流式对话组合式函数
// 职责：管理聊天消息列表、AI 输入状态、流式生命周期与错误处理
// 组件只负责业务编排（发消息、切换会话），可在前端/后台咨询页复用
import { ref, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { streamChat } from '@/api/chatStream'

// 生成消息唯一 ID：前缀 + 时间戳 + 随机串，避免连续发送时 key 冲突
const createMessageId = (prefix) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

export function useChatStream() {
  // 消息列表：{ id, senderType(1用户/2AI), content, createdAt, isStreaming, isError }
  const messages = ref([])
  // AI 是否正在回复
  const isAiTyping = ref(false)

  // 当前流的中止控制器与流式消息 ID（用 id 定位，不再依赖"数组最后一项"）
  let controller = null
  let streamingId = null

  const findStreamingMessage = () =>
    messages.value.find((m) => m.id === streamingId)

  // 追加一条用户消息
  const appendUserMessage = (content) => {
    messages.value.push({
      id: createMessageId('u'),
      senderType: 1,
      content,
      createdAt: new Date().toISOString(),
    })
  }

  // 用历史消息整体替换列表（切换会话时使用）
  const setMessages = (list) => {
    messages.value = Array.isArray(list) ? list : []
  }

  // 错误处理：标记当前 AI 气泡为错误态，恢复输入并提示
  const handleError = (errMsg = 'AI回复失败，请重试') => {
    const target = findStreamingMessage()
    if (target) {
      target.isStreaming = false
      target.isError = true
      target.content = errMsg
    }
    isAiTyping.value = false
    streamingId = null
    controller = null
    ElMessage.error(errMsg)
  }

  // 开启一次流式回复（sessionId/message 均为普通字符串）
  const startAiResponse = (sessionId, message) => {
    // 防止重复发送
    if (isAiTyping.value) {
      ElMessage.warning('AI助手正在处理中，请稍后再发送')
      return
    }
    isAiTyping.value = true

    const aiMessage = {
      id: createMessageId('ai'),
      senderType: 2,
      content: '',
      isStreaming: true,
      isError: false,
      createdAt: new Date().toISOString(),
    }
    messages.value.push(aiMessage)
    streamingId = aiMessage.id

    controller = new AbortController()
    return streamChat({
      sessionId,
      message,
      signal: controller.signal,
      onChunk: (delta) => {
        const target = findStreamingMessage()
        if (target) target.content += delta
      },
      onDone: () => {
        const target = findStreamingMessage()
        if (target) target.isStreaming = false
        isAiTyping.value = false
        streamingId = null
        controller = null
      },
      onError: handleError,
    })
  }

  // 主动中止当前流（切换会话/组件卸载时调用）
  const stopStream = () => {
    controller?.abort()
    controller = null
    const target = findStreamingMessage()
    if (target) target.isStreaming = false
    isAiTyping.value = false
    streamingId = null
  }

  // 组件卸载时自动中断，避免卸载后修改状态/请求泄漏
  onBeforeUnmount(stopStream)

  return {
    messages,
    isAiTyping,
    appendUserMessage,
    setMessages,
    startAiResponse,
    stopStream,
  }
}
