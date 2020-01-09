const twit = require('twit')
const config = require('../config')
const utils = require('../utils/sleep')
const Twitter = new twit(config)

const count = 100
const params = {
    q: 'retweet to win OR rt to win -filter:retweets -filter:replies',
    src: 'hashtag_click',
    lang: 'en',
    lf: 'on',
    result_type: 'latest',
    count: count
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
    Twitter.post(`friendships/create.json?user_id=${userID}&follow=true`, {
        id: userID
    }, (err, response) => {
        const output = response ? `Followed: ${userID}` : `Error following ${err}`
        console.log(response)
    })
}

const handleTweet = (tweet, iteration) => {
    if(typeof tweet != 'undefined') {
        const id = tweet.id_str
        retweet(id)
        likeTweet(id)
        //followUser(tweet.user.id_str)
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