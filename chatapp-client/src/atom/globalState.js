import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
    key: 'recoil-persist',
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
