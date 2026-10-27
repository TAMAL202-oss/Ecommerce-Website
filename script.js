const cart = [];
const cartCount = document.getElementById('cartCount');
const drawerCount = document.getElementById('drawerCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}
function formatPrice(price) { return '₹' + Number(price).toLocaleString('en-IN'); }
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = count;
  drawerCount.textContent = `(${count})`;
  cartSubtotal.textContent = formatPrice(subtotal);
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your bag is waiting for something good.</p>';
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `<div class="cart-item"><div><strong>${item.name}</strong><p>${formatPrice(item.price)} × ${item.quantity}</p></div><div style="text-align:right"><strong>${formatPrice(item.price * item.quantity)}</strong><br><button data-remove="${index}">Remove</button></div></div>`).join('');
}
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) existing.quantity += 1;
  else cart.push({ name, price: Number(price), quantity: 1 });
  renderCart();
  showToast(`${name} added to your bag`);
}
function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  overlay.classList.add('visible');
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('visible');
}
document.querySelectorAll('.quick-add').forEach(button => button.addEventListener('click', () => addToCart(button.dataset.product, button.dataset.price)));
document.getElementById('cartButton').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
cartItems.addEventListener('click', event => {
  const removeButton = event.target.closest('[data-remove]');
  if (!removeButton) return;
  cart.splice(Number(removeButton.dataset.remove), 1);
  renderCart();
  showToast('Item removed from your bag');
});
document.getElementById('checkoutButton').addEventListener('click', () => {
  if (!cart.length) showToast('Add an item to your bag first');
  else showToast('Checkout is a demo — connect a payment provider to accept orders');
});

document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter-button').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected');
  const filter = button.dataset.filter;
  document.querySelectorAll('.product-card').forEach(card => {
    card.hidden = filter !== 'All' && card.dataset.category !== filter;
  });
}));
document.querySelectorAll('[data-category-link]').forEach(link => link.addEventListener('click', () => {
  const category = link.dataset.categoryLink;
  document.querySelectorAll('.filter-button').forEach(button => {
    button.classList.toggle('selected', button.dataset.filter === category);
  });
  document.querySelectorAll('.product-card').forEach(card => card.hidden = card.dataset.category !== category);
}));
const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');
menuToggle.addEventListener('click', () => {
  const isOpen = navbar.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});
navbar.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navbar.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
}));
document.getElementById('newsletterForm').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.getElementById('emailInput');
  document.getElementById('newsletterMessage').textContent = `Thanks! ${email.value} has been added for this demo.`;
  email.value = '';
});
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('showAllButton').addEventListener('click', () => showToast('You have seen all featured products'));
renderCart();
