import { Bot,InlineKeyboard,Keyboard } from "grammy";
import * as grammy from "grammy";
import { env } from "./config/env.config";
import { pool } from "./config/db.config";
const token = env.BOT_TOKEN


const bot = new Bot(token);

bot.command('start', async (ctx) => {
    await ctx.reply('tanlang',{reply_markup:question})
 }
)
  
  const question = new Keyboard()
  .text('ona tili').text('matematika').row()
  .text('fizika').text('biologiya').row()
  .text('english')
  .resized()


 bot.on('message', async (ctx) => {
    const text = ctx.message.text
    const [[fans]]:any = await pool.query(`select fan from test where fan = '${text}'`)
    if(!fans){
      ctx.reply('bunday fan yoq')
      return
    }
    const [savol]:any = await pool.query(`select * from test where fan = '${text}'`)    
    for(let i in savol){
    const [javob]:any = await pool.query(`select javob from test where fan = '${text}'`)
    const answer = new InlineKeyboard()
    .text('A',`a ${savol[i].ID}`).text('B',`b ${savol[i].ID}`).text('C',`c ${savol[i].ID}`).row()
    await ctx.reply(`${savol[i].savol} 
${javob[i].javob}`,{reply_markup:answer})}
 })




var ball = 0

bot.on("callback_query:data",async (ctx) => {
  const str:any = ctx.callbackQuery.data
  const userID = ctx.from.id
  const data = new Date()
  await pool.query(`insert into result (userID,create_AT) values ('${userID}','${data}')`)
  const [[javob]]:any = await pool.query(`select * from test where ID = '${str[2]}'`)
  const jv = javob.togri_javob
  if(jv != str[0]){
  ctx.reply('xato')
  return
  }else{
    await pool.query (`update result set ball = '${ball+=1}' where userID = '${userID}'`)
    ctx.reply('togri')
  }
})

  

bot.start();