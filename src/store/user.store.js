import axios from "axios";
import { create } from "zustand";
import { BASE_API_URI } from "../util/common";

const userStore = create((set, get) => ({
  token: localStorage.getItem("token") || null,
  name: localStorage.getItem("name") || null,
  login: async (email, password, setWarnLabel) => {
    await axios
      .post(
        `${BASE_API_URI}/login`,
        {
          email: email,
          password: password,
        },
        {}
      )
      .then((response) => {
        set({ token: response.data.token, name: response.data.name });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.name);
      })
      .catch((error) =>
        setWarnLabel("E-mail 또는 비밀번호가 일치하지 않습니다.")
      );
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    set({ token: null });
  },
  changeName: (newName) => {
    set({ name: newName });
  },
}));

export default userStore;
