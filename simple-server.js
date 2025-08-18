import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const port = 8081;
const server = createServer();
const wss = new WebSocketServer({ server });

// 연결된 클라이언트들을 저장
const connectedClients = new Map();

console.log('🚀 간단한 웹소켓 서버를 시작합니다...');

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
    connectedAt: new Date()
  };
  
  connectedClients.set(userId, clientInfo);
  
  console.log(`✅ 사용자 연결: ${username} (${userId})`);
  console.log(`📊 현재 연결된 클라이언트 수: ${connectedClients.size}`);
  
  // 연결 성공 메시지 전송
  ws.send(JSON.stringify({
    type: 'connection_success',
    userId,
    username,
    timestamp: new Date().toISOString()
  }));
  
  // 메시지 수신 처리
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('📨 수신된 메시지:', message);
      
      if (message.type === 'ping') {
        // 퐁 응답 전송
        const pongMessage = {
          type: 'pong',
          userId: message.userId,
          timestamp: Date.now(),
          originalPingTime: message.timestamp
        };
        ws.send(JSON.stringify(pongMessage));
        console.log('🏓 퐁 응답 전송');
      }
    } catch (error) {
      console.error('❌ 메시지 파싱 오류:', error);
    }
  });
  
  // 연결 종료 처리
  ws.on('close', () => {
    console.log(`❌ 사용자 연결 종료: ${username} (${userId})`);
    connectedClients.delete(userId);
    console.log(`📊 현재 연결된 클라이언트 수: ${connectedClients.size}`);
  });
  
  // 오류 처리
  ws.on('error', (error) => {
    console.error('❌ WebSocket 오류:', error);
    connectedClients.delete(userId);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`🎉 서버가 성공적으로 시작되었습니다!`);
  console.log(`📡 WebSocket 서버: ws://localhost:${port}`);
  console.log(`🌍 네트워크 접근: ws://192.168.12.110:${port}`);
  console.log(`📊 연결 대기 중...`);
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
