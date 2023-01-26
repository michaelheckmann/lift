import Icon from "@expo/vector-icons/Ionicons";
import { Input, makeStyles, useTheme } from "@rneui/themed";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, FieldArrayWithId, UseFormReturn } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { QuickMenuOptionType } from "src/component/Shared/QuickMenu";
import QuickMenuModal from "src/component/Shared/QuickMenuModal";
import { updateSet } from "src/store/actions/setActions";
import { setLastFinishedSet } from "src/store/actions/tempActions";
import { debounce } from "src/utils/functions/debounce";
import { getSetSpacing } from "src/utils/functions/getSetSpacing";
import { getThemeConfig } from "src/utils/functions/getThemeConfig";
import { handleNumberInput } from "src/utils/functions/handleNumberInput";
import { SetUpdate } from "src/utils/types/Set";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";

type Props = {
  set: FieldArrayWithId<WorkoutJoin, "setGroups.0.sets", "id">;
  setIndex: number;
  setGroupIndex: number;
  methods: UseFormReturn<WorkoutJoin, any>;
};

export default function Set({ set, setIndex, setGroupIndex, methods }: Props) {
  /* Definition of the form values and methods */
  const { control, watch, formState } = methods;
  const path =
    `setGroups.${setGroupIndex}.sets.${setIndex}` as "setGroups.0.sets.0";
  const weight = watch(`${path}.weight`);
  const reps = watch(`${path}.reps`);
  const done = watch(`${path}.done`);

  const styles = useStyles({ done });
  const { theme } = useTheme();

  const width = getSetSpacing();

  const xPosition = useSharedValue(0);
  const yPosition = useSharedValue(0);
  const menuButtonRef = useRef(null);

  const [quickMenuVisible, setQuickMenuVisible] = useState(false);
  const openQuickMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    menuButtonRef.current.measureInWindow((x, y) => {
      xPosition.value = x;
      yPosition.value = y;
      setQuickMenuVisible(true);
    });
  };
  const closeQuickMenu = () => setQuickMenuVisible(false);

  const saveData = useCallback<{ (args: SetUpdate) }>(
    debounce((data: SetUpdate) => updateSet.dispatch(data), 1000),
    []
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Prevent the mutation from firing on initial render
    if (!isMounted || !formState.isDirty) return;
    // console.log(setGroupIndex, setIndex, "||", weight, reps, done);
    saveData({
      id: set.id,
      weight,
      reps,
      done,
    });

    if (done) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [weight, reps, done]);

  const quickMenuOptions: QuickMenuOptionType[] = [
    {
      label: "Add a note",
      icon: "document-text-outline",
      onPress: () => {
        console.log("Add a note");
        closeQuickMenu();
      },
    },
    {
      label: "Delete",
      icon: "trash-outline",
      onPress: () => {
        console.log("Delete");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        closeQuickMenu();
      },
    },
  ];

  const handleDoneToggle = (
    id: string,
    value: boolean,
    onChange: (any) => void
  ) => {
    !value && setLastFinishedSet(id);
    onChange(!value);
  };

  return (
    <View key={set.id} style={styles.container}>
      {/* Set Number */}
      <TouchableOpacity
        style={[
          styles.containerItem,
          styles.firstContainerItem,
          { width: width.set },
        ]}
        onPress={openQuickMenu}
        ref={menuButtonRef}
      >
        <View style={styles.setNumber}>
          <Text style={styles.setNumberText}>{setIndex + 1}</Text>
        </View>
      </TouchableOpacity>

      {/* Previous */}
      <View style={[styles.containerItem, { width: width.previous }]}>
        <View style={styles.previous}>
          <Text style={styles.previousText}>{setIndex}</Text>
        </View>
      </View>

      {/* Weight */}
      <Controller
        control={control}
        name={`setGroups.${setGroupIndex}.sets.${setIndex}.weight`}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            contextMenuHidden
            selectTextOnFocus
            onBlur={onBlur}
            onChangeText={(value) => onChange(handleNumberInput(value))}
            value={value.toString()}
            renderErrorMessage={false}
            containerStyle={[styles.containerItem, { width: width.weight }]}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            selectionColor={theme.colors.black}
            keyboardType="numeric"
            maxLength={6}
          />
        )}
      />

      {/* Reps */}
      <Controller
        control={control}
        name={`setGroups.${setGroupIndex}.sets.${setIndex}.reps`}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            contextMenuHidden
            selectTextOnFocus
            onBlur={onBlur}
            onChangeText={(value) => onChange(handleNumberInput(value))}
            value={value.toString()}
            renderErrorMessage={false}
            containerStyle={[styles.containerItem, { width: width.reps }]}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            selectionColor={theme.colors.black}
            keyboardType="number-pad"
            maxLength={2}
          />
        )}
      />

      {/* Done */}
      <Controller
        control={control}
        name={`setGroups.${setGroupIndex}.sets.${setIndex}.done`}
        render={({ field: { onChange, onBlur, value } }) => (
          <TouchableOpacity
            onBlur={onBlur}
            onPress={() => handleDoneToggle(set.id, value, onChange)}
            style={[
              styles.containerItem,
              styles.lastContainerItem,
              { width: width.done },
            ]}
          >
            <View style={styles.doneContainer}>
              <Icon name="checkmark-sharp" size={18} style={styles.icon} />
            </View>
          </TouchableOpacity>
        )}
      />

      <QuickMenuModal
        menuVisible={quickMenuVisible}
        setMenuVisible={setQuickMenuVisible}
        xPosition={xPosition}
        yPosition={yPosition}
        menuOptions={quickMenuOptions}
      />
    </View>
  );
}

