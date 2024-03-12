import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { RECOIL_PERSIST } from "../util/constants";

const { persistAtom } = recoilPersist({
    key: RECOIL_PERSIST,
    storage: localStorage
});

export const loggedInUser = atom({
  key: "loggedInUser",
  default: {},
  effects_UNSTABLE: [persistAtom], 
});

export const chatActiveContact = atom({
  key: "chatActiveContact",
  default: {},
  effects_UNSTABLE: [persistAtom], 
});

export const chatMessages = atom({
  key: "chatMessages",
  default: [],
  effects_UNSTABLE: [persistAtom], 
});
