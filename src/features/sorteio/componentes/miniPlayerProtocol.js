export const MINI_PLAYER_CHANNEL = 'sorteador-online-mini-player';
export const MINI_PLAYER_QUERY_PARAM = 'mini-player';
export const MINI_PLAYER_ZOOM = {
  MIN: 0.7,
  MAX: 1.5,
  STEP: 0.1,
  DEFAULT: 1,
};

export const MINI_PLAYER_MESSAGE = {
  READY: 'ready',
  STATE: 'state',
  DRAW: 'draw',
};

export function limitarZoomMiniPlayer(zoom) {
  const limitado = Math.min(MINI_PLAYER_ZOOM.MAX, Math.max(MINI_PLAYER_ZOOM.MIN, zoom));
  return Math.round(limitado * 10) / 10;
}

export function criarUrlMiniPlayer(href) {
  const url = new URL(href);
  url.searchParams.set(MINI_PLAYER_QUERY_PARAM, '1');
  return url.href;
}

export function processarMensagemMiniPlayer({
  data,
  desabilitado,
  sortear,
  publicarEstado,
}) {
  if (data.type === MINI_PLAYER_MESSAGE.READY) {
    publicarEstado({
      type: MINI_PLAYER_MESSAGE.STATE,
      disabled: desabilitado,
    });
  }

  if (data.type === MINI_PLAYER_MESSAGE.DRAW && !desabilitado) {
    sortear(true);
  }
}
