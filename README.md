# Twitter Profile

Gets last 5 tweets, number of tweets, following and followers given a [Twitter][1] username.

This is a coding test for a prospective employer.

## Brief

Write a program that accepts a [Twitter][1] username as input, and returns the last 5 tweets, plus
number of Tweets, Following, and Followers for that [Twitter][1] username.

## Notes

'@' character before username is optional, both with and without it works.

You'll need to modify `config.js` to set `config.consumer_key` and `config.consumer_secret` with a
valid Twitter API Consumer Key and Consumer Secret.

There are some external dependencies, so you'll need to `$ npm install` first.

This program will runs in a [Node.js][2] environment. Simply run `$ node twitter username`
(eg. `$ node twitter @bkbooth11`). Run `$ node twitter --help` to see usage instructions.

[1]: https://twitter.com "Twitter"
[2]: https://nodejs.com "Node.js"
