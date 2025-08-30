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

  // 料金計算ツール
  const buildingTypeSelect = document.getElementById('building-type');
  const buildingAreaSelect = document.getElementById('building-area');
  const gardenCheckbox = document.getElementById('garden-maintenance');
  const repairCheckbox = document.getElementById('minor-repairs');
  const mailCheckbox = document.getElementById('mail-management');
  const monthlyRadio = document.getElementById('monthly');
  const yearlyRadio = document.getElementById('yearly');
  const priceDisplay = document.getElementById('estimated-price');
  const annualTotal = document.getElementById('annual-total');
  const annualPrice = document.getElementById('annual-price');
  
  // お客様の声投稿フォームの文字数カウンター
  const voiceMessage = document.getElementById('voice-message');
  const charCount = document.getElementById('char-count');
  
  if (buildingTypeSelect && buildingAreaSelect && priceDisplay) {
    // 基本料金の計算
    function calculatePrice() {
      let basePrice = 0;
      
      // 建物面積による基本料金
      const area = buildingAreaSelect.value;
      if (area === '50㎡以下') {
        basePrice = 8800;
      } else if (area === '100㎡以下') {
        basePrice = 12800;
      } else {
        basePrice = 18800;
      }
      
      // 追加サービスの料金
      let additionalPrice = 0;
      if (gardenCheckbox && gardenCheckbox.checked) {
        additionalPrice += 5000;
      }
      if (repairCheckbox && repairCheckbox.checked) {
        additionalPrice += 3000;
      }
      if (mailCheckbox && mailCheckbox.checked) {
        additionalPrice += 2000;
      }
      
      // 契約期間による割引
      let totalPrice = basePrice + additionalPrice;
      if (yearlyRadio && yearlyRadio.checked) {
        // 年額の場合は月額料金を計算（10%OFFを適用）
        const monthlyPrice = Math.floor(totalPrice * 0.9); // 10%OFF
        const annualPriceTotal = monthlyPrice * 12; // 12ヶ月分の合計
        
        priceDisplay.textContent = `¥${monthlyPrice.toLocaleString()}/月`;
        
        // 年額合計料金を表示
        if (annualTotal && annualPrice) {
          annualTotal.style.display = 'block';
          annualPrice.textContent = `¥${annualPriceTotal.toLocaleString()}`;
        }
      } else {
        // 月額の場合は通常料金
        priceDisplay.textContent = `¥${totalPrice.toLocaleString()}/月`;
        
        // 年額合計料金を非表示
        if (annualTotal) {
          annualTotal.style.display = 'none';
        }
      }
    }
    
    // イベントリスナーを追加
    [buildingTypeSelect, buildingAreaSelect, gardenCheckbox, repairCheckbox, mailCheckbox, monthlyRadio, yearlyRadio].forEach(element => {
      if (element) {
        element.addEventListener('change', calculatePrice);
      }
    });
    
    // 初期料金を計算
    calculatePrice();
  }

  if (voiceMessage && charCount) {
    voiceMessage.addEventListener('input', () => {
      const currentLength = voiceMessage.value.length;
      charCount.textContent = currentLength;
      
      // 文字数に応じて色を変更
      if (currentLength > 800) {
        charCount.style.color = '#dc2626'; // 赤色
      } else if (currentLength > 600) {
        charCount.style.color = '#ea580c'; // オレンジ色
      } else {
        charCount.style.color = '#64748b'; // 通常の色
      }
    });
  }
  
  // プレビューボタンの機能
const previewBtn = document.querySelector('.preview-btn');
if (previewBtn) {
  previewBtn.addEventListener('click', () => {
    const name = document.getElementById('voice-name').value || '匿名';
    const plan = document.getElementById('voice-plan').value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const message = document.getElementById('voice-message').value;

    if (!plan || !rating || !message) {
      alert('必須項目を入力してください。');
      return;
    }

    const planNames = {
      'basic': 'ベーシックプラン',
      'standard': 'スタンダードプラン',
      'premium': 'プレミアムプラン',
      'custom': 'カスタムプラン'
    };

    const ratingStars = '⭐'.repeat(parseInt(rating));

    const previewText = `
投稿プレビュー:

お名前: ${name}
利用プラン: ${planNames[plan]}
評価: ${ratingStars} (${rating}/5)
お客様の声: ${message}

この内容で投稿しますか？
    `;

    if (confirm(previewText)) {
      alert('投稿が完了しました！');
    }
  });
}

// お問い合わせフォームのチェックボックス制御
document.addEventListener('DOMContentLoaded', function() {
  // 利用プランのラジオボタン制御（単一選択）
  const planRadios = document.querySelectorAll('input[name="plan"]');
  planRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        console.log('選択されたプラン:', this.value);
        // ラジオボタンは自動的に単一選択になるので、特別な処理は不要
      }
    });
  });

  // 追加サービスのチェックボックス制御（複数選択可能）
  const addonCheckboxes = document.querySelectorAll('input[name="addon"]');
  addonCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      console.log('追加サービス選択:', this.value, this.checked);
    });
  });

  // 連絡方法のチェックボックス制御（複数選択可能）
  const contactMethodCheckboxes = document.querySelectorAll('input[name="contact-method"]');
  contactMethodCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      console.log('連絡方法選択:', this.value, this.checked);
    });
  });

  // フォーム送信時のバリデーション
  const contactForm = document.querySelector('.contact-form-main');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const selectedPlan = document.querySelector('input[name="plan"]:checked');
      if (!selectedPlan) {
        e.preventDefault();
        alert('利用プランを選択してください。');
        return;
      }
      
      console.log('フォーム送信:', {
        plan: selectedPlan.value,
        addons: Array.from(addonCheckboxes).filter(cb => cb.checked).map(cb => cb.value),
        contactMethods: Array.from(contactMethodCheckboxes).filter(cb => cb.checked).map(cb => cb.value)
      });
    });
  }
});

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
