import * as React from 'react';
import { KBarResults, KBarSearch, KBarProvider, KBarPortal, KBarPositioner, KBarAnimator, Action, ResultHandlers, ResultState } from 'kbar';
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@geist-ui/react";
import { Home, Aperture, Briefcase, Film } from "@geist-ui/react-icons";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/user";

const searchStyle = {
  padding: "12px 16px",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box" as React.CSSProperties["boxSizing"],
  outline: "none",
  border: "none",
  background: "var(--background)",
  color: "var(--foreground)",
};

const resultsStyle = {
  maxHeight: 400,
  overflow: "auto",
};

const App = ({ Component, pageProps }): JSX.Element => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const { username, isCreator } = useRecoilValue(userState)

  const isMobile = useMediaQuery('mobile');

  const animatorStyle = {
    maxWidth: isMobile ? "300px" : "500px",
    width: "100%",
    marginRight: isMobile ? '32px' : '0px',
    background: theme === 'light' ? 'white' : 'black',
    borderRadius: "8px",
    boxShadow: theme === 'light' ? '0 30px 60px rgba(0, 0, 0, 0.12)' : '0px -1px 143px 31px rgba(250,240,240,0.2)',
  };

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
            icon: <Home className="m-2 text-dark-accent-2" size={20} />,
            subtitle: "Browse the awesome feed!"
          },
          {
            id: 'exploreAction',
            name: 'Explore',
            shortcut: ['d'],
            keywords: 'help',
            section: 'Navigation',
            perform: () => router.push('/explore'),
            icon: <Film className="m-2 text-dark-accent-2" size={20} />,
            subtitle: "",
          },
          {
            id: 'creatorAction',
            name: 'Creators',
            shortcut: ['c'],
            keywords: 'email hello',
            section: 'Navigation',
            perform: () => isCreator && username ? router.push(`${username}/creator`) : router.push('/creators'),
            icon: <Briefcase className="m-2 text-dark-accent-2" size={20} />,
            subtitle: "",
          },
          {
            id: 'coinsAction',
            name: 'Hypecoins',
            shortcut: ['4'],
            keywords: 'buy hypecoins coins ',
            section: 'Navigation',
            // perform: () => window.open('https://twitter.com/timcchang', '_blank'),
            perform: () => router.push('/coins'),
            icon: <Aperture className="m-2 text-dark-accent-2" size={20} />,
            subtitle: "Buy, Sell, Check Balance",
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
        },
      }}
    >
      <KBarPortal>
        <KBarPositioner
          className="backdrop-blur-lg"
        >
          <KBarAnimator style={animatorStyle}>
            <KBarSearch
              style={searchStyle}
              placeholder="Type a command or search…"
            />
            <KBarResults
              style={resultsStyle}
              onRender={(action, handlers, state) => (
                <Render action={action} handlers={handlers} state={state} />
              )}
            />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>

      <div>
        <Component {...pageProps} />
      </div>
    </KBarProvider >
  );
};

function Render({
  action,
  handlers,
  state,
}: {
  action: Action;
  handlers: ResultHandlers;
  state: ResultState;
}) {
  const ownRef = React.useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const active = state.index === state.activeIndex;

  React.useEffect(() => {
    if (active) {
      // wait for the KBarAnimator to resize, _then_ scrollIntoView.
      // https://medium.com/@owencm/one-weird-trick-to-performant-touch-response-animations-with-react-9fe4a0838116
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => {
          const element = ownRef.current;
          if (!element) {
            return;
          }
          element.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
            inline: "start",
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
        padding: "12px 16px",
        background: active && theme === 'light' ? '#EAEAEA' : active && theme === 'dark' ? '#2F2F2F' : 'transparent',
        borderLeft: `4px solid ${active && theme === 'light' ? 'black' : active && theme === 'dark' ? 'white' : 'transparent'}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {action.icon && action.icon}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>{action.name}</span>
          {action.subtitle && (
            <span style={{ fontSize: 12 }}>{action.subtitle}</span>
          )}
        </div>
      </div>
      {action.shortcut?.length ? (
        <div style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}>
          {action.shortcut.map((sc) => (
            <kbd
              key={sc}
              style={{
                padding: "4px 6px",
                background: "rgba(0 0 0 / .1)",
                borderRadius: "4px",
              }}
            >
              {sc}
            </kbd>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function HomeIcon() {
  return (
    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m19.681 10.406-7.09-6.179a.924.924 0 0 0-1.214.002l-7.06 6.179c-.642.561-.244 1.618.608 1.618.51 0 .924.414.924.924v5.395c0 .51.414.923.923.923h3.236V14.54c0-.289.234-.522.522-.522h2.94c.288 0 .522.233.522.522v4.728h3.073c.51 0 .924-.413.924-.923V12.95c0-.51.413-.924.923-.924h.163c.853 0 1.25-1.059.606-1.62Z"
        fill="var(--foreground)"
      />
    </svg>
  );
}

export default App;
