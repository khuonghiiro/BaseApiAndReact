import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const cookieStore = cookies();
    const oauth = cookieStore.get("oauth");
    const oauthRole = cookieStore.get("oauthRoles");
    if (oauth) {
      const obj = JSON.parse(oauth.value);
      obj.lstRoles = oauthRole?.value;
      return NextResponse.json(JSON.stringify(obj));
    } else return NextResponse.json(false);
  } catch (error) {
    return NextResponse.json(false);
  }
}
