// import * as React from "react";
// import { useRegisterActions } from "kbar";
// import data from "./docs";
// import { useRouter } from "next/router";

// const searchId = randomId();

// export default function SearchDocsActions() {
//   const history = useRouter();

//   const searchActions = React.useMemo(() => {
//     const actions = [];
//     const collectDocs = (tree) => {
//       Object.keys(tree).forEach((key) => {
//         const curr = tree[key];
//         if (curr.children) {
//           collectDocs(curr.children);
//         }
//         if (curr.component) {
//           actions.push({
//             id: randomId(),
//             parent: searchId,
//             name: curr.name,
//             shortcut: [],
//             keywords: "",
//             perform: () => history.push(curr.slug),
//           });
//         }
//       });
//       return actions;
//     };
//     return collectDocs(data);
//   }, [history]);

//   const rootSearchAction = React.useMemo(
//     () =>
//       searchActions.length
//         ? {
//             id: searchId,
//             name: "Search docs…",
//             shortcut: ["?"],
//             keywords: "find",
//             section: "Documentation",
//           }
//         : null,
//     [searchActions]
//   );

//   useRegisterActions([rootSearchAction, ...searchActions].filter(Boolean));

//   return null;
// }

// function randomId() {
//   return Math.random().toString(36).substring(2, 9);
// }