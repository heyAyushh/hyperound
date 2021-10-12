export const getAvatarUrl = (username:string) => {
  const url = process.env.NEXT_PUBLIC_AVATAR_SRC + '/pixel-art-neutral/' + username + '.svg';

  return url;
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}