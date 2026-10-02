import React, { useState, useEffect } from 'react';

interface User {
  name: string;
  email?: string;
  isLoggedIn: boolean;
}

export default function App() {
  // Cart state persisted to localStorage
  const [cartCount, setCartCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('rangroo_cart_count');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  // User state persisted to localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('rangroo_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // fallback
    }
    return null;
  });

  // UI state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimer, setToastTimer] = useState<NodeJS.Timeout | null>(null);

  // Form input state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Coffee order card quantities
  const [quantities, setQuantities] = useState<Record<number, number>>({
    1: 1,
    2: 1,
    3: 1,
    4: 1,
  });

  // Coffee options state
  const [coffeeTemp, setCoffeeTemp] = useState<Record<number, string>>({
    1: 'HOT',
    2: 'HOT',
    3: 'HOT',
    4: 'ICE',
  });
  const [coffeeSize, setCoffeeSize] = useState<Record<number, string>>({
    1: 'Regular',
    2: 'Regular',
    3: '기본 (2 Shot)',
    4: 'Regular',
  });

  // Save cart count to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('rangroo_cart_count', cartCount.toString());
    } catch (e) {
      console.error('Failed to save cart count to localStorage', e);
    }
  }, [cartCount]);

  // Show Toast for 2 seconds
  const triggerToast = (msg: string = '☕ 장바구니에 상품이 담겼습니다!') => {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2000);
    setToastTimer(timer);
  };

  // Add to Cart handler
  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCartCount(prev => prev + 1);
    triggerToast('☕ 장바구니에 상품이 담겼습니다!');
  };

  // Login handler
  const handleNormalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let displayName = '회원';
    if (loginEmail && loginEmail.includes('@')) {
      const extracted = loginEmail.split('@')[0];
      displayName = extracted.length > 10 ? extracted.slice(0, 10) : extracted;
    } else if (loginEmail.trim()) {
      displayName = loginEmail.trim();
    } else {
      displayName = '김커피';
    }

    const userData: User = {
      name: displayName,
      email: loginEmail || 'user@rangroo.com',
      isLoggedIn: true,
    };

    setCurrentUser(userData);
    try {
      localStorage.setItem('rangroo_user', JSON.stringify(userData));
    } catch (err) {
      console.error(err);
    }

    setIsLoginModalOpen(false);
    setLoginEmail('');
    setLoginPassword('');
    triggerToast(`✨ ${displayName}님 환영합니다!`);
  };

  // Google 1-second Login handler
  const handleGoogleLogin = () => {
    const userData: User = {
      name: '김커피',
      email: 'coffee.lover@gmail.com',
      isLoggedIn: true,
    };

    setCurrentUser(userData);
    try {
      localStorage.setItem('rangroo_user', JSON.stringify(userData));
    } catch (err) {
      console.error(err);
    }

    setIsLoginModalOpen(false);
    triggerToast('✨ 구글 계정으로 로그인되었습니다!');
  };

  // Logout handler
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prevName = currentUser?.name || '회원';
    setCurrentUser(null);
    try {
      localStorage.removeItem('rangroo_user');
    } catch (err) {
      console.error(err);
    }
    triggerToast(`👋 ${prevName}님 로그아웃 되었습니다.`);
  };

  // Quantity modifiers
  const updateQty = (id: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="min-h-screen bg-[#ebedec] text-[#1e1b18]">
      {/* Toast Notification (Top-Right, 2 Seconds) */}
      {toastMessage && (
        <div className="toast-notification" role="status" aria-live="polite">
          <i className="fa-solid fa-mug-hot toast-coffee-icon"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <a href="#" className="brand-logo">
            <img
              src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/bXfGXLhhTmBfS34V1urONg?authuser=0"
              alt="rangroo Caffe Logo"
            />
            <span>rangroo Caffe</span>
          </a>

          <nav>
            <ul className="nav-menu">
              <li><a href="#story" className="nav-link">Story</a></li>
              <li><a href="#values" className="nav-link">Core Values</a></li>
              <li><a href="#products" className="nav-link">Coffee Beans</a></li>
              <li><a href="#order" className="nav-link">Coffee Menu</a></li>
              <li><a href="#atmosphere" className="nav-link">Atmosphere</a></li>
              <li><a href="#reviews" className="nav-link">Reviews</a></li>
              <li><a href="#location" className="nav-link">Visit Us</a></li>
            </ul>
          </nav>

          {/* Header Right Action Area with Cart and Login/Logout Buttons */}
          <div className="header-right-group">
            <a href="#order" className="cta-placeholder-btn">[Your link here]</a>

            {/* Cart Badge Element with eye-catching red badge */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="cart-header-btn"
              title="클릭하여 장바구니 확인"
            >
              <span>🛒 Cart:</span>
              <span className="cart-red-badge">{cartCount}</span>
            </button>

            {/* Login or 000님 (로그아웃) button */}
            {currentUser && currentUser.isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="user-btn"
                title="클릭 시 로그아웃됩니다"
              >
                <i className="fa-solid fa-user-check text-emerald-400"></i>
                <span>{currentUser.name}님</span>
                <span className="logout-hint text-xs opacity-80 underline ml-0.5">(로그아웃)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="login-btn"
              >
                <i className="fa-regular fa-user"></i>
                <span>로그인</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section" id="story">
          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="hero-badge-text">Specialty Coffee &amp; Cozy Haven</span>
              </div>
              <h1 className="hero-headline">한모금의 여유,<br />남부 이탈리아의 햇살을 담다</h1>
              <p className="hero-subtext">
                rangroo Caffe는 바쁜 일상에 치여 진정한 쉼을 필요로 하는 2040 직장인을 위한 스페셜티 커피 브랜드입니다. 정직한 시간과 정성을 들이는 슬로우 로스팅 원두를 바탕으로 이탈리아 남부의 맑고 여유로운 아침을 연상시키는 cozy한 공간 경험을 드립니다.
              </p>

              {/* Generated visual snippet inside hero layout */}
              <div style={{ marginTop: '1.5rem', maxWidth: '420px', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'rgba(237, 179, 153, 0.15)', padding: '1.25rem', border: '1px solid var(--color-peach)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/aFIK4J1Uy2gfog8GtwB4bx?authuser=0"
                    alt="Warm espresso crema"
                    style={{ width: '60px', height: '60px', borderRadius: '8px' }}
                  />
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-terracotta)' }}>MINDFUL CRAFT</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-dark-subtle)' }}>도심 속 온전히 나만의 사색과 휴식에 몰입할 수 있는 안식처</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-media-grid">
              <div className="hero-img-main">
                <img
                  src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/9ybWT9m8dYQcVEddVfV_1s?authuser=0"
                  alt="Warm sunny tabletop with coffee and flowers"
                />
              </div>
              <div className="hero-img-sub">
                <img
                  src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/971dJnmGlQQ6K3kA7vN_qy?authuser=0"
                  alt="Cozy cafe visitor holding coffee cup"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="values-section" id="values">
          <div className="values-container">
            <span className="mono-tag">Core Principles</span>
            <h2 className="section-title">진정성과 사려깊은 배려</h2>
            <p className="section-desc">rangroo Caffe가 추구하는 세 가지 핵심 가치는 일상 속 온전한 회복을 선사합니다.</p>

            <div className="values-grid">
              <div className="value-card">
                <div className="value-number">01</div>
                <h3 className="value-title">진정성 있는 느림</h3>
                <div className="value-subtitle">Mindful Craft</div>
                <p className="value-desc">정직한 시간과 정성을 들이는 슬로우 로스팅 과정. 원두 본연의 섬세한 풍미를 온전히 살려 깊고 차분한 한 잔의 성찰을 완성합니다.</p>
              </div>

              <div className="value-card">
                <div className="value-number">02</div>
                <h3 className="value-title">온전한 쉼</h3>
                <div className="value-subtitle">Genuine Restoration</div>
                <p className="value-desc">남부 이탈리아의 맑고 여유로운 아침 햇빛을 닮은 안식처. 어떤 방해도 없이 온전히 나만의 생각과 감각에 집중하는 시간을 제공합니다.</p>
              </div>

              <div className="value-card">
                <div className="value-number">03</div>
                <h3 className="value-title">담백한 배려</h3>
                <div className="value-subtitle">Thoughtful Simplicity</div>
                <p className="value-desc">눈의 피로를 덜어주는 따뜻한 조명 연출과 군더더기 없는 가구 및 동선 배치. 방문객의 휴식을 가로막는 요소를 정갈하게 비워냈습니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Craft Banner Section */}
        <section className="craft-banner">
          <div className="craft-container">
            <div className="craft-content">
              <span className="mono-tag">Roasting Process</span>
              <h2 className="craft-title">장인정신으로 다듬어지는<br />슬로우 로스팅의 깊은 풍미</h2>
              <p className="craft-text">
                매일 아침 엄선된 스페셜티 생두를 정교하게 볶아냅니다. 눈의 피로를 덜어주는 조명 아래, 차분하고 정중한 어조로 건네는 커피 한 잔에는 남부 이탈리아의 따스함과 미니멀한 여유가 그대로 녹아있습니다.
              </p>
            </div>
            <div className="craft-img-wrapper">
              <img
                src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/aaiDLgA9Mwtbh3E2inY4z4?authuser=0"
                alt="Coffee beans stirring in stainless roaster with rising smoke"
              />
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="products-section" id="products">
          <div className="products-container">
            <span className="mono-tag">Our Collection</span>
            <h2 className="section-title">스페셜티 커피 컬렉션</h2>
            <p className="section-desc">정직한 로스팅 원두로 만나는 rangroo Caffe의 시그니처 렌지입니다.</p>

            <div className="products-grid">
              {/* Product 1 */}
              <div className="product-card">
                <div className="product-image-container">
                  <img
                    src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/aNPj9JCxlKS5aYDrGt7_vB?authuser=0"
                    alt="Roaster’s Choice Collection Package"
                  />
                </div>
                <div className="product-body">
                  <h3 className="product-title">Roaster’s Choice Collection</h3>
                  <p className="product-desc">A curated trio of our finest coffees, featuring diverse origins and processing methods to provide a complete tasting experience from around the world.</p>

                  <table className="product-spec-table">
                    <tbody>
                      <tr>
                        <th>Included Items</th>
                        <td>Ethiopia Yirgacheffe, Colombia Huila, and Brazilian Santos</td>
                      </tr>
                      <tr>
                        <th>Tasting Scope</th>
                        <td>Bright, floral African notes to deep, chocolatey South American profiles</td>
                      </tr>
                      <tr>
                        <th>Features</th>
                        <td>Perfect for gifting or discovering your favorite daily brew across different roast spectrums</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="order-submit-btn"
                      style={{ padding: '0.75rem 1.25rem' }}
                    >
                      <i className="fa-solid fa-cart-shopping"></i> Add to Cart (장바구니 담기)
                    </button>
                  </div>
                </div>
              </div>

              {/* Product 2 */}
              <div className="product-card">
                <div className="product-image-container">
                  <img
                    src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/9C97XAlJeAmbD1EE-iMkOw?authuser=0"
                    alt="Roaster’s Ethiopia Guji Coffee Bag"
                  />
                </div>
                <div className="product-body">
                  <h3 className="product-title">Roaster’s Ethiopia Guji</h3>
                  <p className="product-desc">Experience the vibrant and complex flavors of Ethiopia with our premium Guji single-origin beans, roasted to perfection for a clean and aromatic cup.</p>

                  <table className="product-spec-table">
                    <tbody>
                      <tr>
                        <th>Roast Level</th>
                        <td>Light Roast</td>
                      </tr>
                      <tr>
                        <th>Flavor Profile</th>
                        <td>Distinct notes of jasmine and stone fruit</td>
                      </tr>
                      <tr>
                        <th>Net Weight</th>
                        <td>12 oz (340g)</td>
                      </tr>
                      <tr>
                        <th>Features</th>
                        <td>Sustainably sourced, single-origin Arabica beans</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="order-submit-btn"
                      style={{ padding: '0.75rem 1.25rem' }}
                    >
                      <i className="fa-solid fa-cart-shopping"></i> Add to Cart (장바구니 담기)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coffee Order Section */}
        <section className="order-section" id="order">
          <div className="order-container">
            <span className="mono-tag">Freshly Brewed Order</span>
            <h2 className="section-title">커피 메뉴 주문하기</h2>
            <p className="section-desc">슬로우 로스팅 원두로 정성스럽게 추출하는 rangroo Caffe의 수제 음료를 온라인으로 간편하게 주문하세요.</p>

            <div className="order-grid">
              {/* Order Item 1: Cappuccino */}
              <div className="order-card">
                <div className="order-img-box">
                  <img
                    src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/8WBrVpIclg478HYM18L_ql?authuser=0"
                    alt="카푸치노 Cappuccino"
                  />
                  <span className="order-badge">BEST</span>
                </div>
                <div className="order-details">
                  <div className="order-title-price">
                    <h3 className="order-item-title">
                      카푸치노
                      <span className="en-name">Cappuccino</span>
                    </h3>
                    <span className="order-price">₩6,000</span>
                  </div>
                  <p className="order-item-desc">벨벳처럼 부드럽고 촘촘한 스팀 밀크폼과 깊은 에스프레소가 이루는 완벽한 이탈리안 밸런스.</p>

                  <div className="order-options">
                    <div className="option-group">
                      <span className="option-label">온도</span>
                      <div className="pill-options">
                        <button
                          type="button"
                          className={`pill-btn ${coffeeTemp[1] === 'HOT' ? 'active' : ''}`}
                          onClick={() => setCoffeeTemp(prev => ({ ...prev, 1: 'HOT' }))}
                        >
                          HOT
                        </button>
                        <button
                          type="button"
                          className={`pill-btn ${coffeeTemp[1] === 'ICE' ? 'active' : ''}`}
                          onClick={() => setCoffeeTemp(prev => ({ ...prev, 1: 'ICE' }))}
                        >
                          ICE
                        </button>
                      </div>
                    </div>
                    <div className="option-group">
                      <span className="option-label">사이즈</span>
                      <div className="pill-options">
                        <button
                          type="button"
                          className={`pill-btn ${coffeeSize[1] === 'Regular' ? 'active' : ''}`}
                          onClick={() => setCoffeeSize(prev => ({ ...prev, 1: 'Regular' }))}
                        >
                          Regular
                        </button>
                        <button
                          type="button"
                          className={`pill-btn ${coffeeSize[1] === 'Large' ? 'active' : ''}`}
                          onClick={() => setCoffeeSize(prev => ({ ...prev, 1: 'Large' }))}
                        >
                          Large (+₩500)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="order-card-action">
                    <div className="qty-control">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQty(1, -1)}
                      >
                        -
                      </button>
                      <span className="qty-num">{quantities[1] || 1}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQty(1, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="order-submit-btn"
                    >
                      <i className="fa-solid fa-cart-shopping"></i> Add to Cart (주문에 담기)
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Item 2: Caffè Latte */}
              <div className="order-card">
                <div className="order-img-box">
                  <img
                    src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/aW5MhNK4e1v7e7VzJCQk7q?authuser=0"
                    alt="카페 라떼 Caffè Latte"
                  />
                  <span className="order-badge">POPULAR</span>
                </div>
                <div className="order-details">
                  <div className="order-title-price">
                    <h3 className="order-item-title">
                      카페 라떼
                      <span className="en-name">Caffè Latte</span>
                    </h3>
                    <span className="order-price">₩6,000</span>
                  </div>
                  <p className="order-item-desc">고소한 고품질 우유와 남부 이탈리아 스타일 슬로우 로스팅 원두의 은은하고 부드러운 하모니.</p>

                  <div className="order-options">
                    <div className="option-group">
                      <span className="option-label">온도</span>
                      <div className="pill-options">
                        <button
                          type="button"
                          className={`pill-btn ${coffeeTemp[2] === 'HOT' ? 'active' : ''}`}
                          onClick={() => setCoffeeTemp(prev => ({ ...prev, 2: 'HOT' }))}
                        >
                          HOT
                        </button>
                        <button
                          type="button"
                          className={`pill-btn ${coffeeTemp[2] === 'ICE' ? 'active' : ''}`}
                          onClick={() => setCoffeeTemp(prev => ({ ...prev, 2: 'ICE' }))}
                        >
                          ICE
                        </button>
                      </div>
                    </div>
                    <div className="option-group">
                      <span className="option-label">사이즈</span>
                      <div className="pill-options">
                        <button
                          type="button"
                          className={`pill-btn ${coffeeSize[2] === 'Regular' ? 'active' : ''}`}
                          onClick={() => setCoffeeSize(prev => ({ ...prev, 2: 'Regular' }))}
                        >
                          Regular
                        </button>
                        <button
                          type="button"
                          className={`pill-btn ${coffeeSize[2] === 'Large' ? 'active' : ''}`}
                          onClick={() => setCoffeeSize(prev => ({ ...prev, 2: 'Large' }))}
                        >
                          Large (+₩500)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="order-card-action">
                    <div className="qty-control">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQty(2, -1)}
                      >
                        -
                      </button>
                      <span className="qty-num">{quantities[2] || 1}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQty(2, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="order-submit-btn"
                    >
                      <i className="fa-solid fa-cart-shopping"></i> Add to Cart (주문에 담기)
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Item 3: Espresso */}
              <div className="order-card">
                <div className="order-img-box">
                  <img
                    src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/9wwblO6hGIQ2lbHyE4g_Nv?authuser=0"
                    alt="에스프레소 Espresso"
                  />
                </div>
                <div className="order-details">
                  <div className="order-title-price">
                    <h3 className="order-item-title">
                      에스프레소
                      <span className="en-name">Espresso</span>
                    </h3>
                    <span className="order-price">₩5,000</span>
                  </div>
                  <p className="order-item-desc">풍부한 크레마와 깊고 묵직한 바디감. 정직한 시간으로 완성된 진정한 이탈리아 스페셜티 잔.</p>

                  <div className="order-options">
                    <div className="option-group">
                      <span className="option-label">온도</span>
                      <div className="pill-options">
                        <button
                          type="button"
                          className={`pill-btn ${coffeeTemp[3] === 'HOT' ? 'active' : ''}`}
                          onClick={() => setCoffeeTemp(prev => ({ ...prev, 3: 'HOT' }))}
                        >
                          HOT
                        </button>
                      </div>
                    </div>
                    <div className="option-group">
                      <span className="option-label">옵션</span>
                      <div className="pill-options">
                        <button
                          type="button"
                          className={`pill-btn ${coffeeSize[3] === '기본 (2 Shot)' ? 'active' : ''}`}
                          onClick={() => setCoffeeSize(prev => ({ ...prev, 3: '기본 (2 Shot)' }))}
                        >
                          기본 (2 Shot)
                        </button>
                        <button
                          type="button"
                          className={`pill-btn ${coffeeSize[3] === '3 Shot' ? 'active' : ''}`}
                          onClick={() => setCoffeeSize(prev => ({ ...prev, 3: '3 Shot' }))}
                        >
                          3 Shot (+₩500)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="order-card-action">
                    <div className="qty-control">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQty(3, -1)}
                      >
                        -
                      </button>
                      <span className="qty-num">{quantities[3] || 1}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQty(3, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="order-submit-btn"
                    >
                      <i className="fa-solid fa-cart-shopping"></i> Add to Cart (주문에 담기)
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Item 4: Vanilla Bean Latte */}
              <div className="order-card">
                <div className="order-img-box">
                  <img
                    src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/9ybWT9m8dYQcVEddVfV_1s?authuser=0"
                    alt="바닐라 빈 라떼 Vanilla Bean Latte"
                  />
                  <span className="order-badge">SIGNATURE</span>
                </div>
                <div className="order-details">
                  <div className="order-title-price">
                    <h3 className="order-item-title">
                      바닐라 빈 라떼
                      <span className="en-name">Vanilla Bean Latte</span>
                    </h3>
                    <span className="order-price">₩6,500</span>
                  </div>
                  <p className="order-item-desc">천연 마다가스카르 바닐라 빈 수제 시럽의 고급스러운 단맛과 다크 로스팅 원두의 매혹적인 조화.</p>

                  <div className="order-options">
                    <div className="option-group">
                      <span className="option-label">온도</span>
                      <div className="pill-options">
                        <button
                          type="button"
                          className={`pill-btn ${coffeeTemp[4] === 'HOT' ? 'active' : ''}`}
                          onClick={() => setCoffeeTemp(prev => ({ ...prev, 4: 'HOT' }))}
                        >
                          HOT
                        </button>
                        <button
                          type="button"
                          className={`pill-btn ${coffeeTemp[4] === 'ICE' ? 'active' : ''}`}
                          onClick={() => setCoffeeTemp(prev => ({ ...prev, 4: 'ICE' }))}
                        >
                          ICE
                        </button>
                      </div>
                    </div>
                    <div className="option-group">
                      <span className="option-label">사이즈</span>
                      <div className="pill-options">
                        <button
                          type="button"
                          className={`pill-btn ${coffeeSize[4] === 'Regular' ? 'active' : ''}`}
                          onClick={() => setCoffeeSize(prev => ({ ...prev, 4: 'Regular' }))}
                        >
                          Regular
                        </button>
                        <button
                          type="button"
                          className={`pill-btn ${coffeeSize[4] === 'Large' ? 'active' : ''}`}
                          onClick={() => setCoffeeSize(prev => ({ ...prev, 4: 'Large' }))}
                        >
                          Large (+₩500)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="order-card-action">
                    <div className="qty-control">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQty(4, -1)}
                      >
                        -
                      </button>
                      <span className="qty-num">{quantities[4] || 1}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQty(4, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="order-submit-btn"
                    >
                      <i className="fa-solid fa-cart-shopping"></i> Add to Cart (주문에 담기)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Pickup & Checkout Banner */}
            <div className="order-summary-box">
              <div className="summary-info">
                <i className="fa-solid fa-mug-hot summary-icon"></i>
                <div>
                  <h4 className="summary-title">픽업 및 예약 결제 안내</h4>
                  <p className="summary-text">매장 방문 전 온라인 사전 주문으로 기다림 없이 따뜻하고 신선한 커피를 즐겨보세요.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="checkout-btn"
              >
                <span>장바구니 담기 및 결제</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </section>

        {/* Space & Atmosphere Section */}
        <section className="atmosphere-section" id="atmosphere">
          <div className="atmosphere-container">
            <span className="mono-tag">Spatial Experience</span>
            <h2 className="section-title">미니멀리즘과 따스함이 머무는 공간</h2>
            <p className="section-desc">군더더기 없는 동선과 감각적인 가구 연출로 도심 한가운데에서 이탈리아 남부의 맑고 여유로운 아침 분위기를 재현합니다.</p>

            <div className="gallery-grid">
              <div className="gallery-item gallery-item-1">
                <div
                  style={{
                    backgroundImage: "url('https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/95h2a3sK9SVevkPTNVM_74?authuser=0')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100%',
                    borderRadius: 'var(--border-radius-lg)',
                    minHeight: '260px'
                  }}
                ></div>
              </div>
              <div className="gallery-item gallery-item-2">
                <img
                  src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/8LSdU4ge0UTfNSJyCEl4XB?authuser=0"
                  alt="Clear block of ice holding white coffee cup with latte art with golden bokeh"
                />
              </div>
              <div className="gallery-item gallery-item-3">
                <img
                  src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/bvSiQHa-GPR5n_dnsFw4kg?authuser=0"
                  alt="Bean Roasters Storefront street exterior"
                />
              </div>
            </div>

            <div className="atmosphere-quote-box">
              <p className="atmosphere-quote-text">
                "눈의 피로를 덜어주는 따뜻한 조명과 정갈한 가구 배치 속에서, 방해받지 않고 온전히 나만의 사색과 휴식에 몰입해 보세요."
              </p>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="reviews-section" id="reviews">
          <div className="reviews-container">
            <span className="mono-tag">Guest Experiences</span>
            <h2 className="section-title">rangroo Caffe를 찾은 방문객의 이야기</h2>
            <p className="section-desc">정성 어린 시간과 공간이 주는 온전한 휴식의 순간들입니다.</p>

            <div className="reviews-grid">
              <div className="review-card">
                <div>
                  <div className="review-quote-mark">“</div>
                  <p className="review-text">"남 이탈리아 여행중에 마셨던 espresso의 깊은 풍미를 그대로 느낄수 있는 곳. 따뜻하고 편안한 분위기 덕분에 매주 찾게 됩니다."</p>
                </div>
                <div className="review-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
              </div>

              <div className="review-card">
                <div>
                  <div className="review-quote-mark">“</div>
                  <p className="review-text">"정성스럽게 로스팅한 원두라 그런지 향이 정말 남달라요. 도심속에서 조용히 힐링하고 싶을때 가장 먼저 생각나는 카페입니다."</p>
                </div>
                <div className="review-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
              </div>

              <div className="review-card">
                <div>
                  <div className="review-quote-mark">“</div>
                  <p className="review-text">"친절한 바리스타와 아늑한 조명, 그리고 완벽한 커피 한 잔. 주말 오전을 보내기에 이보다 더 좋은 장소는 없어요."</p>
                </div>
                <div className="review-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
              </div>

              <div className="review-card">
                <div>
                  <div className="review-quote-mark">“</div>
                  <p className="review-text">"원두 구독 서비스를 이용중인데 매번 신선하고 고소한 향에 감탄합니다. 정직한 로스팅이 느껴집니다."</p>
                </div>
                <div className="review-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location & Contact Section */}
        <section className="location-section" id="location">
          <div className="location-container">
            <div className="location-info">
              <span className="mono-tag">Visit &amp; Hours</span>
              <h2 className="location-title">일상 속 안식처로의 초대</h2>

              <div className="info-group">
                <div className="info-label">Address</div>
                <div className="info-value">충남 당진시 석문면 왜목마을, 충남 당진시, South Korea</div>
              </div>

              <div className="info-group">
                <div className="info-label">Contact</div>
                <div className="info-value">010-1234-5678</div>
              </div>

              <div className="info-group">
                <div className="info-label">Operating Hours</div>
                <ul className="hours-list">
                  <li className="hours-item"><span>Monday – Friday</span> <span>9:00 AM - 10:00 PM</span></li>
                  <li className="hours-item"><span>Saturday</span> <span>9:00 AM - 10:00 PM</span></li>
                  <li className="hours-item"><span>Sunday</span> <span>10:00 AM - 6:00 PM</span></li>
                </ul>
              </div>

              <div className="social-links">
                <a
                  href="https://www.instagram.com/rangroo_ss"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn"
                  aria-label="Instagram"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </div>
            </div>

            <div className="location-image-box">
              <img
                src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/aEuwVRGd3nH0oIkJnVWOzN?authuser=0"
                alt="Barista pouring milk into coffee in cozy rustic shop setting"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Login Modal Popup */}
      <div
        className={`login-modal ${isLoginModalOpen ? 'active' : ''}`}
        style={{ display: isLoginModalOpen ? 'flex' : 'none' }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsLoginModalOpen(false);
        }}
      >
        <div className="login-box">
          <button
            type="button"
            className="modal-close"
            onClick={() => setIsLoginModalOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
          <div className="login-header">
            <img
              src="https://labs.google.com/pomelli_downloads/websites/9ZhFp22vRBQfegZrFnlkbL/resources/bXfGXLhhTmBfS34V1urONg?authuser=0"
              alt="rangroo Caffe Logo"
              className="login-logo"
            />
            <h3 className="login-title">rangroo Caffe 로그인</h3>
            <p className="login-subtitle">남부 이탈리아의 햇살과 함께하는 특별한 커피 여정</p>
          </div>

          {/* Google 1-Sec Login Button */}
          <button
            type="button"
            className="google-login-btn"
            onClick={handleGoogleLogin}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>구글 계정으로 1초 로그인</span>
          </button>

          <div className="login-divider">또는 일반 계정으로 로그인</div>

          {/* Standard Email & Password Form */}
          <form className="login-form" onSubmit={handleNormalLogin}>
            <div className="form-group">
              <label htmlFor="user-email" className="form-label">아이디 또는 이메일 주소</label>
              <input
                type="text"
                id="user-email"
                className="form-input"
                placeholder="example@rangroo.com 또는 아이디"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="user-password" className="form-label">비밀번호</label>
              <input
                type="password"
                id="user-password"
                className="form-input"
                placeholder="비밀번호를 입력하세요"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-aux">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>로그인 상태 유지</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); triggerToast('비밀번호 재설정 링크가 발송되었습니다.'); }} className="forgot-link">비밀번호 찾기</a>
            </div>
            <button type="submit" className="login-submit-btn">로그인</button>
            <div className="login-footer-text">
              아직 회원이 아니신가요?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // Quick sign-up mock that registers
                  const demoUser: User = { name: '신규회원', email: 'new@rangroo.com', isLoggedIn: true };
                  setCurrentUser(demoUser);
                  localStorage.setItem('rangroo_user', JSON.stringify(demoUser));
                  setIsLoginModalOpen(false);
                  triggerToast('🎉 신규 회원가입 및 로그인이 완료되었습니다!');
                }}
                className="signup-link"
              >
                회원가입
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-brand-title">rangroo Caffe</div>
            <div>충남 당진시 석문면 왜목마을, 충남 당진시 | Tel. 010-1234-5678</div>
            <div className="keywords-tags">
              <span className="tag-item">#rangroo Caffe</span>
              <span className="tag-item">#Cozy</span>
              <span className="tag-item">#Italia coffe</span>
            </div>
          </div>

          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              Official Store: <a href="https://beanroasters.example.com" target="_blank" rel="noreferrer" className="footer-website-link">beanroasters.example.com</a>
            </div>
            <div className="footer-copyright">
              © rangroo Caffe. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
