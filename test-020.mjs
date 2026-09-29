import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import { Session } from '@deepseek-ai/dsh-session'
import { apply } from './index.js'
import { JevClient } from './jev.js'
const require = createRequire(import.meta.url)

function fixture() {
  const s = Session.create('jev-disposable-020')
  s.append('user/message', {content:[{type:'text',text:'Report SERVICE_PORT from config. Old installation logs are no longer needed.'}],source:{kind:'user'}}, {surfaceOp:'append'})
  const originals=[]
  for(let i=0;i<5;i++) {
    const id=`call-${i}`
    s.append('assistant/message',{turn:1,step:i+1,message:{role:'assistant',content:[{type:'tool-call',id,name:'read',arguments:JSON.stringify({path:i===4?'config':'old-install-log'})}],source:{kind:'model'}}},{surfaceOp:'append'})
    originals.push(s.append('tool/result',{turn:1,step:i+1,message:{role:'tool',content:[{type:'text',text:i===4?'SERVICE_PORT=43127':'Completed installation, no further action needed.\n'.repeat(220)}],source:{kind:'tool',callId:id,name:'read'}}},{surfaceOp:'append'}))
  }
  return {s,originals}
}
async function run({dryRun=false,judge,earlyMinChars=1000,earlyMinSteps=4}) {
 const {s,originals}=fixture();const hooks=[];const disposers=[];const tools=[]
 const meter={estimateMessage:m=>Math.ceil(JSON.stringify(m).length/4),measure:s=>({totalTokens:Math.ceil(JSON.stringify(s.deriveMessages()).length/4)})}
 const pruner={ctx:{tokenMeter:meter},pruneSession:()=>({pruned:[],charsRemoved:0}),pruneContent:()=>{throw Error('Early mode must not use fallback')}}
 const services={toolResultPruner:pruner,tokenMeter:meter,tools:{register:t=>{tools.push(t);return ()=>{}}}}
 const ctx={get:n=>services[n],tools:services.tools,logger:{info(){},warn(){},debug(){}},on:(n,h)=>{if(n==='agent/pre-step')hooks.push(h)},effect:f=>disposers.push(f())}
 apply(ctx,{earlyPrune:true,earlyMinChars,earlyMinSteps,maxJudgeBatches:1,judgeOn:'always',compactReceipts:false,preserveRecent:2,keepMode:'budget',dryRun}, {judge})
 const before=JSON.stringify(s.deriveMessages());const agent={id:s.id,session:s}
 async function step(){for(const h of hooks)await h({agent,signal:new AbortController().signal},async()=>({kind:'enter',messages:[]}))}
 await step();const after=JSON.stringify(s.deriveMessages())
 for(const e of originals)assert.equal(s.eventAt(e.seq),e,'original retained')
 assert.equal(s.deriveMessages().filter(m=>m.role==='assistant').length,5)
 assert.ok(after.includes('SERVICE_PORT=43127'))
 if(dryRun)assert.equal(after,before)
 const requests=judge.requests;await step();assert.equal(judge.requests,requests,'unchanged results must not be judged again')
 for(const d of disposers)await d?.()
 return {beforeChars:before.length,afterChars:after.length,requests:judge.requests,dryRun}
}
function fake(fail=false){return {ready:true,requests:0,batch:(_s,q)=>[q],ask:async function(_s,q){this.requests++;if(fail)throw Error('test timeout');return Object.fromEntries(Object.keys(q).map(k=>[k,0.04]))}}}
if(process.env.JEV_LIVE==='1'){
 const {ProxyAgent,fetch}=require('undici');const yaml=require('js-yaml')
 const creds=yaml.load(await fs.readFile(process.env.JEV_CREDENTIALS_FILE,'utf8'))
 const dispatcher=new ProxyAgent(process.env.JEV_PROXY_URL)
 const judge=new JevClient({apiKey:creds.refs.TYPESAFE_API_KEY,maxRetries:0,timeoutMs:10000,fetchImpl:(u,o)=>fetch(u,{...o,dispatcher})})
 try {const report=await run({judge});assert.ok(report.afterChars<report.beforeChars);console.log(JSON.stringify({...report,usage:judge.usage,scope:'real Jev and DSH Session/deriveMessages; isolated hooks, no live profile'},null,2))}finally{await dispatcher.close()}
}else{
 const dry=await run({dryRun:true,judge:fake()});const applied=await run({judge:fake()});assert.ok(applied.afterChars<applied.beforeChars)
 const fail=await run({judge:fake(true)});assert.equal(fail.beforeChars,fail.afterChars)
 const small=await run({judge:fake(),earlyMinChars:1000000});assert.equal(small.requests,0)
 console.log(JSON.stringify({dry,applied,failedJudgeUnchanged:true,belowBudgetNoRequest:true},null,2))
}
