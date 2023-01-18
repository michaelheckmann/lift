import Icon from "@expo/vector-icons/Ionicons";
import MIcon from "@expo/vector-icons/MaterialIcons";
import { Button, makeStyles, useTheme } from "@rneui/themed";
import React from "react";
import {
  FieldArrayWithId,
  useFieldArray,
  UseFormReturn,
} from "react-hook-form";
import { View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { SharedValue } from "react-native-reanimated";
import { createSet, updateSet } from "src/store/actions/setActions";
import { getSetHeight } from "src/utils/functions/getSetGroupLayouts";
import { getThemeConfig } from "src/utils/functions/getThemeConfig";
import { setListLayoutValue } from "src/utils/functions/listLayoutHelpers";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";
import Set from "../Set/Set";
import { ListItemLayout } from "../Workout/Workout";
import SetHeader from "./SetHeader";

type Props = {
  setGroup: FieldArrayWithId<WorkoutJoin, "setGroups", "id">;
  setGroupIndex: number;
  methods: UseFormReturn<WorkoutJoin, any>;
  listLayout: SharedValue<ListItemLayout[]>;
};

const renderLeftActions = ({ removeSet, styles }) => {
  return (
    <RectButton style={styles.removeBox} onPress={removeSet}>
      <Icon name="trash-bin" size={20} color="white" />
    </RectButton>
  );
};

export default function SetGroupContent({
  methods,
  setGroupIndex,
  setGroup,
  listLayout,
}: Props) {
  const styles = useStyles();
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

    listLayout.value = listLayout.value.map((listLayout, index) => {
      // If the item is the one to which the set is appended,
      // we just need to increase the height of the item
      if (index === setGroupIndex) {
        const height = listLayout.relaxed.height + getSetHeight(theme.spacing);
        return setListLayoutValue(listLayout, "relaxed", "height", height);
      }
      // If the item is below the one to which the set is appended,
      // i.e. later in the list, we need to increase the top of the item,
      // i.e. shift everything done
      else if (index > setGroupIndex) {
        const top = listLayout.relaxed.top + getSetHeight(theme.spacing);
        return setListLayoutValue(listLayout, "relaxed", "top", top);
      }
      // If the item is above the one to which the set is appended,
      // i.e. earlier in the list, we don't need to do anything
      else {
        return listLayout;
      }
    });

    append({ ...defaultSet, id });
  };

  const handleRemoveSet = (setIndex) => {
    remove(setIndex);

    listLayout.value = listLayout.value.map((listLayout, index) => {
      // If the item is the one to which the set is removed,
      // we just need to decrease the height of the item
      if (index === setGroupIndex) {
        const height = listLayout.relaxed.height - getSetHeight(theme.spacing);
        return setListLayoutValue(listLayout, "relaxed", "height", height);
      }
      // If the item is below the one to which the set is removed,
      // i.e. later in the list, we need to decrease the top of the item,
      // i.e. shift everything done
      else if (index > setGroupIndex) {
        const top = listLayout.relaxed.top - getSetHeight(theme.spacing);
        return setListLayoutValue(listLayout, "relaxed", "top", top);
      }
      // If the item is above the one to which the set is removed,
      // i.e. earlier in the list, we don't need to do anything
      else {
        return listLayout;
      }
    });

    updateSet.dispatch({
      id: fields[setIndex].id,
      archived: true,
    });
  };

  return (
    <View style={[styles.container]}>
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
              overshootFriction={2}
              shouldCancelWhenOutside
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

const useStyles = makeStyles((theme) => {
  const { colors, spacing, borderRadius } = theme;
  return {
    container: {
      flex: 1,
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
      height: spacing["9"],
      paddingVertical: 0,
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
