import {IDS,SUITS,LABEL,card,shuffle,fresh,valid,options,evaluate} from "./rules.mjs";
const ID="fu-deck-ace-of-cards-dmarkhron", FLAG="deck", CHANNEL="module."+ID;
let pending=new Map(),queue=new Map(),windowRef;
const actorOf=uuid=>fromUuidSync(uuid);
const canSee=(actor,user)=>actor?.testUserPermission(user,"OBSERVER");
const canAct=(actor,user)=>actor?.testUserPermission(user,"OWNER");
const clone=x=>structuredClone(x);
async function load(actor){let s=actor.getFlag(ID,FLAG) ?? actor.flags?.["ace-yazi"]?.[FLAG];if(!s)return null;if(!valid(s))throw Error("Baralho inválido. Peça ao mestre para conferir os dados.");return clone(s)}
async function transact(actor,fn){let old=await load(actor),s=old?clone(old):fresh(),result=fn(s);if(result===false)return s;if(!valid(s))throw Error("A operação deixou o baralho inválido.");s.revision=(old?.revision??-1)+1;await actor.setFlag(ID,FLAG,s);return s}
function mutation(actor,fn){let key=actor.uuid,prev=queue.get(key)||Promise.resolve(),next=prev.catch(()=>{}).then(()=>transact(actor,fn));queue.set(key,next);next.finally(()=>{if(queue.get(key)===next)queue.delete(key)}).catch(()=>{});return next}
function mutate(s,op,p){let before=clone(s);s.history=null;
 if(op==="draw"){if(!s.deck.length){s.deck=shuffle(s.discard);s.discard=[]}if(!s.deck.length)throw Error("Não há cartas para comprar.");s.hand.push(s.deck.shift())}
 else if(op==="discard"){let ids=p.cards;if(!Array.isArray(ids)||!ids.length||ids.some(id=>!s.hand.includes(id))||new Set(ids).size!==ids.length)throw Error("Seleção inválida.");for(let id of ids){s.hand.splice(s.hand.indexOf(id),1);s.discard.push(id)}}
 else if(op==="play"){let ids=p.cards;if(!Array.isArray(ids)||!ids.every(id=>s.hand.includes(id))||new Set(ids).size!==ids.length)throw Error("Seleção inválida.");let match=evaluate(ids,p.assignment||{}).find(x=>x.id===p.effect);if(!match)throw Error("Essa combinação não é válida.");if(match.id==="forbidden-monarch"&&!p.confirmHeroic)throw Error("Confirme a habilidade Forbidden Monarch.");for(let id of ids){s.hand.splice(s.hand.indexOf(id),1);s.discard.push(id)}return {before,match,ids}}
 else if(op==="vanguard"){let id=p.cards?.[0];if(!s.hand.includes(id)||s.vanguard.length>=3)throw Error("Vanguarda indisponível.");s.hand.splice(s.hand.indexOf(id),1);s.vanguard.push(id)}
 else if(op==="reveal"){let id=p.cards?.[0];if(!s.vanguard.includes(id))throw Error("Carta fora da Vanguarda.");s.vanguard.splice(s.vanguard.indexOf(id),1);s.discard.push(id)}
 else if(op==="reset"){Object.assign(s,fresh())}
 else throw Error("Ação desconhecida.");
 s.history={revision:s.revision+1,before};return null}
