export class Product {
    constructor(endDescription, unit, quantity, unityPrice, subtotalPrice) {
        this.endDescription = endDescription;
        this.unit = unit;
        this.quantity = quantity;
        this.unityPrice = unityPrice;
        this.subtotalPrice = subtotalPrice;
    }
} // Tem uma forma mais enxuta de isso aqui ser feito? Tô sendo acusado de unused variável