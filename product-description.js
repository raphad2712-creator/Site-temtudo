(function () {
  'use strict';

  const rules = [
    [/adesivo pet|laco pet|gravata pet/, 'Acessório decorativo para animais de estimação no modelo indicado.'],
    [/abrac|enforca gato/, 'Abraçadeira para agrupar, prender ou organizar itens conforme o modelo indicado.'],
    [/adubo|fertilizante|substrato|terra vegetal|semente/, 'Produto de jardinagem para o cultivo e o cuidado com plantas.'],
    [/vaso|floreira|cachepo/, 'Peça para organizar ou apresentar plantas e flores.'],
    [/areia.*gato|granulado.*gato/, 'Produto destinado à higiene de gatos.'],
    [/racao|petisco|alimento.*(cao|gato|passaro|peixe)|alpiste/, 'Alimento para animais na apresentação indicada no nome do produto.'],
    [/suplemento|vitamina|vitaminico/, 'Suplemento da linha animal. Consulte o rótulo para composição e modo de uso.'],
    [/shampoo|condicionador|colonia|perfume/, 'Produto de higiene ou perfumação na versão indicada no catálogo.'],
    [/coleira|peitoral|guia.*pet|focinheira/, 'Acessório para a rotina com animais de estimação.'],
    [/brinquedo|bola|arranhador/, 'Item para brincadeiras e atividades, conforme o modelo apresentado.'],
    [/aquario|peixe|filtro.*aquario/, 'Produto da linha de aquarismo na configuração indicada no catálogo.'],
    [/passaro|ave|gaiola|poleiro|comedouro|bebedouro/, 'Item da linha de cuidados e acessórios para animais.'],
    [/inseticida|repelente|afasta.*gato|mosquicida/, 'Produto para controle ou afastamento, conforme as instruções do fabricante.'],
    [/medicament|vermifugo|antipulga|antibiot|solucao oral/, 'Produto da linha veterinária. Confira a embalagem e a orientação profissional antes do uso.'],
    [/alicate|martelo|furadeira|broca|serra|trena|chave|lixa|parafuso|prego/, 'Item para trabalhos de montagem, reparo ou manutenção.'],
    [/lampada|luminaria|abajur|lanterna|led/, 'Item de iluminação no formato e modelo indicados no nome.'],
    [/tomada|interruptor|fio eletrico|cabo eletrico|extensao eletrica/, 'Componente para instalações elétricas. Confira as especificações na embalagem.'],
    [/caneca|copo|garrafa|prato|talher|panela|frigideira|assadeira|pote/, 'Utensílio para o uso diário em casa ou no comércio.'],
    [/vassoura|rodo|pano|esponja|escova|balde|lixeira/, 'Item para tarefas de limpeza e organização.'],
    [/mangueira|irrigacao|regador|pulverizador/, 'Item para rega, irrigação ou aplicação, conforme seu modelo.'],
    [/piscina|algicida|cloro/, 'Produto da linha de cuidados com piscinas. Confira as instruções da embalagem.'],
    [/vara.*pesca|anzol|isca|carretilha|molinete/, 'Equipamento ou acessório da linha de pesca.'],
    [/adesivo|cola|fita/, 'Produto para aplicação, colagem ou fixação conforme o tipo indicado.'],
    [/cadeira|mesa|prateleira|estante/, 'Peça para compor ou organizar ambientes.'],
    [/roupa|camiseta|bone|viseira|chinelo|sapato/, 'Item de vestuário ou acessório no modelo apresentado.']
  ];

  window.productDescription = function (product) {
    const name = String(product.name || product[1] || '').trim();
    const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const type = rules.find(([pattern]) => pattern.test(normalized));
    const details = [];
    const dimensions = name.match(/\b\d+(?:[,.]\d+)?\s?x\s?\d+(?:[,.]\d+)?\b/i);
    const size = name.match(/\b\d+(?:[,.]\d+)?\s?(?:kg|g|ml|l|lt|cm|mm|m)\b/i);
    const pack = name.match(/\b(?:c\/\d+|cx\s*c\/\d+|pct\s*c\/\d+)\b/i);
    const color = name.match(/\b(?:branc[ao]|pret[ao]|azul|verde|vermelh[ao]|rosa|amarel[ao]|cinza|marrom|lil[aá]s|roxo|laranja|dourad[ao])\b/i);
    if (dimensions) details.push('medida ' + dimensions[0].replace(/\s*x\s*/i, ' × '));
    else if (size) details.push('medida ou quantidade ' + size[0]);
    if (pack) details.push('embalagem ' + pack[0]);
    if (color) details.push('cor ' + color[0].toLowerCase());
    else if (/\bbca\b/i.test(name)) details.push('cor branca');
    else if (/\bpta\b/i.test(name)) details.push('cor preta');
    const specific = details.length ? ' Esta versão traz ' + details.join(', ') + '.' : '';
    const context = type ? type[1] : 'Conheça este item do catálogo Temdetudo Atacado e confira sua apresentação na foto.';
    return name + '. ' + context + specific;
  };
})();
