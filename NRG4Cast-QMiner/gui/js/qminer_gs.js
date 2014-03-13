// TODO query examples

////////////////////////////////////////////////////////////////////

var Qm = {}

///////////////////////////
// Qm "members"

Qm.StoresData = null;
Qm.CurrentStore = null;
Qm.CurrentStoreData = null;
Qm.QuickInfo = null;

Qm.DemoData = {
    Stores: { "stores": [{ "storeId": 12, "storeName": "Visit1", "storeRecords": 0, "fields": [{ "fieldId": 0, "fieldName": "Cookie", "valueType": "STRING", "featureType": "NONE", "aggregationType": "NONE", "displayType": "NONE", "keys": [{ "keyId": 0 }, { "keyId": 1 }, { "keyId": 2}], "is_small_string": true, "location": "c", "use_as_name": false, "use_codebook": false }, { "fieldId": 1, "fieldName": "URL", "valueType": "STRING", "featureType": "NONE", "aggregationType": "NONE", "displayType": "TEXT", "is_small_string": false, "location": "c", "use_as_name": false, "use_codebook": false }, { "fieldId": 2, "fieldName": "ServerTime", "valueType": "DATE-TIME", "featureType": "DATE-TIME", "aggregationType": "NONE", "displayType": "TEXT", "is_small_string": false, "location": "c", "use_as_name": false, "use_codebook": false}], "keys": [{ "keyId": 0, "keyName": "Cookie", "keyText": false, "aggregation": false, "wordVoc": { "wordVocId": 0, "values": 0 }, "fields": [{ "fieldId": 0}] }, { "keyId": 1, "keyName": "URL", "keyText": false, "aggregation": false, "wordVoc": { "wordVocId": 0, "values": 0 }, "fields": [{ "fieldId": 0}] }, { "keyId": 2, "keyName": "ServerTime", "keyText": false, "aggregation": false, "wordVoc": { "wordVocId": 0, "values": 0 }, "fields": [{ "fieldId": 0}]}], "joins": [], "time_window_source_field": "", "time_window_source_field_id": 0, "sys_inserted_at_field": "_sys_inserted_at", "window_size": 1, "window_type": 1 }, { "storeId": 32, "storeName": "Visit2", "storeRecords": 0, "fields": [{ "fieldId": 0, "fieldName": "Cookie", "valueType": "STRING", "featureType": "NONE", "aggregationType": "NONE", "displayType": "NONE", "keys": [{ "keyId": 3 }, { "keyId": 4 }, { "keyId": 5}], "is_small_string": true, "location": "c", "use_as_name": false, "use_codebook": false }, { "fieldId": 1, "fieldName": "URL", "valueType": "STRING", "featureType": "NONE", "aggregationType": "NONE", "displayType": "TEXT", "is_small_string": false, "location": "c", "use_as_name": false, "use_codebook": false }, { "fieldId": 2, "fieldName": "ServerTime", "valueType": "DATE-TIME", "featureType": "DATE-TIME", "aggregationType": "NONE", "displayType": "TEXT", "is_small_string": false, "location": "c", "use_as_name": false, "use_codebook": false}], "keys": [{ "keyId": 3, "keyName": "Cookie", "keyText": false, "aggregation": false, "wordVoc": { "wordVocId": 0, "values": 0 }, "fields": [{ "fieldId": 0}] }, { "keyId": 4, "keyName": "URL", "keyText": false, "aggregation": false, "wordVoc": { "wordVocId": 0, "values": 0 }, "fields": [{ "fieldId": 0}] }, { "keyId": 5, "keyName": "ServerTime", "keyText": false, "aggregation": false, "wordVoc": { "wordVocId": 0, "values": 0 }, "fields": [{ "fieldId": 0}]}], "joins": [], "time_window_source_field": "ServerTime", "time_window_source_field_id": 2, "sys_inserted_at_field": "_sys_inserted_at", "window_size": 1.44e+006, "window_type": 2 }, { "storeId": 43, "storeName": "Visit3", "storeRecords": 0, "fields": [{ "fieldId": 0, "fieldName": "Cookie", "valueType": "STRING", "featureType": "NONE", "aggregationType": "NONE", "displayType": "NONE", "keys": [{ "keyId": 6 }, { "keyId": 7 }, { "keyId": 8}], "is_small_string": true, "location": "c", "use_as_name": false, "use_codebook": false }, { "fieldId": 1, "fieldName": "URL", "valueType": "STRING", "featureType": "NONE", "aggregationType": "NONE", "displayType": "TEXT", "is_small_string": false, "location": "c", "use_as_name": false, "use_codebook": false }, { "fieldId": 2, "fieldName": "ServerTime", "valueType": "DATE-TIME", "featureType": "DATE-TIME", "aggregationType": "NONE", "displayType": "TEXT", "is_small_string": false, "location": "c", "use_as_name": false, "use_codebook": false }, { "fieldId": 3, "fieldName": "_sys_inserted_at", "valueType": "DATE-TIME", "featureType": "NONE", "aggregationType": "NONE", "displayType": "NONE", "is_small_string": false, "location": "c", "use_as_name": false, "use_codebook": false}], "keys": [{ "keyId": 6, "keyName": "Cookie", "keyText": false, "aggregation": false, "wordVoc": { "wordVocId": 0, "values": 0 }, "fields": [{ "fieldId": 0}] }, { "keyId": 7, "keyName": "URL", "keyText": false, "aggregation": false, "wordVoc": { "wordVocId": 0, "values": 0 }, "fields": [{ "fieldId": 0}] }, { "keyId": 8, "keyName": "ServerTime", "keyText": false, "aggregation": false, "wordVoc": { "wordVocId": 0, "values": 0 }, "fields": [{ "fieldId": 0}]}], "joins": [], "time_window_source_field": "_sys_inserted_at", "time_window_source_field_id": 3, "sys_inserted_at_field": "_sys_inserted_at", "window_size": 1000, "window_type": 2 }, { "storeId": 53, "storeName": "VisitAll", "storeRecords": 0, "fields": [{ "fieldId": 0, "fieldName": "Cookie", "valueType": "STRING", "featureType": "NONE", "aggregationType": "NONE", "displayType": "NONE", "keys": [{ "keyId": 9 }, { "keyId": 10 }, { "keyId": 11}], "is_small_string": true, "location": "c", "use_as_name": false, "use_codebook": false }, { "fieldId": 1, "fieldName": "URL", "valueType": "STRING", "featureType": "NONE", "aggregationType": "NONE", "displayType": "TEXT", "is_small_string": false, "location": "c", "use_as_name": false, "use_codebook": false }, { "fieldId": 2, "fieldName": "ServerTime", "valueType": "DATE-TIME", "featureType": "DATE-TIME", "aggregationType": "NONE", "displayType": "TEXT", "is_small_string": false, "location": "c", "use_as_name": false, "use_codebook": false}], "keys": [{ "keyId": 9, "keyName": "Cookie", "keyText": false, "aggregation": false, "wordVoc": { "wordVocId": 0, "values": 0 }, "fields": [{ "fieldId": 0}] }, { "keyId": 10, "keyName": "URL", "keyText": false, "aggregation": false, "wordVoc": { "wordVocId": 0, "values": 0 }, "fields": [{ "fieldId": 0}] }, { "keyId": 11, "keyName": "ServerTime", "keyText": false, "aggregation": false, "wordVoc": { "wordVocId": 0, "values": 0 }, "fields": [{ "fieldId": 0}]}], "joins": [], "time_window_source_field": "", "time_window_source_field_id": 0, "sys_inserted_at_field": "_sys_inserted_at", "window_size": 0, "window_type": 0}], "index_path": "..\/..\/output\/data\/" },
    QuickInfo: { "stores": 4, "records": 0, "store_with_max_records": { "name": "", "records": 0} }
};

