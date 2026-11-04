/**
 * main.js — Portfólio Igor Henrique Afonso
 * Script único compartilhado por todas as páginas.
 *
 * Funcionalidades:
 *  1. Tema claro/escuro com persistência em localStorage
 *  2. Menu hambúrguer responsivo (mobile)
 *  3. Validação do formulário de contato (campos + regex de e-mail)
 *  4. Modal de sucesso com simulação de envio
 *  5. Ano do footer preenchido dinamicamente
 *
 * Cada bloco usa guard clauses (verifica se o elemento existe)
 * para que o script não quebre em páginas onde certos elementos
 * não estão presentes.
 */

/* ==========================================================
   1. TEMA CLARO / ESCURO
   - Na 1ª visita, respeita a preferência do sistema operacional
     (prefers-color-scheme) via matchMedia.
   - A escolha feita pelo usuário é salva em localStorage e
     restaurada nas visitas seguintes.
   - O tema é aplicado ao atributo data-theme do <html>.
   ========================================================== */

(function iniciarTema() {
  const html = document.documentElement;

  // Lê o tema salvo; se ainda não existe, usa preferência do sistema
  const temaSalvo = localStorage.getItem('tema');
  if (temaSalvo) {
    html.setAttribute('data-theme', temaSalvo);
  } else {
    // matchMedia detecta se o SO está em modo escuro
    const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefereEscuro ? 'dark' : 'light');
  }
})();

document.addEventListener('DOMContentLoaded', function () {

  /* --------------------------------------------------------
     REFERÊNCIAS AOS ELEMENTOS COMUNS (presentes em todas as páginas)
     -------------------------------------------------------- */
  const html        = document.documentElement;
  const btnTema     = document.getElementById('btn-theme');
  const btnHamburger = document.getElementById('btn-hamburger');
  const nav         = document.getElementById('site-nav');
  const footerAno   = document.getElementById('footer-year');

  /* --------------------------------------------------------
     2. BOTÃO DE TEMA — alterna entre claro e escuro
     -------------------------------------------------------- */
  if (btnTema) {
    // Atualiza o ícone do botão conforme o tema atual
    function atualizarIconeTema() {
      const temaAtual = html.getAttribute('data-theme');
      // Lua = tema claro (indica que vai mudar para escuro); Sol = escuro (vai mudar para claro)
      btnTema.textContent = temaAtual === 'dark' ? '☀️' : '🌙';
      btnTema.setAttribute('aria-label',
        temaAtual === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'
      );
    }

    // Inicializa o ícone correto ao carregar a página
    atualizarIconeTema();

    btnTema.addEventListener('click', function () {
      const temaAtual = html.getAttribute('data-theme');
      const novoTema  = temaAtual === 'dark' ? 'light' : 'dark';

      // Aplica o novo tema e persiste a escolha
      html.setAttribute('data-theme', novoTema);
      localStorage.setItem('tema', novoTema);
      atualizarIconeTema();
    });
  }


  /* --------------------------------------------------------
     3. MENU HAMBÚRGUER — abre e fecha o menu em mobile
     O menu é controlado pela classe .open no <nav>
     e pelo atributo aria-expanded no botão
     -------------------------------------------------------- */
  if (btnHamburger && nav) {

    btnHamburger.addEventListener('click', function () {
      const estaAberto = nav.classList.toggle('open');

      // Atualiza atributo de acessibilidade
      btnHamburger.setAttribute('aria-expanded', estaAberto ? 'true' : 'false');
      btnHamburger.setAttribute('aria-label', estaAberto ? 'Fechar menu' : 'Abrir menu');
      // Alterna o ícone entre hambúrguer e X
      btnHamburger.textContent = estaAberto ? '✕' : '☰';
    });

    // Fecha o menu ao clicar em qualquer link de navegação (útil em single-page)
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        btnHamburger.setAttribute('aria-expanded', 'false');
        btnHamburger.setAttribute('aria-label', 'Abrir menu');
        btnHamburger.textContent = '☰';
      });
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', function (evento) {
      const clicouForaDoMenu = !nav.contains(evento.target) && !btnHamburger.contains(evento.target);
      if (clicouForaDoMenu && nav.classList.contains('open')) {
        nav.classList.remove('open');
        btnHamburger.setAttribute('aria-expanded', 'false');
        btnHamburger.setAttribute('aria-label', 'Abrir menu');
        btnHamburger.textContent = '☰';
      }
    });
  }


  /* --------------------------------------------------------
     5. ANO DO FOOTER — preenchido dinamicamente
     Evita ter que atualizar o HTML todo ano
     -------------------------------------------------------- */
  if (footerAno) {
    footerAno.textContent = new Date().getFullYear();
  }


});
