import {
  ReactNode,
  createContext,
  useContext,
} from "react";
import { AuthService } from "../services";
import { useRouter } from "next/navigation";
import { Login } from "../model";
import axios from "axios";

type authContextType = {
  user: any;
  logout: () => Promise<void>;
};
const authContextDefaultValues: authContextType = {
  user: null,
  logout: async () => {},
};
const AuthContext = createContext<authContextType>(authContextDefaultValues);

type Props = {
  children: ReactNode;
};
export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }: Props) {
  const router = useRouter();
  const { getOauth } = AuthService();
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

  const logout = async () => {
    try {
      const res: any = await axios.post("/api/oauth/logout");
      router.push("/login");
    } catch (err) {
    }
  };

  const value = {
    user: getOauth(),
    logout,
  };
  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}
