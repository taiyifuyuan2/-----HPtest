// 共通: header/footer を読み込み
(async () => {
  const load = async (sel, url) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const res = await fetch(url);
    el.innerHTML = await res.text();
    
    // ヘッダーが読み込まれた後にモバイルナビゲーションを初期化
    if (sel === '#site-header') {
      initializeMobileNav();
    }
  };
  await load('#site-header', 'partials/header.html');
  await load('#site-footer', 'partials/footer.html');

  // 年
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // active表示（今いるページをナビにハイライト）
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, .mobile-nav-content a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

  // スムーススクロール（同一ページ内アンカー）
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href');
      const t=document.querySelector(id);
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
    });
  });
})();

// モバイルナビゲーション初期化関数
function initializeMobileNav() {
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (mobileNavToggle && mobileNav) {
    console.log('モバイルナビゲーションを初期化中...'); // デバッグ用
    
    mobileNavToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;
      
      console.log('メニューボタンがクリックされました。状態:', newState); // デバッグ用
      
      mobileNavToggle.setAttribute('aria-expanded', newState);
      mobileNav.setAttribute('aria-hidden', !newState);
      
      // スクロールを無効化
      document.body.style.overflow = newState ? 'hidden' : '';
    });

    // モバイルナビのリンクをクリックしたら閉じる
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });

    // モバイルナビの外側をクリックしたら閉じる
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) {
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
    
    console.log('モバイルナビゲーションの初期化が完了しました'); // デバッグ用
  } else {
    console.log('モバイルナビゲーション要素が見つかりません:', { 
      toggle: !!mobileNavToggle, 
      nav: !!mobileNav 
    }); // デバッグ用
  }
}

// ===== Ripple effect =====
document.addEventListener('click', e => {
  const btn = e.target.closest('.cta-btn.primary');
  if (!btn) return;

  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const ink = document.createElement('span');
  ink.className = 'ripple-ink';
  ink.style.left = x + 'px';
  ink.style.top  = y + 'px';
  btn.appendChild(ink);

  ink.addEventListener('animationend', ()=> ink.remove());
});