// "namespaces"
Qm.Utils = {};
Qm.Main = {};
Qm.Admin = {};
Qm.StoreList = {};

///////////////////////////
// Qm "methods"

Qm.Main.GarbageCollect = function () {
    $("#btnGc").hide();
    $("#spanGcStatus").show();
    $.getJSON('/gs_gc', function (result) {
        $("#spanGcSuccess").show();
        $("#spanGcStatus").hide();
        setTimeout(function(){ 
            $("#btnGc").show();
            $("#spanGcSuccess").hide();
        }, 1500);
    });
}

Qm.Main.ShowQuickInfo = function () {
    if (Qm.QuickInfo == null) {
        $.getJSON('/gs_quick_info', function (result) {
            Qm.QuickInfo = result;
            Qm.Main.ShowQuickInfoCallback();
        });
    } else {
        Qm.Main.ShowQuickInfoCallback();
    }
}

Qm.Main.ShowQuickInfoCallback = function () {
    $("#spanQiStores").text(Qm.QuickInfo.stores);
    $("#spanQiRecords").text(Qm.QuickInfo.records);
    $("#spanQiMaxRecStore").text(Qm.QuickInfo.store_with_max_records.name);
    $("#spanQiMaxRecStoreCnt").text(Qm.QuickInfo.store_with_max_records.records);
}


