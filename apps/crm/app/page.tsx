import React from 'react';

const stats = [
  { id: 'sales', title: '오늘 매출', value: '₩1,240,000' },
  { id: 'orders', title: '미처리 주문', value: 12 },
  { id: 'users', title: '신규 회원(오늘)', value: 34 },
  { id: 'low_stock', title: '저재고 상품', value: 5 },
];

const recentOrders = [
  { id: 'ORD-1001', store: '강남점', total: '₩24,000', status: '대기' },
  { id: 'ORD-1000', store: '홍대점', total: '₩12,500', status: '배달중' },
  { id: 'ORD-0999', store: '건대점', total: '₩48,000', status: '완료' },
];

export default function Page() {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>CTT CRM</h1>
        <p style={{ color: '#666' }}>관리자 대시보드 목업 — 더미 카드와 최근 활동 목록</p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.id} style={{ padding: 16, borderRadius: 8, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 12, color: '#888' }}>{s.title}</div>
            <div style={{ fontSize: 20, marginTop: 8, fontWeight: 600 }}>{s.value}</div>
          </div>
        ))}
      </section>

      <section style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginTop: 0 }}>최근 주문</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recentOrders.map((o) => (
              <li key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{o.id}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{o.store}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>{o.total}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{o.status}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ width: 320, background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginTop: 0 }}>알림 / 작업</h3>
          <ul style={{ paddingLeft: 16 }}>
            <li>재고 부족: 상품 A (남은 수량 2)</li>
            <li>신규 가입 승인 대기: user@example.com</li>
            <li>이벤트 '할로윈 프로모션' 예약 시작: 2025-10-31</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

