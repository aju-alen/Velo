import { create } from "zustand";


interface ThemeColor {
   color: "light" | "dark";
}

interface DefaultThemeState {
    colorState: ThemeColor;
    setcolorState: (data: Partial<ThemeColor>) => void;
  
}

// Custom storage for SecureStore


const useDefaultTheme = create<DefaultThemeState>()(
        (set) => ({
            colorState: {
                color: "light",
            },
            setcolorState: (data) =>
                set((state) => ({
                    colorState: {
                        ...state.colorState,
                        ...data
                    }
                }),
            ),
        }),
);

export default useDefaultTheme;
