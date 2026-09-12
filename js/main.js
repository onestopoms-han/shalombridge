/**
 * 사단법인 샬롬브릿지 (Shalom Bridge)
 * Interactive Script: Navigation, Story Tabs, Modals, Calculator, Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const drawerCloseBtn = document.querySelector('.drawer-close-btn');
  const mobileLinks = document.querySelectorAll('.mobile-menu-links a');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));
  }

  // 3. Story Tabs Switching
  const storyTabBtns = document.querySelectorAll('.story-tab-btn');
  const storyPanels = document.querySelectorAll('.story-panel');

  storyTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStory = btn.getAttribute('data-story');

      storyTabBtns.forEach(b => b.classList.remove('active'));
      storyPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`story-${targetStory}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // 4. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('open');
            const otherAns = otherItem.querySelector('.faq-answer');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          item.classList.remove('open');
          answer.style.maxHeight = null;
        }
      });
    }
  });

  // 5. Donation Calculator & Presets
  const dtypeBtns = document.querySelectorAll('.dtype-btn');
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customAmountInput = document.getElementById('custom-amount');
  const calcResultBox = document.getElementById('calc-result-text');

  let currentDonationType = 'monthly';
  let currentAmount = 30000;

  const updateDonationImpact = () => {
    let formattedAmount = currentAmount.toLocaleString('ko-KR');
    let message = '';

    if (currentDonationType === 'monthly') {
      if (currentAmount <= 10000) {
        message = `매월 <strong>${formattedAmount}원</strong>의 후원은 미자립교회 목회자 가정의 <strong>상해보험료 1인분</strong>을 든든하게 지켜줍니다.`;
      } else if (currentAmount <= 30000) {
        message = `매월 <strong>${formattedAmount}원</strong>의 후원은 목회자 부부의 <strong>종합 심리상담 및 정기 건강관리</strong>를 지속 지원합니다.`;
      } else if (currentAmount <= 50000) {
        message = `매월 <strong>${formattedAmount}원</strong>의 후원은 상처받은 <strong>PK 자녀 1명의 1:1 멘토링과 성경캠프 장학금</strong>이 됩니다.`;
      } else {
        message = `매월 <strong>${formattedAmount}원</strong>의 큰 사랑은 중증질환 목회자 가정의 <strong>생계비와 긴급 치료비</strong>를 직접 구호합니다.`;
      }
    } else {
      message = `일시 <strong>${formattedAmount}원</strong>의 후원은 위기 발생 목회자·선교사 가정의 <strong>긴급 수술비 및 긴급구호 펀드</strong>로 전액 집행됩니다.`;
    }

    if (calcResultBox) {
      calcResultBox.innerHTML = message;
    }
  };

  dtypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dtypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDonationType = btn.getAttribute('data-type');
      updateDonationImpact();
    });
  });

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentAmount = parseInt(btn.getAttribute('data-amount'), 10);
      if (customAmountInput) customAmountInput.value = '';
      updateDonationImpact();
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener('input', (e) => {
      amountBtns.forEach(b => b.classList.remove('active'));
      let val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(val) && val > 0) {
        currentAmount = val;
      } else {
        currentAmount = 0;
      }
      updateDonationImpact();
    });
  }

  // 6. Modals Management
  const supportModal = document.getElementById('support-apply-modal');
  const donateModal = document.getElementById('donate-modal');
  const chairmanModal = document.getElementById('chairman-modal');
  const joinModal = document.getElementById('join-modal');
  const loginModal = document.getElementById('login-modal');
  const blessingModal = document.getElementById('welcome-blessing-modal');
  const noShowCheckbox = document.getElementById('chk-no-show-today');

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Close Chairman Modal with 'No show today' preference check
  const closeChairmanModal = () => {
    if (!chairmanModal) return;
    if (noShowCheckbox && noShowCheckbox.checked) {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem('hideChairmanGreetingDate', today);
    }
    closeModal(chairmanModal);
  };

  // Check if Chairman modal should auto-open on page entry
  const checkChairmanModalAutoOpen = () => {
    const today = new Date().toISOString().slice(0, 10);
    const hideDate = localStorage.getItem('hideChairmanGreetingDate');
    if (hideDate !== today && chairmanModal) {
      setTimeout(() => {
        openModal(chairmanModal);
      }, 600);
    }
  };

  // Trigger auto-open check
  checkChairmanModalAutoOpen();

  // Open modal buttons
  document.querySelectorAll('[data-open-modal="support"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(chairmanModal);
      openModal(supportModal);
    });
  });

  document.querySelectorAll('[data-open-modal="donate"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(chairmanModal);
      openModal(donateModal);
    });
  });

  document.querySelectorAll('[data-open-modal="chairman"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(chairmanModal);
    });
  });

  document.querySelectorAll('[data-open-modal="join"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(loginModal);
      openModal(joinModal);
    });
  });

  document.querySelectorAll('[data-open-modal="login"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(joinModal);
      openModal(loginModal);
    });
  });

  // Chairman modal specific close/dismiss buttons
  document.querySelectorAll('.chairman-close-btn, .chairman-dismiss-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeChairmanModal();
    });
  });

  // Blessing modal close buttons
  document.querySelectorAll('.blessing-close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(blessingModal);
    });
  });

  // Generic close buttons & overlay clicks
  document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.closest('.modal-close-btn')) {
        if (el === chairmanModal || el.closest('#chairman-modal')) {
          closeChairmanModal();
        } else {
          closeModal(supportModal);
          closeModal(donateModal);
          closeModal(joinModal);
          closeModal(loginModal);
          closeModal(blessingModal);
        }
      }
    });
  });

  // 7. Toast Notification Utility
  const showToast = (message, type = 'success') => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><path d="M20 6L9 17l-5-5"/></svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // 8. User Auth State Management
  const updateAuthUI = () => {
    const guestActions = document.getElementById('guest-auth-actions');
    const userActions = document.getElementById('user-auth-actions');
    const userNameSpan = document.getElementById('header-user-name');
    const loggedUser = JSON.parse(sessionStorage.getItem('shalom_current_user') || 'null');

    if (loggedUser && guestActions && userActions) {
      guestActions.style.display = 'none';
      userActions.style.display = 'flex';
      if (userNameSpan) userNameSpan.textContent = `${loggedUser.name} ${loggedUser.roleLabel || '회원'}님`;
    } else if (guestActions && userActions) {
      guestActions.style.display = 'flex';
      userActions.style.display = 'none';
    }
  };

  const headerLogoutBtn = document.getElementById('header-logout-btn');
  if (headerLogoutBtn) {
    headerLogoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('shalom_current_user');
      updateAuthUI();
      showToast('로그아웃되었습니다.');
    });
  }

  updateAuthUI();

  // 9. Member Registration (Join) Handler + Auto Thank-you Blessing Letter
  const joinForm = document.getElementById('join-application-form');
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('join-name').value.trim();
      const role = document.getElementById('join-role').value;
      const roleSelect = document.getElementById('join-role');
      const roleLabel = roleSelect.options[roleSelect.selectedIndex].text.split('/')[0].trim();
      const phone = document.getElementById('join-phone').value.trim();
      const email = document.getElementById('join-email').value.trim();
      const church = document.getElementById('join-church').value.trim();
      const date = new Date().toISOString().slice(0, 10);

      // Save to localStorage
      const members = JSON.parse(localStorage.getItem('shalom_members') || '[]');
      const newMember = {
        id: Date.now(),
        name,
        role,
        roleLabel,
        phone,
        email,
        church,
        date,
        status: 'active'
      };
      members.unshift(newMember);
      localStorage.setItem('shalom_members', JSON.stringify(members));

      // Set logged in session
      sessionStorage.setItem('shalom_current_user', JSON.stringify(newMember));
      updateAuthUI();

      closeModal(joinModal);
      joinForm.reset();

      // Prepare & Trigger Automated Blessing & Thank-you Letter
      const defaultTemplate = `[사단법인 샬롬브릿지 회원가입 환영 및 축복 서신]

{이름} 님, 주님의 이름으로 축복하고 환영합니다!

사단법인 샬롬브릿지의 귀한 가족이자 동역자가 되어 주심에 깊은 감사를 드립니다.

한국교회의 보이지 않는 그늘 속에서 몸을 아끼지 않고 헌신해 온 목회자와 선교사님, 그리고 함께 눈물 흘리는 사모님과 PK 자녀들의 아픔을 품는 ‘평안(샬롬)의 다리’에 {이름} 님께서 든든한 디딤돌이 되어 주셨습니다.

앞으로 샬롬브릿지는 {이름} 님과 함께 사역자 가정을 지키고 세우는 거룩한 사명을 신실하게 감당하겠습니다. 

언제든 기도가 필요하시거나 사역의 도움이 필요하실 때 편안하게 샬롬브릿지의 문을 두드려 주십시오.

- 사단법인 샬롬브릿지 이사장 및 임직원 일동 배상 -`;

      let template = localStorage.getItem('shalom_welcome_template') || defaultTemplate;
      let personalizedText = template
        .replace(/\{이름\}/g, name)
        .replace(/\{소속\}/g, church || '사역 현장');

      const blessingBody = document.getElementById('blessing-letter-body-text');
      const blessingTitle = document.getElementById('blessing-modal-title');

      if (blessingTitle) {
        blessingTitle.innerHTML = `“${name} 님, 샬롬브릿지의 가족이 되신 것을 축복합니다!”`;
      }

      if (blessingBody) {
        const paragraphs = personalizedText.split('\n\n').filter(p => p.trim() !== '');
        blessingBody.innerHTML = paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
      }

      // Open Blessing Modal
      setTimeout(() => {
        openModal(blessingModal);
      }, 300);

      showToast(`🎉 ${name} 님의 가입이 완료되었습니다. 축복 서신이 도착했습니다!`);
    });
  }

  // 10. User Login Handler
  const userLoginForm = document.getElementById('user-login-form');
  if (userLoginForm) {
    userLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const loginInput = document.getElementById('login-email').value.trim();
      const members = JSON.parse(localStorage.getItem('shalom_members') || '[]');

      const user = members.find(m => (m.email && m.email === loginInput) || (m.phone && m.phone === loginInput)) || {
        name: loginInput.split('@')[0],
        role: 'general',
        roleLabel: '성도'
      };

      sessionStorage.setItem('shalom_current_user', JSON.stringify(user));
      updateAuthUI();
      closeModal(loginModal);
      userLoginForm.reset();
      showToast(`${user.name} 님, 환영합니다! 성공적으로 로그인되었습니다.`);
    });
  }

  // 11. Support & Counseling Application Form Handler
  const supportForm = document.getElementById('support-application-form');
  if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const categorySelect = document.getElementById('apply-category');
      const category = categorySelect.value;
      const categoryLabel = categorySelect.options[categorySelect.selectedIndex].text;
      const name = document.getElementById('applicant-name').value.trim();
      const role = document.getElementById('applicant-role').value;
      const phone = document.getElementById('applicant-phone').value.trim();
      const church = document.getElementById('applicant-church').value.trim();
      const details = document.getElementById('applicant-details').value.trim();
      const date = new Date().toISOString().slice(0, 10);

      // Save to localStorage
      const applications = JSON.parse(localStorage.getItem('shalom_applications') || '[]');
      applications.unshift({
        id: Date.now(),
        name,
        category,
        categoryLabel,
        role,
        phone,
        church,
        details,
        date,
        status: 'pending'
      });
      localStorage.setItem('shalom_applications', JSON.stringify(applications));

      closeModal(supportModal);
      supportForm.reset();
      showToast(`${name} 님의 지원/상담 신청이 안전하게 접수되었습니다. 24시간 이내에 따뜻하게 연락드리겠습니다.`);
    });
  }

  // 12. Donation Form Handler
  const donateForm = document.getElementById('donation-action-form');
  if (donateForm) {
    donateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const donorName = document.getElementById('donor-name').value.trim();
      const donorPhone = document.getElementById('donor-phone').value.trim();
      const donorAmount = parseInt(document.getElementById('donor-amount').value, 10) || 30000;
      const receipt = document.getElementById('donor-receipt').value === 'yes' ? '발행' : '미발행';
      const date = new Date().toISOString().slice(0, 10);

      // Save to localStorage
      const donations = JSON.parse(localStorage.getItem('shalom_donations') || '[]');
      donations.unshift({
        id: Date.now(),
        donorName,
        type: 'monthly',
        typeLabel: '월 정기후원',
        amount: donorAmount,
        category: '사역자 전인적 케어 기금',
        phone: donorPhone,
        receipt,
        date
      });
      localStorage.setItem('shalom_donations', JSON.stringify(donations));

      closeModal(donateModal);
      donateForm.reset();
      showToast(`${donorName} 동역자님의 따뜻한 후원 신청이 접수되었습니다. 진심으로 감사드립니다.`);
    });
  }
});

