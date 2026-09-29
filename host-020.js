import z from '@deepseek-ai/schemastery'
import { apply as applyEngine } from './index.js'
export const name = 'jev-prune'
export const inject = ['tools', 'toolResultPruner', 'webServer', 'connection', 'credentials', 'settings']
const fields = {
  enabled: z.boolean().default(true).volatile(),
  dryRun: z.boolean().default(true).volatile(),
  earlyPrune: z.boolean().default(true).volatile(),
  earlyMinChars: z.natural().min(1000).default(16000).volatile(),
  earlyMinSteps: z.natural().min(1).max(100).default(4).volatile(),
  maxJudgeBatches: z.natural().min(1).max(1).default(1).volatile(),
  judgeMaxRetries: z.natural().max(0).default(0).volatile(),
  preserveRecent: z.natural().min(2).max(100).default(4).volatile(),
  alwaysTrimRatio: z.number().min(0).max(1).default(0.5).volatile(),
  judgeTimeoutMs: z.natural().min(1000).max(30000).default(5000).volatile(),
  judgeMaxStateTokens: z.natural().min(1000).max(25000).default(6000).volatile(),
  proxyUrl: z.string().default('').volatile(),
  model: z.string().default('jev-latest').volatile(),
}
export const Config = z.object(fields)
const keys = Object.keys(fields)
export async function apply(ctx, config) {
  const current = () => Object.fromEntries(keys.map(k => [k, config[k].get()]))
  let control
  applyEngine(ctx, { ...current(), judgeOn:'always', compactReceipts:false, credentialRef:'DSH_JEV_PRUNE_API_KEY' }, { onControl:c => { control=c } })
  const ref = 'DSH_JEV_PRUNE_API_KEY'
  const namespace = ctx.fiber?.entry?.options.id ?? ctx.get('entry')?.options.id ?? 'jev-prune'
  const credential = async () => (await ctx.credentials.resolve(ref)) ?? (await ctx.credentials.resolve('TYPESAFE_API_KEY'))
  // Resolve per operation; the fallback reference remains owned by the operator.
  const sync = async () => { const values=current();control.update({ ...values, maxStateTokens:values.judgeMaxStateTokens, apiKey:(await credential())?.value ?? '' }) }
  ctx.on('agent/pre-step', async (_payload,next) => { try { await sync() } catch { control.update({enabled:false,apiKey:''}) } return next() }, {prepend:true,global:true})
  const json = (res,status,value) => { const body=JSON.stringify(value);res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(body) }
  ctx.effect(() => ctx.webServer.register({kind:'exact',path:'/jev-prune/settings',handler:async(req,res)=>{
    const rejection=ctx.connection.requestRejection(req);if(rejection!==undefined){json(res,rejection,{error:'unauthorized'});return}
    try {
      if(req.method==='GET'){
        const key=await credential()
        json(res,200,{config:current(),credential:{configured:!!key,source:key?.source??null},status:control.status()});return
      }
      if(req.method!=='PUT'){json(res,405,{error:'method not allowed'});return}
      let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>8192){json(res,413,{error:'request too large'});return}}
      const input=JSON.parse(body)
      if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['config','apiKey','clearKey'].includes(k))) {json(res,400,{error:'invalid fields'});return}
      if(input.apiKey!==undefined&&(typeof input.apiKey!=='string'||!input.apiKey.trim()||input.apiKey.length>4096)){json(res,400,{error:'invalid key'});return}
      if(input.clearKey!==undefined&&typeof input.clearKey!=='boolean'){json(res,400,{error:'invalid clearKey'});return}
      if(input.apiKey!==undefined&&input.clearKey){json(res,400,{error:'choose key replacement or removal'});return}
      if(input.config!==undefined){
        if(!input.config||typeof input.config!=='object'||Array.isArray(input.config)||Object.keys(input.config).some(k=>!keys.includes(k))) {json(res,400,{error:'invalid config'});return}
        if(input.config.proxyUrl){const url=new URL(input.config.proxyUrl);if(!['http:','https:'].includes(url.protocol)||url.username||url.password){json(res,400,{error:'proxy must be HTTP(S) without credentials'});return}}
        await ctx.settings.update(namespace,input.config)
      }
      if(input.apiKey!==undefined)await ctx.credentials.set(ref,input.apiKey.trim())
      if(input.clearKey)await ctx.credentials.unset(ref)
      await sync();json(res,200,{ok:true})
    }catch{json(res,400,{error:'Could not save settings. Check field values and credential storage permissions.'})}
  }}))
  try { await sync() } catch { control.update({enabled:false,apiKey:''}) }
}
