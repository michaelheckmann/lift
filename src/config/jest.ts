/* eslint-disable no-undef, import/no-extraneous-dependencies */

// load env variables
require("dotenv").config();

/***********  Reanimated  ***********/
// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

global.__reanimatedWorkletInit = () => {};
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

/***********  AsyncStorage  ***********/
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import { UseAuthReturnType } from "src/utils/hooks/useAuth";
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

/***********  Firebase  ***********/
jest.mock("firebase/auth");
jest.mock("firebase/auth/react-native", () => {
  return {
    getReactNativePersistence: jest.fn(),
  };
});

/***********  Net Info  ***********/
import mockRNCNetInfo from "@react-native-community/netinfo/jest/netinfo-mock.js";
jest.mock("@react-native-community/netinfo", () => mockRNCNetInfo);

/***********  Expo Font  ***********/
jest.mock("expo-font", () => {
  const autoMock = jest.requireActual("expo-font");
  return {
    ...autoMock,
    useFonts: jest.fn().mockReturnValue([true]),
  };
});

/***********  SafeAreaContext  ***********/
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";
jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);

jest.mock("@react-navigation/bottom-tabs", () => {
  const autoMock = jest.requireActual("@react-navigation/bottom-tabs");
  return {
    ...autoMock,
    useBottomTabBarHeight: jest.fn().mockReturnValue(0),
  };
});

/***********  Keyboard Aware Scroll View  ***********/
jest.mock("react-native-keyboard-aware-scroll-view", () => {
  return {
    KeyboardAwareScrollView: jest
      .fn()
      .mockImplementation(({ children }) => children),
  };
});

/***********  Custom Hooks  ***********/

const mockUser = {
  displayName: "Test User",
  email: "test-user@test.com",
  emailVerified: false,
  isAnonymous: false,
  metadata: {},
  phoneNumber: "",
  photoURL: "",
  providerData: [],
  providerId: "",
  refreshToken: "",
  tenantId: "",
  uid: "test-user-id",
  delete: jest.fn(),
  getIdToken: jest.fn().mockReturnValue(process.env.CUSTOM_ID_TOKEN),
  getIdTokenResult: jest.fn(),
  reload: jest.fn(),
  toJSON: jest.fn(),
};

jest.mock("../utils/hooks/useAuth.ts", () => {
  const useAuthReturnValue: UseAuthReturnType = {
    user: mockUser,
  };
  return {
    useAuth: jest.fn().mockReturnValue(useAuthReturnValue),
  };
});

jest.mock("src/config/firebase", () => {
  return {
    auth: {
      currentUser: mockUser,
    },
  };
});

/***********  Other  ***********/
export const navigationProps: any = {
  navigation: {
    navigate: jest.fn(),
  },
};
