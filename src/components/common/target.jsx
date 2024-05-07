import PropTypes from "prop-types";
import { ContextMenu } from "../common/contextMenu";
import { MenuContext } from "../../utils/contextProvider";
import { getRawPosition } from "../../utils/imageUtils";
import { TargetBox } from "../common/contextMenu";

Target.propTypes = {
  menuState: PropTypes.object,
  toastMsg: PropTypes.string,
  setToastMsg: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  characters: PropTypes.array,
};

export function Target({
  menuState,
  toastMsg,
  setToastMsg,
  width,
  height,
  characters,
}) {
  let { posX, posY } = getRawPosition(
    width,
    height,
    menuState.normalX,
    menuState.normalY
  );
  let boxStyle = {
    display: "none",
    position: `absolute`,
    top: `0px`,
    left: `0px`,
  };

  if (menuState.showTargetBox) {
    boxStyle = {
      display: "flex",
      position: `absolute`,
      top: `${posY - 12}px`,
      left: `${posX - 12}px`,
    };
  }
  return (
    <>
      <MenuContext.Provider
        value={{
          toastMsg,
          setToastMsg,
          characters,
          posX,
          posY,
          normalX: menuState.normalX,
          normalY: menuState.normalY,
        }}
      >
        <ContextMenu showMenu={menuState.showMenu} />
      </MenuContext.Provider>
      <TargetBox targetStyle={boxStyle} />
    </>
  );
}
