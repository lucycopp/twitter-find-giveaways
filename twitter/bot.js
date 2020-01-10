const twit = require('twit')
const config = require('../config')
const utils = require('../utils/sleep')
const fetch = require('node-fetch')
const crypto = require('crypto')
const OAuth = require('oauth-1.0a')


const Twitter = new twit(config)

const oauth = OAuth({
    consumer: { key: 'bMJyWnIJ2j4kRKtNAh0ZxzXRP', secret: 'ixCGfjBKUT6akCgvT9XIH2BRkaqTZ5iCspGgjhQErFrlGfhh4c' },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
    },
})

const token = {
    key: '1207423257999290369-uryMHEjc1RxtWLPq438m2ExA39XciK',
    secret: 'cRsHyMfnUEPwnpwr72xVM5A5nRAiOiFnaNfFy0vPdun5Y',
}

const count = 3
const params = {
    q: 'retweet to win OR rt to win -filter:retweets -filter:replies',
    src: 'hashtag_click',
    lang: 'en',
    lf: 'on',
    result_type: 'latest',
    count: count
}

async function postData(method, url) {
    const response = await fetch(url, {
        method: method,
        form: oauth.authorize({ status: 'hello' }, token)
    })
        return await response.json()
}


const likeTweet = tweetID => {
    Twitter.post('favorites/create', {
        id: tweetID
    }, (err, response) => {
        const output = response ? `Favourited tweet: ${response}` : `Error favouriting ${err}`
        console.log(output)
    })
}

const retweet = tweetID => {
    Twitter.post('statuses/retweet/:id', {
        id: tweetID
    }, (err, response) => {
        const output = response ? `Tweeted tweet: ${response}` : `Error favouriting ${err}`
        console.log(output)
    })
}

const followUser = userID => {
    const url = `https://api.twitter.com/1.1/friendships/create.json?user_id=${userID}&follow=true`
    postData('POST', url)
    .then((data) => console.log(data))

}

const handleTweet = (tweet, iteration) => {
    if(typeof tweet != 'undefined') {
        const id = tweet.id_str
        // retweet(id)
        // likeTweet(id)
        followUser(tweet.user.id_str)
        console.log(`Completed ${iteration+1}/${count}`)
        utils.sleep(1000)
    }
}

const runBot = () => {
    Twitter.get('search/tweets', params, function(err, data) {
        if(!err) {
            const tweets = data.statuses
            console.log(tweets)
            for(let i = 0; i < count; i++) {
               handleTweet(tweets[i], i)
            }
        } else {
            console.log("ERROR")
        }
    })
}
    


module.exports.run = runBot 