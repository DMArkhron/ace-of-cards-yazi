export const SUITS = ["earth","air","fire","ice"];
export const LABEL = {earth:"Terra",air:"Ar",fire:"Fogo",ice:"Gelo"};
export const IDS = [...SUITS.flatMap(s=>Array.from({length:7},(_,i)=>s+"-"+(i+1))),"joker-a","joker-b"];
export const card = id => id.startsWith("joker") ? {id,joker:true} : {id,suit:id.split("-")[0],value:Number(id.split("-")[1]),joker:false};
export const shuffle = (a,r=Math.random) => {let b=[...a];for(let i=b.length-1;i>0;i--){let j=Math.floor(r()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
export const fresh = () => {let a=shuffle(IDS);return {version:1,revision:0,deck:a.slice(5),hand:a.slice(0,5),discard:[],vanguard:[],history:null}};
export function valid(s){if(!s||!["deck","hand","discard","vanguard"].every(k=>Array.isArray(s[k])))return false;let all=["deck","hand","discard","vanguard"].flatMap(k=>s[k]);return all.length===30&&new Set(all).size===30&&all.every(x=>IDS.includes(x))&&s.vanguard.length<=3}
export function evaluate(ids,assign={}){
 if(ids.length<2||ids.length>5||new Set(ids).size!==ids.length) return [];
 let c=ids.map(id=>{let x=card(id);return x.joker?{...x,suit:assign[id]?.suit,value:Number(assign[id]?.value)}:x});
 if(c.some(x=>!SUITS.includes(x.suit)||!Number.isInteger(x.value)||x.value<1||x.value>7))return [];
 let n=c.length,v=c.map(x=>x.value),s=c.map(x=>x.suit),cnt=[...new Set(v)].map(x=>v.filter(y=>y===x).length).sort((a,b)=>b-a).join(","),sum=v.reduce((a,b)=>a+b,0),max=Math.max(...v),straight=new Set(v).size===n&&Math.max(...v)-Math.min(...v)===n-1,j=c.filter(x=>x.joker).length;
 let out=[];const add=(id,name,detail)=>out.push({id,name,detail});
 if(n===4&&j===0&&cnt==="4")add("jackpot","Jackpot","Aliados visíveis recuperam 777 PV e 777 PM; personagens rendidos retomam a consciência.");
 if(n===4&&straight&&new Set(s).size===1)add("magic-flush","Magic Flush",`${25+sum} de dano de ${LABEL[s[0]]} a todos os inimigos visíveis (+10 no nível 20; +20 no nível 40).`);
 if(n===4&&straight)add("blinding-flush","Blinding Flush",`${15+sum} de dano de ${max%2?"Trevas":"Luz"} a todos os inimigos visíveis (+10 no nível 20; +20 no nível 40).`);
 if(n===5&&cnt==="3,2")add("full-status","Full Status",max%2?"Escolha duas condições para os inimigos visíveis sofrerem.":"Escolha duas condições para remover dos aliados visíveis.");
 if(n===3&&cnt==="3")add("triple-support","Triple Support",`Você e os aliados visíveis recuperam ${sum*3} PV.`);
 if(n===4&&cnt==="2,2")add("double-trouble","Double Trouble",`${10+max} de dano a até dois inimigos visíveis; escolha um tipo representado nas cartas (+10 no nível 20; +20 no nível 40).`);
 if(n===2&&cnt==="2")add("magic-pair","Magic Pair","Faça um ataque gratuito com arma equipada; se causar dano, escolha um tipo elemental representado.");
 if(n===5&&j===1&&c.filter(x=>!x.joker).every(x=>x.value===c.find(y=>!y.joker)?.value))add("forbidden-monarch","Forbidden Monarch",`777 de dano de ${c.find(x=>!x.joker).value%2?"Trevas":"Luz"} a todos os inimigos visíveis (se possuir a habilidade).`);
 return out;
}
export function options(ids){let jokers=ids.filter(x=>card(x).joker);if(!jokers.length)return evaluate(ids);let out=new Map();function walk(i,a){if(i===jokers.length){for(let x of evaluate(ids,a))if(!out.has(x.id))out.set(x.id,{...x,assignment:structuredClone(a)});return}for(let suit of SUITS)for(let value=1;value<=7;value++)walk(i+1,{...a,[jokers[i]]:{suit,value}})}walk(0,{});return [...out.values()]}
