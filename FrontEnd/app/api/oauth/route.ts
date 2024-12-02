import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies(); // Thêm 'await' để resolve Promise
    const oauth = cookieStore.get("oauth");
    const oauthRole = cookieStore.get("oauthRoles");

    if (oauth) {
      const obj = JSON.parse(oauth.value);
      obj.lstRoles = oauthRole?.value;
      return NextResponse.json(obj); // Không cần JSON.stringify vì `obj` đã là đối tượng
    } else {
      return NextResponse.json(false);
    }
  } catch (error) {
    return NextResponse.json(false);
  }
}
