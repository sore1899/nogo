document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('search');
    const projectsContainer = document.querySelector('.projects');
    const projects = () => Array.from(projectsContainer.querySelectorAll('.project'));

    function projectId(p) { return (p.querySelector('h2')?.textContent || '').trim(); }

    // smooth show/hide with opacity + translate
    function setVisible(el, visible) {
        if (visible) {
            el.style.display = '';
            el.style.opacity = '0';
            el.style.transform = 'translateY(8px)';
            // force layout
            el.getBoundingClientRect();
            requestAnimationFrame(() => {
                el.style.transition = 'opacity 220ms ease, transform 260ms cubic-bezier(.2,.8,.2,1)';
                el.style.opacity = '1';
                el.style.transform = '';
            });
            const cleanup = () => {
                el.style.transition = '';
                el.removeEventListener('transitionend', cleanup);
            };
            el.addEventListener('transitionend', cleanup);
        } else {
            el.style.transition = 'opacity 180ms ease, transform 180ms ease';
            el.style.opacity = '0';
            el.style.transform = 'translateY(-6px)';
            const onEnd = () => {
                el.style.display = 'none';
                el.style.transition = '';
                el.style.transform = '';
                el.removeEventListener('transitionend', onEnd);
            };
            el.addEventListener('transitionend', onEnd);
            // safety hide if transitionend doesn't fire
            setTimeout(() => { if (getComputedStyle(el).opacity === '0') el.style.display = 'none'; }, 300);
        }
    }

    // FLIP reorder animation
    function animateReorder(container, reorderFn) {
        const children = Array.from(container.children);
        const firstRects = new Map(children.map(el => [el, el.getBoundingClientRect()]));

        reorderFn();

        const lastRects = new Map(Array.from(container.children).map(el => [el, el.getBoundingClientRect()]));

        const DURATION = 360;
        const EASING = 'cubic-bezier(.2,.8,.2,1)';

        children.forEach(el => {
            const first = firstRects.get(el);
            const last = lastRects.get(el);
            if (!first || !last) return;
            const dx = first.left - last.left;
            const dy = first.top - last.top;
            if (dx || dy) {
                // Use WAAPI for smoother animation and better frame timing
                const animation = el.animate([
                    { transform: `translate(${dx}px, ${dy}px)` },
                    { transform: 'translate(0, 0)' }
                ], {
                    duration: DURATION,
                    easing: EASING,
                    fill: 'both'
                });

                // ensure element renders above siblings while animating
                const prevZ = el.style.zIndex;
                el.style.zIndex = '800';

                animation.addEventListener('finish', () => {
                    el.style.zIndex = prevZ || '';
                    try { animation.cancel(); } catch (e) { }
                });

                // safety cleanup in case finish doesn't fire
                setTimeout(() => { el.style.zIndex = prevZ || ''; try { animation.cancel(); } catch (e) { } }, DURATION + 120);
            }
        });
    }

    // search/filter using smooth show/hide
    function filter() {
        const q = input.value.trim().toLowerCase();
        projects().forEach(p => {
            const title = (p.querySelector('h2')?.textContent || '').toLowerCase();
            const creatorText = (p.querySelector('p')?.textContent || '').toLowerCase();
            const creator = creatorText.replace('made by:', '').trim();
            const shouldShow = q === '' || title.includes(q) || creator.includes(q);
            const isVisible = getComputedStyle(p).display !== 'none';
            if (shouldShow && !isVisible) setVisible(p, true);
            else if (!shouldShow && isVisible) setVisible(p, false);
        });
    }

    input.addEventListener('input', filter);

    const favKey = 'gameFavorites';
    let favorites = [];
    try { const raw = localStorage.getItem(favKey); favorites = raw ? JSON.parse(raw) : []; } catch (e) { favorites = []; }

    // apply saved favorites with animation
    if (favorites.length) {
        animateReorder(projectsContainer, () => {
            favorites.slice().reverse().forEach(id => {
                const p = projects().find(pp => projectId(pp) === id);
                if (p) {
                    p.classList.add('favorited');
                    const btn = p.querySelector('.favorite'); if (btn) btn.textContent = '❤️';
                    projectsContainer.prepend(p);
                }
            });
        });
    }

    // handle favorite toggles
    projectsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.favorite');
        if (!btn) return;
        e.preventDefault();
        const project = btn.closest('.project');
        const id = projectId(project);
        const willBeFav = !project.classList.contains('favorited');
        btn.textContent = willBeFav ? '❤️' : '🖤';

        favorites = favorites.filter(x => x !== id);
        if (willBeFav) favorites.unshift(id);

        animateReorder(projectsContainer, () => {
            project.classList.toggle('favorited');
            if (willBeFav) projectsContainer.prepend(project);
            else {
                // place after the last favorited element, restoring non-favorited order
                const nonFavs = projects().filter(p => !p.classList.contains('favorited') && p !== project);
                // try to insert at the same index among non-favs as original
                const all = Array.from(projectsContainer.children);
                const origIndex = all.indexOf(project);
                let inserted = false;
                for (let i = 0; i < all.length; i++) {
                    const sibling = all[i];
                    if (!sibling.classList.contains('favorited') && sibling !== project) {
                        projectsContainer.insertBefore(project, sibling);
                        inserted = true;
                        break;
                    }
                }
                if (!inserted) projectsContainer.appendChild(project);
            }
        });

        try { localStorage.setItem(favKey, JSON.stringify(favorites)); } catch (e) { }
    });

    // initial filter state
    filter();
});