# :building_construction: Diagrama de Classes — v1.0

![Versão](https://img.shields.io/badge/versão-1.0-blueviolet?style=flat-square)
![Atualizado](https://img.shields.io/badge/atualizado-Dez%2F2025-blue?style=flat-square)

---

## Diagrama

```mermaid
classDiagram

    %% --- Value Objects / Enumerações ---

    class Priority {
        <<enumeration>>
        LOW
        MEDIUM
        HIGH
    }

    class Difficulty {
        <<enumeration>>
        EASY
        MEDIUM
        HARD
    }

    class Frequency {
        <<enumeration>>
        NONE
        DAILY
        WEEKLY
        MONTHLY
    }

    class TaskStatus {
        <<enumeration>>
        COMPLETED
        FAILED
        SKIPPED
    }

    %% --- Interfaces Auxiliares ---

    class LevelInfo {
        <<interface>>
        +currentLevel: number
        +currentXp: number
        +nextLevelXp: number
    }

    %% --- Entidades Principais ---

    class User {
        <<interface>>
        +uid: string
        +displayName: string
        +email: string
        +photoUrl: string
        +level: LevelInfo
        +skillIds: string[]
    }

    class Skill {
        <<interface>>
        +id: string
        +userId: string
        +name: string
        +icon: string
        +description: string
        +level: LevelInfo
    }

    class Tag {
        <<interface>>
        +id: string
        +userId: string
        +name: string
        +colorHex: string
    }

    %% --- O Coração: Regra, Exceção, Histórico ---

    class TaskRule {
        <<interface>>
        +id: string
        +userId: string
        +title: string
        +description: string
        +tagId: string
        +skillIds: string[]
        +priority: Priority
        +difficulty: Difficulty
        +xpReward: number
        +isXpManual: boolean
        +startDate: Date
        +endDate: Date
        +instanceEndTime: Date
        +frequency: Frequency
        +isDeleted: boolean
    }

    class TaskException {
        <<interface>>
        +id: string
        +ruleId: string
        +originalDate: Date
        +newTitle: string
        +newXpReward: number
        +newDate: Date
        +isDeleted: boolean
    }

    class TaskHistory {
        <<interface>>
        +id: string
        +userId: string
        +ruleId: string
        +completionDate: Date
        +status: TaskStatus
        +snapshotTitle: string
        +snapshotXpEarned: number
        +snapshotTagId: string
    }

    %% --- Relacionamentos ---

    User "1" *-- "1" LevelInfo : Possui
    Skill "1" *-- "1" LevelInfo : Possui

    User "1" --> "0..*" TaskRule : Cria
    User "1" --> "0..*" Skill : Cria
    User "1" --> "0..*" Tag : Cria

    TaskRule "1" --> "0..*" Skill : Referencia (IDs)
    TaskRule "1" --> "0..1" Tag : Referencia (ID)
    TaskRule "1" --o "0..*" TaskException : Tem Exceções
    TaskRule "1" --o "0..*" TaskHistory : Gera Histórico
```

---

## Descrição das Entidades

### :bust_in_silhouette: User
Representa o usuário autenticado. Possui um `LevelInfo` geral e referências às suas habilidades.

### :muscle: Skill
Habilidade criada pelo usuário (ex: "Programação", "Saúde"). Possui seu próprio `LevelInfo` que evolui com base nas tarefas vinculadas.

### :triangular_flag_on_post: Tag
Etiqueta colorida para categorizar tarefas visualmente. Armazenada por referência (`tagId`) nas tarefas.

### :clipboard: TaskRule
**Entidade central.** Representa a definição de uma tarefa — pode ser uma tarefa simples ou uma regra de repetição. Gera ocorrências virtuais em memória via `OccurrenceGenerator`.

### :repeat: TaskException
Exceção a uma regra recorrente — usada quando uma ocorrência específica é editada ou excluída sem afetar as demais.

### :scroll: TaskHistory
Registro imutável de uma tarefa concluída, desistida ou falhou. Contém snapshots dos dados no momento da ação para fins de histórico e relatórios.

### :bar_chart: LevelInfo
Value object embutido em `User` e `Skill`. Representa o estado atual de progressão (nível, XP atual, XP necessário para o próximo nível).
