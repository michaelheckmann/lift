import Icon from "@expo/vector-icons/Ionicons";
import { makeStyles, useTheme } from "@rneui/themed";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useShadow } from "src/utils/hooks/useShadow";
import { IoniconType } from "src/utils/types/lib/Ionicon";

export type QuickMenuOptionType = {
  label: string;
  icon: IoniconType;
  onPress: () => void;
  isSecondary?: boolean;
};

type Props = {
  yPosition: SharedValue<number>;
  xPosition: SharedValue<number>;
  options: QuickMenuOptionType[];
  showMenu: boolean;
};

export default function QuickMenu({
  yPosition,
  xPosition,
  options,
  showMenu,
}: Props) {
  const shadow = useShadow(3);
  const { theme } = useTheme();
  const itemHeight = theme.spacing["14"];
  const containerHeight = itemHeight * options.length + theme.spacing["2"] * 2;
  const styles = useStyles({ shadow, itemHeight });

  const width = useSharedValue(0);
  const height = useSharedValue(0);

  const config = {
    duration: 150,
  };

  useEffect(() => {
    if (showMenu) {
      width.value = withTiming(theme.spacing["56"], config);
      height.value = withTiming(containerHeight, config);
    } else {
      width.value = withTiming(0, config);
      height.value = withTiming(0, config);
    }
  }, [showMenu]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: yPosition.value,
      left: xPosition.value,
      width: width.value,
      height: height.value,
    };
  });
  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      {options.map((option, index) => (
        <View key={option.label}>
          <TouchableOpacity
            onPress={option.onPress}
            style={styles.optionContainer}
          >
            <Icon
              name={option.icon}
              size={theme.spacing["5"]}
              color={theme.colors.gray400}
            />
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
          {index !== options.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </Animated.View>
  );
}

const useStyles = makeStyles((theme, props) => {
  const { colors, spacing, borderRadius } = theme;
  const { shadow, itemHeight } = props as any;
  return {
    container: {
      position: "absolute",
      backgroundColor: colors.background,
      paddingHorizontal: spacing["3"],
      borderRadius: borderRadius.sm,
      justifyContent: "center",
      overflow: "hidden",
      ...shadow,
    },
    optionContainer: {
      height: itemHeight,
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: spacing["2"],
    },
    optionText: {
      fontSize: spacing["4"],
      fontWeight: "bold",
      color: colors.text,
      marginLeft: spacing["2"],
    },
    separator: {
      height: spacing["0.5"],
      backgroundColor: theme.colors.gray200,
      width: "100%",
    },
  };
});
