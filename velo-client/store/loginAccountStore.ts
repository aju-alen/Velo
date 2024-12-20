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
    modeOfWork?: string;
    organisationId?: string;
}

interface UserLoginData {
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
    token?: string;
}

interface LoginAccountState {
    accountLoginData: AccountLoginData;
    userLoginData: UserLoginData;
    setAccountLoginData: (data: Partial<AccountLoginData>) => void;
    setUserLoginData: (data: Partial<UserLoginData>) => void;
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
                modeOfWork: "",
                organisationId: "",
            },
            userLoginData: {
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
                token: "",
            },
            setUserLoginData: (data) =>
                set((state) => ({
                    userLoginData: {
                        ...state.userLoginData,
                        ...data
                    }
                })),
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
                        token: "",
                        modeOfWork: "",
                        organisationId: "",
                        
                    }
                })),
        }),
);

export default useLoginAccountStore;
