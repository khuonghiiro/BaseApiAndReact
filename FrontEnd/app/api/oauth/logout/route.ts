import { ApiUrl } from "@/public/app-setting";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function POST() {
  try {
    var oauth = cookies().get("oauth");
    if (oauth) {
      var obj = JSON.parse(oauth.value);
      const response = await axios.post(ApiUrl + "identity/api/token/auth", {
        grant_type: "invalidate_token",
        refresh_token: obj.refresh_token,
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.CLIENT_SECRET!,
      });
    }
    // Sử dụng axios hoặc thư viện HTTP khác để gửi CLIENT_ID và CLIENT_SECRET đến API
    cookies().delete("oauth");
    cookies().delete("oauthRoles");
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json(false);
  }
}
