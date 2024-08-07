sap.ui.define([
    "vwks/nlp/s2p/mm/reuse/lib/documentHistory/type/ApplicationType",
    "vwks/nlp/s2p/mm/reuse/lib/documentHistory/DocumentHistoryHelper",
    "sap/m/library"
], function (ApplicationType, DocumentHistoryHelper, Library) {
    sap.ui.controller("vwks.cross.fnd.fiori.inbox.CA_FIORI_INBOXExtension.view.S3Custom", {

		/**
		 * Standard extension hook to add button to the footer.
		 * @param {object} oCustomizingObject object with footer buttons related info
		 */
        extHookChangeFooterButtons: function (oCustomizingObject) {
            var sGUILink = this.getView().getBindingContext().getObject("GUI_Link");
            var bIsBrandContractItem = !!~sGUILink.indexOf("C_CentralPurchaseContractTP");
            var bIsPOItem = !!~sGUILink.indexOf("C_CentralPurchaseOrderTP");
            var bDocumentHistoryVisible = bIsBrandContractItem || bIsPOItem;
            var bPrintPreviewVisible = bIsBrandContractItem;

            if (!bDocumentHistoryVisible) {
                return;
            }
            
            this._bIsBrandContractItem = bIsBrandContractItem;
            var oDocumentHistory = {
                iDisplayOrderPriority: 220,
                onBtnPressed: this.handlePress.bind(this),
                sI18nBtnTxt: this.getModel("i18n_ext").getProperty("documentHistoryBtn"),
                sId: "idDocHistory"
            };
            oCustomizingObject.aButtonList.push(oDocumentHistory);

            if (!bPrintPreviewVisible){
                return;
            }
            var oPrintPreview = {
                iDisplayOrderPriority: 210,
                onBtnPressed: this.handlePrintPreviewPress.bind(this),
                sI18nBtnTxt: this.getModel("i18n_ext").getProperty("printPreview"),
                sId: "idoPrintPreview"
            };
            oCustomizingObject.aButtonList.push(oPrintPreview);
        },

		/**
		 * Document History button press event hansler.
		 * @param {sap.ui.base.Event} oEvent press event object
		 */
        handlePress: function (oEvent) {
            var oDetailPageBindingContext = sap.ui.getCore().byId("inb_VFMwMDgwMDYwN0xPQ0FMX1RHVw---templateView").getBindingContext();
            var sApplicationType = this._bIsBrandContractItem ? ApplicationType.MCPC_HEADER : ApplicationType.MPOC_HEADER;
            DocumentHistoryHelper.openDocumentHistoryDialog(oEvent, this.getView(), sApplicationType, oDetailPageBindingContext);
        },

        /**
         * Print Preview button handler for Brand contract
         */
        handlePrintPreviewPress: function () {
            var oDetailPageBindingContextforPrint = sap.ui.getCore().byId("inb_VFMwMDgwMDYwN0xPQ0FMX1RHVw---templateView").getBindingContext();
            var sContract = oDetailPageBindingContextforPrint.getProperty("CentralPurchaseContract");
            if (sContract.includes("#")) {
                sContract = "";
            }
            var sDraftId = oDetailPageBindingContextforPrint.getProperty("DraftUUID");
            var oURLHelper = Library.URLHelper;
            oURLHelper.redirect("/sap/opu/odata/SAP/MM_PUR_CNTRL_CTR_MAINTAIN_SRV/PrintPreview(" + "CentralPurchaseContract='" + sContract +
                "'," + "DraftUUID=guid'" + sDraftId + "'," + "Language='" + sap.ui.getCore().getConfiguration().getLanguage() + "'" + ")/$value/", true);
        }
    });
});