import { makeStyles } from "@rneui/themed";
import React from "react";
import { Text, View } from "react-native";
import { getSetSpacing } from "src/utils/functions/getSetSpacing";

export default function SetHeader() {
  const width = getSetSpacing();
  const styles = useStyles();
  return (
    <View style={styles.setsHeader}>
      <Text
        style={[
          styles.setsHeaderText,
          {
            width: width.set,
          },
        ]}
      >
        Set
      </Text>
      <Text
        style={[
          styles.setsHeaderText,
          {
            width: width.previous,
          },
        ]}
      >
        Previous
      </Text>
      <Text
        style={[
          styles.setsHeaderText,
          {
            width: width.weight,
          },
        ]}
      >
        KG
      </Text>
      <Text
        style={[
          styles.setsHeaderText,
          {
            width: width.reps,
          },
        ]}
      >
        Reps
      </Text>
      <Text
        style={[
          styles.setsHeaderText,
          {
            width: width.done,
          },
        ]}
      >
        ✓
      </Text>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  setsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing["1"],
    height: spacing["9"],
  },
  setsHeaderText: {
    fontWeight: "500",
    fontSize: spacing["4"],
    color: colors.border,
    textAlign: "center",
  },
}));
