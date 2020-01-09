const twit = require('twit')
const config = require('../config')
const utils = require('../utils/sleep')
const Twitter = new twit(config)

const count = 100
const params = {
    q: 'giveaway -filter:retweets -filter:replies',
    result_type: 'latest',
    lang: 'en',
    count: count
}

const likeTweet = tweetID => {
    Twitter.post('favorites/create', {
        id: tweetID
    }, (err, response) => {
        const output = response ? `Favourited tweet: ${tweetID}` : `Error favouriting ${err}`
        console.log(output)
    })
}

const retweet = tweetID => {
    Twitter.post('statuses/retweet/:id', {
        id: tweetID
    }, (err, response) => {
        const output = response ? `Tweeted tweet: ${tweetID}` : `Error favouriting ${err}`
        console.log(output)
    })
}

const handleTweet = (tweet, iteration) => {
    if(typeof tweet != 'undefined') {
        const id = tweet.id_str
        retweet(id)
        likeTweet(id)
        console.log(`Completed ${iteration++}/${count}`)
        utils.sleep(1000)
    }
}

const runBot = () => {
    Twitter.get('search/tweets', params, function(err, data) {
        if(!err) {
            const tweets = data.statuses
            console.log(count)
            for(let i = 0; i < count; i++) {
               handleTweet(tweets[i], i)
            }
        } else {
            console.log("ERROR")
        }
    })
}
    


module.exports.run = runBot 