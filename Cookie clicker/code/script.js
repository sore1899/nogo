let cookie = document.getElementById("cookie")
let cookieCounter = document.getElementById("cookieCounter")
let buyClicker = document.getElementById("buyClicker")
let buyClicksPerClick = document.getElementById("buyClicksPerClick")

cookie.addEventListener("click", clickCookie)
buyClicker.addEventListener("click", buyClickerFunction)
buyClicksPerClick.addEventListener("click", buyClicksPerClickFunction)

let cookies = 0
let cps = 0
let buyClickerCost = 25
let buyClicksPerClickCost = 25
let cpc = 1

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

function clickCookie(e)
{
    cookies += cpc
    updateCookieCounter()

    cookie.classList.add("pop");

    setTimeout(function() {
        cookie.classList.remove("pop");
    }, 100);

    for(let i = 0; i < cpc; i++)
    {
        spawnCookieParticle(e.clientX, e.clientY)
    }
}

function spawnCookieParticle(x, y)
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
    let life = 70
    let rx = Math.random() * 360

    function frame() {
        x += vx
        y += vy
        vy += gravity
        vx *= 0.995
        rx += vx * 4

        p.style.left = x + 'px'
        p.style.top = y + 'px'
        p.style.opacity = Math.max(0, life / 70)
        p.style.transform = `translate(-50%, -50%) rotate(${rx}deg)`

        life--
        if (life > 0) requestAnimationFrame(frame)
        else p.remove()
    }

    requestAnimationFrame(frame)
}

function updateCookieCounter()
{
    cookieCounter.innerHTML = cookies
    localStorage.setItem('cookies', cookies);
}

function updateBuyButtons()
{
    buyClicker.innerHTML = ("Buy Clicker (" + buyClickerCost + ")")
    buyClicksPerClick.innerHTML = ("Buy Clicks Per Click (" + buyClicksPerClickCost + ")")
}

function buyClickerFunction()
{
    if(buyClickerCost <= cookies)
    {
        cps += 1
        localStorage.setItem('cps', cps);
        cookies -= buyClickerCost
        buyClickerCost *= 2
        localStorage.setItem('buyClickerCost', buyClickerCost);
        updateCookieCounter();
        updateBuyButtons();
    }
    
}

function buyClicksPerClickFunction()
{
    if(buyClicksPerClickCost <= cookies)
    {
        cpc += 1
        localStorage.setItem('cpc', cpc);
        cookies -= buyClicksPerClickCost
        buyClicksPerClickCost *= 4
        localStorage.setItem('buyClicksPerClickCost', buyClicksPerClickCost);
        updateCookieCounter();
        updateBuyButtons();
    }
    
}

let interval = setInterval(function() {
    cookies += cps;
    updateCookieCounter();
}, 1000);