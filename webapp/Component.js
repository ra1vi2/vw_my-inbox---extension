jQuery.sap.declare("vwks.cross.fnd.fiori.inbox.CA_FIORI_INBOXExtension.Component");

// use the load function for getting the optimized preload file if present
sap.ui.component.load({
	name: "cross.fnd.fiori.inbox",
	// Use the below URL to run the extended application when SAP-delivered application is deployed on SAPUI5 ABAP Repository
	url: "/sap/bc/ui5_ui5/sap/CA_FIORI_INBOX"
	// we use a URL relative to our own component
	// extension application is deployed with customer namespace
});
sap.ui.define(["cross/fnd/fiori/inbox/Component"], function (oStdComponent) {
	return oStdComponent.extend("vwks.cross.fnd.fiori.inbox.CA_FIORI_INBOXExtension.Component", {
		metadata: {
			manifest: "json"
		},

		/**
		 * As part of incidnet 77241 we are enhancing the standard resource i18n model with our custom resource model.
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			oStdComponent.prototype.init.apply(this, arguments);
			// Fetching standard component i18n model
			var oModel = this.getModel("i18n");
			// enhancing the standard resource i18n model with our custom resource i18n_ext model 
			oModel.enhance(this.getModel("i18n_ext").getResourceBundle());
		}
	});
});