import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context, NextFunction } from "grammy";
import { env } from '../config/env.config'

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

export function adminGuard(ctx: MyContext, next: NextFunction) {
  if (env.ADMIN_ID == ctx.from?.id) {
    next();
  }else{
    ctx.reply('siz admin emassiz')
  }
}