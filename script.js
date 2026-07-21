(function () {
    const screens = Array.from(document.querySelectorAll('.screen'));
    const dots = Array.from(document.querySelectorAll('.progress-dots span'));
    const backLink = document.getElementById('backLink');
    let current = 0;

    function showScreen(i) {
        screens.forEach((s, idx) => s.classList.toggle('active', idx === i));
        dots.forEach((d, idx) => d.classList.toggle('on', idx === i));
        backLink.style.display = i === 0 ? 'none' : 'block';
        current = i;
        window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
        if (i === 2) {
            // timeline screen — (re)draw the railway once cards have laid out
            requestAnimationFrame(() => requestAnimationFrame(updateRailwayPath));
        }
    }

    document.querySelectorAll('[data-goto]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen(parseInt(el.getAttribute('data-goto'), 10));
        });
    });

    backLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (current > 0) showScreen(current - 1);
    });

    function updateRailwayPath() {
        const svg = document.getElementById('railwaySvg');
        const wrap = document.getElementById('railwayWrap');
        const items = document.querySelectorAll('.timeline-item');
        if (!svg || !wrap || items.length < 2 || window.innerWidth <= 820) return;

        const wrapRect = wrap.getBoundingClientRect();
        svg.setAttribute('width', wrapRect.width);
        svg.setAttribute('height', wrapRect.height);

        const points = [];
        items.forEach(item => {
            const node = item.querySelector('.tl-node');
            const rect = node.getBoundingClientRect();
            points.push({
                x: rect.left + rect.width / 2 - wrapRect.left,
                y: rect.top + rect.height / 2 - wrapRect.top
            });
        });

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i], p2 = points[i + 1];
            const midY = (p1.y + p2.y) / 2;
            d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
        }

        document.getElementById('railBase').setAttribute('d', d);
        document.getElementById('railTies').setAttribute('d', d);
        document.getElementById('railLine').setAttribute('d', d);
    }

    window.addEventListener('resize', () => {
        if (current === 2) updateRailwayPath();
    });
    window.addEventListener('load', () => {
        if (current === 2) updateRailwayPath();
    });

    const agreeBtn = document.getElementById('agreeBtn');
    const agreeMessage = document.getElementById('agreeMessage');
    if (agreeBtn && agreeMessage) {
        agreeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (agreeBtn.dataset.clicked) return;
            agreeBtn.dataset.clicked = 'true';
            agreeMessage.classList.add('show');
            setTimeout(() => {
                window.open(agreeBtn.href, '_blank');
            }, 3200);
        });
    }

    showScreen(0);
})();
