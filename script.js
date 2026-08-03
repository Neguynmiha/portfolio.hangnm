document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Avatar Image Upload & Persistence
       ========================================================================== */
    const avatarInput = document.getElementById('avatar-upload-input');
    const avatarImg = document.getElementById('user-avatar-img');

    // Load saved avatar from LocalStorage
    const savedAvatar = localStorage.getItem('user_portfolio_avatar');
    if (savedAvatar && avatarImg) {
        avatarImg.src = savedAvatar;
    }

    if (avatarInput && avatarImg) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newAvatarData = event.target.result;
                    avatarImg.src = newAvatarData;
                    localStorage.setItem('user_portfolio_avatar', newAvatarData);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    /* ==========================================================================
       2. Change Existing Activity Images
       ========================================================================== */
    function attachActivityImageListeners() {
        document.querySelectorAll('.act-card').forEach(card => {
            const fileInput = card.querySelector('.act-img-input');
            const img = card.querySelector('.act-img');
            const cardId = card.getAttribute('data-id');

            // Restore saved image for this card if available
            if (cardId) {
                const savedCardImg = localStorage.getItem(`user_act_img_${cardId}`);
                if (savedCardImg && img) {
                    img.src = savedCardImg;
                }
            }

            if (fileInput && img) {
                fileInput.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const newImgData = event.target.result;
                            img.src = newImgData;
                            if (cardId) {
                                localStorage.setItem(`user_act_img_${cardId}`, newImgData);
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                };
            }
        });
    }

    attachActivityImageListeners();

    /* ==========================================================================
       3. Modal & Add New Activity Photo/Card
       ========================================================================== */
    const btnAddAct = document.getElementById('btn-add-activity');
    const modalAddAct = document.getElementById('add-act-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const addActForm = document.getElementById('add-act-form');
    const featuredGrid = document.getElementById('featured-activities-grid');

    // Open Modal
    if (btnAddAct && modalAddAct) {
        btnAddAct.addEventListener('click', () => {
            modalAddAct.classList.add('active');
        });
    }

    // Close Modal
    const closeModal = () => {
        if (modalAddAct) modalAddAct.classList.remove('active');
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

    // Load custom activities saved in localStorage
    const savedCustomActivities = JSON.parse(localStorage.getItem('user_custom_activities') || '[]');
    savedCustomActivities.forEach(act => renderNewActivityCard(act));

    // Handle Form Submit
    if (addActForm) {
        addActForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('new-act-title').value;
            const tag = document.getElementById('new-act-tag').value || 'Hoạt Động Tiêu Biểu';
            const desc = document.getElementById('new-act-desc').value;
            const imgFile = document.getElementById('new-act-img-file').files[0];

            if (imgFile) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imgData = event.target.result;
                    const newActObj = {
                        id: 'custom-act-' + Date.now(),
                        title,
                        tag,
                        desc,
                        imgData
                    };

                    // Render card & save to localStorage
                    renderNewActivityCard(newActObj);
                    savedCustomActivities.push(newActObj);
                    localStorage.setItem('user_custom_activities', JSON.stringify(savedCustomActivities));

                    addActForm.reset();
                    closeModal();
                };
                reader.readAsDataURL(imgFile);
            }
        });
    }

    function renderNewActivityCard(act) {
        if (!featuredGrid) return;

        const card = document.createElement('div');
        card.className = 'act-card vn-card';
        card.setAttribute('data-id', act.id);

        card.innerHTML = `
            <div class="act-img-wrapper">
                <img src="${act.imgData}" alt="${act.title}" class="act-img">
                <label class="btn-change-act-img" title="Đổi ảnh hoạt động này">
                    📷 Đổi ảnh
                    <input type="file" accept="image/*" class="act-img-input hidden-input">
                </label>
            </div>
            <div class="act-info">
                <span class="act-tag">${act.tag}</span>
                <h3 class="act-title">${act.title}</h3>
                <p class="act-desc">${act.desc}</p>
            </div>
        `;

        featuredGrid.appendChild(card);
        attachActivityImageListeners();
    }

    /* ==========================================================================
       4. Background Music (BGM) Player - "Mục Hạ Vô Nhân" SOOBIN
       ========================================================================== */
    const bgmAudio = document.getElementById('bgm-audio');
    const bgmPlayBtn = document.getElementById('bgm-play-btn');
    const bgmQuickToggle = document.getElementById('bgm-quick-toggle');
    const bgmWidget = document.getElementById('bgm-player-widget');
    const bgmVolume = document.getElementById('bgm-volume');
    const bgmFileInput = document.getElementById('bgm-file-input');

    let isPlaying = false;

    function togglePlay() {
        if (!bgmAudio) return;
        if (isPlaying) {
            bgmAudio.pause();
            isPlaying = false;
            if (bgmPlayBtn) bgmPlayBtn.textContent = '▶️';
            if (bgmWidget) bgmWidget.classList.remove('playing');
        } else {
            bgmAudio.play().then(() => {
                isPlaying = true;
                if (bgmPlayBtn) bgmPlayBtn.textContent = '⏸️';
                if (bgmWidget) bgmWidget.classList.add('playing');
            }).catch(err => {
                console.log('Audio autoplay prevented:', err);
            });
        }
    }

    if (bgmPlayBtn) bgmPlayBtn.addEventListener('click', togglePlay);
    if (bgmQuickToggle) bgmQuickToggle.addEventListener('click', togglePlay);

    if (bgmVolume && bgmAudio) {
        bgmVolume.addEventListener('input', (e) => {
            bgmAudio.volume = e.target.value;
        });
    }

    // Allow user to upload local MP3 for "Mục Hạ Vô Nhân"
    if (bgmFileInput && bgmAudio) {
        bgmFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const audioUrl = URL.createObjectURL(file);
                bgmAudio.src = audioUrl;
                bgmAudio.play();
                isPlaying = true;
                if (bgmPlayBtn) bgmPlayBtn.textContent = '⏸️';
                if (bgmWidget) bgmWidget.classList.add('playing');
            }
        });
    }

    /* ==========================================================================
       5. Theme Toggle & Navigation Interactions
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
        });
    }

    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
        });
    });

    // Scroll Reveal Animation
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.vn-card, .timeline-item, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
    });
});
