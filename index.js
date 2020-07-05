require('dotenv').config()

const sf = require('sf')
const blocks = require('unicode-blocks')
const Telegraf = require('telegraf')
const commandParts = require('telegraf-command-parts')

const token = process.env.BOT_TOKEN
const escaped = '_*[]()~`>#+-=|{}.!'
const linkFormat = process.env.LINK_FORMAT || 'https://hanja.dict.naver.com/search?query={query}'
const formatLink = (c) => sf(linkFormat, {query: c})
const formatMarkup = (c) => sf('[{c}]({link})', {c, link: formatLink(c)})

const makeReply = (text) => text.split('')
        .map((c) => ({c, block: blocks.fromCodePoint(c.charCodeAt(0)).name}))
        .map(({c, block}) => block.toLowerCase().includes('ideographs') ? formatMarkup(c) : c)
        .map((c) => escaped.includes(c) ? `\\${c}` : c)
        .join('')

const hanjaCommand = (ctx) => {
    const args = ctx.state.command.args
    const text = (ctx.message.reply_to_message) ? ctx.message.reply_to_message.text : args
    const reply = makeReply(text || '')
    if(reply.length > 0) ctx.reply(reply, {parse_mode: 'MarkdownV2'})
}

const whatHanja = (ctx) => {
    const text = (ctx.message.reply_to_message) ? ctx.message.reply_to_message.text : ''
    const reply = makeReply(text || '')
    if(reply.length > 0) ctx.reply(reply, {parse_mode: 'MarkdownV2'})
}

const bot = new Telegraf(token)
bot.use(commandParts())
bot.command('hanja', hanjaCommand)
bot.on('text', (ctx) => ctx.message.text == '무슨한자' ? whatHanja(ctx) : null)
bot.launch()
