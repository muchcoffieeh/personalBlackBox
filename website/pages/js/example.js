/*globals jQuery,localStorage,alert,M2X*/
    function M2XExample() {
        this.$statusBar = $("#status-bar span");
        this.$apiKey = $("input[name=api-key]");
        this.$deviceID = $("input[name=device-id]");
        this.$deviceView = $("#device-view");
        this.$streamPush = $("#stream-push");
        this.$streamView = $("#stream-view");

        var key = "317ab1598022498193552239be9615eb";

        if (key) {
            this.m2x = new M2X(key);
        } else {
            this.m2x = undefined;
        }

        this.deviceID = "802f1824496d5ccd64eef6783e915b6b";
        this.bindEvents();

     }

    M2XExample.prototype.handleError = function(error) {
        var text = error.message;

        if (error.responseJSON) {
            console.log(error);
            text = JSON.stringify(error.responseJSON);
        } else {
            text = error.message;
        }

        this.setLoading(false, text);
    };

    M2XExample.prototype.onReceiveDeviceDetails = function(data) {
        $("code", this.$deviceView).text(JSON.stringify(data));

        this.setLoading(false);
    };

    M2XExample.prototype.onReceiveStreamValues = function(data) {
        $("code", this.$streamView).text(JSON.stringify(data));

        this.setLoading(false);
    };

    M2XExample.prototype.bindEvents = function() {
        // Call onKeyChange when api key input changes
        this.$apiKey.on("change", $.proxy(this, "onKeyChange"));

        // Call ondeviceChange when device-id input changes
        this.$deviceID.on("change", $.proxy(this, "ondeviceChange"));

        // Hook this event on all buttons so that we share the check
        // for api-key/device-id, which is needed for all three operations
        $("button").on("click", $.proxy(function(ev) {
            if (! this.m2x) {
                alert("You must type an API Key first.");
            } else if (! this.deviceID) {
                alert("You must type a device ID first.");
            } else {
                return;
            }

            ev.stopPropagation();
        }, this));

        // Handler for getting device information
        this.$deviceView.on("click", "button", $.proxy(function() {
            this.setLoading(true);

            this.m2x.devices.view(this.deviceID,
                $.proxy(this, "onReceiveDeviceDetails"),
                $.proxy(this, "handleError")
            );
        }, this));

        // Handler for pushing values to a data stream
        this.$streamPush.on("click", "button", $.proxy(function() {
            var streamName = $("input[name=stream-name]", this.$streamPush).val();
            var value = $("input[name=stream-value]", this.$streamPush).val();

            if (! streamName) {
                alert("You must type an Stream name first.");
            } else if (! value) {
                alert("You must type a value to be pushed.");
            } else {
                this.setLoading(true);

                this.m2x.devices.setStreamValue(this.deviceID, streamName, { value: value },
                    $.proxy(function() { this.setLoading(false); }, this),
                    $.proxy(this, "handleError")
                );
            }
        }, this));

        // Handler for fetching values from a data stream
        this.$streamView.on("click", "button", $.proxy(function() {
            var streamName = $("input[name=stream-name]", this.$streamView).val();

            if (! streamName) {
                alert("You must type an Stream name first.");
            } else {
                this.setLoading(true);

                this.m2x.devices.streamValues(this.deviceID, streamName,
                    $.proxy(this, "onReceiveStreamValues"),
                    $.proxy(this, "handleError")
                );
            }
        }, this));
    };

    M2XExample.prototype.ondeviceChange = function() {
        this.deviceID = this.$deviceID.val();
        localStorage.setItem("device-id", this.deviceID);
    };

    M2XExample.prototype.onKeyChange = function() {
        // In this example we create a new M2X object each time the api key changes,
        // but in most cases you'll be using the same api key all the time, so what we
        // do here might not necessarily apply for your use case.
        var key = this.$apiKey.val();

        if (key) {
            this.m2x = new M2X(key);
        } else {
            this.m2x = undefined;
        }

        localStorage.setItem("api-key", key);
    };

    M2XExample.prototype.setLoading = function(enabled, error) {
        if (enabled) {
            this.$statusBar.text("Loading...");
        } else {
            if (error) {
                this.$statusBar.text("Error (" + error + ")");
            } else {
                this.$statusBar.text("Done!");
            }
        }
    };

    $(function() {
        new M2XExample();
    });
