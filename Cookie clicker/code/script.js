let cookie = document.getElementById("cookie")
let cookieCounter = document.getElementById("cookieCounter")
let buyClicker = document.getElementById("buyClicker")
let buyClicksPerClick = document.getElementById("buyClicksPerClick")
let title = document.getElementById("title")
let resetButton = document.getElementById("resetButton")

cookie.addEventListener("click", clickCookie)
buyClicker.addEventListener("click", () => buyUpgrade('cps', "add", 0.2, 'buyClickerCost', 1.15))
buyClicksPerClick.addEventListener("click", () => buyUpgrade('cpc', "add", 1, 'buyClicksPerClickCost', 1.45))
buyGrandma.addEventListener("click", () => buyUpgrade('cps', "add", 5, 'buyGrandmaCost', 1.35))
buyCpcMultiplyer.addEventListener("click", () => buyUpgrade('cpcMultiplier', "multiply", 2, 'buyCpcMultiplyerCost', 2.5))
resetButton.addEventListener("click", () => resetGame(true))

let game = {
    cookies: 0,
    cps: 0,
    cpc: 1,
    buyClickerCost: 25,
    buyClicksPerClickCost: 150,
    buyGrandmaCost: 500,
    buyCpcMultiplyerCost: 400,
    fractionalCookies: 0,
    cpcMultiplier: 1
}

let lastTime = Date.now();

function resetGame(resetSave)
{
        game.cookies = 0
        game.cps = 0
        game.cpc = 1
        game.buyClickerCost = 25
        game.buyClicksPerClickCost = 300
        game.fractionalCookies = 0
        game.cpcMultiplier = 1
        if(resetSave && confirm("Are you sure you want to reset your progress?"))
        {
            localStorage.setItem('cookies', game.cookies);
            localStorage.setItem('cps', game.cps);
            localStorage.setItem('cpc', game.cpc);
            localStorage.setItem('buyClickerCost', game.buyClickerCost);
            localStorage.setItem('buyClicksPerClickCost', game.buyClicksPerClickCost);
            localStorage.setItem('buyGrandmaCost', game.buyGrandmaCost);
            localStorage.setItem('buyCpcMultiplyerCost', game.buyCpcMultiplyerCost);
            localStorage.setItem('cpcMultiplier', game.cpcMultiplier);
        }
        updateCookieCounter()
        updateBuyButtons()
}

let savedCookies = localStorage.getItem('cookies');
if (savedCookies !== null) {
    game.cookies = Number(savedCookies);
    updateCookieCounter();
}

let savedCps = localStorage.getItem('cps');
if (savedCps !== null) {
    game.cps = Number(savedCps);
    updateCookieCounter();
}

let savedCpc = localStorage.getItem('cpc');
if (savedCpc !== null) {
    game.cpc = Number(savedCpc);
}

let savedBuyClickerCost = localStorage.getItem('buyClickerCost');
if (savedBuyClickerCost !== null) {
    game.buyClickerCost = Number(savedBuyClickerCost);
    updateBuyButtons();
}

let savedBuyClicksPerClickCost = localStorage.getItem('buyClicksPerClickCost');
if (savedBuyClicksPerClickCost !== null) {
    game.buyClicksPerClickCost = Number(savedBuyClicksPerClickCost);
    updateBuyButtons();
}

let savedBuyCpcMultiplyerCost = localStorage.getItem('buyCpcMultiplyerCost');
if (savedBuyCpcMultiplyerCost !== null) {
    game.buyCpcMultiplyerCost = Number(savedBuyCpcMultiplyerCost);
    updateBuyButtons();
}

let savedBuyGrandmaCost = localStorage.getItem('buyGrandmaCost');
if (savedBuyGrandmaCost !== null) {
    game.buyGrandmaCost = Number(savedBuyGrandmaCost);
    updateBuyButtons();
}

let savedCpcMultiplier = localStorage.getItem('cpcMultiplier');
if (savedCpcMultiplier !== null) {
    game.cpcMultiplier = Number(savedCpcMultiplier);
}

