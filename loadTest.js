import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 500,
    duration: '300s',
};

export default function () {
    const res = http.post('https://msggo80kgk4w80w8sgosgkw4.theneocorner.com');

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}