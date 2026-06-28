# Portfólio — Igor Henrique Afonso

Portfólio pessoal desenvolvido como atividade prática da disciplina **Fundamentos da Programação Web** (UNINTER).

## Tecnologias

- **HTML5** semântico (`<!DOCTYPE html>`, `lang`, `aria-*`)
- **CSS3** puro — sem Bootstrap ou qualquer framework de CSS
- **JavaScript** vanilla — sem jQuery, React, Angular ou similares

## Estrutura de arquivos

```
Portifolio/
├── index.html        → Sobre mim (página inicial)
├── formacao.html     → Formação acadêmica, cursos e idiomas
├── portfolio.html    → Projetos no GitHub
├── contato.html      → Formulário de contato
├── css/
│   └── style.css     → Estilos (design system, temas, responsividade)
└── js/
    └── main.js       → Interações (tema, menu, validação, modal)
```

## Funcionalidades

- Navegação entre 4 páginas com menu fixo em todas elas
- Tema **claro/escuro** com persistência em `localStorage`
- Menu **hambúrguer responsivo** para mobile
- Formulário de contato com **validação JavaScript** (campos obrigatórios + regex de e-mail)
- **Modal de confirmação** após envio bem-sucedido
- Ano do footer preenchido dinamicamente

## Como visualizar localmente

Abra o arquivo `index.html` diretamente no navegador, ou use a extensão **Live Server** do VS Code para recarregamento automático.

## Autor

**Igor Henrique Afonso** — [github.com/IgorAfonso](https://github.com/IgorAfonso)
