# :package: Diagrama de Pacotes — v1.0

![Versão](https://img.shields.io/badge/versão-1.0-blueviolet?style=flat-square)
![Atualizado](https://img.shields.io/badge/atualizado-Dez%2F2025-blue?style=flat-square)

---

## Diagrama de Pacotes

```mermaid
graph TD
    subgraph app["src/app"]
        direction TB

        subgraph core["📦 core (singletons + guards)"]
            core-auth["AuthGuard, AuthInterceptor"]
            core-services["FirebaseAppService, LevelCalculatorService"]
            core-models["LevelConfig (quantos níveis, xp por nível)"]
        end

        subgraph shared["📦 shared"]
            shared-components["NavBar, UiButton, ProgressBar, LevelBadge, XpBar"]
            shared-pipes["RelativeDatePipe, XpFormatPipe"]
            shared-directives["DragDropDirective"]
            shared-models["Priority, Difficulty, Frequency, TaskStatus"]
        end

        subgraph domain["📦 domain (puro TS — sem Angular/Firebase)"]
            domain-entities["User, Skill, Tag, TaskRule, TaskException, TaskHistory"]
            domain-vo["Priority, Difficulty, Frequency, TaskStatus, LevelInfo"]
            domain-repositories["UserRepository · SkillRepository · TaskRuleRepository · TaskHistoryRepository · TagRepository"]
            domain-use-cases["CreateTaskUseCase · CompleteTaskUseCase · LevelUpSkillUseCase · LevelUpUserUseCase · GenerateRecurringTasksUseCase"]
        end

        subgraph infrastructure["📦 infrastructure"]
            subgraph firebase["📦 firebase"]
                firebase-adapters["FirebaseUserAdapter → UserRepository\nFirebaseTaskRuleAdapter → TaskRuleRepository\nFirebaseSkillAdapter → SkillRepository\nFirebaseAuthService\nFirebaseStorageService"]
                firebase-config["firebase.config.ts"]
            end
        end

        subgraph features["📦 features (lazy-loaded)"]
            direction TB

            subgraph auth["📦 auth"]
                auth-components["Login, Register, ForgotPassword"]
                auth-services["AuthFacadeService"]
            end

            subgraph tasks["📦 tasks"]
                tasks-components["TaskList, TaskCard, TaskForm, TaskDetail"]
                tasks-services["TaskFacadeService"]
            end

            subgraph skills["📦 skills"]
                skills-components["SkillList, SkillForm, SkillDetail, SkillProgress"]
                skills-services["SkillFacadeService"]
            end

            subgraph gamification["📦 gamification"]
                gamification-components["UserLevelDashboard, SkillsTree, LevelConfigEditor"]
                gamification-services["GamificationFacade"]
            end

            subgraph reports["📦 reports"]
                reports-components["ReportsDashboard, Charts, StreakCalendar"]
                reports-services["ReportsService"]
            end
        end
    end

    features --> domain
    core --> domain
    shared --> domain
    infrastructure --> domain
    features --> core
    features --> shared
```

---

## Descrição dos Pacotes

### :lock: `core`
Serviços singleton e guards de autenticação. Contém a lógica de configuração de níveis (`LevelConfig`) e o `LevelCalculatorService`, que calcula XP e level-ups.

> **Regra:** se é configuração do app, estado global do Angular ou singleton de infraestrutura → `core/`

### :jigsaw: `shared`
Componentes, pipes e diretivas reutilizáveis sem dependência de feature específica. Exemplos: barra de XP, badge de nível, botões genéricos.

### :brain: `domain`
**Camada mais importante.** TypeScript puro — sem Angular, sem Firebase. Contém entidades, value objects, interfaces de repositório e casos de uso. É o coração das regras de negócio.

> **Regra:** se representa uma regra de negócio ou conceito do problema (tarefa gamificada, skill com level, XP) → `domain/`

### :electric_plug: `infrastructure`
Implementações concretas das interfaces do `domain`. Os adapters Firebase implementam os repositórios definidos no domínio, mantendo o domínio isolado de dependências externas.

### :sparkles: `features`
Módulos lazy-loaded, um por funcionalidade principal. Cada feature tem seus próprios componentes, páginas e um `FacadeService` que orquestra os casos de uso do `domain`.

---

## Diagrama de Sequência — XP Automático

Fluxo completo ao concluir uma tarefa, incluindo distribuição de XP e possível level-up:

```mermaid
sequenceDiagram
    participant U as Usuário
    participant TC as TaskComponent
    participant TF as TaskFacadeService
    participant CU as CompleteTaskUseCase
    participant TR as TaskRuleRepository
    participant CS as LevelCalculatorService
    participant UR as UserRepository
    participant SR as SkillRepository
    participant HR as TaskHistoryRepository

    U->>TC: Marca tarefa como concluída
    TC->>TF: completeTask(taskId)
    TF->>CU: execute(taskId, COMPLETED)

    CU->>TR: getTaskRule(taskId)
    TR-->>CU: TaskRule

    alt isXpManual == false
        CU->>CS: calculateXp(priority, difficulty)
        CS-->>CU: xpEarned
    else isXpManual == true
        CU-->>CU: xpEarned = task.xpReward
    end

    CU->>HR: create(TaskHistory)

    CU->>UR: addXpToUser(userId, xpEarned)
    UR-->>CU: updatedUser + levelUpInfo?

    loop Para cada skillId em task.skillIds
        CU->>SR: addXpToSkill(skillId, xpEarned)
        SR-->>CU: updatedSkill + levelUpInfo?
    end

    opt Houve level up
        CU->>TC: emit levelUpNotification
    end

    CU-->>TF: TaskCompletedResult
    TF-->>TC: result via Observable
    TC-->>U: Toast "+XP!" + animação de level up
```
