import { elements } from "./dom-map.js";
import {Product} from "./product-model.js";

export const stateStorage = {
    saveStorage(listItens) {
        const data = {
            date: elements.generalForm.dateInput.value,
            client: elements.generalForm.clientInput.value,
            representative: elements.generalForm.representativeInput.value,
            payment: elements.generalForm.paymentSelect.value,
            observation: elements.generalForm.observationsInput.value,
            listItens: listItens
        }

        try {
            localStorage.setItem("currentProposal", JSON.stringify(data));
        } catch (error) {
            console.error("Erro ao salvar os dados: ", error);
        }
    },

    loadStorage() {
        try {
            const saved = localStorage.getItem("currentProposal");
            if (!saved) return [];
            const data = JSON.parse(saved);
            elements.generalForm.dateInput.value = data.date || "";
            elements.generalForm.clientInput.value = data.client || "";
            elements.generalForm.representativeInput.value = data.representative || "";
            elements.generalForm.paymentSelect.value = data.payment || "";
            elements.generalForm.observationsInput.value = data.observation || "";
            return (data.listItens || []).map(item =>
                new Product(
                    item.endDescription,
                    item.unit,
                    item.quantity,
                    item.unityPrice,
                    item.subtotalPrice
                )
            );
        } catch (error) {
            console.error("Erro ao carregar os dados: ", error);
            return [];
        }
    }
}