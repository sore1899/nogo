let cookie = document.getElementById("cookie")
let cookieCounter = document.getElementById("cookieCounter")
let buyClicker = document.getElementById("buyClicker")
let buyClicksPerClick = document.getElementById("buyClicksPerClick")
let title = document.getElementById("title")
let resetButton = document.getElementById("resetButton")

cookie.addEventListener("click", clickCookie)
buyClicker.addEventListener("click", buyClickerFunction)
buyClicksPerClick.addEventListener("click", buyClicksPerClickFunction)
resetButton.addEventListener("click", resetGame)

let cookies = 0
let cps = 0
let buyClickerCost = 25
let buyClicksPerClickCost = 300
let cpc = 1
let fractionalCookies = 0;
let lastTime = Date.now();

let savedCookies = localStorage.getItem('cookies');
if (savedCookies !== null) {
    cookies = Number(savedCookies);
    updateCookieCounter();
}

let savedCps = localStorage.getItem('cps');
if (savedCps !== null) {
    cps = Number(savedCps);
}

let savedCpc = localStorage.getItem('cpc');
if (savedCpc !== null) {
    cpc = Number(savedCpc);
}

let savedBuyClickerCost = localStorage.getItem('buyClickerCost');
if (savedBuyClickerCost !== null) {
    buyClickerCost = Number(savedBuyClickerCost);
    updateBuyButtons();
}

let savedBuyClicksPerClickCost = localStorage.getItem('buyClicksPerClickCost');
if (savedBuyClicksPerClickCost !== null) {
    buyClicksPerClickCost = Number(savedBuyClicksPerClickCost);
    updateBuyButtons();
}

updateBuyButtons()

function resetGame()
{
    if(confirm("Are you sure you want to reset your progress?"))
    {
        cookies = 0
        cps = 0
        cpc = 1
        buyClickerCost = 25
        buyClicksPerClickCost = 300
        updateCookieCounter()
        updateBuyButtons()
        localStorage.setItem('cookies', cookies);
        localStorage.setItem('cps', cps);
        localStorage.setItem('cpc', cpc);
        localStorage.setItem('buyClickerCost', buyClickerCost);
        localStorage.setItem('buyClicksPerClickCost', buyClicksPerClickCost);
    }
}

function clickCookie(e)
{
    cookies += cpc
    updateCookieCounter()

    cookie.classList.add("pop");

    setTimeout(function() {
        cookie.classList.remove("pop");
    }, 100);

    spawnClickParticles(e.clientX, e.clientY)

    for(let i = 0; i < cpc; i++)
    {
        spawnCookieParticleBurst(e.clientX, e.clientY)
    }
}

function spawnClickParticles(x, y)
{
    const p = document.createElement('div')
    p.className = 'click-particle'
    p.textContent = '+' + cpc
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
    let vy = - (2)
    let life = 85

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
    let life = 250

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
    p.style.zIndex = '9999'
    p.style.fontSize = '22px'
    p.style.lineHeight = '1'

    document.body.appendChild(p)

    let vx = (Math.random() * 2 - 1) * (Math.random() * 2 + 1.5)
    let vy = - (Math.random() * 3 + 2.5)
    const gravity = 0.12
    let life = 85
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
    cookieCounter.innerHTML = Math.round(cookies).toLocaleString() + "<p style='font-size: 18px;'>Cookies Per Second: " + cps.toLocaleString() + "</p>"
    localStorage.setItem('cookies', cookies);
    title.innerHTML = Math.round(cookies).toLocaleString() + " Cookies"
}

function updateBuyButtons()
{
    buyClicker.innerHTML = ("Buy Clicker (" + Math.round(buyClickerCost).toLocaleString() + ")")
    buyClicksPerClick.innerHTML = ("Buy Clicks Per Click (" + Math.round(buyClicksPerClickCost).toLocaleString() + ")")
}

function buyClickerFunction()
{
    if(buyClickerCost <= Math.round(cookies))
    {
        cps += 0.2
        localStorage.setItem('cps', cps);
        cookies -= buyClickerCost
        buyClickerCost *= 1.15
        localStorage.setItem('buyClickerCost', buyClickerCost);
        updateCookieCounter();
        updateBuyButtons();
    }
    
}

function buyClicksPerClickFunction()
{
    if(buyClicksPerClickCost <= Math.round(cookies))
    {
        cpc += 2
        localStorage.setItem('cpc', cpc);
        cookies -= buyClicksPerClickCost
        buyClicksPerClickCost *= 1.15
        localStorage.setItem('buyClicksPerClickCost', buyClicksPerClickCost);
        updateCookieCounter();
        updateBuyButtons();
    }
    
}

function updateCookies(dt) {
    fractionalCookies += cps * dt;
    let whole = Math.floor(fractionalCookies);
    if (whole > 0) {
        cookies += whole;
        fractionalCookies -= whole;
        updateCookieCounter();
        for (let i = 0; i < whole; i++) {
            spawnOneParticle();
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
    const game = document.getElementById("game");
    const rect = game.getBoundingClientRect();

    const randomX = rect.left + Math.random() * rect.width * 0.9;
    const y = rect.top;

    spawnCookieParticleFall(randomX, y);
}
