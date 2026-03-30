export const elements = {
    generalForm: {
        dateInput: document.getElementById("date"),
        clientInput: document.getElementById("client"),
        representativeInput: document.getElementById("representative"),
        paymentSelect: document.getElementById("payment"),
        observationsInput: document.getElementById("observations")
    },
    itemForm: {
        productInput: document.getElementById("product"),
        portageSelect: document.getElementById("portage"),
        capCheckBox: document.getElementById("cap"),
        contentCapInput: document.getElementById("content-cap"),
        unitSelect: document.getElementById("unit"),
        quantityInput: document.getElementById("quantity"),
        valuePriceInput: document.getElementById("unit-price")
    },
    pdf: {
        dateOutputPdf: document.getElementById("pdf-date"),
        clientOutputPdf: document.getElementById("pdf-client-name"),
        representativeOutputPdf: document.getElementById("pdf-representative"),
        paymentOutputPdf: document.getElementById("pdf-payment"),
        observationOutputPdf: document.getElementById("pdf-obs"),
        tablePdf: document.querySelector('#pdf-table tbody')
    },
    buttons: {
        btnClear: document.getElementById("btn-clear"),
        btnPdf: document.getElementById("btn-create-pdf"),
        btnSetToday: document.getElementById("btn-set-today"),
        btnAddProduct: document.getElementById("btn-add-product")
    },
    table: {
        tableView: document.querySelector('.product-table tbody'),
        totalPrice: document.getElementsByClassName("total-price")
    }
}