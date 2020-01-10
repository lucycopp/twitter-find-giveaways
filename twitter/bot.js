const twit = require('twit')
const config = require('../config')
const utils = require('../utils/sleep')
const crypto = require('crypto')
const twitter = require('twitter')


const Twitter = new twit(config)
const signInTwitter = new twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token,
    access_token_secret: config.access_token_secret
})
let numberOfTweets = 0
const count = 1
let searchString = "retweet to win OR rt to win "
let resultType = 'latest'


const likeTweet = tweetID => {
    Twitter.post('favorites/create', {
        id: tweetID
    }, (err, response) => {
        if(err) { handleError(err) }
    })
}

const retweet = tweetID => {
    Twitter.post('statuses/retweet/:id', {
        id: tweetID
    }, (err, response) => {
        if (err) { handleError(err) }
    })
}

const handleError = err => console.error(err)

async function followUser(userID) {
    signInTwitter.post(`friendships/create.json?user_id=${userID}&follow=true`, {})
        .catch(error =>  { throw error })
}


const handleTweet = (tweet, iteration) => {
    if(typeof tweet != 'undefined') {
        const id = tweet.id_str
        likeTweet(id)
        retweet(id)
        followUser(tweet.user.id)
        console.log(`Completed ${iteration+1}/${count}`)
        utils.sleep(1000)
    }
}

const runBot = (inputSearchString = searchString, inputResultType = resultType) => {
    let params = {
        q: `${inputSearchString}-filter:retweets -filter:replies`,
        src: 'hashtag_click',
        lang: 'en',
        lf: 'on',
        result_type: inputResultType,
        count: count
    }
    Twitter.get('search/tweets', params, function(err, data) {
        if(!err) {
            const tweets = data.statuses
            numberOfTweets = data.search_metadata.count
            for(let i = 0; i < numberOfTweets; i++) {
               handleTweet(tweets[i], i)
            }
        } else {
            console.log(err)
        }
    })
}
    


module.exports.run = runBot 