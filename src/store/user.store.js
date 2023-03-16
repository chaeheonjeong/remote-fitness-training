import axios from "axios";
import { create } from "zustand";

const userStore = create((set, get) => ({
  token: null,
  login: async (email, password, setWarnLabel) => {
    await axios
      .post("http://localhost:8080/login", {
        email: email,
        password: password,
      })
      .then((response) => set({ token: response.token }))
      .catch((error) =>
        setWarnLabel("E-mail 또는 비밀번호가 일치하지 않습니다.")
      );
  },
  logout: () => {
    set({ token: null });
  },
}));
export default userStore;
