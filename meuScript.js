/**
 * ================================================================
 * FAQUIR TEMBE — PORTFOLIO v2
 * Ficheiro: meuScript.js
 * Stack: Bootstrap 5.3.8 · Vanilla JS
 * ================================================================
 */

document.addEventListener('DOMContentLoaded', () => {


    /* ============================================================
       1. CURSOR PERSONALIZADO
       ============================================================ */
    const cr = document.getElementById('cr');
    const cd = document.getElementById('cd');

    let mx = 0, my = 0, rx = 0, ry = 0;

    // O ponto segue o rato imediatamente
    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        cd.style.transform = `translate(${mx}px, ${my}px)`;
    });

    // O anel segue com inércia (lag suave)
    (function animCursor() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        cr.style.transform = `translate(${rx}px, ${ry}px)`;
        requestAnimationFrame(animCursor);
    })();

    // Expande o cursor ao passar em elementos interactivos
    document.querySelectorAll('a, button, .pc, .svc, .sb, .tpill, .pfb').forEach(el => {
        el.addEventListener('mouseenter', () => { cr.classList.add('ch'); cd.classList.add('ch'); });
        el.addEventListener('mouseleave', () => { cr.classList.remove('ch'); cd.classList.remove('ch'); });
    });


    /* ============================================================
       2. NAVBAR — SCROLL + ACTIVE LINK + FECHAR MOBILE
       ============================================================ */
    const nb = document.getElementById('nb');
    const btt = document.getElementById('btt');

    window.addEventListener('scroll', () => {
        // Efeito glassmorphism ao scroll
        nb.classList.toggle('sc', window.scrollY > 60);

        // Mostrar/esconder botão "voltar ao topo"
        btt.classList.toggle('vs', window.scrollY > 60);

        // Destacar link activo na navbar
        let cur = '';
        document.querySelectorAll('section[id], header[id]').forEach(s => {
            if (window.scrollY >= s.offsetTop - 130) cur = s.id;
        });
        document.querySelectorAll('.np').forEach(l =>
            l.classList.toggle('active', l.getAttribute('href') === '#' + cur)
        );

    }, { passive: true });

    // Botão voltar ao topo
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Fechar menu mobile ao clicar num link
    document.querySelectorAll('.np').forEach(l => {
        l.addEventListener('click', () => {
            const collapse = document.getElementById('nvc');
            if (collapse?.classList.contains('show')) {
                bootstrap.Collapse.getInstance(collapse)?.hide();
            }
        });
    });


    /* ============================================================
       3. SCROLL REVEAL
       Observa elementos com classe .rv e adiciona .vi quando
       ficam visíveis no ecrã, com atraso escalonado.
       ============================================================ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('vi'), i * 70);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.rv').forEach(el => revealObserver.observe(el));


    /* ============================================================
       4. CONTADORES ANIMADOS (secção Sobre)
       Anima os números das estatísticas com easing cúbico.
       ============================================================ */
    function animarContador(el, valorFinal, duracao = 1800) {
        // Caracteres especiais (ex: ∞) não são animados
        if (isNaN(parseInt(valorFinal))) {
            el.textContent = valorFinal;
            return;
        }

        const numero = parseInt(valorFinal);
        const sufixo = valorFinal.replace(/[0-9]/g, '');
        let inicio = null;

        function passo(timestamp) {
            if (!inicio) inicio = timestamp;
            const progresso = Math.min((timestamp - inicio) / duracao, 1);
            const eased = 1 - Math.pow(1 - progresso, 3); // ease-out cúbico
            el.textContent = Math.floor(eased * numero) + sufixo;
            if (progresso < 1) requestAnimationFrame(passo);
        }

        requestAnimationFrame(passo);
    }

    const contadorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animarContador(entry.target, entry.target.textContent.trim());
                contadorObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.snum').forEach(el => contadorObserver.observe(el));


    /* ============================================================
       5. PROJECTOS — CONTADORES DE ESTADO
       Preenche os badges com o número de cards por estado.
       ============================================================ */
    ['co', 'de', 'fu'].forEach(estado => {
        const el = document.getElementById('cnt-' + estado);
        if (el) {
            el.textContent = document.querySelectorAll(`.pi[data-s="${estado}"]`).length;
        }
    });


    /* ============================================================
       6. PROJECTOS — FILTROS COM ANIMAÇÃO ESCALONADA
       ============================================================ */
    const projItems = document.querySelectorAll('.pi');

    document.querySelectorAll('.pfb').forEach(btn => {
        btn.addEventListener('click', () => {

            // Actualizar botão activo
            document.querySelectorAll('.pfb').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filtro = btn.dataset.f;

            projItems.forEach((item, i) => {
                const corresponde = filtro === 'todos' || item.dataset.s === filtro;

                if (corresponde) {
                    item.classList.remove('hd');
                    // Entrada escalonada com delay por índice
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.4s, transform 0.4s';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, i * 50);
                } else {
                    item.classList.add('hd');
                }
            });
        });
    });


    /* ============================================================
       7. PROJECTOS — MODAL DE DETALHES
       Preenche o modal com os dados do card clicado.
       ============================================================ */
    const modalEl = document.getElementById('mp');

    if (modalEl) {
        modalEl.addEventListener('show.bs.modal', e => {
            const trigger = e.relatedTarget;
            if (!trigger) return;

            const { ti, st, de, tc, lk, im, an } = trigger.dataset;

            // Preencher campos de texto
            document.getElementById('m-ti').textContent = ti || '';
            document.getElementById('m-de').textContent = de || '';
            document.getElementById('m-an').textContent = an ? '📅 ' + an : '';
            document.getElementById('m-img').src = im || '';

            // Gerar badges de tecnologia
            document.getElementById('m-tc').innerHTML = (tc || '')
                .split(',')
                .map(x => `<span class="tbg">${x.trim()}</span>`)
                .join('');

            // Badge de estado (Concluído / Em Dev / Futuro)
            const badgeEl = document.getElementById('m-sb');
            const badgeMap = {
                'co': { cls: 'bco', label: '<i class="fas fa-check-circle me-1"></i>Concluído' },
                'de': { cls: 'bde', label: '<i class="fas fa-code-branch me-1"></i>Em Desenvolvimento' },
                'fu': { cls: 'bfu', label: '<i class="fas fa-rocket me-1"></i>Futuro' },
            };
            const badge = badgeMap[st] || { cls: '', label: st || '' };
            badgeEl.className = `psb msb ${badge.cls}`;
            badgeEl.innerHTML = badge.label;

            // Botão de link externo (só aparece se houver link)
            const linkWrap = document.getElementById('m-lw');
            const linkEl = document.getElementById('m-lk');
            const temLink = lk && lk !== '#' && lk !== '';
            linkWrap.style.display = temLink ? '' : 'none';
            if (temLink) linkEl.href = lk;
        });
    }


    /* ============================================================
       8. HERO — GLOW QUE SEGUE O RATO
       Actualiza variáveis CSS com a posição do rato
       para criar um efeito de luz que segue o cursor.
       ============================================================ */
    const heroSection = document.getElementById('home');

    heroSection?.addEventListener('mousemove', e => {
        const rect = heroSection.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        heroSection.style.setProperty('--mx', x + '%');
        heroSection.style.setProperty('--my', y + '%');
    });


    /* ============================================================
       9. HERO — PARALLAX NA IMAGEM DE PERFIL
       Move ligeiramente a foto ao fazer scroll.
       ============================================================ */
    const heroImg = document.querySelector('.h-img');

    window.addEventListener('scroll', () => {
        if (heroImg && window.scrollY < window.innerHeight) {
            heroImg.style.transform = `scale(1) translateY(${window.scrollY * 0.06}px)`;
        }
    }, { passive: true });


    /* ============================================================
       10. GALERIA — LIGHTBOX
       Abre as fotos em ecrã cheio com navegação por
       botões, teclado (← → Esc) e swipe no mobile.
       ============================================================ */
    (function iniciarLightbox() {
        const lb = document.getElementById('glb');
        const lbi = document.getElementById('lbi');
        const lbcp = document.getElementById('lbcp');
        const lbc = document.getElementById('lbc');
        const lbp = document.getElementById('lbp');
        const lbn = document.getElementById('lbn');
        const lbbd = document.getElementById('lbbd');

        if (!lb) return;

        // Recolher apenas os originais (1ª metade de cada faixa)
        const itens = [];
        document.querySelectorAll('.gsw').forEach(wrap => {
            const todos = Array.from(wrap.querySelectorAll('.gi'));
            todos.slice(0, Math.ceil(todos.length / 2)).forEach(gi => itens.push(gi));
        });

        let atual = 0;

        function abrir(i) {
            atual = i;
            const item = itens[i];
            if (!item) return;
            lbi.src = item.dataset.src || item.querySelector('img').src;
            lbcp.textContent = item.dataset.cap || '';
            lb.classList.add('act');
            document.body.style.overflow = 'hidden';
        }

        function fechar() {
            lb.classList.remove('act');
            document.body.style.overflow = '';
            setTimeout(() => { lbi.src = ''; }, 350);
        }

        function anterior() { atual = (atual - 1 + itens.length) % itens.length; abrir(atual); }
        function proxima() { atual = (atual + 1) % itens.length; abrir(atual); }

        // Clicar num item da galeria
        document.querySelectorAll('.gi').forEach(gi => {
            gi.addEventListener('click', () => {
                const src = gi.dataset.src || gi.querySelector('img').src;
                const idx = itens.findIndex(i => (i.dataset.src || i.querySelector('img').src) === src);
                abrir(idx >= 0 ? idx : 0);
            });
        });

        // Controlos do lightbox
        lbc?.addEventListener('click', fechar);
        lbbd?.addEventListener('click', fechar);
        lbp?.addEventListener('click', e => { e.stopPropagation(); anterior(); });
        lbn?.addEventListener('click', e => { e.stopPropagation(); proxima(); });

        // Navegação por teclado
        document.addEventListener('keydown', e => {
            if (!lb.classList.contains('act')) return;
            if (e.key === 'Escape') fechar();
            if (e.key === 'ArrowLeft') anterior();
            if (e.key === 'ArrowRight') proxima();
        });

        // Swipe no mobile
        let touchInicioX = 0;
        lb.addEventListener('touchstart', e => {
            touchInicioX = e.changedTouches[0].screenX;
        }, { passive: true });

        lb.addEventListener('touchend', e => {
            const diff = touchInicioX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) diff > 0 ? proxima() : anterior();
        }, { passive: true });

    })();



    /* ============================================================
       11. EMAILJS — CONFIGURAÇÃO
       Serviço gratuito de envio de email sem servidor.
       Passos para configurar (ver guia no README):
         1. Criar conta em https://www.emailjs.com (grátis)
         2. Criar um Email Service ligado ao Gmail
         3. Criar dois Email Templates (contacto + depoimento)
         4. Substituir os IDs abaixo pelos seus
       ============================================================ */
    const EMAILJS_PUBLIC_KEY = 'gSgwFvZIG7l9nkACY';    // Account → API Keys
    const EMAILJS_SERVICE_ID = 'service_4vfhs95';    // Email Services
    const EMAILJS_TEMPLATE_CONT = 'template_qbe2wpc'; // Email Templates
    const EMAILJS_TEMPLATE_DEP = 'template_35vip4u';

    // Inicializar EmailJS com a Public Key
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });


    /* ============================================================
       Função utilitária — mostrar / esconder alertas
       ============================================================ */
    function mostrarAlerta(el, tipo, msg) {
        if (!el) return;
        el.className = `alert alert-${tipo} rounded-3 text-center`;
        el.textContent = msg;
        el.classList.remove('d-none');
        setTimeout(() => el.classList.add('d-none'), 7000);
    }

    function setBtnLoading(btn, loading, textoOriginal) {
        if (loading) {
            btn.dataset.orig = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>A enviar...';
            btn.disabled = true;
        } else {
            btn.innerHTML = textoOriginal || btn.dataset.orig;
            btn.disabled = false;
        }
    }


    /* ============================================================
       12. FORMULÁRIO DE CONTACTO → EmailJS
       Envia email para faquirtembedev@gmail.com com os dados
       preenchidos pelo visitante.

       Template EmailJS sugerido (Template ID: template_contacto):
         Para: faquirtembedev@gmail.com
         Assunto: 📩 Nova mensagem: {{assunto}}
         Corpo:
           Nome: {{nome}}
           Email: {{email}}
           Assunto: {{assunto}}
           Mensagem: {{mensagem}}
       ============================================================ */
    const formContacto = document.getElementById('fc');
    const statusContacto = document.getElementById('cs');
    const btnEnviar = document.getElementById('benv');

    formContacto?.addEventListener('submit', async e => {
        e.preventDefault();

        const nome = document.getElementById('fc-nome').value.trim();
        const email = document.getElementById('fc-email').value.trim();
        const assunto = document.getElementById('fc-assunto')?.value.trim() || 'Sem assunto';
        const mensagem = document.getElementById('fc-mensagem').value.trim();

        if (!nome || !email || !mensagem) {
            mostrarAlerta(statusContacto, 'warning', '⚠️ Preencha todos os campos obrigatórios.');
            return;
        }

        setBtnLoading(btnEnviar, true);

        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CONT, {
                nome,
                email,
                assunto,
                mensagem,
                data: new Date().toLocaleString('pt-MZ'),
            });

            mostrarAlerta(statusContacto, 'success', '✅ Mensagem enviada com sucesso! Responderei em breve.');
            formContacto.reset();

        } catch (err) {
            console.error('EmailJS erro contacto:', err);
            mostrarAlerta(statusContacto, 'danger', '❌ Erro ao enviar. Verifique a sua ligação e tente novamente.');
        } finally {
            setBtnLoading(btnEnviar, false);
        }
    });


    /* ============================================================
       13. FORMULÁRIO DE DEPOIMENTO → EmailJS
       Envia email de notificação com o depoimento submetido.

       Template EmailJS sugerido (Template ID: template_depoimento):
         Para: faquirtembedev@gmail.com
         Assunto: ⭐ Novo depoimento de {{nome}}
         Corpo:
           Autor: {{nome}}
           Empresa: {{empresa}}
           Depoimento: {{mensagem}}
           Data: {{data}}
       ============================================================ */
    const formDep = document.getElementById('fd');
    const statusDep = document.getElementById('ds');
    const btnDep = formDep?.querySelector('button[type="submit"]');

    formDep?.addEventListener('submit', async e => {
        e.preventDefault();

        const nome = document.getElementById('fd-nome').value.trim();
        const empresa = document.getElementById('fd-empresa')?.value.trim() || '';
        const mensagem = document.getElementById('fd-mensagem').value.trim();

        if (!nome || !mensagem) {
            mostrarAlerta(statusDep, 'warning', '⚠️ Nome e mensagem são obrigatórios.');
            return;
        }

        if (mensagem.length < 20) {
            mostrarAlerta(statusDep, 'warning', '⚠️ O depoimento é muito curto (mínimo 20 caracteres).');
            return;
        }

        setBtnLoading(btnDep, true);

        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_DEP, {
                nome,
                empresa: empresa || '—',
                mensagem,
                data: new Date().toLocaleString('pt-MZ'),
            });

            mostrarAlerta(statusDep, 'success', '✅ Depoimento enviado! Obrigado pelo seu feedback.');
            formDep.reset();

        } catch (err) {
            console.error('EmailJS erro depoimento:', err);
            mostrarAlerta(statusDep, 'danger', '❌ Erro ao enviar. Verifique a sua ligação e tente novamente.');
        } finally {
            setBtnLoading(btnDep, false);
        }
    });


}); // fim do DOMContentLoaded