////////////////////////////////

Qm.ClearData = function () {
    Qm.StoresData = null;
    Qm.CurrentStore = null;
    Qm.CurrentStoreData = null;
    Qm.QuickInfo = null;
}

///////////////////////////////

Qm.StoreList.DrawStoreList = function () {
    //Qm.StoresData = Qm.DemoData.Stores; // uncomment to use demo data
    if (Qm.StoresData == null) {
        $.getJSON('/gs_store_def', function (result) {
            Qm.StoresData = result;
            Qm.StoreList.DrawStoreListInner();
        });
    } else {
        Qm.StoreList.DrawStoreListInner();
    }
}
Qm.StoreList.DrawStoreListInner = function () {
    var ul = $("#ulStoreList");
    if (Qm.StoresData.stores.length == 0) {
        $("#divStoreList").text("No store defined");
    } else {
        for (var i = 0; i < Qm.StoresData.stores.length; i++) {
            var store = Qm.StoresData.stores[i];
            for (var j = 0; j < store.fields.length; j++) {
                store.fields[j].is_in_cache = (store.fields[j].location == "c");
                store.fields[j].location_str = (store.fields[j].location == "c" ? "cache" : "memory");
            }
            for (var j = 0; j < store.joins.length; j++) {
                store.joins[j].is_index = (store.joins[j].joinType == "index");
            }
            for (var j = 0; j < store.keys.length; j++) {
                var key = store.keys[j];
                var field_names = [];
                for (var k = 0; k < key.fields.length; k++) {
                    var fn = Qm.Utils.GetFieldById(store, key.fields[k].fieldId).fieldName;
                    key.fields[k].fieldName = fn;
                    field_names.push(fn);
                }
                key.field_names = field_names.join(", ");
            }
        }
        var source = $("#tmplTableListItem").html();
        var template = Handlebars.compile(source);
        $("#divStoreList").html(template(Qm.StoresData));
    }
}

Qm.StoreList.DrawStoreInfo = function (_current_store) {
    Qm.CurrentStore = _current_store;
    if (Qm.StoresData == null) {
        $.getJSON('/stores', function (result) {
            Qm.StoresData = result;
            Qm.StoreList.DrawStoreInfoInner();
        });
    } else {
        Qm.StoreList.DrawStoreInfoInner();
    }
}

