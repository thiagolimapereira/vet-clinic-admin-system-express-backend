# Sistema de Gerenciamento de Clínicas Veterinárias

## 1. Introdução

Este projeto consiste em um **Sistema de Gerenciamento Administrativo para Clínicas Veterinárias**, desenvolvido em **Python** utilizando o framework **Django**.

O objetivo principal é fornecer uma plataforma completa para a gestão de todos os aspectos operacionais e de saúde de uma clínica, garantindo o controle e a organização das informações essenciais.

O sistema abrange as seguintes áreas de negócio:

* **Gestão de Pessoas e Clientes:** Controle de cadastro de tutores e veterinários.
* **Gestão de Pets:** Cadastro detalhado de animais, incluindo dados biométricos e de identificação.
* **Gestão de Atendimentos:** Marcação e acompanhamento de consultas.
* **Gestão de Prontuários:** Manutenção de históricos clínicos detalhados.
* **Gestão Financeira:** Registro e controle de pagamentos e serviços.

A primeira etapa deste projeto foca na solidez do **Modelo de Dados** e na implementação completa do **Ambiente Administrativo** com todas as funcionalidades de **CRUD** (Criação, Leitura, Atualização e Exclusão) para as entidades principais.

---

## 2. Modelo de Dados e Relacionamentos

A arquitetura de dados do sistema foi projetada para ser robusta e escalável, refletindo as complexas relações de uma clínica veterinária. O modelo garante a integridade e a rastreabilidade de todas as informações de atendimento.

### Diagrama de Entidade-Relacionamento (DER)

Abaixo está o diagrama que ilustra as entidades principais do sistema e seus relacionamentos:

<p align="center">
  <img src="./diagrama_entidade_relacionamento.jpg" alt="Diagrama de Entidade-Relacionamento do Sistema">
</p>

### Entidades Chave

| Entidade | Propósito | Relacionamentos Principais |
| :--- | :--- | :--- |
| **`person`** | Entidade base para a gestão de tutores e veterinários, contendo dados como nome, e-mail e documento. | Uma `person` pode ser tutor de múltiplos `pets` (1:N). Serve como base para a entidade `vets` (1:1). |
| **`vets`** | Cadastro dos veterinários, especializado a partir de `person`, incluindo o registro CRMV e especialização. | Um `vet` (que é uma `person`) pode ser responsável por múltiplos `appointments` (1:N). |
| **`pets`** | Cadastro dos animais atendidos pela clínica, incluindo espécie, raça e peso. | Cada `pet` está associado a uma `person` (tutor) (N:1). Um `pet` pode ter múltiplos `appointments` (1:N). |
| **`appointments`** | Registro de agendamentos, contendo dados como data e razão do atendimento. | É o ponto central de ligação, conectando `pet` e `vet`. Deriva `payment` e `medical_records`. |
| **`medical_records`** | Armazena o histórico clínico detalhado de um atendimento. | Relacionamento (1:1) com um `appointment`. |
| **`payment`** | Registro financeiro associado a um atendimento. | Relacionamento (1:1) com um `appointment`. |

---

## 3. Estrutura do Projeto

O sistema segue a arquitetura padrão do framework Django, adotando uma estrutura modular onde cada domínio de negócio é implementado em um App independente.  
Essa abordagem garante organização, reutilização de código e facilidade de manutenção, além de permitir a expansão futura do projeto sem comprometer sua integridade.

Abaixo está uma visão geral da estrutura de diretórios:

<details>
  <summary>📂 Estrutura Completa do Projeto</summary>

```C:.
│   .gitignore
│   README.md
│
└───vet_clinic_admin_system
    │   db.sqlite3
    │   manage.py
    │
    ├───appointments
    │   │   admin.py
    │   │   apps.py
    │   │   models.py
    │   │   tests.py
    │   │   views.py
    │   │   __init__.py
    │   │
    │   └───migrations
    │           0001_initial.py
    │           __init__.py
    │
    ├───medical_records
    │   │   admin.py
    │   │   apps.py
    │   │   models.py
    │   │   tests.py
    │   │   views.py
    │   │   __init__.py
    │   │
    │   └───migrations
    │           __init__.py
    │
    ├───payments
    │   │   admin.py
    │   │   apps.py
    │   │   models.py
    │   │   tests.py
    │   │   views.py
    │   │   __init__.py
    │   │
    │   └───migrations
    │           0001_initial.py
    │           __init__.py
    │
    ├───person
    │   │   admin.py
    │   │   apps.py
    │   │   models.py
    │   │   tests.py
    │   │   validators.py
    │   │   views.py
    │   │   __init__.py
    │   │
    │   └───migrations
    │           0001_initial.py
    │           __init__.py
    │
    ├───pets
    │   │   admin.py
    │   │   apps.py
    │   │   models.py
    │   │   tests.py
    │   │   views.py
    │   │   __init__.py
    │   │
    │   └───migrations
    │           0001_initial.py
    │           __init__.py
    │
    ├───vets
    │   │   admin.py
    │   │   apps.py
    │   │   models.py
    │   │   tests.py
    │   │   validators.py
    │   │   views.py
    │   │   __init__.py
    │   │
    │   └───migrations
    │           0001_initial.py
    │           __init__.py
    │
    └───vet_clinic_admin_system
            asgi.py
            settings.py
            urls.py
            wsgi.py
            __init__.py
```
</details>

