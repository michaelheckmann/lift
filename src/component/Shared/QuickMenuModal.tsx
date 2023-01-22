import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { SharedValue } from "react-native-reanimated";
import QuickMenu, { QuickMenuOptionType } from "src/component/Shared/QuickMenu";

type Props = {
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
  setGroupMenuOptions: QuickMenuOptionType[];
  setGroupMenuVisible: boolean;
  setSetGroupMenuVisible: Dispatch<SetStateAction<boolean>>;
};

export default function QuickMenuModal({
  xPosition,
  yPosition,
  setGroupMenuOptions,
  setGroupMenuVisible,
  setSetGroupMenuVisible,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (setGroupMenuVisible) {
      setModalVisible(setGroupMenuVisible);
      setShowMenu(setGroupMenuVisible);
    } else {
      setShowMenu(false);
      setTimeout(() => {
        setModalVisible(false);
      }, 200);
    }
  }, [setGroupMenuVisible]);

  const handleBackdropPress = () => {
    setSetGroupMenuVisible(false);
  };

  return (
    <Modal
      isVisible={modalVisible}
      onBackdropPress={handleBackdropPress}
      backdropOpacity={0.4}
      animationInTiming={150}
      animationIn="zoomIn"
      animationOut="fadeOut"
      animationOutTiming={150}
      style={styles.modal}
    >
      <QuickMenu
        yPosition={yPosition}
        xPosition={xPosition}
        options={setGroupMenuOptions}
        showMenu={showMenu}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
});
