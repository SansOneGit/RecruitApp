/**
 * Pupil Core WebSocket Bridge
 * * 功能：
 * 1. 连接 Pupil Capture 的 ZeroMQ 端口 (订阅眼动数据)
 * 2. 开启 WebSocket 服务器 (端口 8080)
 * 3. 将眼动数据实时转发给浏览器前端
 * * 依赖库 (需安装):
 * npm install zeromq ws msgpack-lite
 */

const zmq = require('zeromq');
const WebSocket = require('ws');
const msgpack = require('msgpack-lite');

// 配置
const PUPIL_REMOTE_PORT = 50020; // Pupil Capture 默认远程控制端口
const PUPIL_IP = '127.0.0.1';
const WEBSOCKET_PORT = 8080;     // 与 App.tsx 中的 wsUrl 对应

// 1. 启动 WebSocket 服务器
const wss = new WebSocket.Server({ port: WEBSOCKET_PORT });
console.log(`[WebSocket] Server running on ws://localhost:${WEBSOCKET_PORT}`);

wss.on('connection', (ws) => {
    console.log('[WebSocket] Client connected (App.tsx)');
    ws.on('close', () => console.log('[WebSocket] Client disconnected'));
    ws.on('error', (err) => console.error('[WebSocket] Error:', err));
});

// 广播函数：向所有连接的前端发送数据
function broadcast(data) {
    const jsonStr = JSON.stringify(data);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(jsonStr);
        }
    });
}

// 2. 连接 Pupil Capture
async function runPupilBridge() {
    try {
        console.log(`[ZMQ] Connecting to Pupil Capture at ${PUPIL_IP}:${PUPIL_REMOTE_PORT}...`);
        
        // 创建 REQ 套接字以请求订阅端口
        const reqSocket = new zmq.Request();
        reqSocket.connect(`tcp://${PUPIL_IP}:${PUPIL_REMOTE_PORT}`);
        
        // 发送 'SUB_PORT' 命令获取数据流端口
        await reqSocket.send('SUB_PORT');
        const [reply] = await reqSocket.receive();
        const subPort = reply.toString();
        
        console.log(`[ZMQ] Received SUB_PORT: ${subPort}`);
        
        // 关闭请求套接字
        reqSocket.close();

        // 创建 SUB 套接字订阅数据
        const subSocket = new zmq.Subscriber();
        subSocket.connect(`tcp://${PUPIL_IP}:${subPort}`);
        
        // 订阅 'gaze' 主题 (包含 gaze.3d.0., gaze.3d.1. 等)
        subSocket.subscribe('gaze'); 
        console.log(`[ZMQ] Subscribed to 'gaze' topic. Forwarding data...`);

        // 监听数据流
        for await (const [topic, msg] of subSocket) {
            try {
                // Pupil Capture 使用 msgpack 编码数据，需要解码
                const payload = msgpack.decode(msg);
                
                // 提取核心数据：归一化坐标 (norm_pos)
                // App.tsx 期望的格式: { topic: '...', norm_pos: [x, y], ... }
                // 仅转发有效数据以减少带宽
                if (payload.norm_pos) {
                    const cleanData = {
                        topic: topic.toString(),
                        norm_pos: payload.norm_pos,
                        timestamp: payload.timestamp,
                        confidence: payload.confidence
                    };
                    
                    // 广播给前端
                    broadcast(cleanData);
                }
            } catch (err) {
                console.error('[ZMQ] Decode error:', err);
            }
        }
        
    } catch (err) {
        console.error('==================================================');
        console.error('❌ 连接 Pupil Capture 失败');
        console.error('请确保 Pupil Capture 软件已打开，并且 "Network API" 插件已启用。');
        console.error('错误详情:', err.message);
        console.error('==================================================');
    }
}

runPupilBridge();