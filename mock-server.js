const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const cors = require('cors');

// Express 앱 생성
const app = express();
const port = 8080;

// CORS 설정
app.use(cors({
  origin: ['http://localhost:8080', 'http://192.168.12.110:8080'],
  credentials: true
}));

// JSON 파싱 미들웨어
app.use(express.json());

// 연결된 클라이언트들을 저장
const connectedClients = new Map();

// HTTP 서버 생성
const server = http.createServer(app);

// WebSocket 서버 생성
const wss = new WebSocket.Server({ server });

// API 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    connectedClients: connectedClients.size 
  });
});

app.get('/api/users/online', (req, res) => {
  const onlineUsers = Array.from(connectedClients.values()).map(client => ({
    userId: client.userId,
    username: client.username,
    isOnline: true,
    lastSeen: new Date().toISOString()
  }));
  
  res.json(onlineUsers);
});

// WebSocket 연결 처리
wss.on('connection', (ws, req) => {
  console.log('새로운 WebSocket 연결:', req.url);
  
  // URL에서 쿼리 파라미터 파싱
  const url = new URL(req.url, 'http://localhost');
  const userId = url.searchParams.get('userId');
  const username = url.searchParams.get('username');
  
  if (!userId || !username) {
    console.log('사용자 정보가 없어 연결을 종료합니다.');
    ws.close();
    return;
  }
  
  // 클라이언트 정보 저장
  const clientInfo = {
    userId,
    username,
    ws,
    connectedAt: new Date(),
    lastPing: new Date()
  };
  
  connectedClients.set(userId, clientInfo);
  
  console.log(`사용자 연결: ${username} (${userId})`);
  console.log(`현재 연결된 클라이언트 수: ${connectedClients.size}`);
  
  // 연결 성공 메시지 전송
  ws.send(JSON.stringify({
    type: 'connection_success',
    userId,
    username,
    timestamp: new Date().toISOString()
  }));
  
  // 모든 클라이언트에게 온라인 상태 업데이트 전송
  broadcastUserStatus();
  
  // 메시지 수신 처리
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('수신된 메시지:', message);
      
      switch (message.type) {
        case 'ping':
          // 퐁 응답 전송
          const pongMessage = {
            type: 'pong',
            userId: message.userId,
            timestamp: Date.now(),
            originalPingTime: message.timestamp
          };
          ws.send(JSON.stringify(pongMessage));
          
          // 마지막 핑 시간 업데이트
          if (connectedClients.has(userId)) {
            connectedClients.get(userId).lastPing = new Date();
          }
          break;
          
        case 'chat_message':
          // 채팅 메시지를 모든 클라이언트에게 브로드캐스트
          broadcastMessage({
            type: 'chat_message',
            userId: message.userId,
            username: message.username,
            message: message.message,
            timestamp: new Date().toISOString()
          });
          break;
          
        default:
          console.log('알 수 없는 메시지 타입:', message.type);
      }
    } catch (error) {
      console.error('메시지 파싱 오류:', error);
    }
  });
  
  // 연결 종료 처리
  ws.on('close', () => {
    console.log(`사용자 연결 종료: ${username} (${userId})`);
    connectedClients.delete(userId);
    broadcastUserStatus();
  });
  
  // 오류 처리
  ws.on('error', (error) => {
    console.error('WebSocket 오류:', error);
    connectedClients.delete(userId);
    broadcastUserStatus();
  });
});

// 모든 클라이언트에게 메시지 브로드캐스트
function broadcastMessage(message) {
  const messageStr = JSON.stringify(message);
  connectedClients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(messageStr);
    }
  });
}

// 사용자 상태 업데이트 브로드캐스트
function broadcastUserStatus() {
  const onlineUsers = Array.from(connectedClients.values()).map(client => ({
    userId: client.userId,
    username: client.username,
    isOnline: true,
    lastSeen: client.lastPing.toISOString()
  }));
  
  const statusMessage = {
    type: 'status_update',
    data: onlineUsers,
    timestamp: new Date().toISOString()
  };
  
  broadcastMessage(statusMessage);
}

// 서버 시작
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 모의 서버가 시작되었습니다!`);
  console.log(`📡 HTTP 서버: http://localhost:${port}`);
  console.log(`🌐 WebSocket 서버: ws://localhost:${port}`);
  console.log(`🌍 네트워크 접근: http://192.168.12.110:${port}`);
  console.log(`📊 API 엔드포인트: http://localhost:${port}/api/health`);
  console.log(`👥 온라인 사용자: http://localhost:${port}/api/users/online`);
});

// 정상 종료 처리
process.on('SIGINT', () => {
  console.log('\n🛑 서버를 종료합니다...');
  wss.close(() => {
    server.close(() => {
      console.log('✅ 서버가 정상적으로 종료되었습니다.');
      process.exit(0);
    });
  });
});
