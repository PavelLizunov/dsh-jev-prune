import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { JevClient } from './jev.js';
import { planTrims, sliceWithBudget, countChars } from './prune.js';
const require = createRequire(import.meta.url);
const { ProxyAgent, fetch } = require('undici');
const yaml = require('js-yaml');
const credentials = yaml.load(await fs.readFile(process.env.JEV_CREDENTIALS_FILE, 'utf8'));
const apiKey = process.env.TYPESAFE_API_KEY || credentials.refs?.TYPESAFE_API_KEY;
if (typeof apiKey !== 'string' || !apiKey) throw Error('Existing TypeSafe key unavailable');
const dispatcher = new ProxyAgent(process.env.JEV_PROXY_URL);
const client = new JevClient({ apiKey, maxRetries: 0, timeoutMs: 20000, fetchImpl: (url, options) => fetch(url, { ...options, dispatcher }) });
const examples = [
 { id: 'obsolete', text: 'Old package installation completed successfully. Dependency already installed.\n'.repeat(150) },
 { id: 'needed', text: 'Current task: report the exact deployment port. Authoritative configuration: SERVICE_PORT=43127. This value is not present anywhere else.\n'.repeat(20) },
];
try {
 const start = performance.now();
 const state = 'Current goal: report the exact deployment port from the authoritative configuration. The earlier successful dependency-install output is no longer needed.\n' + examples.map(e => `${e.id}: ${e.text.slice(0,240)} (${e.text.length} characters)`).join('\n');
 const questions = Object.fromEntries(examples.map(e => [e.id, `Must the content of tool result ${e.id} be kept to complete the current goal accurately?`]));
 const probabilities = await client.ask(state, questions);
 if (examples.some(e => typeof probabilities[e.id] !== 'number')) throw Error('Missing live judgment');
 const nodes = examples.map((e, i) => ({seq:i,index:i,tool:'read',chars:e.text.length,gain:e.text.length-850,prob:probabilities[e.id],effectProb:0,verdict:{keep:probabilities[e.id]>=0.5},inTail:false,blacklisted:false}));
 const plan = planTrims(nodes, {keepMode:'budget',pressureRatio:0.5,keepThreshold:0.5,keepFloorThreshold:0.2,minCandidatesForBudget:4,minCharsToPrune:400});
 const results = examples.map((e,i) => {const blocks=[{type:'text',text:e.text}];const out=plan.selected.includes(i)?sliceWithBudget(blocks,600,200,'\n[pruned]\n'):null;return {id:e.id,probability:probabilities[e.id],selected:plan.selected.includes(i),before:e.text.length,after:out?countChars(out):e.text.length}});
 const report={kind:'synthetic live Jev + plugin planner/slicer; not live DSH activation or quality benchmark',requests:client.requests,elapsedMs:Math.round(performance.now()-start),usage:client.usage,mode:plan.mode,results};
 await fs.writeFile('/tmp/jev-prune-live-result.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
} finally {await dispatcher.close();}