### Organização dos Módulos

Cada App representa uma entidade ou domínio específico do sistema:

- **`person/`**: Contém a modelagem de pessoas (tutores e veterinários) e suas validações.  
- **`vets/`**: Especialização da entidade `person`, armazenando informações profissionais (CRMV e especialização).  
- **`pets/`**: Gerencia o cadastro de animais, incluindo dados biométricos e de identificação.  
- **`appointments/`**: Responsável pelos agendamentos de consultas, conectando tutores, pets e veterinários.  
- **`medical_records/`**: Armazena os históricos clínicos e prontuários associados aos atendimentos.  
- **`payments/`**: Controla os registros financeiros referentes às consultas realizadas.  

O diretório principal **`vet_clinic_admin_system/`** contém os arquivos de configuração do projeto Django, incluindo:
- `settings.py`: Configurações globais do projeto (apps, banco de dados, autenticação, etc.).
- `urls.py`: Gerencia o roteamento principal.
- `asgi.py` e `wsgi.py`: Pontos de entrada para servidores de aplicação.
- `manage.py`: Ferramenta de linha de comando para administração e execução de comandos do Django.

---

## 4. Funcionalidades e Ambiente Administrativo (CRUD)

O sistema foi desenvolvido como uma ferramenta administrativa, concentrando todas as funcionalidades de gestão no **Ambiente Administrativo do Django (/admin)**.

A estrutura modular do projeto (ver Seção 3) garante que cada entidade de negócio possui seu respectivo *CRUD* (Create, Read, Update, Delete) totalmente funcional, permitindo a gestão completa e consistente dos dados da clínica.

### Entidades CRUD Disponíveis

Todas as entidades mapeadas no Modelo de Dados (ver Seção 2) estão registradas e acessíveis via Django Admin:

| App | Entidade Principal | Foco da Gestão | Comprovação do CRUD |
| :--- | :--- | :--- | :--- |
| **`person`** | `Person` | Cadastro base de tutores, com validação rigorosa de CPF e telefone. | `admin.site.register(Person)` |
| **`vets`** | `Vet` | Especialização de `Person` para gestão de veterinários. Inclui validação customizada para o registro CRMV. | `admin.site.register(Vet)` |
| **`pets`** | `Pet` | Cadastro de animais, vinculado ao tutor (`Person`). Inclui campos para espécie e dados biométricos. | `admin.site.register(Pet)` |
| **`appointments`** | `Appointment` | Agendamentos de consultas, conectando Pet e Vet, com rastreio de *status* (Agendada, Completa, Cancelada). | `admin.site.register(Appointment)` |
| **`medical_records`** | `MedicalRecord` | Criação e atualização de prontuários (diagnóstico, tratamento) por atendimento. | `admin.site.register(MedicalRecord)` |
| **`payments`** | `Payment` | Gestão financeira, vinculada ao atendimento, rastreando valor, status e tipo de pagamento. | `admin.site.register(Payment)` |

### Foco na Integridade dos Dados

O projeto prioriza a integridade das informações por meio de:

* **Herança de Modelo:** A entidade `Vet` herda os campos de `Person`, evitando duplicação de dados básicos.
* **Validações Customizadas:** Validações em tempo real são aplicadas a campos críticos:
    * **CPF e Telefone:** Validação de formato e dígitos verificadores na entidade `Person`.
    * **CRMV:** Validação de formato (UF + Dígitos) na entidade `Vet`.

---

## 5. Instalação e Teste

Esta seção descreve o processo de instalação e execução do projeto em ambiente local, permitindo o acesso ao painel administrativo onde estão implementadas as operações de **CRUD** (Criação, Leitura, Atualização e Exclusão) para todas as entidades do sistema.

### Pré-requisitos

Para executar o sistema, é necessário ter o **Python 3.x** instalado na máquina.  
Recomenda-se também o uso de um ambiente virtual para isolar as dependências do projeto.

### 5.1. Instalação do Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Scommegna/vet-clinic-admin-system.git
   cd vet_clinic_admin_system
   ```

2.  **Crie e ative o ambiente virtual:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # No Linux/macOS
    .\venv\Scripts\activate   # No Windows
    ```

3.  **Instale as dependências:**
    O projeto utiliza o framework Django como principal dependência.
    ```bash
    pip install django~=4.2.0
    ```

### 5.2. Configuração do Banco de Dados

1.  **Crie o Superusuário** para acessar o painel administrativo:
    ```bash
    python manage.py createsuperuser
    ```
    *Durante o processo, informe um nome de usuário, e-mail (opcional) e senha.*

### 5.3. Execução do Sistema

1.  **Inicie o servidor de desenvolvimento:**
    ```bash
    python manage.py runserver
    ```

2.  **Acesse o sistema no navegador:**
    * Abra seu navegador e navegue até: `http://127.0.0.1:8000/admin/`.
    * Faça login com as credenciais do superusuário criado na etapa anterior.

<br>

Após o login, o painel administrativo permitirá o gerenciamento completo das entidades **Person, Vet, Pet, Appointment, MedicalRecord e Payment**, possibilitando testar todas as operações de CRUD implementadas.

O ambiente administrativo do Django serve como base para validação da modelagem de dados e demonstra o correto funcionamento das relações entre as entidades do sistema, consolidando a primeira etapa do projeto.