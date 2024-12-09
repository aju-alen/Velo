import { create } from "zustand";


interface AccountLoginData {
    createdAt: string;
    email: string;
    firstTimeLogin: boolean;
    id: string;
    mobileCode: string;
    mobileCountry: string;
    mobileNumber: string;
    name: string;
    password: string;
    registerVerificationStatus: string;
    role: string;
    updatedAt: string;
    token?: string;
}

interface LoginAccountState {
    accountLoginData: AccountLoginData;
    setAccountLoginData: (data: Partial<AccountLoginData>) => void;
    resetAccountLoginData: () => void;
}

// Custom storage for SecureStore


const useLoginAccountStore = create<LoginAccountState>()(
        (set) => ({
            accountLoginData: {
                createdAt: "",
                email: "",
                firstTimeLogin: true,
                id: "",
                mobileCode: "",
                mobileCountry: "",
                mobileNumber: "",
                name: "",
                password: "",
                registerVerificationStatus: "",
                role: "",
                updatedAt: "",
                token: "",
            },
            setAccountLoginData: (data) =>
                set((state) => ({
                    accountLoginData: {
                        ...state.accountLoginData,
                        ...data
                    }
                })),
            resetAccountLoginData: () =>
                set(() => ({
                    accountLoginData: {
                        createdAt: "",
                        email: "",
                        firstTimeLogin: true,
                        id: "",
                        mobileCode: "",
                        mobileCountry: "",
                        mobileNumber: "",
                        name: "",
                        password: "",
                        registerVerificationStatus: "",
                        role: "",
                        updatedAt: "",
                    }
                })),
        }),
);

export default useLoginAccountStore;
