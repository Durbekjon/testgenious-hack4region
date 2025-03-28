import { io, type Socket } from "socket.io-client"

// Socket events
export const EVENTS = {
  TEST_CREATED: "test:created",
  TEST_PROGRESS: "test:progress",
  CREATE_TEST_BY_FORM: "create:test:by:form",
  CREATE_TEST_BY_BOOK: "create:test:by:book",
  ERROR: "error",
}

let socket: Socket | null = null

export function initSocket(): Socket {
  if (!socket) {
    socket = io("http://localhost:4000", {
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    })

    console.log("Socket initialized")
  }

  return socket
}

export function getSocket(): Socket | null {
  if (!socket) {
    return initSocket()
  }
  return socket
}

export function emitEvent(event: string, data: any): void {
  const socketInstance = getSocket()
  if (socketInstance) {
    console.log(`Emitting event: ${event}`, data)
    socketInstance.emit(event, data)
  } else {
    console.error("Socket not initialized")
  }
}

export function onEvent(event: string, callback: (data: any) => void): () => void {
  const socketInstance = getSocket()
  if (socketInstance) {
    socketInstance.on(event, callback)
    return () => socketInstance.off(event, callback)
  }
  return () => {}
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
    console.log("Socket disconnected")
  }
}

