import * as React from 'react';
import { KBarResults, KBarSearch, KBarProvider, KBarPortal, KBarPositioner, KBarAnimator, Action, ActionId, useDeepMatches } from 'kbar';
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@geist-ui/react";
import { Home, Aperture, Briefcase, Film } from "@geist-ui/react-icons";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/user";
import useUser from "../../lib/useUser";
import { ActionImpl } from "kbar/lib/action";

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

const groupNameStyle = {
  padding: "8px 16px",
  fontSize: "10px",
  textTransform: "uppercase" as const,
  opacity: 0.5,
  background: "var(--background)",
};

const App = ({ Component, pageProps }): JSX.Element => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // const { user: { username, isCreator } } = useUser({})

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
            perform: () => router.push('/creators'),
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
            section: 'Preferences',
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
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>

      <div>
        <Component {...pageProps} />
      </div>
    </KBarProvider >
  );
};

function RenderResults() {
  const { results, rootActionId } = useDeepMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId}
          />
        )
      }
    />
  );
}

// eslint-disable-next-line react/display-name
const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const { theme, setTheme } = useTheme();
    const isLight = theme === 'light';

    const ancestors = React.useMemo(() => {
      return (function collect(action: ActionImpl, ancestors = []) {
        if (action.parent && action.parent.id !== currentRootActionId) {
          ancestors.push(action.parent);
          if (action.parent.parent) {
            collect(action.parent.parent, ancestors);
          }
        }
        return ancestors;
      })(action);
    }, [action, currentRootActionId]);

    return (
      <div
        ref={ref}
        style={{
          padding: "12px 16px",
          background: active ? isLight? "#EAEAEA" : '#2F2F2F' : "transparent",
          borderLeft: `2px solid ${
            active ? isLight? "black" : 'white' : "transparent"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            fontSize: 14,
          }}
        >
          {action.icon && action.icon}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span
                      style={{
                        opacity: 0.5,
                        marginRight: 8,
                      }}
                    >
                      {ancestor.name}
                    </span>
                    <span
                      style={{
                        marginRight: 8,
                      }}
                    >
                      &rsaquo;
                    </span>
                  </React.Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && (
              <span style={{ fontSize: 12 }}>{action.subtitle}</span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div
            aria-hidden
            style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}
          >
            {action.shortcut.map((sc) => (
              <kbd
                key={sc}
                style={{
                  padding: "4px 6px",
                  background: "rgba(0 0 0 / .1)",
                  borderRadius: "4px",
                  // fontSize: 14,
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
);

export default App;
