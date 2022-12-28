import Icon from "@expo/vector-icons/Ionicons";
import { makeStyles, useTheme } from "@rneui/themed";
import React from "react";
import { ListRenderItemInfo, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { OptionType } from "src/utils/functions/getOptionGroups";

const Option = ({ item }: ListRenderItemInfo<OptionType>) => {
  const styles = useStyles();
  const { theme } = useTheme();
  return (
    <TouchableOpacity style={styles.option} onPress={item.onPress}>
      <Icon name={item.icon} size={theme.spacing["5"]} />
      <Text style={styles.optionText}>{item.label}</Text>
      <Icon name="chevron-forward-outline" size={theme.spacing["6"]} />
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
    borderColor: colors.gray900,
    width: "100%",
  },
  optionSeperator: {
    height: spacing["0.5"],
    backgroundColor: colors.gray900,
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
  },
}));
