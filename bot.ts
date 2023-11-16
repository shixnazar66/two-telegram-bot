import { Bot,InlineKeyboard,Keyboard } from "grammy";
import * as grammy from "grammy";
import { env } from "./config/env.config";
import { pool } from "./config/db.config";
import { log } from "console";
import { createContext } from "vm";
const token = env.BOT_TOKEN


const bot = new Bot(token);

bot.command('start', async (ctx) => {
    await ctx.reply('tanlang',{reply_markup:savol})
 }
)
  
  const savol = new Keyboard()
  .text('ona tili').text('matematika').row()
  .text('fizika').text('biologiya').row()
  .text('english')
  .resized()


 bot.hears('ona tili', async (ctx) => {
    const [[jv]]:any = await pool.query("select savol from test where fan = 'ona tili'")
    const [[j]]:any = await pool.query("select javob from test where fan = 'ona tili'")
    await ctx.reply(`${jv.savol} 
${j.javob}`,{reply_markup:answer})
 })

 const answer = new InlineKeyboard()
 .text('A','a').text('B','b').text('C','c').row()

bot.callbackQuery('b',async (ctx) => {
  const str:any = ctx.callbackQuery.data
  console.log(str);
  const [[jv]]:any = await pool.query("select togri_javob from test where fan = 'ona tili'")
  if(str == jv.togri_javob){
    await ctx.reply('true')
  }else{
    await ctx.reply('false')
  }
})


  // bot.on('message', async (ctx) => {
  //   const text = ctx.message.text
  //   console.log(text);
  //   await  ctx.reply(`${text}`)
  // })
  

bot.start();