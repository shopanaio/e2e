import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    ramped_rps_per_user: {
      executor: 'ramping-arrival-rate',
      startRate: 50,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 200,
      stages: [
        { target: 100, duration: '30s' },
        { target: 250, duration: '30s' },
        { target: 1000, duration: '1m' },
        { target: 0, duration: '30s' },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],

    
    http_req_duration: ['p(95)<500'],
    http_req_duration: ['avg<300'],

    
    checks: ['rate>0.99'],
  },
};

const URL = __ENV.K6_GRAPHQL_URL;
const CATEGORY_ID = __ENV.K6_CATEGORY_ID;

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${__ENV.K6_JWT}`,
  'X-PJ-Key': __ENV.K6_PROJECT_SLUG,
};

const query = open('../queries/CategoryFindOne.gql');

export default function () {
  const payload = JSON.stringify({
    query,
    variables: {
      id: CATEGORY_ID,
    },
  });

  const res = http.post(URL, payload, { headers });
  check(res, {
    // returns uuid
    200: (r) => r.json().data?.categoryQuery?.findOne?.id?.length > 0,
  });
}
