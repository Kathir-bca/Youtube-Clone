(() => {
    'use strict';

    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const hamburgerMenu = document.querySelector('.menu-button');
    const searchInput = document.querySelector('.search');
    const searchButton = document.querySelector('.y-search');
    const notificationBell = document.querySelector('.y-notification');
    const notificationButton = document.querySelector('.notification-button');
    const notificationContainer = document.querySelector('.y-notification-container');
    const notificationPanel = document.querySelector('.notification-panel');
    const notificationCount = document.querySelector('.n-count');
    const markReadButton = document.querySelector('.mark-read');
    const voiceSearch = document.querySelector('.y-voice');
    const videoGrid = document.querySelector('.video-grid');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    if (!videoGrid || !Array.isArray(window.videos)) return;

    // -------------------------------
    // Render videos
    // -------------------------------
    const escapeHTML = (value = '') => String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const renderVideos = (list) => {
        if (!list.length) {
            videoGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⌕</div>
                    <h2>No videos found</h2>
                    <p>Try a different search term.</p>
                </div>
            `;
            return;
        }

        videoGrid.innerHTML = list.map((video) => `
            <article class="video-preview">
                <div class="thumb-row">
                    <a class="thumbnail-link" href="${escapeHTML(video.link)}" target="_blank" rel="noopener noreferrer" aria-label="Watch ${escapeHTML(video.title)}">
                        <img class="thumb" src="${escapeHTML(video.thumbnail)}" alt="${escapeHTML(video.title)}" loading="lazy">
                        <span class="video-time">${escapeHTML(video.time)}</span>
                    </a>
                </div>

                <div class="video-bottom">
                    <div class="profile">
                        <img class="vid-profile" src="${escapeHTML(video.profile)}" alt="${escapeHTML(video.author)}" loading="lazy">
                    </div>
                    <div class="vid-info">
                        <h2 class="vid-tit">${escapeHTML(video.title)}</h2>
                        <p class="vid-author">${escapeHTML(video.author)}</p>
                        <p class="views">${escapeHTML(video.views)} <span aria-hidden="true">•</span> ${escapeHTML(video.age)}</p>
                    </div>
                </div>
            </article>
        `).join('');
    };

    // -------------------------------
    // Search
    // -------------------------------
    const filterVideos = () => {
        const searchTerm = searchInput?.value.toLowerCase().trim() || '';
        const filtered = window.videos.filter((video) => {
            const searchable = `${video.title} ${video.author}`.toLowerCase();
            return searchable.includes(searchTerm);
        });

        renderVideos(filtered);
    };

    searchButton?.addEventListener('click', filterVideos);
    searchInput?.addEventListener('input', filterVideos);
    searchInput?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') filterVideos();
    });

    // -------------------------------
    // Sidebar
    // -------------------------------
    const setSidebarState = (open) => {
        sidebar?.classList.toggle('active', open);
        body.classList.toggle('sidebar-open', open);
        hamburgerMenu?.setAttribute('aria-expanded', String(open));
    };

    hamburgerMenu?.addEventListener('click', (event) => {
        event.stopPropagation();
        setSidebarState(!sidebar?.classList.contains('active'));
    });

    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 900 && sidebar?.classList.contains('active')) {
            if (!sidebar.contains(event.target) && !hamburgerMenu?.contains(event.target)) {
                setSidebarState(false);
            }
        }
    });

    sidebarLinks.forEach((link) => {
        link.addEventListener('click', () => {
            sidebarLinks.forEach((item) => item.classList.remove('active'));
            link.classList.add('active');

            if (window.innerWidth <= 900) setSidebarState(false);
        });
    });

    // -------------------------------
    // Notification feedback
    // -------------------------------
    let unreadNotifications = Number(notificationCount?.textContent?.trim()) || 0;

    const updateNotificationCount = () => {
        if (!notificationCount) return;
        notificationCount.textContent = unreadNotifications > 99 ? '99+' : String(unreadNotifications);
        notificationCount.classList.toggle('hidden', unreadNotifications <= 0);
        notificationCount.setAttribute('aria-label', `${unreadNotifications} unread notifications`);
        notificationButton?.setAttribute('aria-label', unreadNotifications ? `Notifications, ${unreadNotifications} unread` : 'Notifications');
    };

    notificationButton?.addEventListener('click', (event) => {
        event.stopPropagation();
        notificationBell?.classList.remove('ring');
        void notificationBell?.offsetWidth;
        notificationBell?.classList.add('ring');
        notificationPanel?.classList.toggle('open');
        notificationPanel?.setAttribute('aria-hidden', String(!notificationPanel.classList.contains('open')));
    });

    markReadButton?.addEventListener('click', (event) => {
        event.stopPropagation();
        unreadNotifications = 0;
        updateNotificationCount();
    });

    document.addEventListener('click', (event) => {
        if (notificationContainer && !notificationContainer.contains(event.target)) {
            notificationPanel?.classList.remove('open');
            notificationPanel?.setAttribute('aria-hidden', 'true');
        }
    });

    updateNotificationCount();

    // -------------------------------
    // Voice search placeholder
    // -------------------------------
    voiceSearch?.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
            window.alert('Voice search is coming soon.');
        }
    });

    // -------------------------------
    // Dark mode shortcut: Ctrl/Cmd + D
    // -------------------------------
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    }

    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
            event.preventDefault();
            body.classList.toggle('dark-mode');
            localStorage.setItem(
                'darkMode',
                body.classList.contains('dark-mode') ? 'enabled' : 'disabled'
            );
        }
    });

    renderVideos(window.videos);
    sidebarLinks[0]?.classList.add('active');
})();
