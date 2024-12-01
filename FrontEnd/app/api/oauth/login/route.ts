import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { ApiHostUrl } from "../../../../public/app-setting";

export async function POST(request: Request) {
  const body = await request.json();
  const { grant_type, username, password } = body;

  try {
    // Gửi request đến API để lấy token
    const response = await axios.post(ApiHostUrl + "api/token/auth", {
      grant_type,
      username,
      password,
      client_id: process.env.CLIENT_ID!,
      client_secret: process.env.CLIENT_SECRET!
    });

    const oneDay = 30 * 24 * 60 * 60 * 1000;

    // Sử dụng await để lấy đúng đối tượng cookies
    const cookie = await cookies();

    // Thiết lập cookie
    cookie.set('oauthRoles', JSON.stringify(response.data.lstRoles), { expires: Date.now() + oneDay });
    cookie.set('oauth', JSON.stringify(response.data), { expires: Date.now() + oneDay });

    // Trả về kết quả cho client
    return NextResponse.json(process.env.CLIENT_ID);
  } catch (error) {
    console.log(error);
    // Trả về lỗi cho client
    return new NextResponse(JSON.stringify(error), { status: 400 });
  }
}
