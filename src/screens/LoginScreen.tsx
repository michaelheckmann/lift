import Icon from "@expo/vector-icons/Ionicons";
import { Button, Input, makeStyles } from "@rneui/themed";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import DismissKeyboard from "src/component/Shared/DismissKeyboard";
import { auth } from "src/config/firebase";
import { useToast } from "src/utils/hooks/useToast";

const LoginScreen = () => {
  const styles = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  const showToast = useToast();

  async function signIn() {
    setIsLoading(true);
    if (email === "" || password === "") {
      showToast("Email and password are required.", "error");
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      showToast("Request failed to send. Please try again.", "error");
    }

    setIsLoading(false);
  }

  return (
    <DismissKeyboard>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Input
          ref={emailRef}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current.focus()}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          onChangeText={(text) => setEmail(text)}
          leftIcon={<Icon name="ios-mail" size={18} />}
        />

        <Input
          ref={passwordRef}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          onSubmitEditing={signIn}
          leftIcon={<Icon name="ios-lock-closed" size={18} />}
        />

        <Button
          title="Sign in"
          onPress={signIn}
          containerStyle={styles.button}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
          loading={isLoading}
        />
      </KeyboardAvoidingView>
    </DismissKeyboard>
  );
};

const useStyles = makeStyles(({ spacing, colors }) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing["4"],
  },
  button: {
    width: "100%",
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.gray900,
  },
}));

export default LoginScreen;
