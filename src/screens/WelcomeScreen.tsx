import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, makeStyles, Text } from "@rneui/themed";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React, { FC } from "react";
import { View } from "react-native";

const WelcomeScreen: FC<NativeStackScreenProps<any>> = ({ navigation }) => {
  const styles = useStyles();
  const [fontsLoaded] = useFonts({
    OkineBlackOutline: require("assets/fonts/OkineBlackOutline.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Welcome to</Text>
        <Text style={[styles.heading, styles.headingLogo]}>BLOCK</Text>
      </View>
      <Button
        title="Login"
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
        onPress={() => navigation.navigate("Login")}
      />
      <Button
        title="Register"
        type="outline"
        containerStyle={styles.buttonContainer}
        buttonStyle={[styles.button, styles.buttonOutline]}
        onPress={() => navigation.navigate("Register")}
      />
      <View style={styles.spacer} />
      <StatusBar style="auto" />
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.white,
  },
  headingContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: theme.spacing["15"],
  },
  heading: {
    fontSize: 40,
    fontWeight: "bold",
    color: theme.colors.black,
  },
  headingLogo: {
    fontFamily: "OkineBlackOutline",
    fontSize: 58,
  },
  button: {
    marginBottom: theme.spacing["15"],
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: theme.spacing["15"],
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderColor: theme.colors.gray300,
    borderWidth: theme.spacing["1"],
  },
  spacer: {
    height: theme.spacing["15"],
  },
}));

export default WelcomeScreen;
