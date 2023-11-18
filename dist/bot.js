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
    yield ctx.reply('tanlang', { reply_markup: question });
}));
const question = new grammy_1.Keyboard()
    .text('ona tili').text('matematika').row()
    .text('fizika').text('biologiya').row()
    .text('english')
    .resized();
bot.on('message', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const text = ctx.message.text;
    const [[fans]] = yield db_config_1.pool.query(`select fan from test where fan = '${text}'`);
    if (!fans) {
        ctx.reply('bunday fan yoq');
        return;
    }
    const [savol] = yield db_config_1.pool.query(`select * from test where fan = '${text}'`);
    for (let i in savol) {
        const [javob] = yield db_config_1.pool.query(`select javob from test where fan = '${text}'`);
        const answer = new grammy_1.InlineKeyboard()
            .text('A', `a ${savol[i].ID}`).text('B', `b ${savol[i].ID}`).text('C', `c ${savol[i].ID}`).row();
        yield ctx.reply(`${savol[i].savol} 
${javob[i].javob}`, { reply_markup: answer });
    }
}));
var ball = 0;
bot.on("callback_query:data", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const str = ctx.callbackQuery.data;
    const userID = ctx.from.id;
    const data = new Date();
    yield db_config_1.pool.query(`insert into result (userID,create_AT) values ('${userID}','${data}')`);
    const [[javob]] = yield db_config_1.pool.query(`select * from test where ID = '${str[2]}'`);
    const jv = javob.togri_javob;
    if (jv != str[0]) {
        ctx.reply('xato');
        return;
    }
    else {
        yield db_config_1.pool.query(`update result set ball = '${ball += 1}' where userID = '${userID}'`);
        ctx.reply('togri');
    }
}));
bot.start();
