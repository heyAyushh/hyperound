import * as React from 'react';
import { KBarResults, KBarSearch, KBarContent, KBarProvider, useKBar, KBarContext } from 'kbar';
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { VisualState } from "../types/types";
import { useRecoilState } from "recoil";
import { kbarVisible } from "../store/kbar";

const searchStyles = {
  padding: '12px 16px',
  fontSize: '16px',
  width: '100%',
  boxSizing: 'border-box' as React.CSSProperties['boxSizing'],
  outline: 'none',
  border: 'none',
  // backdropFilter: 'blur(40px)',
  background: 'var(--background)',
  color: 'var(--foreground)',
};

const App = ({ Component, pageProps }): JSX.Element => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <KBarProvider
      actions={
        [
          {
            id: 'searchDocsAction',
            name: 'Search docs…',
            shortcut: [],
            keywords: 'find',
            section: '',
            children: ['docs1', 'docs2'],
          },
          {
            id: 'homeAction',
            name: 'Home',
            shortcut: ['h'],
            keywords: 'back',
            section: 'Navigation',
            perform: () => router.push('/'),
          },
          {
            id: 'docsAction',
            name: 'Docs',
            shortcut: ['d'],
            keywords: 'help',
            section: 'Navigation',
            perform: () => router.push('/docs'),
          },
          {
            id: 'contactAction',
            name: 'Contact',
            shortcut: ['c'],
            keywords: 'email hello',
            section: 'Navigation',
            perform: () => window.open('mailto:timchang@hey.com', '_blank'),
          },
          {
            id: 'twitterAction',
            name: 'Twitter',
            shortcut: ['t'],
            keywords: 'social contact dm',
            section: 'Navigation',
            perform: () => window.open('https://twitter.com/timcchang', '_blank'),
          },
          {
            id: 'docs1',
            name: 'Docs 1 (Coming soon)',
            shortcut: [],
            keywords: 'Docs 1',
            section: '',
            perform: () => window.alert('nav -> Docs 1'),
            parent: 'searchBlogAction',
          },
          {
            id: 'docs2',
            name: 'Docs 2 (Coming soon)',
            shortcut: [],
            keywords: 'Docs 2',
            section: '',
            perform: () => window.alert('nav -> Docs 2'),
            parent: 'searchBlogAction',
          },
          {
            id: 'theme',
            name: 'Change theme…',
            shortcut: [],
            keywords: 'interface color dark light',
            section: '',
            children: ['darkTheme', 'lightTheme'],
          },
          {
            id: 'darkTheme',
            name: 'Dark',
            shortcut: [],
            keywords: 'dark',
            section: '',
            perform: () => setTheme('dark'),
            parent: 'theme',
          },
          {
            id: 'lightTheme',
            name: 'Light',
            shortcut: [],
            keywords: 'light',
            section: '',
            perform: () => setTheme('light'),
            parent: 'theme',
          },
        ]}
      options={{
        animations: {
          enterMs: 200,
          exitMs: 100,
          maxContentHeight: 400,
        },
      }}
    >
      <KBarContent
        contentStyle={{
          // backdropFilter: 'blur(20px)',
          maxWidth: '400px',
          width: '100%',
          borderRadius: '8px',
          backgroundColor: theme === 'light' ? 'white' : 'black',
          overflow: 'hidden',
          boxShadow: theme === 'light' ? '0 30px 60px rgba(0, 0, 0, 0.12)' : 'linear-gradient(rgb(167, 243, 208), rgb(52, 211, 153), rgb(126, 34, 206))',
          transform: 'translateY(15%) scale(.85)',
          // filter: 'blur(30px)',
        }}
        backgroundStyle={{
          backdropFilter: 'blur(16px)'
        }}
      >
        <KBarSearch
          style={searchStyles}
          placeholder="Type a command or search…"
        />
        <KBarResults
          onRender={(action, handlers, state) => (
            <Render action={action} handlers={handlers} state={state} />
          )}
        />
      </KBarContent>
      <div>
        <Component {...pageProps} />
      </div>
    </KBarProvider >
  );
};

function Render({ action, handlers, state }) {
  const ownRef = React.useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const active = state.index === state.activeIndex;

  React.useEffect(() => {
    if (active) {
      // wait for the KBarContent to resize, _then_ scrollIntoView.
      // https://medium.com/@owencm/one-weird-trick-to-performant-touch-response-animations-with-react-9fe4a0838116
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => {
          const element = ownRef.current;
          if (!element) {
            return;
          }
          element.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
            inline: 'start',
          });
        })
      );
    }
  }, [active]);

  return (
    <div
      ref={ownRef}
      {...handlers}
      style={{
        padding: '12px 16px',
        background: active && theme === 'light' ? '#EAEAEA' : active && theme === 'dark' ? '#2F2F2F' : 'transparent',
        borderLeft: `4px solid ${active && theme === 'light' ? 'black' : active && theme === 'dark' ? 'white' : 'transparent'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
      }}
    >
      <span>{action.name}</span>
      {action.shortcut?.length ? (
        <kbd
          style={{
            padding: '4px 6px',
            background: 'rgba(0 0 0 / .1)',
            borderRadius: '4px',
          }}
        >
          {action.shortcut}
        </kbd>
      ) : null}
    </div>
  );
}

export default App;
