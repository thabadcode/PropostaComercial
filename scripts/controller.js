import {Product} from "./product-model.js";

export class Controller {
    #listProducts = [];

    validateNumber(input, max = Infinity) {
        const parsed = parseFloat(input);
        if (isNaN(parsed) || parsed < 0.01 || parsed > max) return null;
        return parsed;
    }

    addProduct(description, portage, cap, contentCap, unit, quantity, price) {
        if (description === "") return { type: "EMPTY_DESCRIPTION"};
        if (unit === "") return { type: "EMPTY_UNIT"};
        const validQty = this.validateNumber(quantity);
        if (validQty === null) return { type: "INVALID_QUANTITY"};
        const validPrice = this.validateNumber(price);
        if (validPrice === null) return { type: "INVALID_PRICE"};

        let endDescription = description;
        if (portage !== "") endDescription += ` - ${portage}`;
        if (cap) {
            if (this.validateNumber(contentCap, 10) === null) return { type: "INVALID_CAP" };
            endDescription += ` - CAP por conta do cliente - Teor ${contentCap}%`;
        }

        const newProduct = new Product(endDescription,
            unit,
            validQty,
            validPrice,
            validQty * validPrice);
        this.#listProducts.push(newProduct);
        return { type: "SUCCESS" };
    }

    clearList() { this.#listProducts = []; }

    getList() { return this.#listProducts; }
}