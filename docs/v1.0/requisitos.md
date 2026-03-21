# :clipboard: Requisitos — v1.0

![Versão](https://img.shields.io/badge/versão-1.0-blueviolet?style=flat-square)
![Atualizado](https://img.shields.io/badge/atualizado-Nov%2F2025-blue?style=flat-square)

---

## :white_check_mark: Requisitos Funcionais (RFs)

| ID | Descrição |
|---|---|
| **RF01** | O usuário deve poder criar/ler/atualizar/deletar (CRUD) **Tarefas**. |
| **RF02** | Ao criar/editar uma tarefa, o usuário deve poder associá-la a uma ou mais **Habilidades**. |
| **RF03** | Ao criar/editar uma tarefa, o usuário deve poder associá-la a uma **Tag**. |
| **RF04** | Ao criar/editar uma tarefa, o usuário deve poder definir uma **frequência de repetição**. |
| **RF05** | O usuário deve poder criar/ler/atualizar/deletar (CRUD) **Tags**. |
| **RF06** | O usuário deve poder criar/ler/atualizar/deletar (CRUD) **Habilidades** (ex.: "Engenharia de Software"). |
| **RF07** | O usuário deve poder definir uma configuração global de **Níveis** (ex.: quanto XP é necessário para cada nível), que se aplica a todas as habilidades. |
| **RF08** | O usuário deve poder visualizar suas habilidades com os **níveis atuais** de cada uma. |
| **RF09** | O usuário deve poder se **cadastrar e fazer login**. |

---

## :gear: Requisitos Não Funcionais (RNFs)

| ID | Descrição |
|---|---|
| **RNF01** | A aplicação deve ser desenvolvida usando **Angular e TypeScript** (Front-end) e **Firebase** (Back-end as a Service). |
| **RNF02** | Os dados do usuário (tarefas, habilidades, progresso) devem ser **persistidos na nuvem** (Firestore). |
| **RNF03** | A aplicação deve ter um design **responsivo**, com foco **Mobile-First**. |
| **RNF04** | A aplicação deve ser **leve** e ter um **tempo de carregamento rápido** em dispositivos móveis. |
| **RNF05** | O acesso aos dados de um usuário deve ser **restrito apenas ao próprio usuário autenticado**. |
| **RNF06** | O usuário deve poder fazer login/cadastro com **conta do Google**. |
