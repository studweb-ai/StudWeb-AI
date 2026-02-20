// ======================
// PANIER
// ======================

let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
    openCart();
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const total = document.getElementById("cart-total");

    if (!cartItems || !total) return;

    cartItems.innerHTML = "";
    let sum = 0;

    cart.forEach((item, index) => {
        sum += item.price;

        cartItems.innerHTML += `
            <div class="cart-item">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">${item.price}€</span>
                <button class="remove-item" onclick="removeFromCart(${index})">✕</button>
            </div>
        `;
    });

    total.innerText = "Total : " + sum + "€";
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function toggleCart() {
    const cartEl = document.getElementById("cart");
    if (cartEl) cartEl.classList.toggle("active");
}

function openCart() {
    const cartEl = document.getElementById("cart");
    if (cartEl) cartEl.classList.add("active");
}

function closeCart() {
    const cartEl = document.getElementById("cart");
    if (cartEl) cartEl.classList.remove("active");
}


// ======================
// CHECKOUT STRIPE
// ======================

async function checkout() {

    if (cart.length === 0) {
        alert("Votre panier est vide.");
        return;
    }

    try {
        const response = await fetch("/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ items: cart })
        });

        const session = await response.json();

        const stripe = Stripe("TA_CLE_PUBLIQUE_STRIPE"); // Remplace par ta clé
        stripe.redirectToCheckout({
            sessionId: session.id
        });

    } catch (error) {
        console.error("Erreur checkout :", error);
        alert("Une erreur est survenue lors du paiement.");
    }
}


// =============================
// INITIALISATION EMAILJS
// =============================

(function(){
    if (typeof emailjs !== "undefined") {
        emailjs.init("agJdKI8rIn-PgNfvb"); // Ta clé EmailJS
    }
})();


// =============================
// ENVOI FORMULAIRE DEVIS
// =============================

document.addEventListener("DOMContentLoaded", function () {

    const quoteForm = document.getElementById("quote-form");

    if (quoteForm) {
        quoteForm.addEventListener("submit", function(e) {
            e.preventDefault();

            emailjs.send("service_cwfn15m", "template_cyfiyzu", {
                name: this.name.value,
                email: this.email.value,
                company: this.company.value,
                projectType: this.projectType.value,
                description: this.description.value,
                to_email: "studweb.ai@gmail.com"
            })
            .then(() => {
                alert("Votre demande a été envoyée avec succès !");
                this.reset();
            })
            .catch((error) => {
                alert("Erreur lors de l'envoi. Vérifiez EmailJS.");
                console.log(error);
            });
        });
    }

});


// =============================
// ANIMATION REVEAL AU SCROLL
// =============================

function revealOnScroll() {
    const reveals = document.querySelectorAll(".reveal");

    reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            element.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);


// =============================
// HEADER SCROLL EFFECT PREMIUM
// =============================

const header = document.getElementById("mainHeader");

window.addEventListener("scroll", () => {

    const scroll = window.scrollY;
    const maxScroll = 250; // Plus grand = plus progressif

    let progress = scroll / maxScroll;
    if (progress > 1) progress = 1;

    // Header slide doux
    header.style.transform = `translate(-50%, ${-20 * progress}px)`;
    header.style.opacity = 1 - (progress * 0.3);

    // Nav slide + fade progressif
    nav.style.transform = `translate(-50%, ${-40 * progress}px)`;
    nav.style.opacity = 1 - progress;
});



// =============================
// MENU BURGER RESPONSIVE
// =============================

const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
}


// =============================
// HEADER SCROLL EFFECT PREMIUM
// =============================

const headerContainer = document.querySelector(".header-container");

// ⚠️ utilise le nav déjà existant si tu l’as déclaré plus haut
// sinon décommente la ligne suivante :
// const nav = document.querySelector(".nav");

window.addEventListener("scroll", () => {

    const scroll = window.scrollY;
    const maxScroll = 250; // plus grand = plus progressif

    let progress = scroll / maxScroll;
    if (progress > 1) progress = 1;

    // Slide vertical doux
    header.style.transform = `translate(-50%, ${-20 * progress}px)`;
    header.style.opacity = 1 - (progress * 0.3);

    // Menu slide + fade
    nav.style.transform = `translate(-50%, ${-40 * progress}px)`;
    nav.style.opacity = 1 - progress;

    // Fond + bordure disparaissent progressivement
    headerContainer.style.background = `rgba(40, 40, 40, ${0.75 * (1 - progress)})`;
    headerContainer.style.borderColor = `rgba(255,255,255, ${0.1 * (1 - progress)})`;
});

function updateBackground() {

    const scroll = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;

    let progress = scroll / maxScroll;
    if (progress > 1) progress = 1;

    // Blanc
    const startR = 255;
    const startG = 255;
    const startB = 255;

    // Violet clair premium
    const endR = 180;
    const endG = 120;
    const endB = 255;

    const r = Math.round(startR + (endR - startR) * progress);
    const g = Math.round(startG + (endG - startG) * progress);
    const b = Math.round(startB + (endB - startB) * progress);

    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // =============================
    // GLOW progressif
    // =============================

    const glowStrength = progress * 25; // intensité max

    const logo = document.querySelector(".logo img");
    const cart = document.querySelector(".cart-icon");

    if (logo) {
        logo.style.filter = `drop-shadow(0 0 ${glowStrength}px rgba(160, 100, 255, 0.8))`;
    }

    if (cart) {
        cart.style.filter = `drop-shadow(0 0 ${glowStrength}px rgba(160, 100, 255, 0.8))`;
    }
}

// Optimisation ultra fluide
let ticking = false;

window.addEventListener("scroll", () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateBackground();
            ticking = false;
        });
        ticking = true;
    }
});
