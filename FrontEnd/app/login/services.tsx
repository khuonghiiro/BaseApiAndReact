import useSWR from 'swr';
import { BaseService } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {

    SendEmailForgotPasswordAsync = async (email: string) => {
        const url = `${this.url}/forgot-pass?email=${email}`;
        const res: any = await api.post(url);
        return res;
    };

    SendVerifyCodeAsync = async (email: string, code: string) => {
        const url = `${this.url}/verify-code?email=${email}&code=${code}`;
        const res: any = await api.post(url);
        return res;
    };

    SendVerifyCaptchaAsync = async (token: any) => {
        const url = `${this.url}/verify-recaptcha`;
        const res: any = await api.post(url, token);
        return res;
    };
}

const loginServices = new services("identity/api/token");
export { loginServices };