const useStyles = makeStyles((theme, { done }) => {
  const { colors, spacing, borderRadius } = theme;
  return {
    container: {
      // flex: 1,
      height: spacing["12"],
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: colors.background,
    },
    containerItem: {
      flexGrow: 0,
      minWidth: 0,
      minHeight: 0,
      margin: 0,
      padding: 0,
      paddingHorizontal: 0,
      paddingVertical: spacing["2"],
      marginHorizontal: 0,
      marginVertical: 0,
      width: "auto",
      height: "auto",
      justifyContent: "center",
      alignItems: "stretch",
    },
    firstContainerItem: {
      paddingLeft: spacing["2"],
    },
    lastContainerItem: {
      paddingRight: spacing["2"],
    },
    setNumber: {
      borderRadius: borderRadius.sm,
      backgroundColor: done
        ? colors.success200
        : getThemeConfig("Set.setInput.backgroundColor", theme),
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
    },
    setNumberText: {
      fontSize: 16,
      color: done ? colors.success900 : colors.text,
      textAlign: "center",
      fontWeight: "500",
      width: "100%",
    },
    previous: {
      borderRadius: borderRadius.sm,
      backgroundColor: done
        ? colors.success200
        : getThemeConfig("Set.setInput.backgroundColor", theme),
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
    },
    previousText: {
      fontSize: 16,
      color: done ? colors.success900 : colors.text,
      textAlign: "center",
      fontWeight: "500",
      lineHeight: 30,
    },
    inputContainer: {
      backgroundColor: done
        ? colors.success200
        : getThemeConfig("Set.setInput.backgroundColor", theme),
      marginHorizontal: 0,
      paddingHorizontal: 0,
      flex: 0,
      flexGrow: 0,
      flexShrink: 1,
      minWidth: 0,
      minHeight: 0,
      width: "100%",
      height: 30,
      borderWidth: 0,
      borderBottomWidth: 0,
      borderRadius: borderRadius.sm,
    },
    input: {
      textAlign: "center",
      fontSize: 16,
      color: done ? colors.success900 : colors.text,
      fontWeight: "500",
      paddingHorizontal: 0,
    },
    doneContainer: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: borderRadius.sm,
      backgroundColor: done
        ? colors.success200
        : getThemeConfig("Set.setInput.backgroundColor", theme),
    },
    icon: {
      width: "100%",
      textAlign: "center",
      color: done ? colors.success900 : colors.text,
    },
  };
});
