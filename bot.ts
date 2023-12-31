import { Bot,InlineKeyboard,Keyboard,Context } from "grammy";
import * as grammy from "grammy";
import {
  createConversation,
  type Conversation,
  type ConversationFlavor,
  conversations,
} from "@grammyjs/conversations";
import { env } from "./config/env.config";
import { pool } from "./config/db.config";
import { adminGuard } from "./guards/admin-guard";
import { channelGuard } from "./guards/chanel-guard";
// import { userGuard } from "./guards/user-guard";

const token = env.BOT_TOKEN

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;


const bot = new Bot<MyContext>(token);


bot.use(grammy.session({ initial: () => ({}) }));
bot.use(conversations());


bot.use(createConversation(addQuestion,{id:'addquestion'}))
export async function addQuestion(
  conversation: MyConversation,
  ctx: MyContext
) {
  //theme
  ctx.reply("savol fanini yuboring");
  const theme = await conversation.form.text();

  //question
  ctx.reply("savolni yuboring");
  const text = await conversation.form.text();

  //question right answer
  ctx.reply("tog'ri javobni yuboring");
  const rightAnswer = await conversation.form.text();

  //answers
  const answers: string[] = [];
  for (let i = 0; i < 3; ) {
    ctx.reply(`${i + 1} inichi javobni yuboring`);

    const answer = await conversation.form.text();

    if (answers.includes(answer) || rightAnswer == answer) {
      ctx.reply("bu javob allaqachon mavjud");
    } else {
      answers.push(answer);
      i++;
    }
  }
  ctx.reply('savol muffaqiyatli qoshildi')
  const db = await pool.query(
    `INSERT INTO test (fan,savol,javob,togri_javob) VALUES('${theme}','${text}','${answers.join(
      "\r\n"
    )}','${rightAnswer}')`
  );
}




bot.command("add", adminGuard, async (ctx) => {
  const id =  ctx.from?.id
  const [[b]]:any = await pool.query(`select * from result where userID = '${id}'`)
  if(!b){
    ctx.reply('start bosib boshidan boshlang')
    return
  }
  ctx.conversation.enter('addquestion')
})




bot.command('start',channelGuard, async (ctx) => {
    const user = ctx.message
    const data = new Date()
    await pool.query(`insert into result (userID,create_AT,ball) values ('${user?.chat.id}','${data}','0')`)
    await ctx.reply('fanni tanlang',{reply_markup:question})
 }
)


  
  const question = new Keyboard()
  .text('onatili').text('matematika').row()
  .text('fizika').text('biologiya').row()
  .text('english')
  .resized()




  bot.command('me', async (ctx) => {
    const id =  ctx.from?.id
    const name = ctx.from?.first_name
    const [[b]]:any = await pool.query(`select * from result where userID = '${id}'`)
    const thems =await getAllThemes()
    for(let i in thems){
      let right = 0 
      const [userr]:any = await pool.query(`SELECT * FROM result WHERE userID = ${id} AND fan ='${thems[i]}'` )
      for (let i in userr) {
        if (userr[i].javob == 'true') {
          right++;
        }
      }
      await ctx.reply(`${thems[i]} fanidan toplagan\nbalingiz ${right} ✅`);
    }
    if(!b){
      ctx.reply('start bosib boshidan boshlang')
      return
    }
    const [[user]]:any = await pool.query(`select ball from result where userID = '${id}'`)
    await ctx.reply(`${name} 
barcha fandan balingiz ${user.ball}`)
})




 bot.on('message', async (ctx) => {
    const text = ctx.message.text
    const [[fans]]:any = await pool.query(`select fan from test where fan = '${text}'`)
    if(!fans){
      ctx.reply('bunday fan yoq')
      return
    }
    const [savol]:any = await pool.query(`select * from test where fan = '${text}'`) 
    const [javob]:any = await pool.query(`select javob from test where fan = '${text}'`)
    const answer = new InlineKeyboard()
    .text('A',`a ${savol[0].ID} ${savol[0].fan}`).text('B',`b ${savol[0].ID} ${savol[0].fan}`).text('C',`c ${savol[0].ID} ${savol[0].fan}`).row()
    await ctx.reply(`${savol[0].savol}? 

${javob[0].javob}`,{reply_markup:answer})
})




bot.on("callback_query:data",async (ctx) => {
  const str:any = ctx.callbackQuery.data 
  const userID = ctx.from.id
  const [[b]]:any = await pool.query(`select * from result where userID = '${userID}'`)
  if(!b){
    ctx.reply('start bosib boshidan boshlang')
    return
  }
  let  ball = b.ball
  const [[javob]]:any = await pool.query(`select * from test where ID = '${str.split(" ")[1]}'`)  
  const jv = javob.togri_javob
  if(jv != str[0]){
  await ctx.reply('javobingiz notogri❌')
  const data = new Date()
  await pool.query(`insert into result (userID,create_AT,javob,fan) values ('${userID}','${data}','${false}','${str.split(" ")[2]}')`)
  await pool.query (`update result set ball = '${ball}' where userID = '${userID}'`)  
  }else{
    const data = new Date()
    await pool.query(`insert into result (userID,create_AT,javob,fan) values ('${userID}','${data}','${true}','${str.split(" ")[2]}')`)
    await pool.query (`update result set ball = '${ball+=1}' where userID = '${userID}'`)
    ctx.reply('javobingiz togri✅')
  }
  const [find]:any[] = await pool.query(`select * from test where fan = '${javob.fan}'`)
  const savol:any = find.filter((v:any)=>{
    if(v.ID>javob.ID){
      return true
    }
    return false
  })
  const answer = new InlineKeyboard()
  .text('A',`a ${savol[0].ID} ${savol[0].fan}`).text('B',`b ${savol[0].ID} ${savol[0].fan}`).text('C',`c ${savol[0].ID} ${savol[0].fan}`).row()
  await ctx.reply(`${savol[0].savol}? 
${savol[0].javob}`,{reply_markup:answer})
await ctx.deleteMessage()
})
  




bot.start();




export async function getAllThemes() {
  const [questions]:any = await pool.query(`SELECT fan FROM test`)
  const themes: string[] = [];
  for (let i of questions) {
    if (!themes.includes(i.fan)) {
      themes.push(i.fan);
    }
  }

  return themes;
}