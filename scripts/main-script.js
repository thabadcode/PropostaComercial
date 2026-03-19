import {Controller} from "./controller.js";

const controller = new Controller()

const btnClear = document.getElementById("btn-clear");
const btnPdf = document.getElementById("btn-create-pdf");
const btnSetToday = document.getElementById("btn-set-today");

const dateInput = document.getElementById("date");
const clientInput = document.getElementById("client");
const representativeInput = document.getElementById("representative");
const paymentSelect = document.getElementById("payment");
const observationsInput = document.getElementById("observations");

const productInput = document.getElementById("product");
const portageSelect = document.getElementById("portage");
const capCheckBox = document.getElementById("cap");
const contentCapInput = document.getElementById("content-cap");
const unitSelect = document.getElementById("unit");
const quantityInput = document.getElementById("quantity");
const valuePriceInput = document.getElementById("unit-price");

const btnAddProduct = document.getElementById("btn-add-product");

const tableView = document.querySelector('.product-table tbody')

const fieldsToWatch = [
    productInput,
    capCheckBox,
    contentCapInput,
    unitSelect,
    quantityInput,
    valuePriceInput
]

const checkFormValidity = () => {
    contentCapInput.disabled = !capCheckBox.checked;
    if (!capCheckBox.checked)  {
        contentCapInput.value = "";
    }

    const hasProduct = productInput.value.trim() !== "";
    let isCapValid = capCheckBox.checked ? controller.validateNumber(contentCapInput.value, 10) !== null : true;
    const hasUnit = unitSelect.value !== "";
    const qty = controller.validateNumber(quantityInput.value);
    const price = controller.validateNumber(valuePriceInput.value);

    btnAddProduct.disabled = !(hasProduct && isCapValid && hasUnit && qty !== null && price !== null);
};

btnClear.addEventListener("click", function() {
    dateInput.value = "";
    clientInput.value = "";
    representativeInput.value = "";
    paymentSelect.value = "";
    observationsInput.value = "";

    productInput.value = "";
    portageSelect.value = "";
    capCheckBox.checked = false;
    contentCapInput.value = "";
    unitSelect.value = "";
    quantityInput.value = "";
    valuePriceInput.value = "";

    btnAddProduct.disabled = true;

    tableView.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: center;">
                Nenhum produto adicionado à proposta...
            </td>
        </tr>
    `;

    // Implementar lógica para limpar lista de produtos
})

btnSetToday.addEventListener("click", function() {
    dateInput.value = new Date().toISOString().split("T")[0];
});

fieldsToWatch.forEach(filed => {
    filed.addEventListener("input", () => {
        checkFormValidity();
    })
});

btnAddProduct.addEventListener("click", function() {
    const result = controller.addProduct(
        productInput.value,
        portageSelect.value,
        capCheckBox.checked,
        contentCapInput.value,
        unitSelect.value,
        quantityInput.value,
        valuePriceInput.value
    );

    switch (result.type) {
        case "EMPTY_DESCRIPTION":
            productInput.setCustomValidity("Produto não pode estar em branco. Digite a descrição do produto");
            productInput.reportValidity();
            break;
        case "EMPTY_UNIT":
            unitSelect.setCustomValidity("Unidade não pode estar em branco. Selecione uma unidade.");
            unitSelect.reportValidity();
            break;
        case "INVALID_QUANTITY":
            quantityInput.setCustomValidity("Quantidade inválida. Digite uma quantidade maior que 0.");
            quantityInput.reportValidity();
            break;
        case "INVALID_PRICE":
            valuePriceInput.setCustomValidity("Preço unitário inválido. Digite um Preço unitário maior que 0.");
            valuePriceInput.reportValidity();
            break;
        case "INVALID_CAP":
            contentCapInput.setCustomValidity("Teor inválido. Digite um Teor entre 0% e 11%.");
            contentCapInput.reportValidity();
            break;
        case "SUCCESS":
            clearProductForm();
            productInput.focus();
            break;
    }
});