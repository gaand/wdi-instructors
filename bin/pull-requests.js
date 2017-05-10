/* jshint
  esnext: true,
  node: true,
  sub: true
*/

'use strict';

const missingFromOtherList = require('../lib/missing-from-other-list');

require('dotenv').load();

const compare = (a, b) => a.github > b.github ? 1 : a.github < b.github ? -1 : 0;

const pullsPromise = new Promise((resolve, reject) => {

  let https = require('https');

  let user = process.env.GHUSER;
  let token = process.env.GHTOKEN;
  let repo = process.argv[2];

  let options = {
    hostname: 'api.github.com',
    port: 443,
    path: `/repos/ga-wdi-boston/${repo}/pulls?state=all&per_page=100&sort=updated&direction=desc`,
    method: 'GET',
    auth: `${user}:${token}`,
    headers: {
      'User-Agent': 'curl/7.38.0',
    },
  };

  https.get(options, (res) => {
    let result = '';

    res.on('data', d => result += d);

    if (res.statusCode !== 200) {
      //console.log('headers: ', res.headers);
      res.on('end', () => reject(result));
    } else {
      res.on('end', () => {
        let pulls = JSON.parse(result).map(p => ({
          state: p.state,
          github: p.user.login.toLowerCase(),
        })).sort(compare);
        let uniquePulls = [];
        for (let i = 1; i < pulls.length; i++) {
          if (compare(pulls[i - 1], pulls[i])) {
            uniquePulls.push(pulls[i - 1]);
          }
        }

        if (pulls.length > 1 &&
            compare(pulls[pulls.length - 1], pulls[pulls.length - 2]) ||
            pulls.length) {
          uniquePulls.push(pulls[pulls.length - 1]);
        }

        resolve(uniquePulls);
      });
    }

  }).on('error', e => reject(e));

});

let developersPromise = new Promise((resolve, reject) => {
  let developers = [];
  let fs = require('fs');
  let parse = require('csv').parse;
  let parser = parse({
    columns: h => h.map(c => c.toLowerCase()),
  });

  let input = fs.createReadStream(process.env.DEVELOPERS);
  input.on('error', e => reject(e));

  parser.on('readable', () => {
    let record;
    while ((record = parser.read())) {
      record.github = record.github.toLowerCase();
      developers.push(record);
    }
  });

  parser.on('error', e => reject(e));
  parser.on('finish', () => resolve(developers));
  input.pipe(parser);
});

Promise.all([pullsPromise, developersPromise]).then((results) => {
  let missing = missingFromOtherList(results[0], results[1], compare);

  console.log('closed pulls: ',
    results[0].filter(p => p.state === 'closed').length);
  console.log('pulls missing developers: ', missing[0].filter(p => p.state !== 'closed'));
  console.log(`developers missing pulls (${missing[1].length}): `);
  missing[1].forEach(d => console.log(d.given, d.family, `(${d.github})`));

}).catch(e => {
  console.error('Something went wrong!');
  console.error(e);
  if (e.stack) console.error(e.stack);
});
