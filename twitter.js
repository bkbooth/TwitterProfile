var Promise = require('native-promise-only'),
    fetch = require('node-fetch'),
    btoa = require('btoa'),
    config = require('./config'),
    args = process.argv.slice(2);

// Set NPO as fetch Promise library
fetch.Promise = Promise;

/**
 * Output usage help message
 */
function helpMessage() {
    console.log(
        'Usage: node twitter username \n' +
        'Username can optionally include the preceding \'@\' symbol\n' +
        'Examples: @twitter, @twitterapi'
    );
}

// Show error and/or usage help message if input invalid
if (args.length === 1 && args[0] === '-h' || args[0] === '--help' || args[0] === 'help') {
    helpMessage();
    return;
} else if (args.length !== 1) {
    console.error('ERROR: Must input a Twitter username\n');
    helpMessage();
    return;
}

var username = args[0][0] === '@' ? args[0].slice(1) : args[0],
    profile = null,
    stats = null,
    tweets = null;

// Get bearer access_token from Twitter API
fetch('https://api.twitter.com/oauth2/token', {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
        'Authorization': 'Basic ' + btoa(encodeURI(config.consumer_key) + ':' + encodeURI(config.consumer_secret)),
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
}).then(function __success(value) {
    return value.json();
}).then(function __json(value) {
    config.access_token = value.access_token;

    // Lookup Twitter username
    return fetch('https://api.twitter.com/1.1/users/lookup.json?screen_name=' + username, {
        headers: {
            'Authorization': 'Bearer ' + config.access_token
        }
    });
}).then(function __success(value) {
    return value.json();
}).then(function __json(value) {
    if (value.errors && value.errors.length) {
        throw new Error(value.errors[0].message);
    }

    // Save profile and basic stats
    profile = value[0];
    stats = {
        tweets: profile.statuses_count,
        following: profile.friends_count,
        followers: profile.followers_count
    };

    // Output name, username and stats
    console.log(profile.name + ' (@' + profile.screen_name + ')');
    console.log('Tweets: ' + stats.tweets + '');
    console.log('Following: ' + stats.following + '');
    console.log('Followers: ' + stats.followers + '');

    // Get the last 5 tweets
    return fetch(
        'https://api.twitter.com/1.1/statuses/user_timeline.json?count=5&trim_user=true' +
        '&screen_name=' + username,
        {
            headers: {
                'Authorization': 'Bearer ' + config.access_token
            }
        }
    );
}).then(function __success(value) {
    return value.json();
}).then(function __json(value) {
    if (value.errors && value.errors.length) {
        throw new Error(value.errors[0].message);
    }

    tweets = value;

    // Output the text of the last 5 tweets
    console.log('\nLast 5 Tweets:');
    tweets.forEach(function __forEach(tweet) {
        console.log('* ' + tweet.text);
    })
}).catch(function __failure(reason) {
    console.error('ERROR: Failed loading Twitter profile.', reason.message);
});
