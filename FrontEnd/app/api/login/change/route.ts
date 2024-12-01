import axios from "axios";
import { ApiUrl } from "../../../../public/app-setting";
import { NextResponse } from "next/server";
export async function POST(
    request: Request
) {
    const body = await request.json();
    const { grant_type, refresh_token } = body;
    
    try {
        debugger;
        // Sử dụng axios hoặc thư viện HTTP khác để gửi CLIENT_ID và CLIENT_SECRET đến API
        const response = await axios.post(ApiUrl + "", {
            grant_type,
            refresh_token,
            client_id: process.env.CLIENT_ID!,
            client_secret: process.env.CLIENT_SECRET!
        });

        // Xử lý kết quả từ API (nếu cần) và gửi phản hồi cho máy khách
        return NextResponse.json(response.data);
    } catch (error) {
        // Xử lý lỗi và gửi phản hồi lỗi cho máy khách
        return new NextResponse('Error', { status: 400 });
    }
}