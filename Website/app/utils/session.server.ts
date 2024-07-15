import { createCookieSessionStorage,redirect } from "@remix-run/node";
import crypto from 'crypto';


export let sessionStorage= createCookieSessionStorage({
    cookie:{
        name:"__session",
        sameSite:"lax",
        path:"/",
        httpOnly:true,
        secure:false,
        secrets:[process.env.SESSION_SECRET as string],
    },
});

export function hashData(data:any) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function logout(request: Request) {
    const session = await getSession(request);
    return redirect("/", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
}


const USER_SESSION_KEY = "userId";

export async function createUserSession({request,userId}: {request: Request;userId: string;}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7 // 7 days,
      }),
    },
  });
}

export async function getUserId(
    request: Request
  ): Promise<string | undefined> {
    const session = await getSession(request);
    const userId = session.get(USER_SESSION_KEY);
    return userId;
}