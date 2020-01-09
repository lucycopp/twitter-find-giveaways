const twit = require('twit')
const config = require('../config')

const Twitter = new twit(config)

const params = {
    q: 'giveaway -filter:retweets -filter:replies',
    result_type: 'mixed',
    lang: 'en',
    count: 100
}

const runBot = () => {
    Twitter.get('search/tweets', params, function(err, data) {
        console.log(data)
    });
  }


module.exports.run = runBot 