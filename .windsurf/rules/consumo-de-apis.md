---
trigger: always_on
---

Na pagina process-control consumo as API em .env.local usando esta logica descrita acima.
1 - Em NEXT_PUBLIC_API_CLIENTES_URL, envio o access-token e o parametro codcoor = usuário.cod salvo da resposta de NEXT_PUBLIC_API_ME_URL.
Resposta json:
[
    {
        "codcli": 390,
        "fantasia": "AGA - Aganor             ",
        "lc_ufs": [
            {
                "uf": "AL"
            },
            {
                "uf": "BA"
            },
            {
                "uf": "CE"
            },
            {
                "uf": "PA"
            },
            {
                "uf": "PE"
            }
        ]
    }
]

2 - Em NEXT_PUBLIC_API_UNIDADES_URL, envio o access-token e os parametros codcoor = usuário.cod, codcli = codcli de dropdown Clientes, uf de dropdown UF ou "ZZ" para todas se checkbox TodasUfs checked, page = 1.
Resposta json:
{
    "folowups": [],
    "pagination": {
        "totalItems": 0,
        "currentPage": 1,
        "itemsPerPage": 100,
        "lastPage": 0
    }
}

3 - Em NEXT_PUBLIC_API_SERVICOS_URL, envio o access-token e os parametros qcodCoor = usuário.cod salvo, qcontrato = de dropdown Unidades, qUnidade = de dropdown Unidades, qConcluido = checkbox só servicos não concluidos, qCodServ = -1, qStatus = "ALL", qDtlimite = "ALL".
Resposta json:
[
    {
        "codccontra": 261834,
        "contrato": 19196,
        "codend": 20307,
        "tipo": "ARGO - NSP - Shopping Norte Sul Plaza",
        "descserv": "261834 - Shop_Faturamento Mensal - AGOSTO",
        "codServ": 160,
        "rescisao": false,
        "suspenso": false,
        "dtLimite": "2017-08-10T00:00:00.000Z",
        "dt_limiteS": "2017-08-10",
        "mStatus": "Condomínio",
        "valserv": "780",
        "valameni": "780",
        "obsServ": "Condomínio",
        "novo": false,
        "produto": " ",
        "filtroOs": false,
        "obsresci": "",
        "sinal": false,
        "servnf": false,
        "concluido": true,
        "teventserv": false,
        "XdtLimite": "2017-08-10T00:00:00.000Z",
        "revisao": false,
        "eControle": "",
        "pendente": false,
        "qtdPende": 0,
        "cnpjConform": null,
        "medicao": false,
        "codstatusocorr": null,
        "tetramitacao": null,
        "teassessoria": null,
        "horasassessoria": null,
        "horastramitacao": null
    }
]

4 - Em NEXT_PUBLIC_API_FOLLOWUP_URL, envio o access-token e os parametros codserv = linha da grade serviços (codcontra).
Resposta json:
[
    {
        "cod": 2829049,
        "dttarefa": "2024-12-10T00:00:00.000Z",
        "atribui": false,
        "atribuid": false,
        "desctarefa": "Autorizar faturamento da parcela de entrega",
        "conclusao": false,
        "faturado": false,
        "finanNFeRps": false,
        "faturaok": false,
        "fatura": true,
        "evento": null,
        "medicao": false,
        "faturafixa": false,
        "val_faturafixa": "0",
        "porcen": "100",
        "descadnf": "entrega        ",
        "fatura_ger_aux": false,
        "te": 5,
        "ta": 0,
        "tedes": null,
        "desenhista": null,
        "coordena": "Mauro.Luiz          ",
        "coordena2": null,
        "conclusaod": false,
        "codana": null,
        "catg_valmed": "  ",
        "faturafixa_ok": false,
        "faturafixa_ok_aux": false,
        "analista": "Genérico_Mauro      ",
        "tetramitacao": null,
        "teassessoria": null,
        "cad_rps": null,
        "env_finan": false,
        "sdttarefa": "2024-12-10",
        "nfcancelada": false
    }
]

5 - Em NEXT_PUBLIC_API_CONFORMIDADE_URL, envio o access-token e os parametros codimov = de dropdown Unidades, web = false, relatorio = true, cnpj = "", temcnpj = false.
Resposta json:

[
    {
        "cod": 688838,
        "codimov": 22769,
        "codcfor": 3,
        "descr": "Projeto Aprovado - Prefeitura",
        "doc": "31 fls.",
        "area": "0",
        "dt": "2014-02-06T00:00:00.000Z",
        "dtvenc": null,
        "providencia": "",
        "quando": null,
        "quem": "Cliente",
        "grupo": "",
        "atividade": "",
        "docscanv": false,
        "docscani": true,
        "qtdedoc": null,
        "qlocal": null,
        "finternet": true,
        "terceiros": false,
        "cad": false,
        "arqmorto": false,
        "cnpjconform": null,
        "oldcnpj": null,
        "periodocidade": "Única Vez",
        "graurisco": "Alto",
        "obs": "",
        "frelatorio": true,
        "dtrenov": null,
        "fobs": false,
        "codgpdepto": 0,
        "vgraurisco": 2,
        "valtrib": "0",
        "docoriginal": false,
        "dtdocoriginal": null,
        "codusudocorig": null,
        "docoriginalok": false,
        "dtdocoriginalok": null,
        "codusudocorigok": null,
        "dtins": null,
        "docpermanente": false,
        "statusconform": false,
        "dtstatusconform": null,
        "codstatusconform": null,
        "orgaopublico": "",
        "orientacao": null,
        "gestaocli": false,
        "responsterceiro": false,
        "dtrecebe": null,
        "dtinput": null,
        "flagtipopdf": false,
        "subdescr": "GI",
        "aba01": "0"
    }
]