Qm.StoreList.DrawStoreInfoInner = function () {
    Qm.CurrentStoreData = null;
    for (var i = 0; i < Qm.StoresData.stores.length; i++) {
        var store = Qm.StoresData.stores[i];
        if (store.storeName == Qm.CurrentStore) {
            Qm.CurrentStoreData = store;
            break;
        }
    }
    if (Qm.CurrentStoreData == null) {
        Qm.Utils.ShowError("Couldn't find store with name '" + Qm.CurrentStore + "'");
        return;
    }

    $("#spanStoreName").text(store.storeName);

    var window_str = "";
    if (store.window_type == 0) {
        window_str = "No window for store data.";
    } else if (store.window_type == 1) {
        window_str = "<span class='icon'><i class='icon-resize-horizontal'></i></span> Simple length window for store data - length = " + store.window_size;
    } else {
        var s_ms = Qm.Utils.GetMsAsTimeStr(store.window_size);
        window_str = "<span class='icon'><i class='icon-time'></i></span> Time-driven window length for store data - field = " + store.time_window_source_field + ", size = " + s_ms;
    }
    $("#divWindowDesc").html(window_str);

    var source = $("#tmplIndex").html();
    var template = Handlebars.compile(source);
    $("#divIndexList").html(template(store));

    source = $("#tmplJoin").html();
    template = Handlebars.compile(source);
    $("#divJoinList").html(template(store));

    source = $("#tmplField").html();
    template = Handlebars.compile(source);
    $("#divFieldList").html(template(store));

    $("#divMain").show();
}

////////////////////////////////////////////////////////////////
// utils

Qm.Utils.GetFieldById = function (store_obj, id) {
    for (var i = 0; i < store_obj.fields.length; i++) {
        var field = store_obj.fields[i];
        if (field.fieldId == id)
            return field;
    }
    return null;
}

Qm.Utils.ShowError = function (err_str) {
    $("#spanErrorText").text(err_str);
    $("#divError").show();
}

Qm.Utils.GetMsAsTimeStr = function (ms) {
    var res = "" + (ms % 1000) + " msec";
    ms = Math.round(ms / 1000);
    if (ms > 0) {
        res = "" + (ms % 60) + " sec " + res;
        ms = Math.round(ms / 60);
        if (ms > 0) {
            res = "" + (ms % 60) + " min " + res;
            ms = Math.round(ms / 60);
            if (ms > 0) {
                res = "" + (ms % 24) + " h " + res;
                ms = Math.round(ms / 24);
                if (ms > 0) {
                    res = "" + ms + " days " + res;
                }
            }
        }
    }
    return res;
}

Qm.Utils.IsEmptyStr = function (s) { return (s == null || s.trim() == ""); }
Qm.Utils.IsInt = function (s, allow_negative) {
    if (s.length == 0) return false;
    var i = parseInt(s);
    if (i == NaN) return false;
    if (!allow_negative && i < 0) return false;
    return true;
}
Qm.Utils.IsEmptyArray = function (a) { return a.length == 0; }
//////////////////////////////////////////////////////////////
// admin

Qm.Admin.CreateField = function () {
    var self = this;

    self.name = ko.observable("Field");
    self.primary = false;
    self.type = "string";
    self.featureType = "none";
    self.aggregationType = "none";
    self.displayType = "none";
    self.store = "cache";
    self.default_val = null;
    self.codebook = false;
    self.shortstring = true;

    self.CreateRequest = function () {
        var res = {};
        res.name = self.name();
        res.primary = self.primary;
        res.type = self.type;
        res.featureType = self.featureType;
        res.aggregationType = self.aggregationType;
        res.displayType = self.displayType;
        res.store = self.store;
        res.codebook = self.codebook;
        res.shortstring = self.shortstring;
        if (self.default_val != null && self.default_val.trim() != "")
            eval("res.default_val = " + self.default_val);
        return res;
    }
}