// ===== ページ別初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;



  // ヘッダーのスクロール効果（最適化版）
  const header = document.querySelector('header');
  if (header) {
    let lastScrollY = window.scrollY;
    let ticking = false;
    let scrollTimeout;

    const updateHeader = () => {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    // スクロールイベントを最適化（throttling）
    const handleScroll = () => {
      if (scrollTimeout) return;
      
      scrollTimeout = setTimeout(() => {
        requestTick();
        scrollTimeout = null;
      }, 16); // 約60fps
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Back to top ボタン
  const toTop = document.getElementById('toTop');
  if (toTop) {
    addEventListener('scroll', ()=> toTop.classList.toggle('show', scrollY>400), {passive:true});
    toTop.addEventListener('click', ()=> scrollTo({top:0,behavior:'smooth'}));
  }

  // スクロールアニメーション（reveal）
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // Before/After スライダー
  const baHandle = document.querySelector('.ba-handle');
  if (baHandle) {
    const baAfter = document.querySelector('.ba-after');
    const updateSlider = (value) => {
      if (baAfter) {
        baAfter.style.setProperty('--ba-x', `${100 - value}%`);
      }
    };
    
    baHandle.addEventListener('input', (e) => {
      updateSlider(e.target.value);
    });
    
    // 初期位置を設定
    updateSlider(baHandle.value);

    // タッチデバイス対応
    let isDragging = false;
    let startX = 0;
    let startValue = 0;

    baHandle.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      startValue = parseInt(baHandle.value);
      e.preventDefault();
    });

    baHandle.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - startX;
      const containerWidth = baHandle.parentElement.offsetWidth;
      const deltaValue = (deltaX / containerWidth) * 100;
      const newValue = Math.max(0, Math.min(100, startValue + deltaValue));
      baHandle.value = newValue;
      updateSlider(newValue);
      e.preventDefault();
    });

    baHandle.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // FAQ アコーディオン
  document.querySelectorAll('.faq-item .faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const faqItem = q.parentElement;
      const isOpen = faqItem.classList.contains('open');
      
      // 他のFAQを閉じる
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('open');
      });
      
      // クリックされたFAQを開く/閉じる
      if (!isOpen) {
        faqItem.classList.add('open');
      }
    });
  });

  // パララックス効果（ヒーロー画像）
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      hero.style.setProperty('--heroY', `${rate}px`);
    }, { passive: true });
  }

  // スムーススクロール（ページ内リンク）
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // カードのホバー効果をタッチデバイスでも有効にする
  const cards = document.querySelectorAll('.card, .service-item, .pricing-card, .testimonial');
  cards.forEach(card => {
    let touchStartY = 0;
    let touchEndY = 0;

    card.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
      touchEndY = e.changedTouches[0].clientY;
      const touchDiff = Math.abs(touchStartY - touchEndY);
      
      if (touchDiff < 10) { // タップと判定
        card.style.transform = 'translateY(-8px)';
        card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
        
        setTimeout(() => {
          card.style.transform = '';
          card.style.boxShadow = '';
        }, 200);
      }
    }, { passive: true });
  });

  if (page === 'voices') {
    // シンプルカルーセル
    const track = document.getElementById('track');
    if (track) {
      let idx=0; const slides=track.children.length;
      const go = (i)=>{ idx=(i+slides)%slides; track.style.transform=`translateX(-${idx*100}%)`; };
      document.getElementById('prev')?.addEventListener('click',()=>go(idx-1));
      document.getElementById('next')?.addEventListener('click',()=>go(idx+1));
      if(slides>1) setInterval(()=>go(idx+1),6000);
    }
  }

  if (page === 'faq') {
    // FAQ アコーディオン
    document.querySelectorAll('.faq-item .faq-q').forEach(q => {
      q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
    });
  }

  if (page === 'pricing') {
    // 料金プラン切替
    const mBtn = document.getElementById('m-btn');
    const yBtn = document.getElementById('y-btn');
    const cards = document.querySelectorAll('#plans .card');
    const setMode = (mode) => {
      mBtn?.classList.toggle('active', mode==='m');
      yBtn?.classList.toggle('active', mode==='y');
      cards.forEach(c=>{
        const month=Number(c.dataset.month||0);
        const num=c.querySelector('.num'); const yen=c.querySelector('.yen');
        if(!num) return;
        if(mode==='m'){ num.textContent=month.toLocaleString(); yen.textContent='円/月〜'; }
        else { const yearly=Math.round(month*12*0.9); num.textContent=yearly.toLocaleString(); yen.textContent='円/年〜 (10%OFF)'; }                                                                                    
      });
    };
    mBtn?.addEventListener('click',()=>setMode('m'));
    yBtn?.addEventListener('click',()=>setMode('y'));
    setMode('m');

    // 簡易見積り
    const radios = document.querySelectorAll('#calc input[name="plan"]');
    const addons = document.querySelectorAll('#calc .addon');
    const total = document.getElementById('est-total');
    const unit = document.getElementById('est-unit');
    let mode='m';
    document.getElementById('mode-month')?.addEventListener('click', ()=>{mode='m'; render();});
    document.getElementById('mode-year')?.addEventListener('click', ()=>{mode='y'; render();});
    const current = ()=>Number([...radios].find(r=>r.checked)?.value||0);
    const addSum = ()=>[...addons].filter(a=>a.checked).reduce((s,a)=>s+Number(a.dataset.month||0),0);
    const render=()=>{
      const base=current()+addSum();
      if(mode==='m'){ total.textContent=base.toLocaleString(); unit.textContent='円/月'; }
      else{ const y=Math.round(base*12*0.9); total.textContent=y.toLocaleString(); unit.textContent='円/年(10%OFF)'; }                                                                                  
    };
    radios.forEach(r=>r.addEventListener('change',render));
    addons.forEach(a=>a.addEventListener('change',render));
    render();
  }

  // お問い合わせフォームの処理
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // フォームデータの取得
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const message = formData.get('message');
      
      // 簡単なバリデーション
      if (!name || !email || !message) {
        alert('必須項目を入力してください。');
        return;
      }
      
      // 送信処理（実際の実装ではサーバーサイドに送信）
      alert(`${name}様、お問い合わせありがとうございます。\n内容を確認次第、担当者よりご連絡いたします。`);
      
      // フォームをリセット
      contactForm.reset();
    });
  }

  // パフォーマンス最適化：画像の遅延読み込み
  const images = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // タッチデバイスでのスクロール最適化
  let touchStartY = 0;
  let touchStartX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;
    const deltaY = Math.abs(touchY - touchStartY);
    const deltaX = Math.abs(touchX - touchStartX);

    // 縦スクロールの場合は横スクロールを防ぐ
    if (deltaY > deltaX) {
      e.preventDefault();
    }
  }, { passive: false });

  // ページ読み込み完了時のアニメーション
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // ヒーローセクションの要素を順番に表示
    const heroElements = document.querySelectorAll('.hero .tag, .hero h1, .hero p, .hero .cta-row, .hero .benefits');
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 200);
    });
  });

  // ESCキーでモバイルナビを閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.getAttribute('aria-hidden') === 'false') {
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
});
