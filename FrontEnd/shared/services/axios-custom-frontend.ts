import axios from "axios";
import { ApiUrl } from "../../public/app-setting";
import { AuthService } from "./auth-service";
import { useAuth } from "../Context/appAdminContext";
const apiFrontend = axios.create({
    baseURL: ApiUrl,
});

apiFrontend.interceptors.request.use(
    async (config) => {                
        const { getAuthPublic } = AuthService();
        const oauth = getAuthPublic() || {};
        
        if (oauth.access_token) {
            config.headers["Authorization"] = "Bearer " + oauth.access_token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const refresh = async () => {
    const { getAuthPublic } = AuthService();
    const oauth = getAuthPublic();
    const rs = await axios.post("/api/login/refresh", {
        grant_type: "refresh_token",
        refresh_token: oauth.refresh_token,
    });

    return rs;
};

let refreshToken: any = null;

apiFrontend.interceptors.response.use(
    (res) => {
        return res.data;
    },
    async (err) => {
        const { setLogoutPublic } = AuthService();

        const originalConfig = err?.config;
        if (
            originalConfig?.url !== "api/login" &&
            err?.response?.status === 401 &&
            !originalConfig?._retry
        ) {
            originalConfig._retry = true;
            try {
                refreshToken = refreshToken ? refreshToken : refresh();
                const rs = await refreshToken;
                refreshToken = null;
                return await apiFrontend(originalConfig);
            } catch (_error) {
                setLogoutPublic();
                window.location.href = "/dang-nhap";
                return Promise.reject(_error);
            }
        }

        return Promise.reject(err);
    }
);

export default apiFrontend;
