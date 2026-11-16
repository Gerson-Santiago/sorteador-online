export function semRepeticaoEsgotada(config, numerosDisponiveis) {
  return config.semRepeticao && numerosDisponiveis.length === 0;
}
