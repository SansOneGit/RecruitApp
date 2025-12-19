// @ts-nocheck
import React, { useState } from 'react';
import CognitiveLoadPlatform from './App'; // 导入原来的实验平台
import RecruitApp from './RecruitApp';     // 导入新的招募程序

// 🔑 设定你的管理员密码 (建议设简单点，方便现场输入)
const ADMIN_PASSWORD = "9999"; 

const Launcher = () => {
  const [currentApp, setCurrentApp] = useState('menu'); // 'menu' | 'experiment' | 'recruit'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 验证密码逻辑
  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setShowAuthModal(false);
      setCurrentApp('experiment');
    } else {
      setErrorMsg('密码错误，权限拒绝');
      setPasswordInput('');
    }
  };

  // 监听回车键
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  // 如果选择了实验平台，直接渲染原来的 App.tsx
  if (currentApp === 'experiment') {
    return <CognitiveLoadPlatform />;
  }

  // 如果选择了招募程序，渲染 RecruitApp.tsx
  if (currentApp === 'recruit') {
    return <RecruitApp />;
  }

  // 默认显示菜单页面
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.headerIcon}>🔬</div>
        <h1 style={styles.title}>科研项目控制台</h1>
        <p style={styles.subtitle}>请选择要启动的功能模块</p>
        
        <div style={styles.grid}>
          {/* 按钮 1：进入被试招募 (绿色 - 突出显示给学生看) */}
          <button 
            style={{...styles.button, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}
            onClick={() => setCurrentApp('recruit')}
          >
            <div style={styles.icon}>📱</div>
            <div style={styles.btnText}>
              <span style={styles.btnTitle}>我是被试 (招募报名)</span>
              <span style={styles.btnDesc}>点击此处进行实验预约</span>
            </div>
            <div style={styles.arrow}>→</div>
          </button>

          {/* 按钮 2：进入实验平台 (蓝色 - 加锁) */}
          <button 
            style={{...styles.button, background: 'white', border: '1px solid #e2e8f0', boxShadow: 'none'}}
            onClick={() => {
              setShowAuthModal(true);
              setErrorMsg('');
              setPasswordInput('');
            }}
          >
            <div style={{...styles.icon, filter: 'grayscale(1)'}}>🧪</div>
            <div style={styles.btnText}>
              <span style={{...styles.btnTitle, color: '#64748b'}}>实验平台 (管理员)</span>
              <span style={styles.btnDesc}>仅限实验人员访问</span>
            </div>
            <div style={styles.lockIcon}>🔒</div>
          </button>
        </div>
        
        <div style={styles.footer}>
          SDUST-Design Research Lab © 2025-2026
        </div>
      </div>

      {/* 🔐 密码验证弹窗 */}
      {showAuthModal && (
        <div style={styles.modalOverlay} onClick={(e) => {
          if(e.target === e.currentTarget) setShowAuthModal(false);
        }}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>管理员验证</h3>
            <p style={styles.modalDesc}>请输入密码以进入实验控制台</p>
            
            <input 
              type="password" 
              autoFocus
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Password"
              style={styles.input}
            />
            
            {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}

            <div style={styles.modalButtons}>
              <button 
                onClick={() => setShowAuthModal(false)}
                style={styles.cancelBtn}
              >
                取消
              </button>
              <button 
                onClick={handleLogin}
                style={styles.confirmBtn}
              >
                进入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 样式定义
const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px'
  },
  card: {
    background: 'white',
    padding: '40px 30px',
    borderRadius: '24px',
    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center'
  },
  headerIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '32px',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
    position: 'relative',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  icon: {
    fontSize: '28px',
    marginRight: '16px',
  },
  btnText: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  btnTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white', 
    marginBottom: '2px'
  },
  btnDesc: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.9)', 
  },
  arrow: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  lockIcon: {
    fontSize: '16px',
    color: '#94a3b8'
  },
  footer: {
    marginTop: '40px',
    fontSize: '12px',
    color: '#cbd5e1',
  },
  
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  },
  modal: {
    background: 'white',
    padding: '24px',
    borderRadius: '20px',
    width: '80%',
    maxWidth: '300px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: '#1e293b'
  },
  modalDesc: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '16px', // 16px 防止 iOS 自动缩放
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '8px',
    textAlign: 'center'
  },
  errorText: {
    color: '#ef4444',
    fontSize: '12px',
    margin: '0 0 10px 0'
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  cancelBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    background: '#f1f5f9',
    color: '#64748b',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  confirmBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    background: '#3b82f6',
    color: 'white',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default Launcher;
