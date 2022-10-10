import encoding from 'k6/encoding';
import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const username = '';
const password = '';

export function handleSummary(data) {
  return {
    "result_spike_test.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

export const options = {
  stages: [
    { duration: '10s', target: 100 }, // below normal load
    { duration: '1m', target: 100 },
    { duration: '10s', target: 400 }, // spike to 400 users
    { duration: '3m', target: 400 }, // stay at 400 for 3 minutes
    { duration: '10s', target: 100 }, // scale down. Recovery stage.
    { duration: '3m', target: 100 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    'http_req_duration': ['p(99)<1500'] // 99% of requests must complete below 1.5s
  },
}

export default function () {
  const credentials = `${username}:${password}`;
  const url = ``;
  let data ='{"fields":{"project":{"id":"10000"},"summary":"Bao Spike Test","description": "K6 Spike Test","issuetype":{"name":"Bug"}}}'
  const encodedCredentials = encoding.b64encode(credentials);
  let res = http.put(url,data,{headers: {Authorization: `Basic ${encodedCredentials}`,"Content-Type": `application/json;charset=UTF-8`}})

  check(res, {
    'Status is 204': (r) => r.status === 204,
  });
}
