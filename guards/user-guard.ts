import { InlineKeyboard, NextFunction,Context } from "grammy";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { env } from "../config/env.config";
import { pool } from "../config/db.config";

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;


// export async function userGuard(ctx:MyContext,next:NextFunction){
// const user = ctx.from?.id
// const find = await pool.query(`select * from result where userID = '${user}'`)
// const data = new Date()
// if(!find){
//     await pool.query(`insert into result (userID,create_AT) values ('${user}','${data}')`)
// }{
//     next()
// }
// }