/* ═══════════════════════════════════════════════
   VLADYSLAV MANKO — PORTFOLIO JS
   Language toggle, scroll reveals, terminal demo
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Scroll Reveal (Apple-style fade-in) ──
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ── 2. Skill Bars Animation ──
    const skillBars = document.querySelectorAll('.skill-bar');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.dataset.level;
                entry.target.style.setProperty('--level', level + '%');
                entry.target.classList.add('animated');
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // ── 3. Stat Counter Animation ──
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el, target) {
        let current = 0;
        const step = Math.max(1, Math.floor(target / 30));
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = current;
        }, 50);
    }

    // ── 4. Language Toggle (EN / UA) ──
    const langToggle = document.getElementById('lang-toggle');
    const langOptions = langToggle.querySelectorAll('.lang-option');
    let currentLang = 'en';

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ua' : 'en';
        document.documentElement.dataset.lang = currentLang;

        langOptions.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === currentLang);
        });

        // Update all translatable elements
        document.querySelectorAll('[data-en]').forEach(el => {
            const text = el.getAttribute(`data-${currentLang}`);
            if (text) el.textContent = text;
        });
    });

    // ── 5. Smooth Nav Links ──
    document.querySelectorAll('.nav-links a, .hero-cta a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ── 6. Navbar Background on Scroll ──
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.88)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.72)';
        }
    });

    // ── 6.5. Interactive Tabs Switcher (scoped to each visual card) ──
    document.querySelectorAll('.project-visual').forEach(visualContainer => {
        const tabButtons = visualContainer.querySelectorAll('.tab-btn');
        const tabContents = visualContainer.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                
                // Deactivate buttons inside this visual container only
                tabButtons.forEach(b => b.classList.remove('active'));
                // Hide contents inside this visual container only
                tabContents.forEach(c => c.classList.add('hidden'));
                
                // Activate selected button
                btn.classList.add('active');
                // Show corresponding content inside this visual container
                const targetContent = visualContainer.querySelector(`[data-tab-content="${tabName}"]`);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                }
            });
        });
    });

    // ── 7. Interactive Terminal Demo ──
    const terminalBtn = document.getElementById('terminal-start');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input-field');
    let terminalRunning = false;

    const terminalLinesEN = [
        { type: 'info', text: '[Playwright] Launching Chromium browser...' },
        { type: 'info', text: '[Playwright] Navigating to Google Maps...' },
        { type: 'dim',  text: '  → Search query: "Стоматологія Київ"' },
        { type: 'info', text: '[Playwright] Waiting for results to load...' },
        { type: 'success', text: '[Maps] Found 18 businesses in viewport' },
        { type: 'dim',  text: '  → Scrolling to load more results...' },
        { type: 'success', text: '[Maps] Total: 42 businesses loaded' },
        { type: 'info', text: '[Scraper] Extracting business data...' },
        { type: 'data', text: '  ✦ "DentaPro Clinic" — dentapro.com.ua — +380 44 123 4567' },
        { type: 'data', text: '  ✦ "SmileLab" — smilelab.kiev.ua — +380 67 987 6543' },
        { type: 'data', text: '  ✦ "Dr. Kovalenko" — dr-kovalenko.com — +380 50 555 1234' },
        { type: 'info', text: '[HTTPX] Scraping websites for social contacts...' },
        { type: 'dim',  text: '  → GET https://dentapro.com.ua ... 200 OK' },
        { type: 'success', text: '  ✔ Instagram: @dentapro_clinic' },
        { type: 'success', text: '  ✔ Telegram: t.me/dentapro_ua' },
        { type: 'dim',  text: '  → GET https://smilelab.kiev.ua ... 200 OK' },
        { type: 'success', text: '  ✔ Email: info@smilelab.kiev.ua' },
        { type: 'success', text: '  ✔ Viber: viber.click/smilelab' },
        { type: 'dim',  text: '  → GET https://dr-kovalenko.com ... 200 OK' },
        { type: 'success', text: '  ✔ Instagram: @dr.kovalenko.kyiv' },
        { type: 'success', text: '  ✔ Telegram: t.me/drkovalenko' },
        { type: 'info', text: '[WebSocket] Streaming results to dashboard...' },
        { type: 'warn', text: '[Stats] Processed: 42 businesses | Contacts found: 38' },
        { type: 'success', text: '═══ Pipeline complete. 38 leads saved to database. ═══' },
    ];

    const terminalLinesUA = [
        { type: 'info', text: '[Playwright] Запуск браузера Chromium...' },
        { type: 'info', text: '[Playwright] Навігація до Google Maps...' },
        { type: 'dim',  text: '  → Пошуковий запит: "Стоматологія Київ"' },
        { type: 'info', text: '[Playwright] Очікування завантаження результатів...' },
        { type: 'success', text: '[Maps] Знайдено 18 бізнесів у зоні видимості' },
        { type: 'dim',  text: '  → Скролінг для завантаження додаткових результатів...' },
        { type: 'success', text: '[Maps] Всього: 42 бізнеси завантажено' },
        { type: 'info', text: '[Scraper] Витягування даних бізнесів...' },
        { type: 'data', text: '  ✦ "DentaPro Clinic" — dentapro.com.ua — +380 44 123 4567' },
        { type: 'data', text: '  ✦ "SmileLab" — smilelab.kiev.ua — +380 67 987 6543' },
        { type: 'data', text: '  ✦ "Dr. Kovalenko" — dr-kovalenko.com — +380 50 555 1234' },
        { type: 'info', text: '[HTTPX] Скрапінг веб-сайтів для пошуку контактів...' },
        { type: 'dim',  text: '  → GET https://dentapro.com.ua ... 200 OK' },
        { type: 'success', text: '  ✔ Instagram: @dentapro_clinic' },
        { type: 'success', text: '  ✔ Telegram: t.me/dentapro_ua' },
        { type: 'dim',  text: '  → GET https://smilelab.kiev.ua ... 200 OK' },
        { type: 'success', text: '  ✔ Email: info@smilelab.kiev.ua' },
        { type: 'success', text: '  ✔ Viber: viber.click/smilelab' },
        { type: 'dim',  text: '  → GET https://dr-kovalenko.com ... 200 OK' },
        { type: 'success', text: '  ✔ Instagram: @dr.kovalenko.kyiv' },
        { type: 'success', text: '  ✔ Telegram: t.me/drkovalenko' },
        { type: 'info', text: '[WebSocket] Стрімінг результатів на дашборд...' },
        { type: 'warn', text: '[Stats] Оброблено: 42 бізнеси | Контактів знайдено: 38' },
        { type: 'success', text: '═══ Пайплайн завершено. 38 лідів збережено в базу. ═══' },
    ];

    const commandsEN = {
        help: 'Available commands:\n  help     - Show this help menu\n  run      - Start scraping simulation demo\n  projects - List all key projects\n  about    - Show info about Vladyslav\n  clear    - Clear terminal screen',
        about: 'Vladyslav Manko\nRole: Python & AI Automation Engineer\nExperience: 1+ Year in building backend APIs & scrapers\nTech Stack: Python, FastAPI, Playwright, Docker, GCP, OpenAI/Gemini',
        projects: '1. Lead Processing Service (FastAPI, GCP, Docker)\n2. Lead Console (Playwright, Scraper, WebSockets)\n3. AI Audio Summarizer Bot (Telegram, LLM integration)\n4. Claude Code News Digest (Cron CLI script, Daily 9:00 AM)',
        error: 'Command not found: "$CMD". Type "help" to view available commands.'
    };

    const commandsUA = {
        help: 'Доступні команди:\n  help     - Показати це меню допомоги\n  run      - Запустити демо симуляції скрапінгу\n  projects - Список усіх ключових проєктів\n  about    - Інформація про Владислава\n  clear    - Очистити екран термінала',
        about: 'Владислав Манько\nСпеціалізація: Python & AI Automation Engineer\nДосвід: 1+ рік розробки backend API та скраперів\nСтек: Python, FastAPI, Playwright, Docker, GCP, OpenAI/Gemini',
        projects: '1. Lead Processing Service (FastAPI, GCP, Docker)\n2. Lead Console (Playwright, Scraper, WebSockets)\n3. AI Audio Summarizer Bot (Telegram, інтеграція LLM)\n4. Claude Code News Digest (Cron CLI скрипт, щодня о 9:00)',
        error: 'Команду "$CMD" не знайдено. Введіть "help" для перегляду списку команд.'
    };

    function printOutput(text, type = 'default') {
        const div = document.createElement('div');
        div.className = `terminal-line t-${type}`;
        div.innerHTML = text.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
        terminalOutput.appendChild(div);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function runDemo() {
        if (terminalRunning) return;
        terminalRunning = true;
        terminalBtn.disabled = true;
        terminalInput.disabled = true;
        terminalBtn.textContent = currentLang === 'ua' ? '⏳ Виконується...' : '⏳ Running...';

        printOutput(`python -m lead_console --niche "Стоматологія" --city "Київ"`, 'cmd');

        const lines = currentLang === 'ua' ? terminalLinesUA : terminalLinesEN;
        let i = 0;

        function addLine() {
            if (i >= lines.length) {
                terminalRunning = false;
                terminalBtn.disabled = false;
                terminalInput.disabled = false;
                terminalBtn.textContent = currentLang === 'ua' ? '▶ Запустити знову' : '▶ Run Again';
                terminalBtn.setAttribute('data-en', '▶ Run Again');
                terminalBtn.setAttribute('data-ua', '▶ Запустити знову');
                return;
            }

            const line = lines[i];
            printOutput(line.text, line.type);
            i++;

            const delay = line.type === 'data' ? 300 : line.type === 'dim' ? 200 : 400;
            setTimeout(addLine, delay + Math.random() * 150);
        }

        setTimeout(addLine, 600);
    }

    terminalBtn.addEventListener('click', () => {
        terminalOutput.innerHTML = '';
        runDemo();
    });

    // Focus input on clicking anywhere in terminal body
    terminalOutput.addEventListener('click', () => {
        terminalInput.focus();
    });

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const inputVal = terminalInput.value.trim();
            terminalInput.value = '';

            if (!inputVal) return;

            // Output command prompt
            const promptDiv = document.createElement('div');
            promptDiv.className = 'terminal-line';
            promptDiv.innerHTML = `<span class="t-prompt">$</span> <span class="t-cmd">${escapeHtml(inputVal)}</span>`;
            terminalOutput.appendChild(promptDiv);

            if (terminalRunning) {
                printOutput(currentLang === 'ua' ? 'Будь ласка, зачекайте завершення поточного процесу...' : 'Please wait for the current process to complete...', 'warn');
                return;
            }

            const command = inputVal.toLowerCase();

            if (command === 'clear') {
                terminalOutput.innerHTML = '';
            } else if (command === 'run') {
                runDemo();
            } else if (command === 'help') {
                const text = currentLang === 'ua' ? commandsUA.help : commandsEN.help;
                printOutput(text, 'dim');
            } else if (command === 'about' || command === 'whoami') {
                const text = currentLang === 'ua' ? commandsUA.about : commandsEN.about;
                printOutput(text, 'success');
            } else if (command === 'projects') {
                const text = currentLang === 'ua' ? commandsUA.projects : commandsEN.projects;
                printOutput(text, 'data');
            } else {
                let errText = currentLang === 'ua' ? commandsUA.error : commandsEN.error;
                errText = errText.replace('$CMD', escapeHtml(inputVal));
                printOutput(errText, 'error');
            }
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

});
