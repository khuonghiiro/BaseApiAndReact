import { ApiUrl } from "@/public/app-setting";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();  // Chờ Promise được giải quyết

    var oauth = cookieStore.get("oauth");
    if (oauth) {
      var obj = JSON.parse(oauth.value);
      const response = await axios.post(ApiUrl + "api/token/auth", {
        grant_type: "invalidate_token",
        refresh_token: obj.refresh_token,
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.CLIENT_SECRET!,
      });
    }

    // Xóa cookies sau khi logout
    cookieStore.delete("oauth");
    cookieStore.delete("oauthRoles");

    return NextResponse.json(true);
  } catch (error) {
    console.error(error);
    return NextResponse.json(false);
  }
}