async function execute(payload,user){let actor=actorOf(payload.actorUuid);if(!actor||!canAct(actor,user))throw Error("Você não pode alterar este baralho.");if(payload.op==="undo"){return mutation(actor,s=>{if(!s.history||s.history.revision!==s.revision)throw Error("Não há uma ação recente para desfazer.");Object.assign(s,clone(s.history.before));s.history=null})}let played;let state=await mutation(actor,s=>{if(payload.revision!==undefined&&payload.revision!==s.revision)throw Error("Baralho atualizado em outra janela. Tente novamente.");played=mutate(s,payload.op,payload)});if(played?.match)await ChatMessage.create({speaker:ChatMessage.getSpeaker({actor}),content:chatCard(actor,played)});return state}
function label(id){let c=card(id);return c.joker?"Coringa":`${c.value} de ${LABEL[c.suit]}`}
const ICONS={earth:'<path d="M12 2 2 19h20L12 2Zm0 6 6 10H6l6-10Z"/>',air:'<path d="M3 9c5-8 13-7 16-1 2 5-2 9-6 8-3-1-2-5 1-5M2 17c6-4 10 0 15 3"/>',fire:'<path d="M12 2c2 5-1 6 2 10 1-3 4-4 4-7 5 7 4 16-6 17-8 0-11-8-6-14 0 4 2 6 3 6-1-5 0-8 3-12Z"/>',ice:'<path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19M8 2l4 4 4-4M8 22l4-4 4 4"/>',joker:'<path d="M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/>'};
function icon(name,size=24){return `<svg class="ace-icon" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||ICONS.joker}</svg>`}
function svgCard(id,{interactive=true,selected=false,compact=false}={}){let c=card(id),s=c.suit||"joker",n=c.joker?"✦":c.value,title=label(id);return `<${interactive?"button":"div"} ${interactive?'type="button" data-card="'+id+'" aria-pressed="'+selected+'"':''} class="ace-card ace-${s} ${selected?"selected":""} ${compact?"ace-compact":""}" title="${title}" aria-label="${title}"><span class="ace-card-top"><b>${n}</b>${c.joker?`<img class="ace-card-corner" src="systems/projectfu/styles/static/icons/resources/up.png" alt="">`:`<img class="ace-card-corner" src="systems/projectfu/styles/static/affinities/icons/${s}.png" alt="">`}</span><span class="ace-card-art">${c.joker?`<img src="systems/projectfu/styles/static/icons/resources/up.png" alt="">`:`<img src="systems/projectfu/styles/static/affinities/icons/${s}.png" alt="" loading="lazy">`}</span><span class="ace-card-bottom">${c.joker?"CORINGA":LABEL[s].toUpperCase()}</span></${interactive?"button":"div"}>`}
function faces(ids,selected=[],compact=false){return ids.map(id=>svgCard(id,{selected:selected.includes(id),compact})).join("")}
function chatCard(actor,played){return `<article class="ace-chat-card"><div class="ace-chat-kicker">${icon("joker",18)} ÁS DAS CARTAS <span>✦ JOGADA</span></div><h3>${foundry.utils.escapeHTML(played.match.name)}</h3><p class="ace-chat-actor">${foundry.utils.escapeHTML(actor.name)}</p><div class="ace-chat-cards">${played.ids.map(id=>svgCard(id,{interactive:false,compact:true})).join("")}</div><div class="ace-chat-effect"><small>EFEITO</small><p>${foundry.utils.escapeHTML(played.match.detail)}</p></div></article>`}
class DeckApp extends Application {
 constructor(actor){super();this.actor=actor;this.selected=[];this.picked=null}
 static get defaultOptions(){return foundry.utils.mergeObject(super.defaultOptions,{id:"ace-yazi-deck",title:"Ás das Cartas",width:760,height:"auto",resizable:true})}
 async _renderInner(){
  let s=await load(this.actor),name=foundry.utils.escapeHTML(this.actor.name);
  if(!s)return $(`<main class="ace-wrap ace-empty"><div class="ace-hero"><div class="ace-eyebrow">✦ ÁS DAS CARTAS</div><h2>${name}</h2><p>Um baralho de 30 cartas espera por você.</p><button class="ace-primary" data-op="reset">Embaralhar e comprar 5 cartas</button></div></main>`);
  this.state=s;this.selected=this.selected.filter(x=>s.hand.includes(x));
  let opts=options(this.selected),pick=opts.find(x=>x.id===this.picked)||opts[0];this.picked=pick?.id;
  let assign=pick?.assignment||{},chosen=this.selected.length;
  let jokerControls=Object.entries(assign).map(([id,a])=>`<div class="ace-joker-control"><span>${icon("joker",17)} ${label(id)} como</span><select data-joker="${id}" data-field="suit">${SUITS.map(suit=>`<option value="${suit}" ${a.suit===suit?"selected":""}>${LABEL[suit]}</option>`).join("")}</select><select data-joker="${id}" data-field="value">${Array.from({length:7},(_,i)=>`<option value="${i+1}" ${a.value===i+1?"selected":""}>${i+1}</option>`).join("")}</select></div>`).join("");
  return $(`<main class="ace-wrap"><div class="ace-hero"><div class="ace-eyebrow">✦ ÁS DAS CARTAS <span>PROJECTFU</span></div><h2>${name}</h2><div class="ace-stats"><div><b>${s.deck.length}</b><small>MONTE</small></div><div><b>${s.hand.length}</b><small>NA MÃO</small></div><div><b>${s.discard.length}</b><small>DESCARTE</small></div></div></div><section class="ace-panel"><div class="ace-section-heading"><div><span class="ace-step">01</span><h3>Sua mão</h3></div><span class="ace-hint">${chosen?`${chosen} ${chosen===1?"carta selecionada":"cartas selecionadas"}`:"Clique nas cartas para selecionar"}</span></div><div class="ace-cards ace-hand">${faces(s.hand,this.selected)||'<div class="ace-placeholder">Sua mão está vazia. Compre uma carta para continuar.</div>'}</div><div class="ace-actions"><button class="ace-primary" data-op="draw" ${!s.deck.length&&!s.discard.length?"disabled":""}>${icon("joker",16)} Comprar carta</button><button data-op="discard" ${!chosen?"disabled":""}>Descartar ${chosen||""}</button><button data-op="vanguard" ${chosen!==1||s.vanguard.length>=3?"disabled":""}>Vanguarda</button></div></section><section class="ace-panel ace-resolution"><div class="ace-section-heading"><div><span class="ace-step">02</span><h3>Jogada</h3></div></div>${opts.length?`<div class="ace-play"><label>COMBINAÇÃO DISPONÍVEL<select id="ace-effect">${opts.map(x=>`<option value="${x.id}" ${x.id===this.picked?"selected":""}>${x.name}</option>`).join("")}</select></label><div class="ace-effect"><small>EFEITO</small><p>${foundry.utils.escapeHTML(pick.detail)}</p></div>${jokerControls}<button class="ace-primary ace-play-button" data-op="play">Jogar ${chosen} cartas →</button></div>`:`<div class="ace-guidance">${icon("joker",31)}<p>${chosen<2?"Selecione de 2 a 5 cartas para descobrir as jogadas possíveis.":"Estas cartas ainda não formam uma combinação. Tente outra seleção."}</p></div>`}</section><details class="ace-piles"><summary>Vanguarda, descarte e controles <span>⌄</span></summary><div class="ace-piles-body"><h4>Vanguarda <small>${s.vanguard.length}/3 · Clique para revelar</small></h4><div class="ace-cards ace-small-cards">${faces(s.vanguard,[],true)||'<span class="ace-muted">Nenhuma carta</span>'}</div><h4>Descarte <small>${s.discard.length} cartas</small></h4><div class="ace-cards ace-small-cards">${s.discard.map(id=>svgCard(id,{interactive:false,compact:true})).join("")||'<span class="ace-muted">Nenhuma carta</span>'}</div><div class="ace-admin"><button data-op="undo" ${s.history?"":"disabled"}>↶ Desfazer última ação</button><button data-op="reset">Reiniciar baralho</button></div></div></details></main>`)
 }
 activateListeners(html){super.activateListeners(html);html.find("[data-card]").on("click",ev=>{let id=ev.currentTarget.dataset.card;if(this.state.hand.includes(id)){this.selected=this.selected.includes(id)?this.selected.filter(x=>x!==id):[...this.selected,id];this.picked=null;this.render() }else if(this.state.vanguard.includes(id))this.action("reveal",[id])});html.find("#ace-effect").on("change",ev=>{this.picked=ev.target.value;this.render()});html.find("[data-op]").on("click",ev=>this.action(ev.currentTarget.dataset.op));html.find("[data-joker]").on("change",ev=>{let row=ev.currentTarget.closest(".ace-joker-control");if(row)row.dataset.changed="true"})}
 async action(op,cards=this.selected){try{if(op==="reset"&&this.state&&!await Dialog.confirm({title:"Reiniciar baralho",content:"<p>Reunir as 30 cartas, embaralhar e comprar uma nova mão de cinco?</p>"}))return;let assignment=options(cards).find(x=>x.id===this.picked)?.assignment||{};this.element.find("[data-joker]").each((_,el)=>{let id=el.dataset.joker;assignment[id]??={};assignment[id][el.dataset.field]=el.dataset.field==="value"?Number(el.value):el.value});let payload={actorUuid:this.actor.uuid,op,cards,assignment,effect:this.picked,revision:this.state?.revision,confirmHeroic:op==="play"&&this.picked==="forbidden-monarch"?await Dialog.confirm({title:"Habilidade heroica",content:"<p>Confirmar Forbidden Monarch?</p>"}):false};if(op==="play"&&!evaluate(cards,assignment).some(x=>x.id===this.picked))throw Error("A atribuição dos coringas não forma essa combinação.");await request(payload);this.selected=[];this.picked=null;this.render()}catch(e){ui.notifications.error(e.message)}}
}
async function request(payload){let gm=game.users.activeGM;if(!gm)throw Error("É necessário um mestre conectado para alterar o baralho.");if(gm.isSelf)return execute(payload,game.user);let id=foundry.utils.randomID();return new Promise((resolve,reject)=>{let timeout=setTimeout(()=>{pending.delete(id);reject(Error("O mestre não respondeu."))},12000);pending.set(id,{resolve,reject,timeout});game.socket.emit(CHANNEL,{type:"request",id,to:gm.id,from:game.user.id,payload})})}
function open(actor){if(!actor||!canSee(actor,game.user)){ui.notifications.warn("Selecione um personagem que você pode consultar.");return}windowRef?.close();windowRef=new DeckApp(actor);windowRef.render(true)}
class ActorPicker extends Application {
 constructor(actors){super();this.actors=actors}
 static get defaultOptions(){return foundry.utils.mergeObject(super.defaultOptions,{id:"ace-yazi-picker",title:"Escolher personagem · Ás das Cartas",width:480,height:"auto",resizable:true})}
 async _renderInner(){return $(`<main class="ace-picker"><div class="ace-picker-head"><div class="ace-eyebrow">✦ ÁS DAS CARTAS</div><h2>Escolha um personagem</h2><p>O baralho fica salvo no personagem escolhido.</p></div><div class="ace-picker-list">${this.actors.map(actor=>`<button type="button" class="ace-picker-item" data-actor-id="${actor.id}"><img src="${foundry.utils.escapeHTML(actor.img||"icons/svg/mystery-man.svg")}" alt=""><span><strong>${foundry.utils.escapeHTML(actor.name)}</strong><small>${actor.isOwner?"Pode jogar as cartas":"Somente consulta"}</small></span><span class="ace-picker-arrow" aria-hidden="true">→</span></button>`).join("")}</div></main>`)}
 activateListeners(html){super.activateListeners(html);html.find("[data-actor-id]").on("click",event=>{let actor=game.actors.get(event.currentTarget.dataset.actorId);if(actor){this.close();open(actor)}})}
}
async function openFromCards() {
 const controlled=canvas?.tokens?.controlled?.map(t=>t.actor).find(a=>a?.type==="character"&&canSee(a,game.user));
 if(controlled)return open(controlled);
 const actors=game.actors.filter(a=>a.type==="character"&&canSee(a,game.user)).sort((a,b)=>a.name.localeCompare(b.name));
 if(!actors.length){ui.notifications.warn("Nenhum personagem disponível. Atribua um personagem ao usuário ou selecione seu token.");return}
 new ActorPicker(actors).render(true);
}
function attachCardsButton() {
 const root=document.querySelector("#cards, #cards-directory, [data-tab='cards'].sidebar-tab, [data-tab='cards'].tab");
 if(!root||root.querySelector(".ace-sidebar-button"))return;
 const button=document.createElement("button");button.type="button";button.className="ace-sidebar-button";button.innerHTML="<i class='fas fa-clone'></i> Ás das Cartas — abrir baralho";
 button.addEventListener("click",openFromCards);
 const create=root.querySelector("[data-action='createEntry'], [data-action='createDocument'], [data-action='create'], .create-document, .create-entity");
 if(create){let row=create.closest(".header-actions, .directory-header, .action-buttons, .directory-actions")||create;row.insertAdjacentElement("afterend",button)}
 else (root.querySelector(".directory-header")||root).prepend(button);
}
Hooks.once("init",()=>{game.modules.get(ID).api={open,openMyDeck:()=>open(canvas?.tokens?.controlled?.[0]?.actor||game.user.character)}})
function attachSheetButton(app) {
 const actor=app.actor||app.document;
 if(actor?.documentName!=="Actor"||actor.type!=="character"||!canSee(actor,game.user))return;
 const root=app.element?.[0]||app.element;
 if(!root?.querySelector||root.querySelector(".ace-sheet-button"))return;
 const button=document.createElement("button");button.type="button";button.className="ace-sheet-button";button.textContent="🃏 Meu baralho";
 button.addEventListener("click",event=>{event.preventDefault();open(actor)});
 const tabs=root.querySelector("nav.sheet-tabs, .sheet-tabs, nav.tabs, .tabs");
 const heading=root.querySelector(".window-content h1, .window-content h2, .window-content .sheet-header, .window-content header");
 const host=tabs||heading||root.querySelector(".window-content");
 if(host)host.parentElement?.insertBefore(button,host);
}
Hooks.once("ready",()=>{
 game.socket.on(CHANNEL,async msg=>{
  if(msg.to!==game.user.id)return;
  if(msg.type==="request"&&game.user.isGM&&game.users.activeGM?.isSelf){try{await execute(msg.payload,game.users.get(msg.from));game.socket.emit(CHANNEL,{type:"response",id:msg.id,to:msg.from,ok:true,actorUuid:msg.payload.actorUuid})}catch(e){game.socket.emit(CHANNEL,{type:"response",id:msg.id,to:msg.from,ok:false,error:e.message})}}
  else if(msg.type==="response"){let p=pending.get(msg.id);if(p){clearTimeout(p.timeout);pending.delete(msg.id);msg.ok?p.resolve():p.reject(Error(msg.error))}}
  else if(msg.type==="changed"&&windowRef?.actor.uuid===msg.actorUuid)windowRef.render()
 });
 for(const hook of ["renderActorSheet","renderActorSheetV2","renderApplicationV2","renderApplication"])
  Hooks.on(hook,app=>setTimeout(()=>attachSheetButton(app),0));
 Hooks.on("updateActor",actor=>{if(windowRef?.actor.id===actor.id)windowRef.render()});
 for(const hook of ["renderCardsDirectory","renderCardsDirectoryV2","renderSidebarTab","renderApplicationV2"])
  Hooks.on(hook,()=>setTimeout(attachCardsButton,0));
 const observer=new MutationObserver(()=>attachCardsButton());
 observer.observe(document.body,{childList:true,subtree:true});
 attachCardsButton();
});
