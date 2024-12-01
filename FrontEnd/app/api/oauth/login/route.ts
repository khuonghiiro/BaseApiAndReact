import axios from "axios";
import { ApiHostUrl, ApiUrl } from "../../../../public/app-setting";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function POST(
  request: Request
) {
  const body = await request.json();
  const { grant_type, username, password } = body;
  try {

    // Sử dụng axios hoặc thư viện HTTP khác để gửi CLIENT_ID và CLIENT_SECRET đến API
    const response = await axios.post(ApiHostUrl + "/api/token/auth", {
      grant_type,
      username,
      password,
      client_id: process.env.CLIENT_ID!,
      client_secret: process.env.CLIENT_SECRET!
    });
    const oneDay = 30 * 24 * 60 * 60 * 1000;
    cookies().set('oauthRoles', JSON.stringify(response.data.lstRoles), { expires: Date.now() + oneDay });
    response.data.lstRoles = '',
      cookies().set('oauth', JSON.stringify(response.data), { expires: Date.now() + oneDay });
    // Xử lý kết quả từ API (nếu cần) và gửi phản hồi cho máy khách
    return NextResponse.json(process.env.CLIENT_ID);
  } catch (error) {
    console.log(error);
    // Xử lý lỗi và gửi phản hồi lỗi cho máy khách
    return new NextResponse(JSON.stringify(error), { status: 400 });
  }
}
