import Icon from "@expo/vector-icons/Ionicons";
import { makeStyles, useTheme } from "@rneui/themed";
import { signOut } from "firebase/auth";
import React from "react";
import { ListRenderItemInfo, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { auth } from "src/config/firebase";
import { useLiftStore } from "src/store";
import { updateSettings } from "src/store/actions/settingsActions";
import { OptionType } from "src/utils/functions/getProfileOptionGroups";

const Option = ({ item }: ListRenderItemInfo<OptionType>) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { id } = useLiftStore((state) => state.settings);

  const handleSelect = () => {
    const { label } = item;
    if (label === "Light Mode") {
      updateSettings.dispatch({ id, theme: "light" });
    } else if (label === "Dark Mode") {
      updateSettings.dispatch({ id, theme: "dark" });
    } else if (label === "Halloween") {
      updateSettings.dispatch({ id, theme: "halloween" });
    } else if (label === "Logout") {
      signOut(auth);
    }
  };

  return (
    <TouchableOpacity style={styles.option} onPress={handleSelect}>
      <Icon
        name={item.icon}
        size={theme.spacing["5"]}
        color={theme.colors.text}
      />
      <Text style={styles.optionText}>{item.label}</Text>
      <Icon
        name="chevron-forward-outline"
        size={theme.spacing["6"]}
        color={theme.colors.text}
      />
    </TouchableOpacity>
  );
};

export default function OptionGroup({
  item,
}: ListRenderItemInfo<OptionType[]>) {
  const styles = useStyles();
  return (
    <View style={styles.optionGroup}>
      <KeyboardAwareFlatList
        data={item}
        renderItem={(props) => <Option {...props} />}
        keyExtractor={(item) => item.label}
        ItemSeparatorComponent={() => <View style={styles.optionSeperator} />}
      />
    </View>
  );
}

const useStyles = makeStyles(({ spacing, colors, borderRadius }) => ({
  optionGroup: {
    borderRadius: borderRadius.sm,
    borderWidth: spacing["0.5"],
    borderColor: colors.border,
    width: "100%",
    backgroundColor: colors.foreground,
  },
  optionSeperator: {
    height: spacing["0.5"],
    backgroundColor: colors.border,
  },
  option: {
    paddingVertical: spacing["4"],
    paddingHorizontal: spacing["5"],
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: spacing["4"],
    flexBasis: "75%",
    color: colors.text,
  },
}));
