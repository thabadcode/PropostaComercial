export class Controller {
    listProducts= [];

    validateNumber(input, fieldName) {
        const parsed = parseFloat(input);
        if (input.trim() === "") {
            return { type: "EMPTY", message: `O campo ${fieldName} não pode estar vazio.` };
        }
        if (isNaN(parsed)) {
            return { type: "INVALID_FORMAT", message: `O campo ${fieldName} deve conter apenas números.` };
        }
        if (parsed <= 0) {
            return { type: "NEGATIVE", message: `O campo ${fieldName} deve ser maior que zero.` };
        }
        return { type: "SUCCESS", value: parsed };
    }

    addProduct(Product) {

    }
}