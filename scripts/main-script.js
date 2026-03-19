/** * Icons provided by Lucide (https://lucide.dev)
 * License: ISC
 */

import {Controller} from "./controller.js";

const controller = new Controller()

const brNumber = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const ICONS = {
    trash:
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="lucide lucide-trash2-icon lucide-trash-2">
            <path d="M10 11v6"/>
            <path d="M14 11v6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
            <path d="M3 6h18"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>`,
    up:
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="lucide lucide-chevron-up-icon lucide-chevron-up">
            <path d="m18 15-6-6-6 6"/>
        </svg>`,
    down:
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="lucide lucide-chevron-down-icon lucide-chevron-down">
            <path d="m6 9 6 6 6-6"/>
        </svg>`
};

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
    if (!capCheckBox.checked) {
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

    clearProductForm();

    controller.clearList();

    renderTableView();
})

btnSetToday.addEventListener("click", function() {
    dateInput.value = new Date().toISOString().split("T")[0];
});

fieldsToWatch.forEach(field => {
    field.addEventListener("input", () => {
        field.setCustomValidity("");
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
            renderTableView();
            break;
    }
});

function clearProductForm() {
    productInput.value = "";
    portageSelect.value = "";
    capCheckBox.checked = false;
    contentCapInput.value = "";
    unitSelect.value = "";
    quantityInput.value = "";
    valuePriceInput.value = "";

    btnAddProduct.disabled = true;
}

function renderTableView() {
    const listProducts = controller.getList();
    const lengthListProduct = listProducts.length;
    let tbodyHTML = "";

    if (lengthListProduct === 0) {
        tbodyHTML += `
        <tr>
            <td colspan="6" style="text-align: center;">
                Nenhum produto adicionado à proposta...
            </td>
        </tr>
    `;
    } else {
        listProducts.forEach((product, index) => {
            const isFirst = index === 0 ? "disabled" : "";
            const isLast = index === lengthListProduct - 1 ? "disabled" : "";
            tbodyHTML += `
                <tr>
                    <td class="actions-cell">
                        <button class="bt-up" data-index="${ index }" type="button" ${isFirst}>${ICONS.up}</button>
                        <button class="bt-down" data-index="${ index }" type="button" ${isLast}>${ICONS.down}</button>
                        <button class="bt-trash" data-index="${ index }" type="button">${ICONS.trash}</button>
                    </td>
                    <td>${product.endDescription}</td>
                    <td>${product.unit}</td>
                    <td>${brNumber.format(product.quantity)}</td>
                    <td>R$ ${brNumber.format(product.unityPrice)}</td>
                    <td>R$ ${brNumber.format(product.subtotalPrice)}</td>
                </tr>
            `;
        });
    }
    tableView.innerHTML = tbodyHTML;
}