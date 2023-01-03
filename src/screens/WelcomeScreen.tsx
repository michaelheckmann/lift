import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, makeStyles, Text } from "@rneui/themed";
import { useFonts } from "expo-font";
import React, { FC } from "react";
import { View } from "react-native";

const WelcomeScreen: FC<NativeStackScreenProps<any>> = ({ navigation }) => {
  const styles = useStyles();
  const [fontsLoaded] = useFonts({
    HubotSansBlackNarrow: require("assets/fonts/HubotSansBlackNarrow.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>LIFT</Text>
      </View>
      <View style={styles.buttonStack}>
        <Button
          title="Login"
          titleStyle={styles.buttonText}
          containerStyle={[styles.buttonContainer, styles.buttonTop]}
          buttonStyle={styles.button}
          onPress={() => navigation.navigate("Login")}
        />
        <Button
          title="Register"
          type="outline"
          titleStyle={styles.buttonOutlineText}
          containerStyle={styles.buttonContainer}
          buttonStyle={[styles.button, styles.buttonOutline]}
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
};

const useStyles = makeStyles(({ spacing, colors, mode }) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  headingContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: spacing["15"],
  },
  heading: {
    fontSize: spacing["36"],
    fontWeight: "bold",
    color: colors.text,
    fontFamily: "HubotSansBlackNarrow",
  },
  buttonStack: {
    flexDirection: "column",
    marginTop: spacing["16"],
    marginBottom: spacing["16"],
    width: "100%",
    paddingHorizontal: spacing["4"],
  },
  button: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonText: {
    color: mode === "dark" ? colors.primary900 : colors.primary50,
  },
  buttonOutlineText: {
    color: colors.text,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacing["15"],
  },
  buttonTop: {
    marginBottom: spacing["8"],
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderColor: colors.text,
    borderWidth: spacing["0.5"],
  },
  spacer: {
    height: spacing["15"],
  },
}));

export default WelcomeScreen;
