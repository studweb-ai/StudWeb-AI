// ══════════════════════════════
// CART
// ══════════════════════════════
let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
    openCart();
    showToast(`${name} ajouté au panier`);
}

function updateCart() {
    const cartItemsEl = document.getElementById("cart-items");
    const totalAmountEl = document.getElementById("cart-amount");
    const badge = document.querySelector(".cart-badge");

    if (!cartItemsEl) return;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="cart-empty">
                <div class="empty-icon">🛍️</div>
                <p>Votre panier est vide</p>
            </div>`;
        if (totalAmountEl) totalAmountEl.textContent = "0€";
        if (badge) { badge.textContent = "0"; badge.classList.remove("visible"); }
        return;
    }

    const icons = { 'Basic': '⚡', 'Premium': '✦', 'Ultimate': '🚀' };

    cartItemsEl.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-icon">${icons[item.name] || '📦'}</div>
            <div class="cart-item-info">
                <span class="cart-item-name">Pack ${item.name}</span>
                <span class="cart-item-price">${item.price}€</span>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})" title="Supprimer">✕</button>
        </div>
    `).join("");

    const sum = cart.reduce((s, i) => s + i.price, 0);
    if (totalAmountEl) totalAmountEl.textContent = sum + "€";
    if (badge) {
        badge.textContent = cart.length;
        badge.classList.toggle("visible", cart.length > 0);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function toggleCart() {
    const cartEl = document.getElementById("cart");
    const overlay = document.getElementById("cartOverlay");
    if (cartEl) {
        const isActive = cartEl.classList.toggle("active");
        if (overlay) overlay.classList.toggle("active", isActive);
    }
}

function openCart() {
    const cartEl = document.getElementById("cart");
    const overlay = document.getElementById("cartOverlay");
    if (cartEl) { cartEl.classList.add("active"); }
    if (overlay) { overlay.classList.add("active"); }
}

function closeCart() {
    const cartEl = document.getElementById("cart");
    const overlay = document.getElementById("cartOverlay");
    if (cartEl) { cartEl.classList.remove("active"); }
    if (overlay) { overlay.classList.remove("active"); }
}

// ══════════════════════════════
// TOAST NOTIFICATION
// ══════════════════════════════
function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.style.cssText = `
            position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(20px);
            background: rgba(12,12,20,0.95); border: 1px solid rgba(124,92,252,0.4);
            color: #f0f0f8; padding: 12px 24px; border-radius: 50px;
            font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600;
            z-index: 9999; opacity: 0; transition: all 0.3s ease;
            backdrop-filter: blur(20px); white-space: nowrap;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = "✦ " + message;
    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
    });
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(10px)";
    }, 2500);
}

// ══════════════════════════════
// CHECKOUT STRIPE
// ══════════════════════════════
async function checkout() {
    if (cart.length === 0) {
        showToast("Votre panier est vide");
        return;
    }
    try {
        const response = await fetch("/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cart })
        });
        const session = await response.json();
        const stripe = Stripe("YOUR_STRIPE_KEY");
        stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
        console.error("Erreur checkout :", error);
        showToast("Erreur lors du paiement");
    }
}

// ══════════════════════════════
// EMAILJS
// ══════════════════════════════
(function(){
    if (typeof emailjs !== "undefined") {
        emailjs.init("agJdKI8rIn-PgNfvb");
    }
})();

document.addEventListener("DOMContentLoaded", function () {
    const quoteForm = document.getElementById("quote-form");
    if (quoteForm) {
        quoteForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const btn = this.querySelector(".btn-submit");
            btn.textContent = "Envoi en cours...";
            btn.disabled = true;
            emailjs.send("service_cwfn15m", "template_cyfiyzu", {
                name: this.name.value,
                email: this.email.value,
                company: this.company.value,
                projectType: this.projectType.value,
                description: this.description.value,
                to_email: "studweb.ai@gmail.com"
            })
            .then(() => {
                showToast("Demande envoyée avec succès !");
                this.reset();
                btn.textContent = "Envoyer la demande →";
                btn.disabled = false;
            })
            .catch((error) => {
                showToast("Erreur lors de l'envoi");
                btn.textContent = "Envoyer la demande →";
                btn.disabled = false;
                console.log(error);
            });
        });
    }

    // Initial cart render
    updateCart();
});

// ══════════════════════════════
// REVEAL ON SCROLL
// ══════════════════════════════
function revealOnScroll() {
    document.querySelectorAll(".reveal").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 80) {
            el.classList.add("active");
        }
    });
}
window.addEventListener("scroll", revealOnScroll, { passive: true });
window.addEventListener("load", revealOnScroll);

// ══════════════════════════════
// HEADER SCROLL EFFECT
// ══════════════════════════════
const header = document.getElementById("mainHeader");

let lastScroll = 0;
let headerHidden = false;

window.addEventListener("scroll", () => {
    const scroll = window.scrollY;
    
    if (scroll > 100) {
        if (scroll > lastScroll && !headerHidden) {
            header.style.transform = "translateX(-50%) translateY(-120%)";
            header.style.opacity = "0";
            headerHidden = true;
        } else if (scroll < lastScroll && headerHidden) {
            header.style.transform = "translateX(-50%) translateY(0)";
            header.style.opacity = "1";
            headerHidden = false;
        }
    } else {
        header.style.transform = "translateX(-50%) translateY(0)";
        header.style.opacity = "1";
        headerHidden = false;
    }
    
    lastScroll = scroll;
}, { passive: true });

// ══════════════════════════════
// DRAG SCROLL
// ══════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".scroll-track-wrapper");
    if (!track) return;
    
    let isDown = false, startX, scrollLeft;
    
    track.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.style.animationPlayState = "paused";
    });
    track.addEventListener("mouseleave", () => { isDown = false; });
    track.addEventListener("mouseup", () => { isDown = false; });
    track.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2;
        track.scrollLeft = scrollLeft - walk;
    });
});
