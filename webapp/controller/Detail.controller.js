sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("at.clouddna.zsapui5withodatav2.controller.Detail", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                oRoute = oRouter.getRoute("Detail");

                oRoute.attachPatternMatched(this.onPatternMatched,this);

                this.oEditModel = new JSONModel({
                    editMode: false
                });

                this.getView().setModel(this.oEditModel, "editModel");

                this.aFragments = {};

                this._loadFragment("Display");
            },

            onPatternMatched: function(oEvent){
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath);
            },

            onEditPressed: function(){
                this._onSwitchEdit();
            },

            _onSwitchEdit: function(){
                let bNewMode = !this.oEditModel.getProperty("/editMode");

                this.oEditModel.setProperty("/editMode", bNewMode);

                this._loadFragment(bNewMode ? "Edit" : "Display");
            },

            _loadFragment: function(sFragmentName){
                this.getView().byId("page").removeAllContent();

                if(this.aFragments[sFragmentName]){
                    this.getView().byId("page").addContent(this.aFragments[sFragmentName]);
                }else{
                    sap.ui.core.Fragment.load({
                        id: sap.ui.core.Fragment.createId(this.getView().getId(),sFragmentName),
                        fragmentName: "at.clouddna.zsapui5withodatav2.view.fragment." + sFragmentName,
                        type: "XML",
                        controller: this
                    }).then((oFragment) => {
                        this.aFragments[sFragmentName] = oFragment;
                        this.getView().byId("page").addContent(oFragment);
                    });
                }
            },

            onSavePressed: function(){
                this.getView().getModel().submitChanges({
                    success: () => {
                        sap.m.MessageToast.show("Successfully saved!");
                        this._onSwitchEdit();
                    },
                    error: () => {
                        sap.m.MessageToast.show("An error occured!");
                    }
                });
            },

            onCancelPressed: function(){
                this.getView().getModel().resetChanges().then(() => {
                    this._onSwitchEdit();
                });
            },

            onEditToggled: function(oEvent){
                let bNewMode = !this.oEditModel.getProperty("/editMode");

                this.oEditModel.setProperty("/editMode", bNewMode);

                if(!oEvent.getParameters().editable){
                    this.onCancelPressed();
                }
            }

            /*
            sateAvSeats: function (seatsmax, seatsocc) {
                let iDiff = seatsmax - seatsocc;

                if (iDiff <= 15) {
                    return "Error";
                } else if (iDiff <= 25) {
                    return "Warning";
                } else {
                    return "Success";
                }
            },

            iconAvSeats: function (seatsmax, seatsocc) {
                let iDiff = seatsmax - seatsocc;

                if (iDiff <= 15) {
                    return "sap-icon://message-error";
                } else if (iDiff <= 25) {
                    return "sap-icon://message-warning";
                } else {
                    return "sap-icon://message-success";
                }
            },
            */

        });
    });