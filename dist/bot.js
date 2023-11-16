"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const env_config_1 = require("./config/env.config");
const db_config_1 = require("./config/db.config");
const token = env_config_1.env.BOT_TOKEN;
const bot = new grammy_1.Bot(token);
bot.command('start', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply('tanlang', { reply_markup: savol });
}));
const savol = new grammy_1.Keyboard()
    .text('ona tili').text('matematika').row()
    .text('fizika').text('biologiya').row()
    .text('english')
    .resized();
bot.hears('ona tili', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const [[jv]] = yield db_config_1.pool.query("select savol from test where fan = 'ona tili'");
    const [[j]] = yield db_config_1.pool.query("select javob from test where fan = 'ona tili'");
    yield ctx.reply(`${jv.savol} 
${j.javob}`, { reply_markup: answer });
}));
const answer = new grammy_1.InlineKeyboard()
    .text('A', 'a').text('B', 'b').text('C', 'c').row();
bot.callbackQuery('b', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const str = ctx.callbackQuery.data;
    console.log(str);
    const [[jv]] = yield db_config_1.pool.query("select togri_javob from test where fan = 'ona tili'");
    if (str == jv.togri_javob) {
        yield ctx.reply('true');
    }
    else {
        yield ctx.reply('false');
    }
}));
// bot.on('message', async (ctx) => {
//   const text = ctx.message.text
//   console.log(text);
//   await  ctx.reply(`${text}`)
// })
bot.start();
