"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { SiscopCliente, SiscopUnidade } from '@/lib/types';

import { fetchClientes, fetchUnidades } from '@/lib/api-service';
import { LOCAL_STORAGE_TOKEN_KEY, LOCAL_STORAGE_USER_KEY } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { ApiParamDialog } from '@/components/api-param-dialog';

interface ProcessCommandPanelProps {
  onClientChange?: (clientId: number) => void;
  onUnitChange?: (unit: SiscopUnidade) => void;
}

export function ProcessCommandPanel({ onClientChange, onUnitChange }: ProcessCommandPanelProps): React.ReactElement {
  // Hook de toast
  const toast = useToast();
  // Referências para controle de processamento
  const isProcessingClientChange = useRef(false);
  const isProcessingUfChange = useRef(false);
  const lastFetchedParams = useRef<{ codcli?: number, uf?: string } | null>(null);

  // Estados principais
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [selectedUF, setSelectedUF] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<SiscopUnidade | null>(null);
  const [manualUFSelection, setManualUFSelection] = useState<boolean>(false);
  const [isUFEnabled, setIsUFEnabled] = useState(false);
  const [isUnitsEnabled, setIsUnitsEnabled] = useState(false);
  const [isApplyFiltersEnabled, setIsApplyFiltersEnabled] = useState(false);

  // ... demais hooks, funções auxiliares e lógica do componente
  const [codCoor, setCodCoor] = useState<number>(0);
  const [units, setUnits] = useState<SiscopUnidade[]>([]);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [unitsError, setUnitsError] = useState<Error | null>(null);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [apiParams, setApiParams] = useState({
    token: null as string | null,
    codcoor: null as number | null,
    codcli: null as number | null,
    uf: null as string | null,
    page: 1
  });
  const [clientSearchTerm, setClientSearchTerm] = useState<string>('');
  const [ufSearchTerm, setUfSearchTerm] = useState<string>('');
  const [unitSearchTerm, setUnitSearchTerm] = useState<string>('');
  const [allUfs, setAllUfs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [shouldShowPagination, setShouldShowPagination] = useState(false);

  // Carregar dados do usuário uma única vez e inicializar estados
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Ao carregar a página, resetar tudo conforme o fluxo
    setAllUfs(false);
    setSelectedClient(null);
    setSelectedUF(null);
    setSelectedUnit(null);
    setUnits([]);
    setIsUFEnabled(false);
    setIsUnitsEnabled(false);
    setIsApplyFiltersEnabled(false);
    try {
      const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      const userJson = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (!userJson) return;
      const userData = JSON.parse(userJson);
      if (userData?.cod) {
        setCodCoor(userData.cod);
      }
    } catch (e) {
      console.error('Erro ao carregar dados do usuário:', e);
    }
  }, []);

  // Carregar clientes manualmente (React puro)
  const [clients, setClients] = useState<SiscopCliente[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [clientsError, setClientsError] = useState<Error | null>(null);
  useEffect(() => {
    if (!codCoor) {
      setClients([]);
      return;
    }
    setIsLoadingClients(true);
    setClientsError(null);
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (!token) {
      setClients([]);
      setIsLoadingClients(false);
      return;
    }
    fetchClientes(codCoor)
      .then(data => setClients(Array.isArray(data) ? data : []))
      .catch(err => setClientsError(err))
      .finally(() => setIsLoadingClients(false));
  }, [codCoor]);
  // UFs disponíveis para o cliente selecionado
  const ufs = useMemo(() => {
    if (!selectedClient) return [];
    const clientData = clients.find(c => c.codcli === selectedClient);
    return clientData?.lc_ufs?.map(u => u.uf) || [];
  }, [selectedClient, clients]);

  // Controle de habilitação dos dropdowns e botões conforme o fluxo
  useEffect(() => {
    // Após selecionar cliente, habilita UF e Unidades
    setIsUFEnabled(!!selectedClient);
    setIsUnitsEnabled(false);
    setIsApplyFiltersEnabled(false);
    setSelectedUF(null);
    setSelectedUnit(null);
    setUnits([]);
    setAllUfs(false);
  }, [selectedClient]);

  useEffect(() => {
    // Após selecionar UF (ou marcar Todas UFs), habilita Unidades
    if ((selectedUF && !allUfs) || allUfs) {
      setIsUnitsEnabled(true);
    } else {
      setIsUnitsEnabled(false);
      setSelectedUnit(null);
      setUnits([]);
    }
    setIsApplyFiltersEnabled(false);
  }, [selectedUF, allUfs]);

  useEffect(() => {
    // Após selecionar unidade, habilita botão aplicar filtros
    if (selectedUnit) {
      setIsApplyFiltersEnabled(true);
    } else {
      setIsApplyFiltersEnabled(false);
    }
  }, [selectedUnit]);

  // Listas filtradas para os dropdowns (filtragem ocorre apenas após 3 caracteres)
  const filteredClients = useMemo(() => {
    const trimmedTerm = clientSearchTerm.trim();
    // Retornar todos os clientes se o termo de busca for vazio ou tiver menos de 3 caracteres
    if (!trimmedTerm || trimmedTerm.length < 3) return clients;
    // Aplicar filtro apenas se tiver 3 ou mais caracteres
    return clients.filter(client => 
      client.fantasia.toLowerCase().includes(trimmedTerm.toLowerCase())
    );
  }, [clients, clientSearchTerm]);

  const filteredUfs = useMemo(() => {
    const trimmedTerm = ufSearchTerm.trim();
    // Retornar todas as UFs se o termo de busca for vazio ou tiver menos de 3 caracteres
    if (!trimmedTerm || trimmedTerm.length < 3) return ufs;
    // Aplicar filtro apenas se tiver 3 ou mais caracteres
    return ufs.filter(uf => 
      uf.toLowerCase().includes(trimmedTerm.toLowerCase())
    );
  }, [ufs, ufSearchTerm]);

  const filteredUnits = useMemo(() => {
    const trimmedTerm = unitSearchTerm.trim();
    // Retornar todas as unidades se o termo de busca for vazio ou tiver menos de 3 caracteres
    if (!trimmedTerm || trimmedTerm.length < 3) return units;
    // Aplicar filtro apenas se tiver 3 ou mais caracteres
    return units.filter(unit => {
      const unitStr = `${unit.contrato} - ${unit.cadimov?.uf || ''} - ${unit.cadimov?.tipo || ''}`;
      return unitStr.toLowerCase().includes(trimmedTerm.toLowerCase());
    });
  }, [units, unitSearchTerm]);

  // Função interna para limpar o cache de unidades
  const clearUnitsCacheInternal = (client: number, uf: string, coorCode: number) => {
    if (!client || !uf || !coorCode) return;
    
    // Limpar chave específica do localStorage
    const cacheKey = `units_${coorCode}_${client}_${uf}_1`;
    console.log(`Limpando cache para ${cacheKey}`);
    localStorage.removeItem(cacheKey);
  };
  
  // Função para limpar o cache de unidades (versão com hook)
  const clearUnitsCache = useCallback((client: number, uf: string) => {
    clearUnitsCacheInternal(client, uf, codCoor);
  }, [codCoor]);

  // Função memoizada para carregar unidades com validação de parâmetros duplicados
  const fetchUnitsIfNeeded = useCallback(async (
    codcli: number,
    uf: string,
    processingRef: React.MutableRefObject<boolean>,
    shouldForceRefresh = true
  ): Promise<any> => {
    // Se já estiver processando, evitamos requisições duplicadas
    if (processingRef.current) {
      return null;
    }
    
    // Verificar se é uma mudança real de cliente/UF ou se é apenas um recarregamento
    const isParameterChange = 
      lastFetchedParams.current?.codcli !== codcli || 
      lastFetchedParams.current?.uf !== uf;
    
    // Sempre limpar cache quando mudar cliente ou UF
    if (isParameterChange && codCoor) {
      clearUnitsCacheInternal(codcli, uf, codCoor);
    }
    
    // Marcar como em processamento
    processingRef.current = true;
    
    // Limpar unidades enquanto carrega novos dados
    setUnits([]);
    
    // Atualizar parâmetros da última busca
    lastFetchedParams.current = { codcli, uf };
    
    if (!codCoor) {
      processingRef.current = false;
      return null;
    }
    
    setIsLoadingUnits(true);
    setUnitsError(null);
    
    try {
      const params = { codcoor: codCoor, codcli, uf, page: 1 };
      
      console.log(`Buscando unidades para cliente ${codcli} e UF ${uf}`);
      
      // Sempre forçar recarga de dados (sem usar cache) para garantir dados atualizados
      // Independente se é troca de cliente, UF ou não
      const options = { skipCache: true };
      const response = await fetchUnidades(params);
      
      if (!response?.folowups) {
        setUnits([]);
        processingRef.current = false;
        setSelectedUnit(null); // Garantir que nenhuma unidade esteja selecionada se não houver dados
        return null;
      }
      
      // Atualizar unidades
      setUnits(response.folowups);
      
      // Atualizar informações de paginação
      if (response.pagination) {
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.lastPage);
        setTotalItems(response.pagination.totalItems);
        
        // Mostrar paginação apenas se houver mais de 100 itens
        setShouldShowPagination(response.pagination.totalItems > 100);
      } else {
        // Reset paginação se não houver dados de paginação
        setCurrentPage(1);
        setTotalPages(1);
        setTotalItems(0);
        setShouldShowPagination(false);
      }
      
      // Verificar se há unidades
      if (response.folowups.length === 0) {
        toast(`Nenhuma unidade encontrada. Não há unidades para este cliente na UF ${uf}.`, 'info');
        processingRef.current = false;
        setSelectedUnit(null); // Garantir que nenhuma unidade esteja selecionada
        return null;
      }
      
      // Selecionar primeira unidade com timeout para evitar renders excessivos
      if (response.folowups.length > 0) {
        const firstUnit = response.folowups[0];
        setTimeout(() => {
          setSelectedUnit(firstUnit);
          processingRef.current = false;
        }, 100);
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
      setUnitsError(error as Error);
      toast(`Erro ao buscar unidades: ${(error as Error).message || 'Erro desconhecido ao buscar unidades.'}`, 'error');
      processingRef.current = false;
      setSelectedUnit(null); // Garantir que nenhuma unidade esteja selecionada em caso de erro
      return null;
    } finally {
  // Handler para recarregar unidades manualmente (botão "Tentar novamente")
  const refetchUnits = useCallback(() => {
    if (selectedClient === null || selectedUF === null) {
      toast('Cliente e UF são necessários para buscar unidades.');
      return;
    }
    fetchUnitsIfNeeded(selectedClient, selectedUF ?? '', isProcessingUfChange, true);
  }, [selectedClient, selectedUF, fetchUnitsIfNeeded]);

  // Função para carregar unidades com paginação
  const loadPagedUnits = useCallback((pageNumber: number) => {
    if (!selectedClient || !codCoor) return;
    if (!selectedUF && !allUfs) return;
    const ufParam: string = allUfs ? "ZZ" : (selectedUF ?? "");
    if (!ufParam) return;
    setIsLoadingUnits(true);
    const params = {
      codcoor: codCoor,
      codcli: selectedClient,
      uf: ufParam,
      page: pageNumber
    };
    fetchUnidades(params)
      .then((response: any) => {
        if (response?.folowups) {
          setUnits(response.folowups);
          if (response.pagination) {
            setCurrentPage(response.pagination.currentPage);
            setTotalPages(response.pagination.lastPage);
            setTotalItems(response.pagination.totalItems);
            setShouldShowPagination(response.pagination.totalItems > 100);
          } else {
            setCurrentPage(1);
            setTotalPages(1);
            setTotalItems(0);
            setShouldShowPagination(false);
          }
          if (response.folowups.length > 0) {
            setTimeout(() => {
              setSelectedUnit(response.folowups[0]);
            }, 100);
          } else {
            setSelectedUnit(null);
          }
        } else {
          setUnits([]);
          setSelectedUnit(null);
        }
      })
      .catch((error: unknown) => {
        setUnitsError(error as Error);
        toast(`Erro ao buscar unidades: ${(error instanceof Error ? error.message : 'Erro desconhecido ao buscar unidades.')}`);
        setUnits([]);
        setSelectedUnit(null);
      })
      .finally(() => {
        setIsLoadingUnits(false);
      });
  }, [selectedClient, selectedUF, allUfs, codCoor]);

  // Handler para o diálogo de API
  const showParamsDialog = useCallback(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    setApiParams({
      token: token || 'não disponível',
      codcoor: Number(codCoor) || 0,
      codcli: Number(selectedClient) || 0, 
      uf: selectedUF || 'não disponível',
      page: 1
    });
    setIsVerifyDialogOpen(true);
  }, [codCoor, selectedClient, selectedUF]);

  // Restaurado: handler para confirmação do diálogo de parâmetros da API
  const handleConfirmApiCall = useCallback(() => {
    setIsVerifyDialogOpen(false);
    refetchUnits();
  }, [refetchUnits]);

  // Manipulador de alteração de cliente
  const handleClientChange = useCallback((codcli: number) => {
    // Limpar cache do cliente/UF anterior se existir
    if (selectedClient && selectedUF) {
      clearUnitsCache(selectedClient, selectedUF);
    }
    
    // Definir o novo cliente
    setSelectedClient(codcli);
    
    // Forçar remoção da seleção manual de UF para permitir seleção automática
    setManualUFSelection(false);
    
    // Limpar seleções atuais
    setSelectedUnit(null);
    setUnits([]);
    
    // Encontrar a primeira UF do novo cliente selecionado e defini-la imediatamente
    const clientData = clients.find(c => c.codcli === codcli);
    if (clientData?.lc_ufs?.length) {
      const firstClientUF = clientData.lc_ufs[0].uf;
      console.log(`Cliente alterado para ${codcli}, definindo primeira UF: ${firstClientUF}`);
      setSelectedUF(firstClientUF);
    } else {
      // Se o cliente não tiver UFs, limpar a UF selecionada
      setSelectedUF(null);
    }
    
    // Notificar o componente pai
    if (onClientChange) {
      onClientChange(codcli);
    }
  }, [onClientChange, selectedClient, selectedUF, clearUnitsCache, clients]);

  // Manipulador de alteração de UF
  const handleUFChange = useCallback((uf: string) => {
    // Limpar cache do cliente/UF anterior se existir
    if (selectedClient && selectedUF) {
      clearUnitsCache(selectedClient, selectedUF);
    }
    // Limpar possível cache para a nova combinação cliente/UF
    if (selectedClient !== null && uf) {
      clearUnitsCache(selectedClient, uf);
    }
    // Limpar cache atual antes de buscar novas unidades
    if (selectedClient !== null && selectedUF) {
      clearUnitsCache(selectedClient, selectedUF);
}