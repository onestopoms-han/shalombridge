/**
 * 사단법인 샬롬브릿지 - Admin Management Script
 * Authentication, Dashboard KPIs, Members Table, Applications Manager, Donations Tracker
 */

// Initial Seed Data if empty
const initMockData = () => {
  if (!localStorage.getItem('shalom_members')) {
    const seedMembers = [
      { id: 1, name: '김성현', role: 'pastor', roleLabel: '목사', church: '안산 새빛교회', phone: '010-3456-7890', email: 'pastor.kim@gmail.com', date: '2026-09-10', status: 'active' },
      { id: 2, name: '이영희', role: 'spouse', roleLabel: '사모', church: '인천 은혜교회', phone: '010-9876-5432', email: 'grace.lee@naver.com', date: '2026-09-11', status: 'active' },
      { id: 3, name: '박준혁', role: 'pk', roleLabel: 'PK 자녀', church: '서울 성민교회', phone: '010-5555-1234', email: 'pk.jun@daum.net', date: '2026-09-11', status: 'active' },
      { id: 4, name: '정다니엘', role: 'missionary', roleLabel: '선교사', church: '동남아 선교지 (GMS)', phone: '010-7777-8888', email: 'daniel.mission@gmail.com', date: '2026-09-12', status: 'active' },
      { id: 5, name: '최진우', role: 'donor', roleLabel: '후원 성도', church: '온누리교회', phone: '010-1234-5678', email: 'jinwoo.choi@kakao.com', date: '2026-09-12', status: 'active' }
    ];
    localStorage.setItem('shalom_members', JSON.stringify(seedMembers));
  }

  if (!localStorage.getItem('shalom_applications')) {
    const seedApplications = [
      { id: 101, name: '김성현 목사', category: 'medical', categoryLabel: '중증질환 긴급의료비', church: '안산 새빛교회', phone: '010-3456-7890', details: '위암 2기 진단 및 수술비 지원 요청 (긴급)', date: '2026-09-10', status: 'approved' },
      { id: 102, name: '이영희 사모', category: 'counseling', categoryLabel: '목회자·사모 심리상담', church: '인천 은혜교회', phone: '010-9876-5432', details: '개척 10년 차 사역 번아웃 및 우울감 상담 요청', date: '2026-09-11', status: 'reviewing' },
      { id: 103, name: '박준혁 청년', category: 'pk', categoryLabel: 'PK 멘토링 & 장학', church: '서울 성민교회', phone: '010-5555-1234', details: '대학 진로 고민 및 PK 신앙 멘토링 결연 신청', date: '2026-09-11', status: 'pending' },
      { id: 104, name: '정다니엘 선교사', category: 'overseas', categoryLabel: '해외선교사 SOS', church: '동남아 선교지', phone: '010-7777-8888', details: '선교지 뎅기열 중증 감염 긴급 치료비 보조', date: '2026-09-12', status: 'approved' }
    ];
    localStorage.setItem('shalom_applications', JSON.stringify(seedApplications));
  }

  if (!localStorage.getItem('shalom_donations')) {
    const seedDonations = [
      { id: 201, donorName: '최진우 성도', type: 'monthly', typeLabel: '월 정기후원', amount: 50000, category: '사역자 전인적 케어 기금', phone: '010-1234-5678', receipt: '발행', date: '2026-09-12' },
      { id: 202, donorName: '소망선교교회', type: 'monthly', typeLabel: '월 정기후원', amount: 300000, category: '긴급의료비 & 수술기금', phone: '02-555-0100', receipt: '발행', date: '2026-09-11' },
      { id: 203, donorName: '한마음교회 여전도회', type: 'onetime', typeLabel: '일시 긴급후원', amount: 1000000, category: '위기 사역자 긴급구호 펀드', phone: '031-777-8899', receipt: '발행', date: '2026-09-10' }
    ];
    localStorage.setItem('shalom_donations', JSON.stringify(seedDonations));
  }

  if (!localStorage.getItem('shalom_welcome_template')) {
    const defaultTemplate = `[사단법인 샬롬브릿지 회원가입 환영 및 축복 서신]

{이름} 님, 주님의 이름으로 축복하고 환영합니다!

사단법인 샬롬브릿지의 귀한 가족이자 동역자가 되어 주심에 깊은 감사를 드립니다.

한국교회의 보이지 않는 그늘 속에서 몸을 아끼지 않고 헌신해 온 목회자와 선교사님, 그리고 함께 눈물 흘리는 사모님과 PK 자녀들의 아픔을 품는 ‘평안(샬롬)의 다리’에 {이름} 님께서 든든한 디딤돌이 되어 주셨습니다.

앞으로 샬롬브릿지는 {이름} 님과 함께 사역자 가정을 지키고 세우는 거룩한 사명을 신실하게 감당하겠습니다. 

언제든 기도가 필요하시거나 사역의 도움이 필요하실 때 편안하게 샬롬브릿지의 문을 두드려 주십시오.

- 사단법인 샬롬브릿지 이사장 및 임직원 일동 배상 -`;
    localStorage.setItem('shalom_welcome_template', defaultTemplate);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initMockData();

  // Auth Elements
  const loginScreen = document.getElementById('admin-login-screen');
  const adminLayout = document.getElementById('admin-layout');
  const loginForm = document.getElementById('admin-login-form');
  const adminIdInput = document.getElementById('admin-id');
  const adminPwInput = document.getElementById('admin-pw');
  const logoutBtn = document.getElementById('admin-logout-btn');

  // Check Session
  const checkAuth = () => {
    const isAuth = sessionStorage.getItem('shalom_admin_auth');
    if (isAuth === 'true') {
      loginScreen.style.display = 'none';
      adminLayout.classList.add('active');
      renderDashboard();
    } else {
      loginScreen.style.display = 'flex';
      adminLayout.classList.remove('active');
    }
  };

  // Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = adminIdInput.value.trim();
      const pw = adminPwInput.value.trim();

      if (id === 'admin' && pw === 'shalom2026!') {
        sessionStorage.setItem('shalom_admin_auth', 'true');
        checkAuth();
      } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.\n(기본 계정: admin / shalom2026!)');
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('관리자 모드에서 로그아웃하시겠습니까?')) {
        sessionStorage.removeItem('shalom_admin_auth');
        checkAuth();
      }
    });
  }

  // Sidebar Tab Navigation
  const navBtns = document.querySelectorAll('.sidebar-nav-btn');
  const tabPanels = document.querySelectorAll('.admin-tab-panel');
  const pageTitleH1 = document.getElementById('admin-title-h1');
  const pageTitleP = document.getElementById('admin-title-p');

  const tabTitles = {
    overview: { title: '통합 운영 현황', desc: '샬롬브릿지의 회원, 긴급지원, 후원 지표를 한눈에 파악합니다.' },
    members: { title: '회원 가입 관리', desc: '등록된 사역자, 사모, PK 자녀 및 후원회원 명단을 관리합니다.' },
    applications: { title: '긴급지원 & 상담 신청 관리', desc: '접수된 긴급의료비 지원 및 심리상담 신청서를 심사하고 상태를 변경합니다.' },
    donations: { title: '후원금 & 동역자 관리', desc: '정기후원 및 일시후원 약정 내역과 기부금영수증 발행을 관리합니다.' },
    template: { title: '자동 감사인사 서신 설정', desc: '회원가입 완료 시 자동으로 전달되는 축복 감사 서신 문구를 편집합니다.' }
  };

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      navBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`tab-${targetTab}`);
      if (targetPanel) targetPanel.classList.add('active');

      if (tabTitles[targetTab]) {
        pageTitleH1.textContent = tabTitles[targetTab].title;
        pageTitleP.textContent = tabTitles[targetTab].desc;
      }

      renderDashboard();
    });
  });

  // Global Render Function
  const renderDashboard = () => {
    const members = JSON.parse(localStorage.getItem('shalom_members') || '[]');
    const applications = JSON.parse(localStorage.getItem('shalom_applications') || '[]');
    const donations = JSON.parse(localStorage.getItem('shalom_donations') || '[]');

    // 1. KPI Stats
    document.getElementById('kpi-total-members').textContent = members.length + '명';
    document.getElementById('kpi-total-apps').textContent = applications.length + '건';
    
    const approvedCount = applications.filter(a => a.status === 'approved').length;
    document.getElementById('kpi-approved-apps').textContent = approvedCount + '건';

    const totalDonationAmount = donations.reduce((sum, d) => sum + (parseInt(d.amount, 10) || 0), 0);
    document.getElementById('kpi-monthly-donations').textContent = totalDonationAmount.toLocaleString('ko-KR') + '원';

    // 2. Render Overview Quick Tables
    renderOverviewTables(members, applications);

    // 3. Render Members Table
    renderMembersTable(members);

    // 4. Render Applications Table
    renderApplicationsTable(applications);

    // 5. Render Donations Table
    renderDonationsTable(donations);

    // 6. Render Template Text
    const templateInput = document.getElementById('welcome-template-textarea');
    if (templateInput) {
      templateInput.value = localStorage.getItem('shalom_welcome_template') || '';
    }
  };

  // Render Overview Tables
  const renderOverviewTables = (members, applications) => {
    const recentMembersTbody = document.getElementById('overview-recent-members');
    if (recentMembersTbody) {
      recentMembersTbody.innerHTML = members.slice(0, 4).map(m => `
        <tr>
          <td><strong>${m.name}</strong></td>
          <td><span class="badge-role ${m.role}">${m.roleLabel || m.role}</span></td>
          <td>${m.church || '-'}</td>
          <td>${m.date}</td>
        </tr>
      `).join('');
    }

    const recentAppsTbody = document.getElementById('overview-recent-apps');
    if (recentAppsTbody) {
      recentAppsTbody.innerHTML = applications.slice(0, 4).map(a => {
        let statusBadge = getStatusBadge(a.status);
        return `
          <tr>
            <td><strong>${a.name}</strong></td>
            <td>${a.categoryLabel || a.category}</td>
            <td>${statusBadge}</td>
            <td>${a.date}</td>
          </tr>
        `;
      }).join('');
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    if (status === 'approved') return '<span class="badge-status approved">지원확정</span>';
    if (status === 'reviewing') return '<span class="badge-status reviewing">심사중</span>';
    if (status === 'completed') return '<span class="badge-status completed">처리완료</span>';
    return '<span class="badge-status pending">접수완료</span>';
  };

  // Render Members Table with Search/Filter
  const renderMembersTable = (members) => {
    const tbody = document.getElementById('members-table-body');
    const searchInput = document.getElementById('member-search-input');
    const roleFilter = document.getElementById('member-role-filter');

    if (!tbody) return;

    let filtered = [...members];

    if (roleFilter && roleFilter.value !== 'all') {
      filtered = filtered.filter(m => m.role === roleFilter.value);
    }

    if (searchInput && searchInput.value.trim() !== '') {
      const q = searchInput.value.trim().toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(q) || 
        (m.church && m.church.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q))
      );
    }

    tbody.innerHTML = filtered.map(m => `
      <tr>
        <td>#${m.id}</td>
        <td><strong>${m.name}</strong></td>
        <td><span class="badge-role ${m.role}">${m.roleLabel || m.role}</span></td>
        <td>${m.church || '-'}</td>
        <td>${m.phone}</td>
        <td>${m.email || '-'}</td>
        <td>${m.date}</td>
        <td>
          <button class="btn-action-sm" onclick="alert('회원 정보: ${m.name}\\n구분: ${m.roleLabel}\\n소속: ${m.church}\\n연락처: ${m.phone}\\n이메일: ${m.email}')">상세보기</button>
        </td>
      </tr>
    `).join('');
  };

  // Filter Event Listeners for Members
  const memberSearch = document.getElementById('member-search-input');
  const memberFilter = document.getElementById('member-role-filter');
  if (memberSearch) memberSearch.addEventListener('input', () => renderMembersTable(JSON.parse(localStorage.getItem('shalom_members') || '[]')));
  if (memberFilter) memberFilter.addEventListener('change', () => renderMembersTable(JSON.parse(localStorage.getItem('shalom_members') || '[]')));

  // Render Applications Table with interactive status change
  const renderApplicationsTable = (applications) => {
    const tbody = document.getElementById('applications-table-body');
    if (!tbody) return;

    tbody.innerHTML = applications.map(a => `
      <tr>
        <td>#${a.id}</td>
        <td><strong>${a.name}</strong></td>
        <td><span style="font-weight:600; color:var(--admin-primary);">${a.categoryLabel || a.category}</span></td>
        <td>${a.church || '-'}</td>
        <td>${a.phone}</td>
        <td style="max-width:240px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${a.details}">${a.details}</td>
        <td>${getStatusBadge(a.status)}</td>
        <td>${a.date}</td>
        <td>
          <select class="filter-select" onchange="updateAppStatus(${a.id}, this.value)">
            <option value="pending" ${a.status === 'pending' ? 'selected' : ''}>접수완료</option>
            <option value="reviewing" ${a.status === 'reviewing' ? 'selected' : ''}>심사중</option>
            <option value="approved" ${a.status === 'approved' ? 'selected' : ''}>지원확정</option>
            <option value="completed" ${a.status === 'completed' ? 'selected' : ''}>처리완료</option>
          </select>
        </td>
      </tr>
    `).join('');
  };

  // Global Function for updating application status
  window.updateAppStatus = (appId, newStatus) => {
    const applications = JSON.parse(localStorage.getItem('shalom_applications') || '[]');
    const app = applications.find(a => a.id === appId);
    if (app) {
      app.status = newStatus;
      localStorage.setItem('shalom_applications', JSON.stringify(applications));
      renderDashboard();
      alert(`[${app.name}]님의 신청 상태가 [${getStatusText(newStatus)}](으)로 변경되었습니다.`);
    }
  };

  const getStatusText = (status) => {
    if (status === 'approved') return '지원확정';
    if (status === 'reviewing') return '심사중';
    if (status === 'completed') return '처리완료';
    return '접수완료';
  };

  // Render Donations Table
  const renderDonationsTable = (donations) => {
    const tbody = document.getElementById('donations-table-body');
    if (!tbody) return;

    tbody.innerHTML = donations.map(d => `
      <tr>
        <td>#${d.id}</td>
        <td><strong>${d.donorName}</strong></td>
        <td><span class="badge-role donor">${d.typeLabel || d.type}</span></td>
        <td style="font-family:'Outfit'; font-weight:700; color:var(--admin-accent-gold); font-size:1.05rem;">
          ${(parseInt(d.amount, 10) || 0).toLocaleString('ko-KR')}원
        </td>
        <td>${d.category || '-'}</td>
        <td>${d.phone || '-'}</td>
        <td><span class="badge-status approved">${d.receipt || '신청'}</span></td>
        <td>${d.date}</td>
      </tr>
    `).join('');
  };

  // Template Save Handler
  const templateSaveBtn = document.getElementById('save-template-btn');
  if (templateSaveBtn) {
    templateSaveBtn.addEventListener('click', () => {
      const templateVal = document.getElementById('welcome-template-textarea').value;
      localStorage.setItem('shalom_welcome_template', templateVal);
      alert('회원가입 자동 감사인사 서신 템플릿이 성공적으로 저장되었습니다!');
    });
  }

  // Initial Auth Check
  checkAuth();
});