updateBuyButtons()

function clickCookie(e)
{
    game.cookies += game.cpc * game.cpcMultiplier;
    updateCookieCounter()

    cookie.classList.add("pop");

    setTimeout(function() {
        cookie.classList.remove("pop");
    }, 100);

    spawnClickParticles(e.clientX, e.clientY)

    for (let i = 0; i < Math.min(game.cpc * game.cpcMultiplier, 25); i++)
    {
        spawnCookieParticleBurst(e.clientX, e.clientY)
    }
}

function spawnClickParticles(x, y)
{
    const p = document.createElement('div')
    p.className = 'click-particle'
    p.textContent = '+' + game.cpc * game.cpcMultiplier
    p.style.left = x + 'px'
    p.style.top = y + 'px'
    p.style.position = 'fixed'
    p.style.pointerEvents = 'none'
    p.style.userSelect = 'none'
    p.style.zIndex = '9999'
    p.style.fontSize = '27px'
    p.style.color = '#fff';
    p.style.fontWeight = 'bold';
    document.body.appendChild(p)

    y -= 50

    let vx = (2)
    let vy = -0.8
    let life = 185

    function frame() {
        x += vx
        y += vy
        vx *= 0.9

        p.style.left = x + 'px'
        p.style.top = y + 'px'
        p.style.opacity = Math.max(0, (life * 2) / 85)
        p.style.transform = `translate(-50%, -50%)`

        life--
        if (life > 0) requestAnimationFrame(frame)
        else p.remove()
    }

    requestAnimationFrame(frame)
}

function spawnCookieParticleFall(x, y)
{
    const p = document.createElement('div')
    p.className = 'click-particle'
    p.textContent = '🍪'
    p.style.left = x + 'px'
    p.style.top = y + 'px'
    p.style.position = 'fixed'
    p.style.pointerEvents = 'none'
    p.style.userSelect = 'none'
    p.style.zIndex = '-1'
    p.style.fontSize = '27px'
    p.style.color = '#fff';
    p.style.fontWeight = 'bold';
    document.body.appendChild(p)

    let vy = 2
    let life = 250 + Math.random() * 50

    function frame() {
        y += vy

        p.style.left = x
        p.style.top = y + 'px'
        p.style.opacity = Math.max(0, (life) / 150)
        p.style.transform = `translate(-50%, -50%)`

        life--
        if (life > 0) requestAnimationFrame(frame)
        else p.remove()
    }

    requestAnimationFrame(frame)
}

function spawnCookieParticleBurst(x, y)
{
    const p = document.createElement('div')
    p.className = 'cookie-particle'
    p.textContent = '🍪'
    p.style.left = x + 'px'
    p.style.top = y + 'px'
    p.style.opacity = '1'
    p.style.position = 'fixed'
    p.style.pointerEvents = 'none'
    p.style.userSelect = 'none'
    p.style.zIndex = '9998'
    p.style.fontSize = '22px'
    p.style.lineHeight = '1'

    document.body.appendChild(p)

    let vx = (Math.random() * 2 - 1) * (Math.random() * 2 + 1.5)
    let vy = - (Math.random() * 3 + 2.5)
    const gravity = 0.12
    let life = 85 + Math.random() * 30
    let rx = Math.random() * 360

    function frame() {
        x += vx
        y += vy
        vy += gravity
        vx *= 0.995
        rx += vx * 4

        p.style.left = x + 'px'
        p.style.top = y + 'px'
        p.style.opacity = Math.max(0, (life * 2) / 85)
        p.style.transform = `translate(-50%, -50%) rotate(${rx}deg)`

        life--
        if (life > 0) requestAnimationFrame(frame)
        else p.remove()
    }

    requestAnimationFrame(frame)
}

function updateCookieCounter()
{
    cookieCounter.innerHTML = (Math.round(game.cookies) >= 1_000_000 ? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(Math.round(game.cookies)) : Math.round(game.cookies).toLocaleString()) + "<p style='font-size: 18px;'>Cookies Per Second: " + Math.round(game.cps * 10) / 10 + "</p>";
    localStorage.setItem('cookies', game.cookies);
    title.innerHTML = Math.round(game.cookies).toLocaleString() + " Cookies"
}

