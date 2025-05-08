---
trigger: always_on
---

flowchart TD
    Start([Load page]) --> DisableDropdowns[Disable dropdowns: UF, Unidades, Aplicar filtros, Hidden régua de paginação de unidades]
    DisableDropdowns --> PopulateClients[Popular o dropdown Clientes com a resposta da API Clientes]
    
    PopulateClients --> ClientSelection{Selecionou cliente?}
    ClientSelection -->|Sim| EnableDropdowns[Enable dropdowns: UF, Unidades. Enable Button: Aplicar filtros]
    EnableDropdowns --> PopulateUF[Popular dropdown UF com UFs do cliente. Selecionar 1 item (1 UF)]
    
    PopulateUF --> UFSelection{Selecionou UF?}
    UFSelection -->|Sim| CheckboxAllUFs{Checkbox Todas UFs?}
    
    CheckboxAllUFs -->|True| DisableUFDropdown[Dropdown UF disable]
    CheckboxAllUFs -->|False| EnableUFDropdown[Dropdown UF enable]
    
    DisableUFDropdown --> PopulateUnits[Popular dropdown Unidades com a resposta da API Unidades. Selecionar 1 item (1 Unidade)]
    EnableUFDropdown --> PopulateUnits
    
    PopulateUnits --> UnitSelection{Selecionou Unidade?}
    PopulateUnits --> CheckTotalUnits{Na resposta da API unidades totalItens > 100?}
    
    CheckTotalUnits -->|Sim| ShowPagination[Visible régua de paginação de unidades]
    CheckTotalUnits -->|Não| HidePagination[Hidden régua de paginação de unidades]
    
    UnitSelection -->|Sim| ApplyFilters{Button Aplicar filtros?}
    
    ApplyFilters -->|Clicado| QueryServices[Consultar API de Serviços com parâmetros:
    qoodCoor=user.cod
    qcontrato=folowups.contrato
    qunidade=folowups.coend
    qConcluido=false
    qCodServ=1
    Status=ALL
    qDtlimite=ALL]
    
    QueryServices --> SaveResults[Com o resultado: Salvar em local-store sem valores repetidos (distinct):
    codserv=codServ
    status=mStatus
    DtLimite=dtlimite]
    
    SaveResults --> PopulateServicesGrid[Popular grade de serviços com a resposta da API Serviços. Selecionar 1 item]
    
    PopulateServicesGrid --> ServiceSelection{Selecionou item na grade Serviço?}
    
    ServiceSelection -->|Sim| QueryTasks[Consultar API de Serviços com parâmetros:
    qoodCoor=user.cod
    qcontrato=folowups.contrato
    qUnidade=folowups.coend
    qConcluido=checkbox.soservnaoconcluidos
    qCodServ=dropdown.codserv
    qStatus=dropdown.status
    qDtlimite=dropdown.dtlimite]
    
    QueryTasks --> PopulateTasksGrid[Popular grade de tarefas com a resposta da API Tarefas. Selecionar 1 item (grade tarefas)]