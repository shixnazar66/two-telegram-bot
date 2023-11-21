"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGuard = void 0;
const env_config_1 = require("../config/env.config");
function adminGuard(ctx, next) {
    var _a;
    if (env_config_1.env.ADMIN_ID == ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id)) {
        next();
    }
    else {
        ctx.reply('siz admin emassiz');
    }
}
exports.adminGuard = adminGuard;
