import { colors } from './colors.enum';
import { EMetricsCategory } from './metrics-category.enum';

export const METRIC_CATEGORY_COLOR_INFORMATION: Record<EMetricsCategory, { color: colors, abbreviation: string }> = {
    [EMetricsCategory.MIN]: { color: colors.LIME, abbreviation: 'Min' },
    [EMetricsCategory.MAX]: { color: colors.PINK, abbreviation: 'Max' },
    [EMetricsCategory.MEAN]: { color: colors.GREEN, abbreviation: 'Mean' },
    [EMetricsCategory.VARIANCE]: { color: colors.STONE, abbreviation: 'Variance' },
    [EMetricsCategory.STANDARD_DEVIATION]: { color: colors.PURPLE, abbreviation: 'StdDev' },
    [EMetricsCategory.COEFFICIENT_OF_VARIATION]: { color: colors.BLUE, abbreviation: 'CV' },
}
