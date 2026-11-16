export const MINI_PLAYER_CHANNEL = 'sorteador-online-mini-player';
export const MINI_PLAYER_QUERY_PARAM = 'mini-player';

export const MINI_PLAYER_MESSAGE = {
  READY: 'ready',
  STATE: 'state',
  DRAW: 'draw',
};

export function criarUrlMiniPlayer(href) {
  const url = new URL(href);
  url.searchParams.set(MINI_PLAYER_QUERY_PARAM, '1');
  return url.href;
}
