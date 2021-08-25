import { useCallback, useRef } from "react";

function App() {
  function useRefWithCallback(onMount, onUnmount) {
    const nodeRef = useRef(null);

    const setRef = useCallback(node => {
      if (nodeRef.current) {
        onUnmount(nodeRef.current);
      }

      nodeRef.current = node;

      if (nodeRef.current) {
        onMount(nodeRef.current);
      }
    }, [onMount, onUnmount]);

    return setRef;
  }

  const onMouseDown = useCallback(e => console.log('hi!', e.target.clientHeight), []);

  const setDivRef = useRefWithCallback(
    node => node.addEventListener("mousedown", onMouseDown),
    node => node.removeEventListener("mousedown", onMouseDown)
  );

  return <div></div>
}



export default App;