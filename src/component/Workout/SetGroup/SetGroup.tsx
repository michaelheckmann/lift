import Icon from "@expo/vector-icons/Ionicons";
import MIcon from "@expo/vector-icons/MaterialIcons";
import { Button, makeStyles, useTheme } from "@rneui/themed";
import React from "react";
import {
  FieldArrayWithId,
  useFieldArray,
  UseFormReturn,
} from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { createSet, updateSet } from "src/store/actions/setActions";
import { getThemeConfig } from "src/utils/functions/getThemeConfig";
import { useShadow } from "src/utils/hooks/useShadow";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";
import Set from "../Set/Set";
import SetHeader from "./SetHeader";

type Props = {
  setGroup: FieldArrayWithId<WorkoutJoin, "setGroups", "id">;
  setGroupIndex: number;
  methods: UseFormReturn<WorkoutJoin, any>;
};

const renderLeftActions = ({ removeSet, styles }) => {
  return (
    <RectButton style={styles.removeBox} onPress={removeSet}>
      <Icon name="trash-bin" size={20} color="white" />
    </RectButton>
  );
};

export default function SetGroup({ setGroup, setGroupIndex, methods }: Props) {
  const shadow = useShadow();
  const styles = useStyles({ shadow });
  const { theme } = useTheme();

  /* Definition of the form values and methods */
  const { control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `setGroups.${setGroupIndex}.sets` as "setGroups.0.sets",
    keyName: "fieldId",
  });

  const handleAppendSet = () => {
    const defaultSet = {
      weight: 0,
      reps: 0,
      done: false,
      archived: false,
      setgroup_id: setGroup.id,
    };
    const id = createSet.dispatch({
      setgroup_id: defaultSet.setgroup_id,
    });

    append({ ...defaultSet, id });
  };

  const handleRemoveSet = (setIndex) => {
    remove(setIndex);
    updateSet.dispatch({
      id: fields[setIndex].id,
      archived: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* Set Group Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.headerButton, styles.setGroupOptions]}>
          <Text style={styles.headerButtonText}>{setGroupIndex + 1}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.headerButton, styles.exercise]}>
          <Text style={styles.headerButtonText}>{setGroup.exercise.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Set Header */}
      <SetHeader />

      {/* Sets */}
      <View style={styles.setGroupContainer}>
        {fields.map((set, setIndex) => (
          <View key={set.fieldId} style={styles.set}>
            <Swipeable
              renderRightActions={() =>
                renderLeftActions({
                  removeSet: () => handleRemoveSet(setIndex),
                  styles,
                })
              }
              rightThreshold={40}
              overshootFriction={8}
              shouldCancelWhenOutside
              containerStyle={{
                backgroundColor: theme.colors.error,
              }}
            >
              <Set
                set={set}
                setIndex={setIndex}
                setGroupIndex={setGroupIndex}
                methods={methods}
              />
            </Swipeable>
          </View>
        ))}
      </View>

      <Button
        buttonStyle={styles.addSetButton}
        titleStyle={styles.addSetButtonText}
        title="Add set"
        icon={
          <MIcon
            name="add"
            size={theme.spacing["5"]}
            color={theme.colors.text}
            style={styles.addSetIcon}
          />
        }
        onPress={handleAppendSet}
      />
    </View>
  );
}

const useStyles = makeStyles((theme, { shadow }) => {
  const { colors, spacing, borderRadius } = theme;
  return {
    container: {
      width: "100%",
      marginBottom: spacing["8"],
    },
    header: {
      flexDirection: "row",
      marginBottom: spacing["4"],
      borderWidth: spacing["0.5"],
      borderColor: colors.border,
      borderRadius: borderRadius.sm,
    },
    headerButton: {
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      ...shadow,
    },
    headerButtonText: {
      fontWeight: "bold",
      fontSize: spacing["4"],
      color: colors.text,
    },
    setGroupOptions: {
      height: spacing["10"],
      width: spacing["10"],
      backgroundColor: colors.foreground,
    },
    exercise: {
      paddingHorizontal: spacing["4"],
      flex: 1,
      alignItems: "flex-start",
      borderLeftWidth: spacing["0.5"],
      borderColor: colors.border,
      ...shadow,
    },
    setGroupContainer: {
      borderWidth: spacing["0.5"],
      borderColor: colors.border,
      borderRadius: borderRadius.sm,
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      borderColor: "black",
    },
    addSetButton: {
      paddingVertical: spacing["2"],
      // borderColor: colors.gray600,
      borderWidth: 0,
      backgroundColor: getThemeConfig(
        "SetGroup.addSetButton.backgroundColor",
        theme
      ),
      marginTop: spacing["4"],
    },
    addSetButtonText: {
      fontSize: spacing["4"],
      color: colors.text,
    },
    addSetIcon: {
      marginRight: spacing["0.5"],
    },
    removeBox: {
      backgroundColor: colors.error,
      width: spacing["20"],
      justifyContent: "center",
      alignItems: "center",
    },
    set: {
      marginBottom: spacing["0"],
    },
  };
});
