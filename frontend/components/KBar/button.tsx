import { Keyboard } from "@geist-ui/react";
import { useKBar, VisualState } from "kbar";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { useRecoilState } from "recoil";
import { mobileNavbarVisiblityState } from "../../store/mobileNavbar";

export default function KbarButton(): JSX.Element {

  const [, setState] = useRecoilState(mobileNavbarVisiblityState);

  const { query } = useKBar();
  const { theme } = useTheme();

  const isLight = useMemo(
    () => {
      return theme === 'light'
    },
    [theme],
  )

  return (
    <Keyboard
      command
      className={
        isLight ?
          "hover:bg-light-accent-2 hover:border-black bg-light-accent-1"
          : "hover:bg-dark-accent-2 hover:border-white"
      }
      scale={1.2}
      onClick={() => {
        // turn off navbar
        setState(false);

        // turn on kBar
        query.setVisualState((vs) =>
          [
            VisualState.animatingOut,
            VisualState.hidden
          ].includes(vs)
            ? VisualState.animatingIn
            : VisualState.animatingOut
        );
      }}>k</Keyboard>
  )
}