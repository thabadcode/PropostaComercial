import { elements } from "./dom-map.js";
import { Controller } from "./controller.js";
import { ICONS } from "../assets/icons.js";

const controller = new Controller()

const brNumber = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
const brDate = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
})

const fieldsToWatch = [
    elements.itemForm.productInput,
    elements.itemForm.capCheckBox,
    elements.itemForm.contentCapInput,
    elements.itemForm.unitSelect,
    elements.itemForm.quantityInput,
    elements.itemForm.valuePriceInput
]

const checkFormValidity = () => {
    elements.itemForm.contentCapInput.disabled = !elements.itemForm.capCheckBox.checked;
    if (!elements.itemForm.capCheckBox.checked) {
        elements.itemForm.contentCapInput.value = "";
    }

    const hasProduct = elements.itemForm.productInput.value.trim() !== "";
    const isCapValid = elements.itemForm.capCheckBox.checked ? controller.validateNumber(elements.itemForm.contentCapInput.value, 10) !== null : true;
    const hasUnit = elements.itemForm.unitSelect.value !== "";
    const qty = controller.validateNumber(elements.itemForm.quantityInput.value);
    const price = controller.validateNumber(elements.itemForm.valuePriceInput.value);

    elements.buttons.btnAddProduct.disabled = !(hasProduct && isCapValid && hasUnit && qty !== null && price !== null);
};

elements.buttons.btnClear.addEventListener("click", function() {
    elements.generalForm.dateInput.value = "";
    elements.generalForm.clientInput.value = "";
    elements.generalForm.representativeInput.value = "";
    elements.generalForm.paymentSelect.value = "";
    elements.generalForm.observationsInput.value = "";

    clearProductForm();

    controller.clearList();

    renderTables();
})

elements.buttons.btnPdf.addEventListener("click", function () { window.print(); });

elements.buttons.btnSetToday.addEventListener("click", function() {
    elements.generalForm.dateInput.value = new Date().toISOString().split("T")[0];
    elements.pdf.dateOutputPdf.innerText = brDate.format(new Date(elements.generalForm.dateInput.value + "T12:00:00"));
});

fieldsToWatch.forEach(field => {
    field.addEventListener("input", () => {
        field.setCustomValidity("");
        checkFormValidity();
    })
});

elements.buttons.btnAddProduct.addEventListener("click", function() {
    const result = controller.addProduct(
        elements.itemForm.productInput.value,
        elements.itemForm.portageSelect.value,
        elements.itemForm.capCheckBox.checked,
        elements.itemForm.contentCapInput.value,
        elements.itemForm.unitSelect.value,
        elements.itemForm.quantityInput.value,
        elements.itemForm.valuePriceInput.value
    );

    switch (result.type) {
        case "EMPTY_DESCRIPTION":
            elements.itemForm.productInput.setCustomValidity("Produto não pode estar em branco. Digite a descrição do produto");
            elements.itemForm.productInput.reportValidity();
            break;
        case "EMPTY_UNIT":
            elements.itemForm.unitSelect.setCustomValidity("Unidade não pode estar em branco. Selecione uma unidade.");
            elements.itemForm.unitSelect.reportValidity();
            break;
        case "INVALID_QUANTITY":
            elements.itemForm.quantityInput.setCustomValidity("Quantidade inválida. Digite uma quantidade maior que 0.");
            elements.itemForm.quantityInput.reportValidity();
            break;
        case "INVALID_PRICE":
            elements.itemForm.valuePriceInput.setCustomValidity("Preço unitário inválido. Digite um Preço unitário maior que 0.");
            elements.itemForm.valuePriceInput.reportValidity();
            break;
        case "INVALID_CAP":
            elements.itemForm.contentCapInput.setCustomValidity("Teor inválido. Digite um Teor entre 0% e 11%.");
            elements.itemForm.contentCapInput.reportValidity();
            break;
        case "SUCCESS":
            clearProductForm();
            elements.itemForm.productInput.focus();
            renderTables();
            break;
    }
});

elements.table.tableView.addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;

    const index = parseInt(btn.dataset.index);
    if (btn.classList.contains("bt-trash")) {
        if (!controller.deleteProduct(index)) {
            alert("Não há produtos/serviços adicionado. Impossível excluir item inexistente.");
        }

    } else {
        let offset = 1;
        if (btn.classList.contains("bt-up")) offset = -1;
        if (btn.classList.contains("bt-down")) offset = 1;
        const result = controller.moveProduct(index, offset);

        if (result) renderTables();
        else alert("Não é possível reordenar este item: limite da lista alcançado.");
    }
    renderTables();
});

function clearProductForm() {
    elements.itemForm.productInput.value = "";
    elements.itemForm.portageSelect.value = "";
    elements.itemForm.capCheckBox.checked = false;
    elements.itemForm.contentCapInput.value = "";
    elements.itemForm.unitSelect.value = "";
    elements.itemForm.quantityInput.value = "";
    elements.itemForm.valuePriceInput.value = "";

    elements.buttons.btnAddProduct.disabled = true;
}

function renderTables() {
    const listProducts = controller.getList();
    const lengthListProduct = listProducts.length;
    let tbodyFormHTML = "";
    let tbodyPdfHTML = "";

    if (lengthListProduct === 0) {
        tbodyFormHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    Nenhum produto adicionado à proposta...
                </td>
            </tr>
        `;
        Array.from(elements.table.totalPrice).forEach(el => el.innerHTML = "R$ 0,00");
        tbodyPdfHTML = tbodyFormHTML;
    } else {
        listProducts.forEach((product, index) => {
            const isFirst = index === 0 ? "disabled" : "";
            const isLast = index === lengthListProduct - 1 ? "disabled" : "";
            tbodyFormHTML += `
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
            tbodyPdfHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${product.endDescription}</td>
                    <td>${product.unit}</td>
                    <td>${brNumber.format(product.quantity)}</td>
                    <td>R$ ${brNumber.format(product.unityPrice)}</td>
                    <td>R$ ${brNumber.format(product.subtotalPrice)}</td>
                </tr>
            `;
        });

        Array.from(elements.table.totalPrice).forEach(el =>
            el.innerHTML = `R$ ${brNumber.format(controller.getTotalPrice())}`);
    }
    elements.table.tableView.innerHTML = tbodyFormHTML;
    elements.pdf.tablePdf.innerHTML = tbodyPdfHTML;
}

elements.generalForm.dateInput.addEventListener("input", () => {
    elements.pdf.dateOutputPdf.innerText = brDate.format(new Date(elements.generalForm.dateInput.value + "T12:00:00"));
});

elements.generalForm.clientInput.addEventListener("input", () => {
    elements.pdf.clientOutputPdf.innerText = elements.generalForm.clientInput.value;
    document.title = elements.generalForm.clientInput.value === "" ? "Proposta Comercial" : "Proposta Comercial - " + elements.generalForm.clientInput.value;
});

elements.generalForm.representativeInput.addEventListener("input", () => {
    elements.pdf.representativeOutputPdf.innerText = elements.generalForm.representativeInput.value === "" ? "" : "Att. " + elements.generalForm.representativeInput.value;
});

elements.generalForm.paymentSelect.addEventListener("change", () => {
    elements.pdf.paymentOutputPdf.innerText = elements.generalForm.paymentSelect.value === "" ? "" : elements.generalForm.paymentSelect.value;
});

elements.generalForm.observationsInput.addEventListener("input", () => {
    elements.pdf.observationOutputPdf.innerText = elements.generalForm.observationsInput.value === "" ? "" : "Obs.: " + elements.generalForm.observationsInput.value;
});