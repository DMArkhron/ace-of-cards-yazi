# Ás das Cartas — Yazi

Módulo independente para usar o baralho da classe Ace of Cards no **Foundry VTT V13** com **ProjectFU**. Interface em português, 30 cartas (Terra, Ar, Fogo e Gelo de 1 a 7; dois coringas), mão inicial de cinco e estado salvo no personagem até o reinício manual.

## Instalação

Após a primeira release, use este manifesto em **Instalar módulo → URL do manifesto**:

```text
https://github.com/DMArkhron/ace-of-cards-yazi/releases/latest/download/module.json
```

Ative o módulo no mundo ProjectFU. Para instalação manual, extraia **fu-deck-ace-of-cards-dmarkhron.zip** da release em `FoundryVTT/Data/modules/fu-deck-ace-of-cards-dmarkhron/`. O arquivo `module.json` deve ficar diretamente nessa pasta.

## Uso

Na aba **Baralhos** da barra lateral, clique em **Ás das Cartas — abrir baralho**. Selecione um token de personagem antes para abri-lo diretamente; caso contrário, escolha o personagem na lista. Também é possível usar uma macro de script:

```js
game.modules.get("fu-deck-ace-of-cards-dmarkhron").api.openMyDeck()
```

O mestre deve estar conectado para que jogadores alterem o baralho. Clique nas cartas da mão para selecionar uma combinação, examine seu efeito e use **Jogar cartas**. O resultado aparece no chat. Comprar recicla o descarte embaralhado quando o monte acaba. O painel inferior contém Vanguarda, descarte, desfazer e reiniciar.

O módulo administra cartas e publica uma descrição do efeito. Não altera automaticamente PV, PM, condições, alvos ou ataques. Confirme os custos e requisitos das habilidades com o livro oficial. O módulo não verifica se um personagem possui a classe ou uma habilidade opcional.

## Publicação

O arquivo `module.json` deve permanecer na raiz do repositório. Ao criar a tag `v0.2.5` no GitHub, a ação em `.github/workflows/release.yml` verifica os arquivos e cria uma release com `module.json` e `fu-deck-ace-of-cards-dmarkhron.zip`. O ZIP de release tem o manifesto na raiz, formato necessário para o instalador do Foundry.

Para uma próxima versão, atualize `version` no manifesto, envie o código e crie uma tag correspondente, por exemplo `v0.2.6`.

## Créditos

Código e interface originais de DM Arkhron. Os ícones de elementos e Ponto de Última são carregados da instalação do ProjectFU, sem cópias no módulo. Este módulo independente não é afiliado a Need Games, Rooster Games ou à equipe ProjectFU. Fabula Ultima é uma criação de Emanuele Galletto, publicada por Need Games e Rooster Games. Requer o livro oficial para as regras da classe.

## Atualização do identificador

A partir da 0.2.5, a pasta e o identificador são `fu-deck-ace-of-cards-dmarkhron`. Desative a versão antiga `ace-yazi` antes de ativar a nova. Baralhos antigos são lidos dos dados do personagem e gravados no novo identificador na próxima alteração. O repositório continua `DMArkhron/ace-of-cards-yazi`.
