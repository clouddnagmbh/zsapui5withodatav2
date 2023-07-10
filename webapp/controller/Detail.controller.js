sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, History) {
        "use strict";

        return Controller.extend("at.clouddna.zsapui5withodatav2.controller.Detail", {

            aFragments: {},

            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                oRoute = oRouter.getRoute("Detail");

                oRoute.attachPatternMatched(this.onPatternMatched,this);

                oRouter.getRoute("Create").attachPatternMatched(this.onCreatePatternMatched,this);
            },

            onPatternMatched: function(oEvent){
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                //MessageBox.show("Param 1: " + oArguments["?query"].param1 + "\nParam2: " + oArguments["?query"].param2);

                //this.getView().bindElement(sPath);
                
                this.oEditModel = new JSONModel({
                    editMode: false,
                    create: false
                });

                this.getView().setModel(this.oEditModel, "editModel");

                this.sPath = sPath;
                this.getView().getModel().read(this.sPath, {
                    success: (oData) => {
                        this.getView().setModel(new JSONModel(oData), "detailModel");
                    }
                });

                this._loadFragment("Display");
            },

            onCreatePatternMatched: function(oEvent){
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                //MessageBox.show("Param 1: " + oArguments["?query"].param1 + "\nParam2: " + oArguments["?query"].param2);

                //this.getView().bindElement(sPath);
                
                this.oEditModel = new JSONModel({
                    editMode: true,
                    create: true
                });

                this.getView().setModel(this.oEditModel, "editModel");

                this.getView().setModel(new JSONModel({
                    ISBN: null
                }), "detailModel");

                this._loadFragment("Edit");
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
                let oDetailData = this.getView().getModel("detailModel").getData(),
                    oEditModel = this.getView().getModel("editModel").getData();

                if(oEditModel.create){
                    this.getView().getModel().create("/ZRAP_CV_BOOKS", oDetailData, {
                        success: (oCreateData) => {
                            sap.m.MessageToast.show("Successfully saved!");
                            this.onNavBack();
                        },
                        error: (oError) => {
                            sap.m.MessageToast.show("An error occured!");
                        }
                    });
                }else{
                    let sPath = this.getView().getElementBinding().getPath();

                    this.getView().getModel().update(this.sPath, oDetailData, {
                        success: (oUpdateData) => {
                            sap.m.MessageToast.show("Successfully saved!");
                            this._onSwitchEdit();
                        },
                        error: (oError) => {
                            sap.m.MessageToast.show("An error occured!");
                        }
                    });
                }
                

                /*
                let oEditModel = this.getView().getModel("editModel").getData();
                
                this.getView().getModel().submitChanges({
                    success: (oCreatedData) => {
                        sap.m.MessageToast.show("Successfully saved!");
                        this._onSwitchEdit();

                        if(oEditModel.create){
                            this.onNavBack();
                        }
                    },
                    error: (oError) => {
                        sap.m.MessageToast.show("An error occured!");
                    }
                });
                */
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
            },

            onDeletePressed: function(){
                let sPath = this.getView().getElementBinding().getPath(),
                    i18nModel = this.getView().getModel("i18n"),
                    oResourceBundle = i18nModel.getResourceBundle(),
                    sText = oResourceBundle.getText("deleteQuestion");
                MessageBox.confirm(sText, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: (sAction) => {
                        if(MessageBox.Action.YES === sAction){
                            this.getView().getModel().remove(sPath, {
                                success: () => {
                                    this.onNavBack();
                                },
                                error: (oError) => {
                                    sap.m.MessageToast.show("An error occured!");
                                }
                            });
                        }
                    }
                });
            },

            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
    
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("Main", {}, true);
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