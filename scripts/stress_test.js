import encoding from 'k6/encoding';
import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const username = '';
const password = '';

export function handleSummary(data) {
  return {
    "result_stress_test.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
export const options = {
  stages: [
    { duration: '2m', target: 100 }, // below normal load
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 }, // normal load
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 }, // around the breaking point
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 }, // beyond the breaking point
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 }, // scale down. Recovery stage.
  ],
  thresholds: {
    'http_req_duration': ['p(99)<1500'] // 99% of requests must complete below 1.5s
  },
}
export default function () {
  const credentials = `${username}:${password}`;
  const url = ``;
  let data ='{"fields":{"project":{"id":"10000"},"summary":"Bao Stress Test","description": "K6","issuetype":{"name":"Bug"}}}'
  const encodedCredentials = encoding.b64encode(credentials);
  let res = http.post(url,data,{headers: {Authorization: `Basic ${encodedCredentials}`,"Content-Type": `application/json;charset=UTF-8`}})
  check(res, {
    'Status is 201': (r) => r.status === 201,
    'Id is generated automatically': (r) => r.body.id !== null
  });
}
