import assert from 'node:assert/strict'
import {apply,Config} from './host-020.js'
import {Context} from '@deepseek-ai/cordis'
let liveConfig
const c=new Context();const fiber=c.plugin({Config,apply(_ctx,config){liveConfig=config}},{});await fiber.await()
const stored=new Map([['TYPESAFE_API_KEY','original-test-secret']]);const routes=new Map();const hooks=[]
const ctx={fiber:{entry:{options:{id:'plugin-entry-7'}}},get:()=>undefined,tools:{register(){return ()=>{}}},logger:{info(){},warn(){}},effect:f=>f(),on:(n,h)=>hooks.push(h),connection:{requestRejection:r=>r.allowed?undefined:401},credentials:{resolve:async r=>stored.has(r)?{value:stored.get(r),source:'file'}:undefined,set:async(r,v)=>stored.set(r,v),unset:async r=>stored.delete(r)},settings:{update:async ns=>{assert.equal(ns,'plugin-entry-7')}},webServer:{register:r=>{routes.set(r.path,r.handler);return ()=>{}}},toolResultPruner:{pruneSession(){},pruneContent(){}}}
await apply(ctx,liveConfig)
async function request(method,body,allowed=true){let code,result;const req={method,allowed,async *[Symbol.asyncIterator](){if(body!==undefined)yield JSON.stringify(body)}};await routes.get('/jev-prune/settings')(req,{writeHead:c=>code=c,end:b=>result=JSON.parse(b)});return {code,result}}
assert.equal((await request('GET',undefined,false)).code,401)
assert.equal((await request('PUT',{apiKey:'new-test-secret'},false)).code,401)
assert.equal(stored.has('DSH_JEV_PRUNE_API_KEY'),false)
assert.equal((await request('PUT',{apiKey:'new-test-secret'})).code,200)
assert.equal(stored.get('DSH_JEV_PRUNE_API_KEY'),'new-test-secret')
const get=await request('GET');assert.equal(get.result.credential.configured,true);assert.ok(!JSON.stringify(get).includes('test-secret'))
assert.equal((await request('PUT',{clearKey:true})).code,200);assert.equal(stored.get('TYPESAFE_API_KEY'),'original-test-secret')
assert.equal((await request('PUT',{config:{proxyUrl:'file:///tmp/x'}})).code,400)
assert.equal((await request('PUT',{apiKey:'x'.repeat(9000)})).code,413)
await fiber.dispose();console.log('Settings: auth gate, write-only key replacement/removal, fallback preservation, URL and size bounds PASS')
