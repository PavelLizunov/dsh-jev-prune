window.__ModuleLoader__.load({id:'@pavellizunov/dsh-jev-prune',factory:(require)=>{
const React=require('react');const {createElement:h,useState,useEffect}=React;
function Settings(){
 const [data,setData]=useState(null),[form,setForm]=useState({}),[key,setKey]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 async function load(){const r=await fetch('/jev-prune/settings',{cache:'no-store'});if(!r.ok)throw Error('Settings unavailable');const d=await r.json();setData(d);setForm(d.config)}
 useEffect(()=>{load().catch(e=>setMessage(e.message))},[]);
 async function save(clearKey=false){setBusy(true);setMessage('');try{const r=await fetch('/jev-prune/settings',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({config:form,...(key?{apiKey:key}:{}),...(clearKey?{clearKey:true}:{})})});if(!r.ok)throw Error((await r.json()).error);setKey('');await load();setMessage('Saved / Сохранено')}catch(e){setMessage(e.message)}finally{setBusy(false)}}
 const row=(name,label,type='number')=>h('label',{key:name,style:{display:'grid',gridTemplateColumns:'minmax(200px,1fr) minmax(100px,1fr)',gap:12,alignItems:'center'}},label,h('input',{type,'aria-label':label,value:form[name]??'',disabled:busy,onChange:e=>setForm({...form,[name]:type==='number'?Number(e.target.value):e.target.value}),style:{padding:6,color:'inherit',background:'transparent',border:'1px solid #8886',borderRadius:5}}));
 const toggle=(name,label)=>h('label',{key:name},h('input',{type:'checkbox',checked:!!form[name],disabled:busy,onChange:e=>setForm({...form,[name]:e.target.checked})}),' ',label);
 return h('section',{style:{display:'grid',gap:14,maxWidth:760,padding:'16px 0'}},h('h3',null,'Jev · Early tool-result pruning'),
 h('p',null,'Сокращает устаревшие результаты до следующего запроса. Оригиналы остаются в журнале. Выдержки отправляются в TypeSafe API.'),
 data?h(React.Fragment,null,toggle('enabled','Enabled / Включён'),toggle('dryRun','Dry run / Только оценка, без сокращения'),toggle('earlyPrune','Early pruning / Раннее сокращение'),
 row('earlyMinChars','Minimum new result characters'),row('earlyMinSteps','Minimum steps between passes'),row('preserveRecent','Recent nodes to preserve'),row('alwaysTrimRatio','Candidate trimming budget (0–1)'),row('judgeTimeoutMs','Jev timeout (milliseconds)'),row('judgeMaxStateTokens','Maximum judge history tokens'),row('model','Jev model','text'),row('proxyUrl','HTTP proxy URL (optional)','url'),
 h('label',null,`API key: ${data.credential.configured?'configured / настроен':'missing / отсутствует'}`,h('input',{type:'password',autoComplete:'new-password','aria-label':'New Jev API key',placeholder:'Leave empty to keep existing key',value:key,onChange:e=>setKey(e.target.value),style:{display:'block',width:'100%',padding:8,marginTop:6}})),
 h('small',null,'Ключ хранится отдельно от настроек. Значение не возвращается в браузер. Используется отдельный ключ плагина, иначе существующий TYPESAFE_API_KEY.'),
 h('div',{style:{display:'flex',gap:12}},h('button',{disabled:busy,onClick:()=>save()},busy?'Saving…':'Save settings'),h('button',{disabled:busy||!!key,onClick:()=>save(true)},'Remove plugin key'),h('button',{disabled:busy,onClick:()=>load().catch(e=>setMessage(e.message))},'Refresh status')),
 h('h4',null,'Runtime status'),h('dl',null,...[['Agent steps',data.status.preStepEvents??0],['Jev requests',data.status.requests],['Judged results',data.status.judged],['Saved characters (includes dry-run estimates)',data.status.savedChars],['Errors',data.status.errors],['Last event',data.status.lastNote||'—']].map(([k,v])=>h('div',{key:k,style:{display:'flex',gap:12}},h('dt',null,k),h('dd',null,String(v)))))):h('p',null,'Loading…'),h('p',{role:'status'},message));
}
return {inject:['slots'],apply(ctx){ctx.slots.inject('plugins.bundle.config',()=>ctx.slots.register({name:'plugins.bundle.config',key:'@pavellizunov/dsh-jev-prune',registrant:'@pavellizunov/dsh-jev-prune'},Settings))}};
}});