Qm.Admin.CreateStore = function () {
    var self = this;
    self.id = "";
    self.name = ko.observable("NewStore");
    self.fields = ko.observableArray();
    self.indexes = ko.observableArray();
    self.joins = ko.observableArray();
    self.window_type = ko.observable("None");
    self.window_len = 1000000;
    self.window_unit = "hour";
    self.window_field = "";
    self.field_names = ko.computed(function () {
        var res = [];
        $.each(self.fields(), function () { res.push(this.name); });
        res.sort();
        return res;
    });
    self.field_names2 = ko.computed(function () {
        var res = ["-"];
        $.each(self.fields(), function () { res.push(this.name); });
        res.sort();
        return res;
    });

    self.display_error_message = ko.observable(false);
    self.errors = ko.observableArray();
    self.error_msg = ko.observable(null);

    self.Validate = function () {
        self.errors.removeAll();

        // missing store name
        if (Qm.Utils.IsEmptyStr(self.name())) {
            self.errors.push("Missing store name");
        }
        // id is not int
        if (!Qm.Utils.IsEmptyStr(self.id) && !Qm.Utils.IsInt(self.id)) {
            self.errors.push("Store id not valid");
        }

        var primary_field = null;
        var fields_map = {};

        $.each(self.fields(), function () {
            var field = this;

            // missing field name
            var fn = field.name();
            if (Qm.Utils.IsEmptyStr(fn)) {
                self.errors.push("Missing field name");
            }
            // duplicate field name
            if (fields_map[fn] != null) {
                self.errors.push("Duplicate field name: " + fn);
            } else {
                fields_map[fn] = true;
            }

            // more than 1 primary field in per store
            if (field.primary) {
                if (primary_field != null) {
                    self.errors.push("Multiple fields marked as primary.");
                } else {
                    primary_field = field.primary;
                }
            }
            // validate default value (eval must pass)
            if (field.default_val != null && field.default_val.trim() != "") {
                try {
                    eval("var xyz = " + field.default_val);
                } catch (e) {
                    self.errors.push("Invalid default value for field " + fn);
                }
            }
        });

        var index_map = {};
        $.each(self.indexes(), function () {
            var index = this;
            name = index.field;

            // missing index name
            var name = index.name;
            if (Qm.Utils.IsEmptyStr(name)) {
                name = index.field;
            }
            // duplicate index name
            if (index_map[name] != null) {
                self.errors.push("Duplicate index name: " + name);
            } else {
                index_map[name] = true;
            }
        });

        var joins_map = {};
        $.each(self.joins(), function () {
            var join = this;

            // missing join name
            if (Qm.Utils.IsEmptyStr(join.name)) {
                self.errors.push("Missing join name");
            }
            // duplicate join name
            if (joins_map[join.name] != null) {
                self.errors.push("Duplicate join name: " + join.name);
            } else {
                joins_map[join.name] = true;
            }
        });

        if (primary_field == null)
            self.errors.push("No primary field defined.");

        // check if window field exists
        if (self.window_type == "Time" && self.window_field != "" && self.window_field != null) {

        }

        self.display_error_message(self.errors().length > 0);
        self.error_msg(self.errors().length > 0 ? self.errors().join("<br/>") : null);
        return !self.display_error_message();
    }

    self.AddField = function () {
        self.fields.push(new Qm.Admin.CreateField());
    };

    self.AddIndex = function () {
        self.indexes.push({
            field: "",
            name: "",
            type: "value",
            vocabulary: "",
            field_names: self.field_names /*ko.computed(function () {
                var res = [];
                $.each(self.fields(), function () { res.push(this.name); });
                res.sort();
                return res;
            })*/
        });
    };

    self.AddJoin = function () {
        self.joins.push({ name: "Join", type: "index", store: "" });
    };

    self.CreateRequest = function () {
        var store_req = {};
        store_req.fields = [];
        store_req.joins = [];
        store_req.keys = [];
        store_req.name = self.name();

        if (self.id != "" && self.id != null)
            store_req.id = self.id;

        if (self.window_type == "Fixed") {
            store_req.window = parseInt(self.window_len);
        } else if (self.window_type == "Time") {
            store_req.timeWindow = {};
            store_req.timeWindow.duration = parseInt(self.window_len);
            store_req.timeWindow.unit = self.window_unit;
            if (self.window_field != null && self.window_field.trim() != "" && self.window_field.trim() != "-")
                store_req.timeWindow.field = self.window_field;
        }

        $.each(self.fields(), function () { store_req.fields.push(this.CreateRequest()); });

        $.each(self.indexes(), function () {
            var obj = { field: this.field, type: this.type };
            if (this.name != "") obj.name = this.name;
            if (this.vocabulary != "") obj.vocabulary = this.vocabulary;
            store_req.keys.push(obj);
        });

        $.each(self.joins(), function () {
            var obj = { name: this.name, type: this.type, store: this.store };
            store_req.joins.push(obj);
        });
        return store_req;
    }

    // by default add one field
    self.AddField();
}

