/**
 * Simulates syncing customer data with an ERP system.
 */
export const syncCustomerToERP = async (customerData) => {
    console.log("--- SIMULATING ERP CUSTOMER SYNC ---");
    console.log("Syncing customer:", customerData);

    return new Promise(resolve => setTimeout(() => {
        const response = {
            status: 'Success',
            erpCustomerId: `ERP_${customerData.id}`,
            message: 'Customer synced successfully with ERP.'
        };
        console.log("--- ERP Customer Sync Success ---");
        resolve(response);
    }, 800));
};


/**
 * Simulates posting a finalized invoice to the accounting module of an ERP.
 */
export const postInvoiceToERP = async (invoiceData) => {
    console.log("--- SIMULATING ERP INVOICE POSTING ---");
    console.log("Posting invoice:", invoiceData);

    return new Promise(resolve => setTimeout(() => {
        const response = {
            status: 'Success',
            journalEntryId: `JE_${Date.now()}`,
            message: `Invoice ${invoiceData.id} posted to ERP successfully.`
        };
        console.log("--- ERP Invoice Posting Success ---");
        resolve(response);
    }, 1200));
};