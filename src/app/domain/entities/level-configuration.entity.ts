export interface LevelConfiguration {
  mode              : 'FORMULA' | 'CUSTOM_TABLE';

  formulaParams    ?: {
    baseXp          : number;
    multiplier      : number;
  };

  customThresholds ?: Record<number, number>;
}
