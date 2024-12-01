import React, { ReactNode, useContext, createContext, useCallback, useRef, useState } from 'react';
import { WebSocketModel, WebsocketEnum } from '@/shared/model';
// Khai báo đường dẫn cho WebSocket, đảm bảo nó được định nghĩa đúng
import { WebSocketUrl } from "@/public/app-setting";
import { AuthService } from '@/shared/services';

interface WebSocketContextType {
  connect: (userId: string) => void;
  disconnect: () => void;
  resetMessage: () => void;
  sendMessage: (data: WebSocketModel) => void;
  cancelView: (data: WebSocketModel) => void;
  getMessage: () => WebSocketModel | null; // có cả tin nhắn và thông báo
  getContact: () => WebSocketModel | null;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

// Thêm kiểu cho props của WebSocketProvider
export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const websocketService = useProvideWebSocket();
  return <WebSocketContext.Provider value={websocketService}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

function useProvideWebSocket(): WebSocketContextType {
  const websocketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<WebSocketModel | null>(null);
  const [contact, setContact] = useState<WebSocketModel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // lấy token
  const { getOauth } = AuthService();
  const oauth = getOauth() || {};

  const connect = useCallback((userId: string) => {
    if (!userId || websocketRef.current) return;
    const socket = new WebSocket(`${WebSocketUrl}/ws/chat/connect/${userId}?token=${oauth.access_token}`);
    websocketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };
    socket.onmessage = event => {
      const message: WebSocketModel = JSON.parse(event.data);
      if (message.type === WebsocketEnum.contact) {
        setContact(message);
      }
      else {
        setMessages(message);
      }
      // console.log("Tin nhắn đã nhận lúc: " + message.sentAt, message);
    };
    socket.onerror = event => {
      console.error('WebSocket Error:', event);
      setIsConnected(false);
    };
    socket.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
      websocketRef.current = null;
    };
  }, [isConnected]);

  const disconnect = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
  }, []);

  // gửi dữ liệu sang cho người nhận
  const sendMessage = useCallback((data: WebSocketModel) => {
    if (data && websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      try {
        websocketRef.current.send(JSON.stringify(data));
      } catch (error) {
        console.error("Error serializing object: ", data);
        throw error;
      }

    }
  }, []);

  // hủy lượt view nhận khi người gửi soạn tin gửi lại tin nhắn cho người nhận
  const cancelView = useCallback((data: WebSocketModel) => {
    if (data && websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {

      try {
        data.type = WebsocketEnum.contact;
        data.sentAt = new Date();
        websocketRef.current.send(JSON.stringify(data));
      } catch (error) {
        console.error("Error serializing object: ", data);
        throw error;
      }
    }
  }, []);

  // dùng để đặt message về mặc định
  const resetMessage = useCallback(() => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      setMessages(null);
      setContact(null);
    }
  }, []);

  const getMessage = useCallback((): (WebSocketModel | null) => {
    if (messages?.type === WebsocketEnum.chat || messages?.type === WebsocketEnum.notify) {
      return messages;
    }
    return null;
  }, [messages]);

  const getContact = useCallback((): (WebSocketModel | null) => {
    return contact;
  }, [contact]);

  return { connect, disconnect, resetMessage, sendMessage, cancelView, getMessage, getContact };
}