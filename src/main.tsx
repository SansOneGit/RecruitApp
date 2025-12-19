import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App'; // 注释掉原来的
import Launcher from './Launcher'; // <--- 导入新的启动器

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Launcher /> {/* <--- 改为渲染 Launcher */}
  </React.StrictMode>
);