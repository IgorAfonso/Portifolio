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


  /* --------------------------------------------------------
     4. FORMULÁRIO DE CONTATO + MODAL DE SUCESSO
     Guard clause: só executa se o formulário existir na página
     (presente apenas em contato.html)
     -------------------------------------------------------- */
  const formulario = document.getElementById('contact-form');

  if (formulario) {

    /* Referências aos campos e seus elementos de erro */
    const inputNome      = document.getElementById('input-nome');
    const inputEmail     = document.getElementById('input-email');
    const inputMensagem  = document.getElementById('input-mensagem');
    const erroNome       = document.getElementById('erro-nome');
    const erroEmail      = document.getElementById('erro-email');
    const erroMensagem   = document.getElementById('erro-mensagem');

    /* Referências ao modal */
    const modalOverlay   = document.getElementById('modal-overlay');
    const modalFechar    = document.getElementById('modal-close');
    const modalNomeUser  = document.getElementById('modal-nome-usuario');

    /* Regex para validar formato de e-mail (usuario@dominio.com) */
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /**
     * Marca um campo como inválido: adiciona borda vermelha e exibe o erro inline.
     * @param {HTMLElement} campo  - input ou textarea
     * @param {HTMLElement} erro   - span com a mensagem de erro
     */
    function marcarErro(campo, erro) {
      campo.classList.add('error');
      erro.classList.add('visible');
    }

    /**
     * Limpa o estado de erro de um campo.
     * @param {HTMLElement} campo
     * @param {HTMLElement} erro
     */
    function limparErro(campo, erro) {
      campo.classList.remove('error');
      erro.classList.remove('visible');
    }

    /**
     * Valida todos os campos do formulário.
     * Retorna true se tudo estiver válido, false caso contrário.
     */
    function validarFormulario() {
      let valido = true;

      // Valida nome (não pode estar vazio)
      if (inputNome.value.trim() === '') {
        marcarErro(inputNome, erroNome);
        valido = false;
      } else {
        limparErro(inputNome, erroNome);
      }

      // Valida e-mail (não pode estar vazio E deve ter formato correto)
      if (inputEmail.value.trim() === '' || !regexEmail.test(inputEmail.value.trim())) {
        marcarErro(inputEmail, erroEmail);
        valido = false;
      } else {
        limparErro(inputEmail, erroEmail);
      }

      // Valida mensagem (não pode estar vazia)
      if (inputMensagem.value.trim() === '') {
        marcarErro(inputMensagem, erroMensagem);
        valido = false;
      } else {
        limparErro(inputMensagem, erroMensagem);
      }

      return valido;
    }

    /* Remove o erro de um campo assim que o usuário começa a corrigi-lo */
    inputNome.addEventListener('input', function () { limparErro(inputNome, erroNome); });
    inputEmail.addEventListener('input', function () { limparErro(inputEmail, erroEmail); });
    inputMensagem.addEventListener('input', function () { limparErro(inputMensagem, erroMensagem); });


    /* --------------------------------------------------
       SUBMIT DO FORMULÁRIO
       Intercepta o envio, valida e simula o envio com modal
       -------------------------------------------------- */
    formulario.addEventListener('submit', function (evento) {
      // Previne o comportamento padrão (recarregar a página)
      evento.preventDefault();

      if (!validarFormulario()) {
        // Foca o primeiro campo com erro para facilitar a correção
        const primeiroErro = formulario.querySelector('.form-input.error, .form-textarea.error');
        if (primeiroErro) primeiroErro.focus();
        return;
      }

      // Validação passou: preenche o nome do usuário no modal
      if (modalNomeUser) {
        modalNomeUser.textContent = inputNome.value.trim();
      }

      // Limpa todos os campos do formulário
      inputNome.value      = '';
      inputEmail.value     = '';
      inputMensagem.value  = '';

      // Exibe o modal de sucesso
      abrirModal();
    });


    /* --------------------------------------------------
       MODAL — abrir, fechar e acessibilidade
       -------------------------------------------------- */

    function abrirModal() {
      if (!modalOverlay) return;
      modalOverlay.classList.add('active');
      // Atualiza aria-hidden para leitores de tela
      modalOverlay.setAttribute('aria-hidden', 'false');
      // Foca o botão de fechar para acessibilidade via teclado
      if (modalFechar) modalFechar.focus();
    }

    function fecharModal() {
      if (!modalOverlay) return;
      modalOverlay.classList.remove('active');
      modalOverlay.setAttribute('aria-hidden', 'true');
      // Devolve o foco ao botão de envio do formulário
      const btnSubmit = formulario.querySelector('.btn-submit');
      if (btnSubmit) btnSubmit.focus();
    }

    // Fecha ao clicar no botão "Fechar"
    if (modalFechar) {
      modalFechar.addEventListener('click', fecharModal);
    }

    // Fecha ao clicar no overlay (fora da caixa do modal)
    if (modalOverlay) {
      modalOverlay.addEventListener('click', function (evento) {
        // Só fecha se o clique foi no overlay, não na caixa do modal
        if (evento.target === modalOverlay) {
          fecharModal();
        }
      });
    }

    // Fecha ao pressionar a tecla Escape
    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        fecharModal();
      }
    });

  }
  /* /formulário */

});
