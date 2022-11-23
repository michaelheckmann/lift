import Icon from "@expo/vector-icons/Ionicons";
import { Input, makeStyles, useTheme } from "@rneui/themed";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, FieldArrayWithId, UseFormReturn } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { updateSet } from "src/store/actions/setActions";
import { debounce } from "src/utils/functions/debounce";
import { SetUpdate } from "src/utils/types/Set";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";
import tinycolor from "tinycolor2";

type Props = {
  set: FieldArrayWithId<WorkoutJoin, "setGroups.0.sets", "id">;
  setIndex: number;
  setGroupIndex: number;
  methods: UseFormReturn<WorkoutJoin, any>;
};

export default function Set({ set, setIndex, setGroupIndex, methods }: Props) {
  const { control, watch, formState } = methods;

  const path =
    `setGroups.${setGroupIndex}.sets.${setIndex}` as "setGroups.0.sets.0";
  const weight = watch(`${path}.weight`);
  const reps = watch(`${path}.reps`);
  const done = watch(`${path}.done`);

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
  }, [weight, reps, done]);

  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const handleNumberInput = (value: string) => {
    if (value === ",") return "0";
    // handle the case of mulitple commas
    if (value.match(/,/g)?.length > 1) {
      // remove all the commas expect for the one most closest to the middle of the string 'value'
      const length = value.length;
      const commaIndizes = [...value.matchAll(/,/g)].map(
        (match) => match.index
      );
      const middleIndex = Math.floor(length / 2);
      const closestCommaIndex = commaIndizes.reduce((prev, curr) =>
        Math.abs(curr - middleIndex) < Math.abs(prev - middleIndex)
          ? curr
          : prev
      );
      value = value
        .split("")
        .map((number, i) => {
          if (!commaIndizes.includes(i) || i === closestCommaIndex)
            return number;
          return "";
        })
        .join("");
      return value;
    }
    // handle the case of a comma at the end (idicating a decimal)
    if (value.endsWith(",")) return value;
    value = value.replace(",", ".");
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return 0;
    return parsed.toString().replace(/\./g, ",");
  };

  return (
    <View key={set.id} style={styles.container}>
      {/* Set Number */}
      <View
        style={[
          styles.containerItem,
          styles.firstContainerItem,
          { width: "8%" },
        ]}
      >
        <View style={styles.setNumber}>
          <Text style={styles.setNumberText}>{setIndex + 1}</Text>
        </View>
      </View>

      {/* Previous */}
      <View style={[styles.containerItem, { width: "30%" }]}>
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
            containerStyle={[styles.containerItem, { width: "25%" }]}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            selectionColor={colors.black}
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
            containerStyle={[styles.containerItem, { width: "20%" }]}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            selectionColor={colors.black}
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
            onPress={() => onChange(!value)}
            style={[
              styles.containerItem,
              styles.lastContainerItem,
              { width: "8%" },
            ]}
          >
            <View
              style={[
                styles.doneContainer,
                {
                  backgroundColor: value
                    ? tinycolor(colors.success, 90)
                        .lighten(40)
                        .saturate(80)
                        .toString()
                    : colors.grey0,
                },
              ]}
            >
              <Icon
                name="checkmark-sharp"
                size={18}
                style={[
                  styles.icon,
                  { color: value ? colors.success : colors.black },
                ]}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: theme.border.radius.sm,
    backgroundColor: theme.colors.white,
  },
  containerItem: {
    flexGrow: 0,
    minWidth: 0,
    minHeight: 0,
    margin: 0,
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: theme.spacing.md,
    marginHorizontal: 0,
    marginVertical: 0,
    width: "auto",
    height: "auto",
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "transparent",
  },
  firstContainerItem: {
    paddingLeft: theme.spacing.md,
  },
  lastContainerItem: {
    paddingRight: theme.spacing.md,
  },
  setNumber: {
    borderRadius: theme.border.radius.sm,
    backgroundColor: theme.colors.grey0,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  setNumberText: {
    fontSize: 16,
    color: theme.colors.black,
    textAlign: "center",
    fontWeight: "500",
    width: "100%",
  },
  previous: {
    borderRadius: theme.border.radius.sm,
    backgroundColor: theme.colors.grey0,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  previousText: {
    fontSize: 16,
    color: theme.colors.black,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 30,
  },
  inputContainer: {
    backgroundColor: theme.colors.grey0,
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
  },
  input: {
    textAlign: "center",
    fontSize: 16,
    color: theme.colors.black,
    fontWeight: "500",
    paddingHorizontal: 0,
  },
  doneContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.border.radius.sm,
  },
  icon: {
    width: "100%",
    textAlign: "center",
  },
}));
