import { Keyboard } from "@geist-ui/react";
import { useKBar, VisualState } from "kbar";
import { useTheme } from "next-themes";
import { useCallback, useMemo } from "react";

export default function KbarButton(): JSX.Element {

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
          "hover:bg-light-accent-2 hover:border-black"
          : "hover:bg-dark-accent-2 hover:border-white"
      }
      scale={1.2}
      onClick={() =>
        // TODO: we can expose a query.toggle to handle this logic within the library itself
        query.setVisualState((vs) =>
          [VisualState.animatingOut, VisualState.hidden].includes(vs)
            ? VisualState.animatingIn
            : VisualState.animatingOut
        )
      }>k</Keyboard>
  )
}