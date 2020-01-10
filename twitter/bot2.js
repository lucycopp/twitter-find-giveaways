const Twitter = require('twitter')
const config = require('../config')
const sleep = require('../utils/sleep')

const client = new Twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token,
    access_token_secret: config.access_token_secret
})

let numberOfTweets = 0
let searchObject = {
    q: "retweet rt win",
    count: 100,
    lang: "en",
    result_type: "latest",
    geocode: ""
}

const search = (query = searchObject) => {
    client.get('search/tweets.json', query)
        .then(data => handleResponse(data))
        .catch(error =>  { throw error })
  }


async function followUser(userID) {
    client.post(`friendships/create.json?user_id=${userID}&follow=true`, {})
        .then(`Followed ${userID}`)
        .catch(error =>  { throw error })
}

async function likeTweet(tweetID) {
    client.post(`favorites/create.json?id=${tweetID}`, {})
    .then(`Liked ${tweetID}`)
    .catch(error => { throw error })
}

async function retweetTweet(tweetID) {
    client.post(`statuses/retweet/${tweetID}.json`, {})
    .then(`Retweeted ${tweetID}`)
    .catch(error => { throw error })
}

const handleTweet = (tweet, iteration) => {
    followUser(tweet.user.id)
        .then(() => likeTweet(tweet.id_str))
        .then(() => retweetTweet(tweet.id_str))
        .catch(error => { throw error })

    console.log(`Completed ${iteration+1}/${numberOfTweets}`)
    sleep.sleep(1000)
}

const handleResponse = response => {
    numberOfTweets = response.search_metadata.count
    const tweets = response.statuses
    for (let i = 0; i < numberOfTweets; i++) {
        handleTweet(tweets[i], i)
    }
}

module.exports.makeRequest = search