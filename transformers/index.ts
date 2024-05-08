import { priceToTransformer } from "./priceTo.transformer";
import { wallexTransformer } from "./wallex.transformer";

export const transformers = {
    'wallex':wallexTransformer,
    'priceTo':priceToTransformer
}

