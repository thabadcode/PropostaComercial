import {Product} from "./product-model.js";

export class Controller {
    listProducts= [];

    validateNumber(input, max = Infinity) {
        const parsed = parseFloat(input);
        if (isNaN(parsed) || parsed < 0.01 || parsed > max) return null;
        return parsed;
    }

    addProduct(Product) {

    }
}