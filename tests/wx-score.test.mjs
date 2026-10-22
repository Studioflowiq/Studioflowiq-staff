import assert from 'node:assert/strict';
import {weatherScore} from '../lib/assessment.mjs';
const minimums={name:'AC',aircraft:'Cherokee',minCeilingFt:2000,minVisibilitySm:5,maxCrosswindKt:12,maxWindKt:20,maxGustKt:25};
const checks=[['Ceiling',4000],['Visibility',10],['Runway crosswind',6],['Surface wind',10],['Gust',12]].map(([rule,value])=>({rule,value,status:'pass',reason:'Valid value'}));
const points=[{label:'K54J',checks}];
const high=weatherScore(points,minimums);assert.equal(high.score,100);assert.equal(high.coverage,65);assert.equal(high.incomplete,true);assert.equal(high.factors.find(f=>f.id==='icing').score,null);
const atLimit=weatherScore([{checks:checks.map(c=>({...c,value:({Ceiling:2000,Visibility:5,'Runway crosswind':12,'Surface wind':20,Gust:25})[c.rule]}))}],minimums);assert.equal(atLimit.score,60);
assert.equal(weatherScore([],minimums).score,null);
const failed=weatherScore([{checks:[...checks,{rule:'Ceiling',value:1000,status:'fail',reason:'Below limit'}]}],minimums);assert.equal(failed.status,'no-go');
const missing=weatherScore([{checks:checks.map(c=>c.rule==='Visibility'?{...c,status:'review',value:null}:c)}],minimums);assert.equal(missing.factors.find(f=>f.id==='visibility').score,null);
const alternate=weatherScore(points,{...minimums,minCeilingFt:4000});assert(alternate.score<high.score);
const clear=weatherScore([{checks:[{rule:'Ceiling',status:'pass',value:null,reason:'No ceiling forecast (clear)'}]}],minimums);assert.equal(clear.factors[0].score,100);
console.log('WX score: personal limits, aircraft changes, boundaries, missing data, no-ceiling and hard breaches passed');

const full=weatherScore([...points,{hazardScreen:true,checks:['Turbulence','Icing','Convective advisories'].map(rule=>({rule,status:'pass',score:100,value:0,reason:'No matching advisory'}))}],minimums);assert.equal(full.coverage,100);assert.equal(full.score,100);assert.equal(full.incomplete,false);
