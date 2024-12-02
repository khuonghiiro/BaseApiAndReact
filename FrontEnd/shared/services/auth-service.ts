import axios from "axios";
import { Login } from "../model";
import Cookies from "js-cookie";
export const AuthService = () => {
  const login = async (data: { username: string; password: string }) => {
    const body: Login = {
      grant_type: "password",
      username: data.username,
      password: data.password,
    };
    try {
      const res: any = await axios.post("/api/oauth/login", body);
      return true;
    } catch (err) {
      return false;
    }
  };
  const loginFrontend = async (data: {
    username: string;
    password: string;
  }) => {
    const body: Login = {
      grant_type: "password",
      username: data.username,
      password: data.password,
    };
    try {
      const res: any = await axios.post("../api/login", body);
      setAuthPublic(res.data);
      return true;
    } catch (err) {
      return false;
    }
  };

  const setOauth = (data: any) => {
    try {
      // Lưu thông tin OAuth vào Cookies
      Cookies.set("oauth", JSON.stringify(data.oauth), { expires: 7 }); // Lưu OAuth token
      Cookies.set("oauthRoles", JSON.stringify(data.roles), { expires: 7 }); // Lưu roles nếu có

      // Nếu muốn lưu thêm vào localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("oauth", JSON.stringify(data.oauth));
        localStorage.setItem("oauthRoles", JSON.stringify(data.roles));
      }
    } catch (err) {
      console.error("Error setting OAuth data:", err);
    }
  };

  const getOauth = () => {
    try {
      const oauth = Cookies.get("oauth");
      const oauthRole = Cookies.get("oauthRoles");
      if (oauth) {
        var obj = JSON.parse(oauth);
        if (oauthRole) obj.lstRoles = JSON.parse(oauthRole);
        return obj;
      }
      return null;
    } catch (err) {
      return false;
    }
  };
  const logout = async () => {
    try {
      const res: any = await axios.get("/api/oauth/logout");
      return true;
    } catch (err) {
      return false;
    }
  };

  const setAuthPublic = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("authPublic", JSON.stringify(token));
    }
  };
  const getAuthPublic = () => {
    if (typeof window === "undefined") {
      return null;
    }
    const oauth = localStorage.getItem("authPublic");
    return oauth ? JSON.parse(oauth) : null;
  };
  const setLogoutPublic = () => {
    localStorage.removeItem("authPublic");
  };
  return {
    login,
    setOauth,
    getOauth,
    logout,
    loginFrontend,
    getAuthPublic,
    setLogoutPublic,
  };
};