Qm.Admin.CreateModel = function () {
    var self = this;
    self.types = ["int", "int_v", "uint64", "string", "string_v", "bool", "float", "float_v", "float_pair", "datetime"];
    self.join_types = ["index", "field"];
    self.index_types = ["value", "text"];
    self.display_types = ["none", "text", "map"];
    self.feature_types = ["none", "numeric", "multinom", "token", "spnum", "datetime"];
    self.aggr_types = ["none", "histogram", "pie_chart", "timeline", "keywords", "scalar"];
    self.store_types = ["memory", "cache"];
    self.time_window_units = ["hour", "minute", "second", "day", "month", "week"];
    self.window_types = ["None", "Fixed", "Time"];

    self.stores = ko.observableArray();
    self.errors = ko.observableArray();
    self.error_msg = ko.observable("");
    self.has_errors = ko.observable(false);
    self.validate_executed = ko.observable(false);
    self.json_for_server = ko.observable("");
    self.json_for_server_obj = null;
    self.show_json = ko.observable(false);
    self.existing_schema = ko.observable(false);

    self.disable_btn_view = ko.computed(function () {
        return self.has_errors() || !self.validate_executed();
    }, self);
    self.show_btn_send = ko.computed(function () {
        return !self.existing_schema() && !self.has_errors() && self.validate_executed();
    }, self);

    self.store_names = ko.computed(function () {
        var res = [];
        $.each(self.stores(), function () { res.push(this.name()); });
        res.sort();
        return res;
    });
    // methods

    self.AddStore = function () {
        self.stores.push(new Qm.Admin.CreateStore());
    };
    self.RemoveStore = function (store) {
        self.stores.remove(store);
    };
    self.AddField = function (store) {
        store.AddField();
    };
    self.RemoveField = function (field) {
        $.each(self.stores(), function () { this.fields.remove(field) });
    }
    self.AddIndex = function (store) {
        store.AddIndex();
    };
    self.RemoveIndex = function (index) {
        $.each(self.stores(), function () { this.indexes.remove(index) });
    }
    self.AddJoin = function (store) {
        store.AddJoin();
    };
    self.RemoveJoin = function (join) {
        $.each(self.stores(), function () { this.joins.remove(join) });
    }

    self.save = function () {
        self.lastSavedJson(JSON.stringify(ko.toJS(self.stores), null, 2));
    };

    self.Validate = function () {
        var allow = true;
        var store_names = {};
        self.errors.removeAll();
        $.each(self.stores(), function () {
            var store = this;
            allow = allow && store.Validate();

            // check duplicate store names
            if (store_names[store.name()] != null) {
                self.errors.push("Duplicate store name: " + store.name());
            } else {
                store_names[store.name()] = true;
            }
        });
        allow = allow && (self.errors().length == 0);

        self.validate_executed(true);
        self.has_errors(!allow);
        self.error_msg(self.errors().length > 0 ? self.errors().join("<br/>") : null);
        return allow;
    }

    self.HideJson = function () { self.show_json(false); }

    self.CreateRequest = function () {
        var res = {};
        res.stores = [];
        $.each(self.stores(), function () {
            res.stores.push(this.CreateRequest());
        });
        self.json_for_server_obj = res;
        self.json_for_server(JSON.stringify(res, undefined, 4));
        self.show_json(true);
    }

    self.SendToServer = function () {
        if (self.Validate()) {
            self.CreateRequest();
            $.ajax({
              type: 'POST',
              url: '/gs_create_schema',
              data: self.json_for_server(),
              success: function (result) {
                    if (result.error == null) {
                        alert("Done.");
                        document.location = "stores.html";
                    } else {
                        self.validate_executed(true);
                        self.has_errors(true);
                        self.error_msg(result.error.message + "<br/>" + result.location);
                    }
                },
              dataType: "text",
              processData: false
            });
            
        }
    }

    // check if stores already exist
    $.getJSON('/gs_quick_info', function (result) {
        self.existing_schema(result.stores > 0);
    });
};

Qm.Admin.Model = new Qm.Admin.CreateModel();

