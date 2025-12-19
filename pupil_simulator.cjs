/**
 * Pupil Core 数据模拟器 (纯测试用)
 * 不需要真实的眼动仪，不需要 ZMQ 库
 */

const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log(`[Simulator] 🟢 模拟器启动成功！正在监听 ws://localhost:${PORT}`);
console.log(`[Simulator] 请打开浏览器进入“正式学习”阶段...`);

// 模拟参数
let angle = 0;
const centerX = 0.5;
const centerY = 0.5;
const radius = 0.3; 

wss.on('connection', (ws) => {
    console.log('[Simulator] 🔗 前端已连接！开始发送模拟眼动数据...');

    const intervalId = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            // 模拟视线在屏幕上画圆圈
            angle += 0.05;
            const simX = centerX + Math.cos(angle) * radius; 
            const simY = centerY + Math.sin(angle) * radius;

            const mockData = {
                topic: 'gaze.3d.0.',
                norm_pos: [simX, simY], // 发送归一化坐标 (0.0 - 1.0)
                confidence: 1.0,
                timestamp: Date.now() / 1000
            };

            ws.send(JSON.stringify(mockData));
        }
    }, 33); // 30Hz

    ws.on('close', () => {
        console.log('[Simulator] ❌ 前端断开连接');
        clearInterval(intervalId);
    });
});