function updateBuyButtons()
{
    buyClicker.innerHTML = ("Buy Clicker (" + (Math.round(game.buyClickerCost) >= 1_000_000 ? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(Math.round(game.buyClickerCost)) : Math.round(game.buyClickerCost).toLocaleString()) + "🍪)")
    buyClicksPerClick.innerHTML = ("Buy Clicks Per Click (" + (Math.round(game.buyClicksPerClickCost) >= 1_000_000 ? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(Math.round(game.buyClicksPerClickCost)) : Math.round(game.buyClicksPerClickCost).toLocaleString()) + "🍪)")
    buyGrandma.innerHTML = ("Buy Grandma (" + (Math.round(game.buyGrandmaCost) >= 1_000_000 ? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(Math.round(game.buyGrandmaCost)) : Math.round(game.buyGrandmaCost).toLocaleString()) + "🍪)")
    buyCpcMultiplyer.innerHTML = ("Buy CPC Upgrade (" + (Math.round(game.buyCpcMultiplyerCost) >= 1_000_000 ? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(Math.round(game.buyCpcMultiplyerCost)) : Math.round(game.buyCpcMultiplyerCost).toLocaleString()) + "🍪)")
}
function buyUpgrade(upgradeKey, upgradeMultOrAdd, amount, costKey, costMult)
{
    const currentUpgradeVal = (upgradeKey && game[upgradeKey] !== undefined) ? Number(game[upgradeKey]) : 0;
    const currentCostVal = (costKey && game[costKey] !== undefined) ? Number(game[costKey]) : 0;

    if (Math.round(game.cookies) >= currentCostVal && currentCostVal > 0)
    {
        let newUpgradeVal = currentUpgradeVal;

        if(upgradeMultOrAdd === "add")
        {
            newUpgradeVal = currentUpgradeVal + amount;
        }
        else if(upgradeMultOrAdd === "multiply")
        {
            newUpgradeVal = currentUpgradeVal * amount;
        }

        if (upgradeKey)
        {
            game[upgradeKey] = newUpgradeVal;
            localStorage.setItem(upgradeKey, newUpgradeVal);
        }

        game.cookies -= currentCostVal;

        if (costKey)
        {
            const newCost = currentCostVal * costMult;
            game[costKey] = newCost;
            localStorage.setItem(costKey, newCost);
        }

        updateCookieCounter();
        updateBuyButtons();
    }
}

function updateCookies(dt) {
    game.fractionalCookies += game.cps * dt;
    let whole = Math.floor(game.fractionalCookies);
    if (whole > 0) {
        game.cookies += whole;
        game.fractionalCookies -= whole;
        updateCookieCounter();
        if (isTabActive)
        {
            for (let i = 0; i < whole; i++) {
                spawnOneParticle();
            }
        }
    }
}

setInterval(function() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000;
    lastTime = now;

    updateCookies(dt);
}, 50);

function spawnOneParticle()
{
    const gameEl = document.getElementById("game");
    const rect = gameEl.getBoundingClientRect();

    const randomX = rect.left + Math.random() * rect.width * 0.9;
    const y = rect.top;

    spawnCookieParticleFall(randomX, y);
}

let isTabActive = true;

document.addEventListener("visibilitychange", function ()
{
    if (document.hidden) {
        isTabActive = false;
    } else {
        isTabActive = true;
        lastTime = Date.now();
    }
});

let buttons = document.querySelectorAll(".upgrade-btn");

buttons.forEach(button =>{

    let popup = button.nextElementSibling;

    button.addEventListener("mousemove", function(e) {
        popup.style.display = "block";
        popup.style.left = (e.clientX - popup.offsetWidth - 10) + "px";
        popup.style.top = (e.clientY + 10) + "px";
    });

    button.addEventListener("mouseleave", function() {
        popup.style.display = "none";
    });

});