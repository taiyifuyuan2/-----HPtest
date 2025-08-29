// 最小限のJavaScript - スクロールに影響しない機能のみ

document.addEventListener('DOMContentLoaded', () => {

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

  // Back to top ボタン
  const toTop = document.getElementById('toTop');
  if (toTop) {
    addEventListener('scroll', () => {
      toTop.classList.toggle('show', scrollY > 400);
    }, {passive: true});
    
    toTop.addEventListener('click', () => {
      scrollTo({top: 0, behavior: 'smooth'});
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

  // ヘッダースクロール効果
  const header = document.querySelector('header');
  if (header) {
    addEventListener('scroll', () => {
      if (scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, {passive: true});
  }
  
  // モバイルメニューの動作
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const body = document.body;
  
  if (mobileMenuBtn && mobileNav) {
    console.log('モバイルメニュー要素が見つかりました');
    
    mobileMenuBtn.addEventListener('click', () => {
      console.log('モバイルメニューボタンがクリックされました');
      mobileMenuBtn.classList.toggle('active');
      mobileNav.classList.toggle('open');
      body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    
    // モバイルメニューのリンクをクリックしたら閉じる
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('open');
        body.style.overflow = '';
      });
    });
  } else {
    console.log('モバイルメニュー要素が見つかりません');
    console.log('mobileMenuBtn:', mobileMenuBtn);
    console.log('mobileNav:', mobileNav);
  }

  // 年
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // active表示（今いるページをナビにハイライト）
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

  // スムーススクロール（同一ページ内アンカー）
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });
});
