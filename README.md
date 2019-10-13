# The Equalizer

### [Official Bot Invite Link](https://discordapp.com/oauth2/authorize?=&client_id=276532396998787072&scope=bot&permissions=8)

### Description
When you own a Discord server things can get hectic really fast.

It usually comes down to who you want to be an admin and who you don't. This can be a difficult decision to make, as if you mod only a few people, others might complain that they should be admin. If you mod too many people than it becomes chaos, people moving others in and out of channels when being a sore loser, ect.

The aim for this bot is to be able replace all admins on a discord server. It may also be used alongside admin users, but they would be able to overrule anything the bot decides, so it sort of defeats the purpose.

As of now, the bot is nowhere near where I envision it in the future, but I suppose you have to start somewhere.

### Technical Info

This project is written in TypeScript and makes use of the [discord.js](https://discord.js.org) API.

This bot runs on [node.js](https://nodejs.org), specifically the v10 "Dubnium" LTS release. As of 10/13/2019, dependencies will not compile on the latest v12 release of node.

`npm` is not supported for this bot. Please use `yarn` instead. After downloading the repository, simply run `yarn install`. This will install all dependencies (only into the repository directory) and compile to JavaScript. You may run this any time you wish to rebuild the bot for any reason.

Before starting the bot, you must create a new bot and define your auth code as `auth` in `options.json`. Once you have done so, you may run `yarn start` to start the bot.

### Options

All options passed to the bot should be put in `options.json`. This file uses standard json syntax. You must create this file yourself. Here is a list of all supported options (as of now):

Name | Type | Optional | Default | Description
---- | ---- | -------- | ------- | -----------
`auth` | `string` | No | None | The auth code for the bot.
`motd` | `string` | Yes | None | The string that is displayed where Discord would normally put the game a user is playing.
`biasAdmin` | `boolean` | Yes | `false` | If true, votes targeting users with the `Administrator` Discord permission will be invalidated.
`ownerID` | `string` | Yes | None | The user ID of the bot owner. If not defined, you will not be able to use `eval`.
`discordPwAuth` | `string` | Yes | None | The auth code for [bots.discord.pw](https://bots.discord.pw). (Only used by official instance of bot to post stats; you shouldn't be using this.)

Your file should look like this:
```
{
	"auth": "XXXXXXXXXXXXX",
	"anotherOption": "value" // Example
}
```
