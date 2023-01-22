import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { SharedValue } from "react-native-reanimated";
import QuickMenu, { QuickMenuOptionType } from "src/component/Shared/QuickMenu";

type Props = {
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
  menuOptions: QuickMenuOptionType[];
  menuVisible: boolean;
  setMenuVisible: Dispatch<SetStateAction<boolean>>;
  openToLeft?: boolean;
};

export default function QuickMenuModal({
  xPosition,
  yPosition,
  menuOptions,
  menuVisible,
  setMenuVisible,
  openToLeft,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (menuVisible) {
      setModalVisible(true);
      setShowMenu(true);
    } else {
      setShowMenu(false);
      setTimeout(() => {
        setModalVisible(false);
      }, 200);
    }
  }, [menuVisible]);

  const handleBackdropPress = () => {
    setMenuVisible(false);
  };

  return (
    <Modal
      isVisible={modalVisible}
      onBackdropPress={handleBackdropPress}
      backdropOpacity={0.2}
      animationInTiming={150}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationOutTiming={150}
      backdropTransitionOutTiming={150}
      style={styles.modal}
    >
      <QuickMenu
        yPosition={yPosition}
        xPosition={xPosition}
        options={menuOptions}
        showMenu={showMenu}
        openToLeft={openToLeft}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
});
