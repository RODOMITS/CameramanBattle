import test from 'node:test';
import assert from 'node:assert/strict';
import {networkError} from '../server/network.js';
test('network diagnostics include nested connection codes and redact bot credentials',()=>{
 const token='123456789:synthetic_test_secret';
 const failure=new TypeError('fetch failed',{cause:new AggregateError([
  Object.assign(new Error('connect ETIMEDOUT'),{code:'ETIMEDOUT'}),
  Object.assign(new Error('connect ENETUNREACH'),{code:'ENETUNREACH'})
 ],'Request https://api.telegram.org/bot'+token+'/getUpdates')});
 const text=networkError(failure,token);
 assert.ok(text.includes('ETIMEDOUT'));
 assert.ok(text.includes('ENETUNREACH'));
 assert.ok(!text.includes(token));
 assert.ok(text.includes('[TOKEN]'));
});
