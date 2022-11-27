import { createContext, useState, useCallback, Dispatch, SetStateAction, useContext } from 'react'

const CONTEXT_VALUE: {
  account: string,
  setAccount: Dispatch<SetStateAction<string>>;
  reset: () => void;
} = {
  account: "",
  setAccount: () => {},
  reset: () => {},
}

export const UserContext = createContext(CONTEXT_VALUE)

const useUserContext = () => {
  return useContext(UserContext)
}

export default useUserContext
