sap.ui.define([
		"sap/m/MessageBox"
	],
	// eslint-disable-next-line strict
	function (MessageBox) {
		sap.ui.controller("vwks.cross.fnd.fiori.inbox.CA_FIORI_INBOXExtension.view.S2Custom", {

			_sChangeClassification: "ChangeClass",

			/**
			 * Controller Extension to add custom parameters in $filter
			 * @param {Object} oFilterOptions - Filter Options
			 * @public
			 */
			extHookGetCustomFilter: function (oFilterOptions) {
				//Clear additional filters as change classification is already getting added with 'and' condition
				oFilterOptions.additionalFilters = [];

				var aChangeClassificationFilters = [];

				for (var key in oFilterOptions.selectedFilterOptions) {
					if (oFilterOptions.selectedFilterOptions.hasOwnProperty(key) && key) {
						var aKeyParts = key.split(":");
						if (aKeyParts[0] === this._sChangeClassification) {
							var oChangeClassificationFilter = new sap.ui.model.Filter(aKeyParts[0], sap.ui.model.FilterOperator.EQ, aKeyParts[1]);
							aChangeClassificationFilters.push(oChangeClassificationFilter);
						}
					}
				}
				//Combine Change Classification filters with 'or condition'
				if (aChangeClassificationFilters.length > 0) {
					oFilterOptions.additionalFilters.push(new sap.ui.model.Filter({
						filters: aChangeClassificationFilters,
						and: false
					}));
				}
			},

			/**
			 * Controller Extension to add custom filter items
			 * @param {Array} aFilters - Filter items
			 * @public
			 */
			extHookChangeFilterItems: function (aFilters) {
				var oI18nExt = this.getView().getModel("i18n_ext").getResourceBundle();
				this._oChangeClassificationCategory = new sap.m.ViewSettingsFilterItem({
					text: oI18nExt.getText("changeClassification"),
					multiSelect: true
				});
				aFilters.push(this._oChangeClassificationCategory);

				// Get DataManager instance
				this.oDataManager = this.getOwnerComponent().getDataManager();
				this.oDataManager.oModel.read(
					"/ChangeClassificationCollection", {
						success: this._fnChangeClassificationSuccess.bind(this),
						error: this._fnChangeClassificationError.bind(this)
					}
				);
			},

			/**
			 * Success handler for Change Classification service
			 * @param {Object} oResponse - Response data
			 * @private
			 */
			_fnChangeClassificationSuccess: function (oResponse) {
				// Create filter items for change classification
				var aResults = oResponse.results;
				if (this._createFilterItem && typeof this._createFilterItem === "function") {
					for (var i = 0; i < aResults.length; i++) {
						var sChangeClassicationKey = this._sChangeClassification + ":" + aResults[i].RSNCODE;
						//Although _createFilterItem is a private method, it can be used in the extension app as per note 2118812
						var oChangeClassificationFilterItem = this._createFilterItem(sChangeClassicationKey, aResults[i].RSNTXT);
						this._oChangeClassificationCategory.addItem(oChangeClassificationFilterItem);
					}
				}
			},

			/**
			 * Error handler for Change Classification service
			 * @param {Object} oError - Error object
			 * @private
			 */
			_fnChangeClassificationError: function (oError) {
				// Handle errors
				var oI18n = this.getView().getModel("i18n_ext").getResourceBundle();
				var sDetails = this.getErrorMessage(oError);
				sap.m.MessageBox.error(oI18n.getText("changeClassificationErrorMessage"), {
					details: sDetails
				});
			},

			/**
			 * Controller Extension to add custom parameters to $select
			 * @returns {Array} Custom fields to be added in $select
			 * @public
			 */
			extHookGetPropertiesToSelect: function () {
				// Place your hook implementation code here 
				return ["ChangeClassDesc"];
			},

			/**
			 * Parse error response from backend service
			 * This method is copied from DataManager of standard My Inbox app
			 * @param {Object} oError - Error object
			 * @returns {String} Error message
			 * @public
			 */
			getErrorMessage: function (oError) {
				if (oError.response && oError.response.body && oError.response.body !== "") {
					try {
						var oMessage = JSON.parse(oError.response.body);
						return (oMessage.error.message.value ? oMessage.error.message.value : null);
					} catch (e) {
						return oError.response.body;
					}
				} else if (oError.responseText && oError.responseText !== "") {
					try {
						// eslint-disable-next-line block-scoped-var
						oMessage = JSON.parse(oError.responseText);
						// eslint-disable-next-line block-scoped-var
						return oMessage.error.message.value ? oMessage.error.message.value : null;
					} catch (e) {
						return oError.responseText;
					}
				} else if (oError instanceof Event && (oError.getParameter("responseText") || oError.getParameter("response").body)) {
					return oError.getParameter("responseText") ? oError.getParameter("responseText") : oError.getParameter("response").body;
				} else {
					return null;
				}
			}
		});

	});