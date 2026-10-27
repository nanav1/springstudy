import { useCallback, useEffect, useRef, useState } from 'react';
import '../css/Chatting.css';
import chatIcon from '../img/chat-icon.png';
import { serverUrl } from '../common/config';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

function Chatting() {
  const [isVisible, setIsVisible] = useState(true);
  const [sender, setSender] = useState('');
  const [isJoin, setIsJoin] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');

  const refSenderInput = useRef(null);
  const refDialogDiv = useRef(null);
  const refMessageInput = useRef(null);
  const stompClient = useRef(null);
  const senderRef = useRef('');
  const joinedRef = useRef(false);

  // HTTP / HTTPS 서버 주소 정리
const getWebSocketUrl = () => {
  return `${window.location.origin}/ws`;
};

  // 채팅창 표시 / 숨김
  const handleIsVisible = () => {
    setIsVisible(prev => !prev);
  };

  // 수신 메시지 처리
const onMessageReceived = useCallback((payload) => {
    const messageJson = JSON.parse(payload.body);

    setChatHistory(prev => [...prev, messageJson]);
}, []);

  // 채팅방 입장
  const joinChatting = useCallback(() => {
    const nickname = sender.trim();

    if (!nickname) {
      alert('닉네임을 입력하세요.');
      refSenderInput.current?.focus();
      return;
    }

    if (stompClient.current?.active) return;

    senderRef.current = nickname;
    setIsConnecting(true);

    const client = new Client({
      webSocketFactory: () => new SockJS(getWebSocketUrl()),

      // 5초 간격으로 자동 재연결
      reconnectDelay: 5000,

      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      debug: () => {},

      onConnect: () => {
        console.log('채팅 서버 연결 성공');

        setIsConnecting(false);

        client.subscribe(
          '/topic/chatting',
          onMessageReceived
        );

        joinedRef.current = true;
        setIsJoin(true);

        client.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({
            sender: senderRef.current,
            type: 'JOIN'
          })
        });

        refMessageInput.current?.focus();
      },

      onStompError: (frame) => {
        console.error(
          'STOMP 오류:',
          frame.headers?.message,
          frame.body
        );
        setIsConnecting(false);
      },

      onWebSocketError: (error) => {
        console.error('WebSocket 오류:', error);
      },

      onWebSocketClose: () => {
        joinedRef.current = false;
        setIsJoin(false);
        setIsConnecting(false);
      }
    });

    stompClient.current = client;
    client.activate();

  }, [sender, onMessageReceived]);

  // 메시지 전송
  const sendMessage = useCallback((e) => {
    e?.preventDefault();

    const text = message.trim();
    const client = stompClient.current;

    if (!text || !client?.connected || !joinedRef.current) {
      return;
    }

    client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({
        sender: senderRef.current,
        message: text,
        type: 'CHAT'
      })
    });

    setMessage('');
    refMessageInput.current?.focus();

  }, [message]);

  // 채팅방 퇴장
  const leaveChatting = useCallback(async () => {
    const client = stompClient.current;

    if (client) {
      if (client.connected && joinedRef.current) {
        client.publish({
          destination: '/app/chat.leaveUser',
          body: JSON.stringify({
            sender: senderRef.current,
            type: 'LEAVE'
          })
        });
      }

      joinedRef.current = false;
      stompClient.current = null;
      await client.deactivate();
    }

    setIsJoin(false);
    setIsConnecting(false);
    setChatHistory([]);
    setMessage('');

  }, []);

  // 메시지가 추가되면 맨 아래로 스크롤
  useEffect(() => {
    const dialog = refDialogDiv.current;

    if (dialog) {
      dialog.scrollTo({
        top: dialog.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory]);

  // 컴포넌트가 사라질 때 연결 정리
  useEffect(() => {
    return () => {
      const client = stompClient.current;

      if (client) {
        if (client.connected && joinedRef.current) {
          client.publish({
            destination: '/app/chat.leaveUser',
            body: JSON.stringify({
              sender: senderRef.current,
              type: 'LEAVE'
            })
          });
        }

        joinedRef.current = false;
        void client.deactivate();
      }
    };
  }, []);

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          color: '#fff',
          padding: '40px',
          fontSize: '3em',
          top: '250px',
          left: '300px'
        }}
      >
        채팅확인
      </div>

      {/* 채팅 아이콘 */}
      {!isVisible && (
        <img
          src={chatIcon}
          id="chat_icon"
          alt="채팅 열기"
          onClick={handleIsVisible}
        />
      )}

      {/* 채팅 대화상자 */}
      {isVisible && (
        <div id="chat-wrap">
          <div id="chat">
            <div
              className="chat-close"
              onClick={handleIsVisible}
            >
              <strong>닫기</strong>
            </div>
          </div>

          {/* 대화 내용 */}
          <div id="dialog" ref={refDialogDiv}>
            <div className="dialog-board">
                {chatHistory.map((chat, idx) => {

                    // 입장 / 퇴장 메시지
                    if (chat.type === 'JOIN' || chat.type === 'LEAVE') {
                        return (
                            <div key={idx} className="system-message">
                                {chat.message}
                            </div>
                        );
                    }

                    // 일반 채팅 메시지
                    return (
                        <div
                            key={idx}
                            className={chat.sender === sender ? 'me' : 'other'}
                        >
                            <span><b>{chat.sender}</b></span>
                            <span className="date">{chat.createDateTime}</span>
                            <span>{chat.message}</span>
                        </div>
                    );
                })}
            </div>
          </div>

          {/* 닉네임 입력 */}
          <div id="divSender">
            <label>닉네임</label>
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              maxLength={7}
              ref={refSenderInput}
              value={sender}
              disabled={isJoin || isConnecting}
              onChange={e => setSender(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  joinChatting();
                }
              }}
              id="senderInput"
            />

            <input
              type="button"
              value={isConnecting
                ? '연결 중...'
                : isJoin ? '입장 완료' : 'join'}
              id="btnJoin"
              disabled={isJoin || isConnecting}
              onClick={joinChatting}
            />
          </div>

          {/* 채팅 메시지 입력 */}
          <div id="divMessage">
            <label>메시지</label>

            <textarea
              id="messageInput"
              value={message}
              ref={refMessageInput}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => {
                if (
                  e.key === 'Enter' &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  sendMessage(e);
                }
              }}
              disabled={!isJoin}
            />

            <input
              type="button"
              value="send"
              id="btnSend"
              onClick={sendMessage}
              disabled={!isJoin || !message.trim()}
            />
          </div>

          {/* 퇴장 */}
          {isJoin && (
            <button
              type="button"
              onClick={leaveChatting}
            >
              채팅방 퇴장
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Chatting;
