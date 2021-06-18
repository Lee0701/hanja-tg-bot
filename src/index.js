require('dotenv').config()

const Telegraf = require('telegraf')
const commandParts = require('telegraf-command-parts')

const {convertHanjaReading} = require('./hanja-reading')
const {convertHanja} = require('./hanja-convert')

const token = process.env.BOT_TOKEN

const onText = (ctx) => {
    if(ctx.message.chat.type == 'private') {
        const reply = convertHanjaReading(ctx.message.text)
        ctx.reply(reply)
    }
}

const toHangCommand = (ctx) => {
    const args = ctx.state.command.args
    const text = (ctx.message.reply_to_message) ? ctx.message.reply_to_message.text : args
    const reply = convertHanjaReading(text)
    if(reply.length > 0) ctx.reply(reply)
}

const inlineQuery = async ({inlineQuery, answerInlineQuery}) => {
    const {id, query} = inlineQuery
}

const bot = new Telegraf(token)
bot.use(commandParts())
bot.command('tohang', toHangCommand)
bot.on('inline_query', inlineQuery)
bot.on('text', onText)
bot.launch()