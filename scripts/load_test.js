import http from 'k6/http';
import { check } from 'k6';
import encoding from 'k6/encoding';

const username = 'baonguyen01121995@gmail.com';
const password = 'U5vgjiVwxWqvXJ9Pig5H8949';

export const options = {
    stages: [
        { duration: '2m', target: 40 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
        { duration: '4m', target: 40 }, // stay at 100 users for 10 minutes
        { duration: '2m', target: 0 }, // ramp-down to 0 users
      ],
      thresholds: {
        'http_req_duration': ['p(99)<1500'] // 99% of requests must complete below 1.5s
      },
}
export default function () {
  const credentials = `${username}:${password}`;
  const url = `https://baoapitesting.atlassian.net/rest/api/2/issue/`;
  let data ='{"fields":{"project":{"id":"10000"},"summary":"Bao Load Test","description": "K6","issuetype":{"name":"Task"}}}'
  const encodedCredentials = encoding.b64encode(credentials);
  let res = http.post(url,data,{headers: {Authorization: `Basic ${encodedCredentials}`,"Content-Type": `application/json;charset=UTF-8`}})
  check(res, {
    'Status is 201': (r) => r.status === 201,
    'Id is generated automatically': (r) => r.body.id !== null
  });
}
