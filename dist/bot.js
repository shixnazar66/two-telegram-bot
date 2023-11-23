"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.addQuestion = void 0;
const grammy_1 = require("grammy");
const grammy = __importStar(require("grammy"));
const conversations_1 = require("@grammyjs/conversations");
const env_config_1 = require("./config/env.config");
const db_config_1 = require("./config/db.config");
const admin_guard_1 = require("./guards/admin-guard");
const chanel_guard_1 = require("./guards/chanel-guard");
// import { userGuard } from "./guards/user-guard";
const token = env_config_1.env.BOT_TOKEN;
const bot = new grammy_1.Bot(token);
bot.use(grammy.session({ initial: () => ({}) }));
bot.use((0, conversations_1.conversations)());
bot.use((0, conversations_1.createConversation)(addQuestion, { id: 'addquestion' }));
function addQuestion(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        //theme
        ctx.reply("savol fanini yuboring");
        const theme = yield conversation.form.text();
        //question
        ctx.reply("savolni yuboring");
        const text = yield conversation.form.text();
        //question right answer
        ctx.reply("tog'ri javobni yuboring");
        const rightAnswer = yield conversation.form.text();
        //answers
        const answers = [];
        for (let i = 0; i < 3;) {
            ctx.reply(`${i + 1} inichi javobni yuboring`);
            const answer = yield conversation.form.text();
            if (answers.includes(answer) || rightAnswer == answer) {
                ctx.reply("bu javob allaqachon mavjud");
            }
            else {
                answers.push(answer);
                i++;
            }
        }
        ctx.reply('savol muffaqiyatli qoshildi');
        const db = yield db_config_1.pool.query(`INSERT INTO test (fan,savol,javob,togri_javob) VALUES('${theme}','${text}','${answers.join("\r\n")}','${rightAnswer}')`);
    });
}
exports.addQuestion = addQuestion;
bot.command("add", admin_guard_1.adminGuard, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
    const [[b]] = yield db_config_1.pool.query(`select * from result where userID = '${id}'`);
    if (!b) {
        ctx.reply('start bosib boshidan boshlang');
        return;
    }
    ctx.conversation.enter('addquestion');
}));
bot.command('start', chanel_guard_1.channelGuard, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const user = ctx.message;
    const data = new Date();
    yield db_config_1.pool.query(`insert into result (userID,create_AT,ball) values ('${user === null || user === void 0 ? void 0 : user.chat.id}','${data}','0')`);
    yield ctx.reply('tanlang', { reply_markup: question });
}));
const question = new grammy_1.Keyboard()
    .text('ona tili').text('matematika').row()
    .text('fizika').text('biologiya').row()
    .text('english')
    .resized();
bot.command('me', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const id = (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id;
    const [[b]] = yield db_config_1.pool.query(`select * from result where userID = '${id}'`);
    if (!b) {
        ctx.reply('start bosib boshidan boshlang');
        return;
    }
    const name = (_c = ctx.from) === null || _c === void 0 ? void 0 : _c.first_name;
    const [[user]] = yield db_config_1.pool.query(`select ball from result where userID = '${id}'`);
    yield ctx.reply(`${name} 
balingiz ${user.ball}`);
}));
bot.on('message', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const text = ctx.message.text;
    const [[fans]] = yield db_config_1.pool.query(`select fan from test where fan = '${text}'`);
    if (!fans) {
        ctx.reply('bunday fan yoq');
        return;
    }
    const [savol] = yield db_config_1.pool.query(`select * from test where fan = '${text}'`);
    const [javob] = yield db_config_1.pool.query(`select javob from test where fan = '${text}'`);
    const answer = new grammy_1.InlineKeyboard()
        .text('A', `a ${savol[0].ID}`).text('B', `b ${savol[0].ID}`).text('C', `c ${savol[0].ID}`).row();
    yield ctx.reply(`${savol[0].savol}? 
${javob[0].javob}`, { reply_markup: answer });
}));
bot.on("callback_query:data", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const str = ctx.callbackQuery.data;
    const userID = ctx.from.id;
    const [[b]] = yield db_config_1.pool.query(`select * from result where userID = '${userID}'`);
    if (!b) {
        ctx.reply('start bosib boshidan boshlang');
        return;
    }
    let ball = b.ball;
    const [[javob]] = yield db_config_1.pool.query(`select * from test where ID = '${str.split(" ")[1]}'`);
    const jv = javob.togri_javob;
    if (jv != str[0]) {
        ctx.reply('javobingiz notogri❌');
    }
    else {
        const data = new Date();
        yield db_config_1.pool.query(`insert into result (userID,create_AT,javob,fan) values ('${userID}','${data}','${str[0]}','${str.split(" ")[1]}')`);
        yield db_config_1.pool.query(`update result set ball = '${ball += 1}' where userID = '${userID}'`);
        ctx.reply('javobingiz togri✅');
    }
    const [find] = yield db_config_1.pool.query(`select * from test where fan = '${javob.fan}'`);
    const savol = find.filter((v) => {
        if (v.ID > javob.ID) {
            return true;
        }
        return false;
    });
    const answer = new grammy_1.InlineKeyboard()
        .text('A', `a ${savol[0].ID}`).text('B', `b ${savol[0].ID}`).text('C', `c ${savol[0].ID}`).row();
    yield ctx.reply(`${savol[0].savol}? 
${savol[0].javob}`, { reply_markup: answer });
    yield ctx.deleteMessage();
}));
bot.start();
