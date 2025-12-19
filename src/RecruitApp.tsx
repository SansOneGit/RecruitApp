import React, { useState, useEffect } from 'react';
// 1. 引入腾讯云 SDK
import cloudbase from "@cloudbase/js-sdk";

// 2. 初始化 (务必确认 env ID 正确)
const app = cloudbase.init({
  env: "cloud1-2g5vhu65a81aecf7" 
});

// 3. 获取数据库引用
const db = app.database();
const auth = app.auth();

// ==========================================
// 样式定义
// ==========================================
const colors = {
  bg: '#F5F5F7',
  cardBg: '#FFFFFF',
  textPrimary: '#1D1D1F',
  textSecondary: '#86868B',
  appleBlue: '#0071E3',
  border: '#E5E5EA',
  error: '#FF3B30',
  glass: 'rgba(255, 255, 255, 0.9)', // 增加一点不透明度，防止背景干扰太强
};

// 统一的左右间距，满足 24pt 的要求
const SPACING_X = '24px';

const styles = {
  container: {
    height: '100dvh', // 使用 dvh 兼容移动端浏览器地址栏变化
    backgroundColor: colors.bg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
    color: colors.textPrimary,
    overflow: 'hidden',
    position: 'relative',
    '@media (max-width: 640px)': {
       backgroundColor: colors.cardBg,
    }
  },
  card: {
    backgroundColor: colors.cardBg,
    width: '100%',
    height: '100%', 
    maxWidth: '640px', //在大屏幕上保持类似手机的宽度
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  header: {
    padding: `0 ${SPACING_X}`, // 左右间距 24px
    height: '60px',
    backgroundColor: colors.glass,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: `1px solid rgba(0,0,0,0.05)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
    position: 'absolute',
    top: 0,
    width: '100%',
    boxSizing: 'border-box',
  },
  headerTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: colors.textPrimary,
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: colors.appleBlue,
    fontSize: '17px',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '400',
  },
  // 修改点：移除左右 padding，让滚动条贴边
  scrollContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '80px 0 100px 0', 
    WebkitOverflowScrolling: 'touch',
    width: '100%',
  },
  // 新增：用于包裹内容的容器，控制左右 24px 间距
  contentContainer: {
    padding: `0 ${SPACING_X}`,
    width: '100%',
    boxSizing: 'border-box',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: `20px ${SPACING_X} 34px ${SPACING_X}`, // 左右间距 24px
    backgroundColor: colors.glass,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: `1px solid rgba(0,0,0,0.05)`,
    zIndex: 20,
    boxSizing: 'border-box',
  },
  eyebrow: {
    fontSize: '13px',
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '8px',
  },
  bigTitle: {
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: '1.1',
    marginBottom: '16px',
    letterSpacing: '-0.5px',
    color: '#000',
  },
  subTitle: {
    fontSize: '17px',
    color: colors.textSecondary,
    lineHeight: '1.5',
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    marginTop: '10px',
  },
  infoBox: {
    backgroundColor: '#F5F5F7',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '24px',
  },
  infoRow: {
    display: 'flex',
    marginBottom: '16px',
  },
  infoLabel: {
    width: '70px',
    fontSize: '14px',
    color: colors.textSecondary,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: '14px',
    color: colors.textPrimary,
    fontWeight: '500',
    lineHeight: '1.4',
  },
  formGroup: { marginBottom: '24px' },
  label: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    height: '56px',
    padding: '0 16px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: '#F2F2F7', 
    fontSize: '17px',
    color: colors.textPrimary,
    outline: 'none',
    boxSizing: 'border-box',
    appearance: 'none',
    transition: 'background 0.2s',
  },
  button: {
    width: '100%',
    height: '56px',
    borderRadius: '28px',
    border: 'none',
    backgroundColor: colors.appleBlue,
    color: '#fff',
    fontSize: '17px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 113, 227, 0.3)',
    transition: 'transform 0.1s, opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 修改点：增加 padding-top/bottom 防止边框被遮挡
  dateScrollContainer: {
    display: 'flex',
    overflowX: 'auto',
    gap: '12px',
    // 关键修改：上下 padding 增大，左右 padding 保持与页面一致
    padding: `12px ${SPACING_X} 20px ${SPACING_X}`, 
    // 关键修改：因为父级现在没有 padding，不需要负 margin 了，或者根据设计微调
    margin: '0 0 10px 0',
    scrollbarWidth: 'none', 
    msOverflowStyle: 'none',
    width: '100%', // 确保占满全宽
    boxSizing: 'border-box',
  },
  datePill: {
    flex: '0 0 auto',
    padding: '12px 20px',
    borderRadius: '18px',
    backgroundColor: '#F2F2F7',
    color: colors.textPrimary,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    border: '2px solid transparent',
    // 增加初始状态的阴影位置，避免跳动太大
    transform: 'translateY(0)',
  },
  datePillSelected: {
    backgroundColor: '#FFFFFF',
    color: colors.appleBlue,
    border: `2px solid ${colors.appleBlue}`,
    boxShadow: '0 8px 20px rgba(0,0,0,0.12)', // 增强阴影效果
    transform: 'translateY(-4px)', // 稍微上浮更多一点
  },
  dateDay: { fontSize: '18px', fontWeight: '700', marginBottom: '2px' },
  dateWeek: { fontSize: '12px', fontWeight: '500', opacity: 0.6 },
  timeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  timeSlot: {
    padding: '16px 8px',
    borderRadius: '14px',
    backgroundColor: '#F2F2F7',
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: '500',
    color: colors.textPrimary,
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  timeSlotSelected: {
    backgroundColor: colors.appleBlue,
    color: '#fff',
    boxShadow: '0 4px 12px rgba(0, 113, 227, 0.3)',
    transform: 'scale(1.02)',
  },
  timeSlotDisabled: {
    opacity: 0.3,
    textDecoration: 'line-through',
    pointerEvents: 'none',
  }
};

const generateDates = () => {
  const dates = [];
  const start = new Date('2025-12-20T00:00:00'); 
  const end = new Date('2026-01-26T00:00:00');   
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (d < today) continue;
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const week = ['周日','周一','周二','周三','周四','周五','周六'][d.getDay()];
    dates.push({ 
      val: `${d.getFullYear()}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`, 
      dayStr: `${month}月${day}日`,
      weekStr: week
    });
  }
  return dates;
};

const FIXED_TIME_SLOTS = [
  { id: 1, text: "14:00 - 14:30" }, { id: 2, text: "14:30 - 15:00" },
  { id: 3, text: "15:00 - 15:30" }, { id: 4, text: "15:30 - 16:00" },
  { id: 5, text: "16:00 - 16:30" }, { id: 6, text: "16:30 - 17:00" },
  { id: 7, text: "17:00 - 17:30" }, { id: 8, text: "17:30 - 18:00" },
  { id: 9, text: "19:00 - 19:30" }, { id: 10, text: "19:30 - 20:00" },
  { id: 11, text: "20:00 - 20:30" }, { id: 12, text: "20:30 - 21:00" }
];

const MAJORS = ["工业设计", "产品设计", "环境设计", "视觉传达设计", "其他"];

const RecruitApp = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dates] = useState(generateDates());
  const [formData, setFormData] = useState({
    name: '', age: '', gender: '男', grade: '研一', majorSelect: '工业设计', majorInput: ''
  });
  const [selectedDate, setSelectedDate] = useState(dates.length > 0 ? dates[0].val : '');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  // SDK 初始化与登录
  useEffect(() => {
    const signIn = async () => {
      try {
        const loginState = await auth.getLoginState();
        if (!loginState) {
          if (auth.signInAnonymously) {
             await auth.signInAnonymously();
          } else if (auth.anonymousAuthProvider) {
             await auth.anonymousAuthProvider().signIn();
          }
        }
      } catch (err) {
        console.error("登录失败详情:", err);
      }
    };
    signIn();
  }, []);

  // 获取占用情况
  useEffect(() => {
    if (step === 3 && selectedDate) {
      const fetchBooked = async () => {
        try {
          const res = await db.collection('Appointments')
            .where({ date: selectedDate })
            .get();
          
          if(res.data) {
            setBookedSlots(res.data.map(r => r.slotId));
          }
        } catch (error) {
          console.error("Fetch Error:", error);
        }
      };
      fetchBooked();
      setSelectedSlot(null);
    }
  }, [step, selectedDate]);

  // 提交数据
  const handleSubmit = async () => {
    setLoading(true);
    const finalMajor = formData.majorSelect === '其他' ? formData.majorInput : formData.majorSelect;
    const finalSlotText = FIXED_TIME_SLOTS.find(s => s.id === selectedSlot)?.text;

    try {
      const countRes = await db.collection('Appointments').where({
        date: selectedDate,
        slotId: selectedSlot
      }).count();
      
      if (countRes.total > 0) {
        alert("该时间段刚刚被抢走了！请选择其他时间。");
        const res = await db.collection('Appointments').where({ date: selectedDate }).get();
        setBookedSlots(res.data.map(r => r.slotId));
        setLoading(false);
        return;
      }

      await db.collection("Appointments").add({
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        grade: formData.grade,
        major: finalMajor,
        date: selectedDate,
        slotId: selectedSlot,
        timeRange: finalSlotText,
        createAt: new Date()
      });

      setTimeout(() => { setStep(4); setLoading(false); }, 800);
      
    } catch (err) {
      console.error(err);
      alert("提交失败：" + err.message);
      setLoading(false);
    }
  };

  const Header = ({ title, showBack = true }) => (
    <div style={styles.header}>
      <div style={{width: '60px'}}>
        {showBack && (
          <button style={styles.backBtn} onClick={() => setStep(step - 1)}>
            <span style={{fontSize: '24px', marginRight: '4px', paddingBottom:'2px'}}>‹</span> 返回
          </button>
        )}
      </div>
      <span style={styles.headerTitle}>{title}</span>
      <div style={{width: '60px'}}></div>
    </div>
  );

  // 通用的内容容器组件，处理左右间距
  const Content = ({ children }) => (
    <div style={styles.contentContainer}>
      {children}
    </div>
  );

  if (step === 1) return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.scrollContent}>
          <Content>
            <div style={styles.eyebrow}>Design Research 2025</div>
            <h1 style={styles.bigTitle}>探索设计认知<br/>与自适应学习。</h1>
            <p style={styles.subTitle}>诚邀您参与一项基于眼动追踪的交互式学习实验，帮助我们优化未来的设计教育工具。</p>
            <div style={styles.infoBox}>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>实验内容</div>
                <div style={styles.infoValue}>阅读一段关于“可供性”的设计理论，并完成简单的案例分析任务。全程无侵入，轻松有趣。</div>
              </div>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>招募对象</div>
                <div style={styles.infoValue}>设计专业在读硕士研究生（研一至研三）<br/>需视力或矫正视力正常</div>
              </div>
              <div style={{...styles.infoRow, marginBottom: 0}}>
                <div style={styles.infoLabel}>地点时长</div>
                <div style={styles.infoValue}>J9 设计学院 443 实验室<br/>约 30 分钟</div>
              </div>
            </div>
          </Content>
        </div>
        <div style={styles.footer}>
          <button style={styles.button} onClick={() => setStep(2)}>我符合条件，立即报名</button>
        </div>
      </div>
    </div>
  );

  if (step === 2) return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Header title="基本信息" />
        <div style={styles.scrollContent}>
          <Content>
            <h2 style={styles.sectionTitle}>确认身份信息</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>姓名</label>
              <input style={styles.input} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="请输入真实姓名" />
            </div>
            <div style={{display: 'flex', gap: '16px'}}>
              <div style={{...styles.formGroup, flex: 1}}>
                <label style={styles.label}>年龄</label>
                <input style={styles.input} type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="24" />
              </div>
              <div style={{...styles.formGroup, flex: 1}}>
                <label style={styles.label}>性别</label>
                <select style={{...styles.input, backgroundImage: 'none'}} value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>年级</label>
              <select style={{...styles.input, backgroundImage: 'none'}} value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})}>
                <option value="研一">研一</option>
                <option value="研二">研二</option>
                <option value="研三">研三</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>专业方向</label>
              <select style={{...styles.input, backgroundImage: 'none'}} value={formData.majorSelect} onChange={e => setFormData({...formData, majorSelect: e.target.value})}>
                {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {formData.majorSelect === '其他' && (
                <input style={{...styles.input, marginTop: '12px'}} placeholder="请输入具体专业名称" value={formData.majorInput} onChange={e => setFormData({...formData, majorInput: e.target.value})} />
              )}
            </div>
          </Content>
        </div>
        <div style={styles.footer}>
          <button style={{...styles.button, opacity: (formData.name && formData.age) ? 1 : 0.5}} disabled={!formData.name || !formData.age} onClick={() => setStep(3)}>下一步</button>
        </div>
      </div>
    </div>
  );

  if (step === 3) return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Header title="选择时间" />
        <div style={styles.scrollContent}>
          {/* 标题放在 Content 内，保持 24px 间距 */}
          <Content>
            <label style={styles.label}>选择日期</label>
          </Content>

          {/* 日期滚动条直接放在 scrollContent 下，不包含在 Content 内，实现全宽滑动，但通过 styles.dateScrollContainer 的 padding 实现视觉对齐 */}
          {dates.length === 0 ? (
            <div style={{padding:'20px', textAlign:'center', color:colors.textSecondary}}>暂无未来可用日期</div>
          ) : (
            <div style={styles.dateScrollContainer}>
              {dates.map((d) => {
                const isSelected = selectedDate === d.val;
                return (
                  <div key={d.val} onClick={() => setSelectedDate(d.val)}
                    style={{...styles.datePill, ...(isSelected ? styles.datePillSelected : {})}}
                  >
                    <div style={styles.dateDay}>{d.dayStr}</div>
                    <div style={styles.dateWeek}>{d.weekStr}</div>
                  </div>
                );
              })}
            </div>
          )}
          
          <Content>
            <label style={styles.label}>选择时段</label>
            <div style={styles.timeGrid}>
              {FIXED_TIME_SLOTS.map(slot => {
                const isBooked = bookedSlots.includes(slot.id);
                const isSelected = selectedSlot === slot.id;
                return (
                  <div key={slot.id} onClick={() => { if(!isBooked) setSelectedSlot(slot.id) }}
                    style={{
                      ...styles.timeSlot,
                      ...(isBooked ? styles.timeSlotDisabled : {}),
                      ...(isSelected ? styles.timeSlotSelected : {})
                    }}
                  >
                    <div>{slot.text}</div>
                    {isBooked && <div style={{fontSize:'12px', marginTop:'2px', opacity:0.8}}>已约满</div>}
                  </div>
                )
              })}
            </div>
          </Content>
        </div>
        <div style={styles.footer}>
          <button style={{...styles.button, opacity: selectedSlot ? 1 : 0.5}} disabled={!selectedSlot || loading} onClick={handleSubmit}>
            {loading ? '正在提交...' : '确认预约'}
          </button>
        </div>
      </div>
    </div>
  );

  if (step === 4) return (
    <div style={styles.container}>
      <div style={{...styles.card, justifyContent: 'center', alignItems: 'center'}}>
        {/* 这里 scrollContent 宽度占满，滚动条在最右边 */}
        <div style={styles.scrollContent}>
          {/* 内部容器 Content 负责 24px 的边距 */}
          <Content>
            <div style={{textAlign: 'center', paddingTop: '40px'}}>
              <div style={{width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#34C759', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto'}}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h2 style={{fontSize: '28px', fontWeight: '700', marginBottom: '8px'}}>预约成功</h2>
              <p style={{color: colors.textSecondary, marginBottom: '40px'}}>您已成功加入实验计划</p>
              
              <div style={{
                backgroundColor: '#F5F5F7',
                borderRadius: '20px',
                padding: '24px',
                textAlign: 'left',
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                width: '100%', // 宽度占满 Content 容器 (减去 24px padding 后)
                boxSizing: 'border-box' 
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{marginBottom: '12px', fontSize: '13px', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px'}}>预约凭证</div>
                  <div style={{fontSize: '18px', fontWeight: '600', marginBottom: '6px', color: colors.textPrimary}}>{formData.name}</div>
                  <div style={{fontSize: '15px', marginBottom: '4px', color: '#444'}}>{selectedDate}</div>
                  <div style={{fontSize: '15px', color: colors.appleBlue, fontWeight: '500'}}>{FIXED_TIME_SLOTS.find(s=>s.id===selectedSlot)?.text}</div>
                  <div style={{fontSize: '13px', color: colors.textSecondary, marginTop: '12px'}}>J9 设计学院 443</div>
                </div>
                <div style={{ marginLeft: '20px', paddingLeft: '20px', borderLeft: '2px dashed #D1D1D6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.8}}>
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DesignResearch_${selectedDate}_${formData.name}`} alt="Voucher Code" style={{ width: '80px', height: '80px', display: 'block', borderRadius: '4px' }}/>
                   <span style={{ fontSize: '10px', color: colors.textSecondary, marginTop: '6px', letterSpacing: '1px', fontWeight: '500' }}>ADMIT ONE</span>
                </div>
              </div>
              <div style={{marginBottom: '20px'}}>
                <p style={{fontSize: '14px', color: colors.textSecondary, marginBottom: '16px'}}>请长按识别二维码添加微信（备注姓名）</p>
                <div style={{width: '240px', margin: '0 auto 12px auto', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E5EA', backgroundColor: 'white', lineHeight: 0}}>
                  <img src="/wechat_qr.jpg" alt="QR Code" style={{width: '100%', height: 'auto', display: 'block'}} onError={(e)=>{e.target.src="https://via.placeholder.com/240x240?text=No+QR"}}/>
                </div>
                <p style={{marginTop: '10px', fontWeight: '600', fontSize: '16px'}}>SansOneX</p>
              </div>
            </div>
          </Content>
        </div>
      </div>
    </div>
  );

  return null;
};

export default RecruitApp;
