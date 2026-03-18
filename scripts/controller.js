export class Controller {
    listProducts= [];

    validateNumber(input) {
        const parsed = parseFloat(input);
        if (isNaN(parsed) || parsed <= 0) return null;
        return parsed;
    }

    addProduct(Product) {

    }
}