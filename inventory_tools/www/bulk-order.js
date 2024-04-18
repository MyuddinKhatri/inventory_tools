function addRow() {
    // Get the form element
    const form = document.getElementById("line-by-line-order");

    // Create a new div for the input fields
    const newRowDiv = document.createElement("div");
    newRowDiv.className = "form-group data-row row ml-5 grid-field input-row";
    const rowDivContainer = form.getElementsByClassName("input-row-container");
    const inputRow = form.getElementsByClassName("input-row");
    const inputRowLength = inputRow.length;

    // Create two new input fields
    const newInputSku = document.createElement("input");
    newInputSku.type = "text";
    newInputSku.id = "sku_" + (inputRowLength + 1);
    newInputSku.placeholder = "SKU " + (inputRowLength + 1);
    newInputSku.className = "form-control col col-xs-6";
    newInputSku.required = "1";

    const nbsp = document.createTextNode("\u00A0");

    const newInputQty = document.createElement("input");
    newInputQty.type = "Number";
    newInputQty.id = "qty_" + (inputRowLength + 1);
    newInputQty.placeholder = "Quantity " + (inputRowLength + 1);
    newInputQty.className = "form-control col col-xs-4";
    newInputQty.min = "0";
    newInputQty.required = "1";

    // Append the new input fields to the new div
    newRowDiv.appendChild(newInputSku);
    newRowDiv.appendChild(nbsp);
    newRowDiv.appendChild(newInputQty);

    rowDivContainer[0].appendChild(newRowDiv);
}

function createQuote(isPastedString) {
    let quote_data = "";
    if (isPastedString) {
        quote_data = document.getElementById("bulk_paste").value;
    } else {
        // Get all input-rows and iterate through each to capture value
        const inputRow = document.getElementsByClassName("input-row");
        dataObject = [];
        Array.from(inputRow).forEach((element, index) => {
            let sku = document.getElementById("sku_" + (index + 1));
            let qty = document.getElementById("qty_" + (index + 1));
            dataObject.push({
                "sku": sku.value,
                "qty": qty.value
            })
        });
        quote_data = dataObject;
    }

    frappe.call({
        method: 'inventory_tools.inventory_tools.bulk_order.create_quotation',
        type: "POST",
        args: {
            "quote_data": quote_data,
            "is_processed": isPastedString
        },
        freeze: true,
        freeze_message: "Adding to Shopping Cart...",
        headers: { 'X-Frappe-CSRF-Token': frappe.csrf_token },
        callback: r => {
            window.location.href = "\cart";
        }
    })
}

function toggleCards() {
    var lineOrder = document.getElementById("line-by-line-order");
    var bulkOrder = document.getElementById("bulk-order");
    var orderType = document.getElementById("order-type-button");

    if (lineOrder.style.display === "none") {
        lineOrder.style.display = "block";
        bulkOrder.style.display = "none";
        orderType.innerHTML = "Paste products and quantities";
    } else {
        lineOrder.style.display = "none";
        bulkOrder.style.display = "block";
        orderType.innerHTML = "Build order line by line";
    }
}