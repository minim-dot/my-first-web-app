
const products = [
  { id:1, name:'モイスチャーリフト セラム', brand:'LUMIÈRE', price:7800, category:'skin', emoji:'🧴', bg:'#F5EDE8', badge:'ベストセラー', desc:'ヒアルロン酸×レチノール 高浸透美容液' },
  { id:2, name:'ローズ グロウ ファンデーション', brand:'LUMIÈRE', price:6200, category:'base', emoji:'💄', bg:'#F0E8F0', badge:'新作', desc:'SPF30 PA++ 軽いつけ心地の素肌感ファンデ' },
  { id:3, name:'ベルベット リップ カラー', brand:'LUMIÈRE', price:3800, category:'lips', emoji:'💋', bg:'#FAEBE8', badge:null, desc:'マットな仕上がり 6時間持続処方' },
  { id:4, name:'シルクボディローション', brand:'LUMIÈRE', price:5500, category:'body', emoji:'🌸', bg:'#EBF0E8', badge:'人気No.1', desc:'桜エキス配合 しっとりなめらか素肌へ' },
  { id:5, name:'アクア バランシング クリーム', brand:'LUMIÈRE', price:9800, category:'skin', emoji:'✨', bg:'#E8EEF5', badge:null, desc:'敏感肌・混合肌向け 24時間保湿クリーム' },
  { id:6, name:'グロスフィニッシュ コンシーラー', brand:'LUMIÈRE', price:4200, category:'base', emoji:'🪞', bg:'#F5F0E8', badge:null, desc:'カバー力◎ 自然なツヤ肌に' },
  { id:7, name:'プランプ グロス リップ', brand:'LUMIÈRE', price:3200, category:'lips', emoji:'🍑', bg:'#FEF0E8', badge:'新作', desc:'プランピング効果 うるうる艶リップ' },
  { id:8, name:'アロマバスエッセンス', brand:'LUMIÈRE', price:4800, category:'body', emoji:'🛁', bg:'#E8F5F0', badge:null, desc:'ローズ＆ジャスミンの香り リラックスバスタイム' },
];

let cart = [];
let currentFilter = 'all';

function filterProducts(cat) {
  currentFilter = cat;
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  const navLinks = document.querySelectorAll('nav a');
  const idx = ['all','skin','base','lips','body'].indexOf(cat);
  if(navLinks[idx]) navLinks[idx].classList.add('active');

  const titles = { all:'人気商品', skin:'スキンケア', base:'ベースメイク', lips:'リップ', body:'ボディケア' };
  document.getElementById('sectionTitle').textContent = titles[cat];
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const filtered = currentFilter === 'all' ? products : products.filter(p => p.category === currentFilter);
  document.getElementById('productCount').textContent = filtered.length + '点';

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-img" style="background:${p.bg}">
        <div class="product-placeholder">
          <div class="product-icon" style="background:rgba(255,255,255,0.6)">${p.emoji}</div>
        </div>
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <span class="product-price">¥${p.price.toLocaleString()}</span>
          <button class="add-btn" onclick="addToCart(${p.id})">カートに追加</button>
        </div>
      </div>
    </div>
  `).join('');
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if(existing) { existing.qty++; }
  else { cart.push({ ...product, qty: 1 }); }
  updateCartCount();
  showToast(product.name + ' をカートに追加しました');
}

function updateCartCount() {
  const total = cart.reduce((s,c) => s + c.qty, 0);
  document.getElementById('cartCount').textContent = total;
}

function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartSidebar').classList.add('open');
  renderCart();
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartSidebar').classList.remove('open');
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  if(cart.length === 0) {
    container.innerHTML = '<div class="empty-cart">カートは空です</div>';
    footer.innerHTML = '';
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-brand">${item.brand}</div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-controls">
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
          <span class="cart-item-price">¥${(item.price * item.qty).toLocaleString()}</span>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">削除</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((s,c) => s + c.price * c.qty, 0);
  const shipping = subtotal >= 8000 ? 0 : 550;
  const total = subtotal + shipping;

  footer.innerHTML = `
    <div class="cart-summary">
      <div class="summary-row"><span>小計</span><span>¥${subtotal.toLocaleString()}</span></div>
      <div class="summary-row"><span>送料</span><span>${shipping === 0 ? '無料' : '¥'+shipping.toLocaleString()}</span></div>
      ${shipping > 0 ? `<div class="summary-row"><span style="color:var(--rose)">あと¥${(8000-subtotal).toLocaleString()}で送料無料</span></div>` : ''}
      <div class="summary-row total"><span>合計</span><span>¥${total.toLocaleString()}</span></div>
    </div>
    <button class="checkout-btn" onclick="checkout()">ご注文手続きへ</button>
    <p class="ship-note">✦ 平日14時までのご注文は即日発送</p>
  `;
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(c => c.id !== id);
  updateCartCount();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartCount();
  renderCart();
}

function checkout() {
  cart = [];
  updateCartCount();
  closeCart();
  document.getElementById('modalWrap').classList.add('open');
}

function closeModal() {
  document.getElementById('modalWrap').classList.remove('open');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// DOMの読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
});

