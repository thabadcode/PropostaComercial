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

const tableView = document.querySelector('.product-table tbody')

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
})

capCheckBox.addEventListener("change", function() {
    contentCapInput.disabled = !capCheckBox.checked;
    if (!capCheckBox.checked)  {
        contentCapInput.value = "";
    }
})