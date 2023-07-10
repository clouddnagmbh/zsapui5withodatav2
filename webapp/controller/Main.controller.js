sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("at.clouddna.zsapui5withodatav2.controller.Main", {
            onInit: function () {
                /*
                this.getView().setModel(new sap.ui.model.json.JSONModel({
                    "FlightSet('111')": {
                        "ID": "111",
                        "AirlineID": "LH",
                        "Seats": 350
                    },
                    "FlightSet('456')": {
                        "ID": "456",
                        "AirlineID": "AUA",
                        "Seats": 250
                    }
                }));

                this.getView().byId("myVBox").bindElement("/FlightSet('111')");
                */
            },

            onNavToDetail: function(oEvent){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oListItem = oEvent.getSource(),
                    oSourceBinding = oListItem.getBindingContext(),
                    sPath = oSourceBinding.getPath();
                    
                /*
                oRouter.navTo("Detail", {
                    query: {
                        param1: "ABC",
                        param2: "123"
                    }
                });
                */
                
                oRouter.navTo("Detail", {
                    path: encodeURIComponent(sPath)
                });
            },

            onCreatePressed: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oNewContext = this.getView().getModel().createEntry("/ZRAP_CV_BOOKS");
                
                    debugger;

                oRouter.navTo("Create", {
                    path: encodeURIComponent(oNewContext.getPath())
                });
            }

            /*
            calcAvSeats: function (seatsmax, seatsocc) {
                return seatsmax - seatsocc;
            },

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
