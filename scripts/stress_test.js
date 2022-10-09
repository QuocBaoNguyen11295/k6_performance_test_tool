import encoding from 'k6/encoding';
import http from 'k6/http';
import { check } from 'k6';

const username = 'baonguyen01121995@gmail.com';
const password = 'U5vgjiVwxWqvXJ9Pig5H8949';

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
}
export default function () {
  const credentials = `${username}:${password}`;
  const url = `https://baoapitesting.atlassian.net/rest/api/2/issue/`;
  let data ='{"fields":{"project":{"id":"10000"},"summary":"Bao Stress Test","description": "K6","issuetype":{"name":"Bug"}}}'
  const encodedCredentials = encoding.b64encode(credentials);
  let res = http.post(url,data,{headers: {Authorization: `Basic ${encodedCredentials}`,"Content-Type": `application/json;charset=UTF-8`}})
  check(res, {
    'Status is 201': (r) => r.status === 201,
    'Id is generated automatically': (r) => r.body.id !== null
  });
}
