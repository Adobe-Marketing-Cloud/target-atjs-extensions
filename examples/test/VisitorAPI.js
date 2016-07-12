/** @license ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ============

Adobe Visitor API for JavaScript version: 1.5
Copyright 1996-2015 Adobe, Inc. All Rights Reserved
More info available at http://www.omniture.com
*/

/*********************************************************************
* Class Visitor(marketingCloudOrgID,initConfig): Shared functionality across products
*     marketingCloudOrgID = Marketing Cloud Organization ID to use
*     initConfig          = Optional initial config object allowing the constructor to fire
*                           off requests immediately instead of lazily
*
* @constructor
* @noalias
*********************************************************************/
function Visitor(marketingCloudOrgID,initConfig) {
    if (!marketingCloudOrgID) {
        throw "Visitor requires Adobe Marketing Cloud Org ID";
    }

    /**
      * @type {Visitor}
      * @noalias
      */
    var visitor = this;

    visitor.version = "1.5";

    /**
      * @type {!Window}
      */
    var w = window;
    /**
      * @type {Visitor}
      * @noalias
      */
    var thisClass = w['Visitor'];
    if (!w.s_c_in) {
        w.s_c_il = [];
        w.s_c_in = 0;
    }
    visitor._c  = "Visitor";
    visitor._il = w.s_c_il;
    visitor._in = w.s_c_in;
    visitor._il[visitor._in] = visitor;
    w.s_c_in++;

    /**
      * @type {!Document}
      */
    var d = w.document;

    // This and the use of Null below is a hack to keep Google Closure Compiler from creating a global variable for null
    var Null = thisClass.Null;
    if (!Null) {
        Null = null;
    }
    // Same thing for undefined...
    var Undefined = thisClass.Undefined;
    if (!Undefined) {
        Undefined = undefined;
    }
    // ...and for true...
    var True = thisClass.True;
    if (!True) {
        True = true;
    }
    // ...and for false
    var False = thisClass.False;
    if (!False) {
        False = false;
    }

    /*********************************************************************
    * Function _isNOP(m): Test to see if a member is NOT part of the Object.prototype
    *     m = Member
    * Returns:
    *     True if m is NOT part of Object.prototype otherwise False
    *********************************************************************/
    var _isNOP = function(m) {
        return (!Object.prototype[m]);
    };

    /*********************************************************************
    * Function _hash(str): Generate hash of string
    *     str = String to generate hash from
    * Returns:
    *     Hash
    *********************************************************************/
    visitor._hash = function(str) {
        var
            hash = 0,
            pos,
            ch;
        if (str) {
            for (pos = 0;pos < str.length;pos++) {
                ch = str.charCodeAt(pos);
                hash = (((hash << 5) - hash) + ch);
                hash = (hash & hash); // Convert to 32bit integer
            }
        }
        return hash;
    };

    /*********************************************************************
    * Function _generateID(method): Generate a random 128bit ID
    *     method = Optional ID generation method
    *              0 = Decimal 2 63bit numbers
    *              1 = Hex 2 63bit numbers
    * Returns:
    *     Random 128bit ID as a string
    *********************************************************************/
    visitor._generateID = function(method) {
        var
            digits = "0123456789",
            high = "",low = "",
            digitNum,digitValue,digitValueMax = 8,highDigitValueMax = 10,lowDigitValueMax = 10; /* The first nibble can't have the left-most bit set because we are deailing with signed 64bit numbers. */
        if (method == 1) {
            digits += "ABCDEF";
            for (digitNum = 0;digitNum < 16;digitNum++) {
                digitValue = Math.floor(Math.random() * digitValueMax);
                high += digits.substring(digitValue,(digitValue + 1));
                digitValue = Math.floor(Math.random() * digitValueMax);
                low += digits.substring(digitValue,(digitValue + 1));
                digitValueMax = 16;
            }
            return high + "-" + low;
        }
        /*
         * We're dealing with 2 signed, but positive, 64bit numbers so the max for high and low is:
         * 9222372036854775807
         *    ^---------------- The 4th digit could actually be a 3 if we wanted to add more max checks
         *                      but we set the max to 2 to avoid them
         */
        for (digitNum = 0;digitNum < 19;digitNum++) {
            digitValue = Math.floor(Math.random() * highDigitValueMax);
            high += digits.substring(digitValue,(digitValue + 1));
            if ((digitNum == 0) && (digitValue == 9)) {
                highDigitValueMax = 3;
            } else if (((digitNum == 1) || (digitNum == 2)) && (highDigitValueMax != 10) && (digitValue < 2)) {
                highDigitValueMax = 10;
            } else if (digitNum > 2) {
                highDigitValueMax = 10;
            }
            digitValue = Math.floor(Math.random() * lowDigitValueMax);
            low += digits.substring(digitValue,(digitValue + 1));
            if ((digitNum == 0) && (digitValue == 9)) {
                lowDigitValueMax = 3;
            } else if (((digitNum == 1) || (digitNum == 2)) && (lowDigitValueMax != 10) && (digitValue < 2)) {
                lowDigitValueMax = 10;
            } else if (digitNum > 2) {
                lowDigitValueMax = 10;
            }
        }
        return high + low;
    };

    /*********************************************************************
    * Function _getDomain(hostname): Get domain from hostname
    *     hostname = Optional hostname to build the domain from.
    *                Defaults to window.location.hostname
    * Returns:
    *     Domain
    *********************************************************************/
    visitor._getDomain = function(hostname) {
        var
            domain;

        if ((!hostname) && (w.location)) {
            hostname = w.location.hostname;
        }
        domain = hostname;
        if (domain) {
            if (!(/^[0-9.]+$/).test(domain)) {
                var
                    domain2CharExceptions = ",DOMAIN_2_CHAR_EXCEPTIONS,",
                    domainPartList = domain.split("."),
                    domainPartNum = (domainPartList.length - 1),
                    domainTargetPartNum = (domainPartNum - 1);
                // Take care of two part top level domains like .co.uk
                // The rule is:
                // 1. Right most part is 2 characters or less
                // 2. The next part to the left is not 2 characters
                // 3. The right most part is not in the 2 character exception list
                // that doesn't require a 2 part TLD
                if ((domainPartNum > 1) && (domainPartList[domainPartNum].length <= 2) &&
                    ((domainPartList[(domainPartNum - 1)].length == 2) || (domain2CharExceptions.indexOf("," + domainPartList[domainPartNum] + ",") < 0))) {
                    domainTargetPartNum--;
                }
                if (domainTargetPartNum > 0) {
                    domain = "";
                    while (domainPartNum >= domainTargetPartNum) {
                        domain = domainPartList[domainPartNum] + (domain ? "." : "") + domain;
                        domainPartNum--;
                    }
                }
            } else {
                domain = "";
            }
        }

        return domain;
    };

    /*********************************************************************
    * Function cookieRead(k): Read, URL-decode, and return value of k in cookies
    *     k = key to read value for out of cookies
    * Returns:
    *     Value of k in cookies if found, blank if not
    *********************************************************************/
    visitor.cookieRead = function(k) {
        k = encodeURIComponent(k);
        var
            c = (";" + d.cookie).split(" ").join(";"),
            i = c.indexOf(";" + k + "="),
            e = (i < 0 ? i : c.indexOf(";",(i + 1))),
            v = (i < 0 ? "" : decodeURIComponent(c.substring((i + 2 + k.length),(e < 0 ? c.length : e))));
        return v;
    };

    /*********************************************************************
    * Function cookieWrite(k,v,e): Write value v as key k in cookies with
    *                              optional expiration e and domain automaticly
    *                              generated by getCookieDomain()
    *     k = key to write value for in cookies
    *     v = value to write to cookies
    *     e = optional expiration Date object or 1 to use default expiration
    * Returns:
    *     True if value was successfuly written and false if it was not
    *********************************************************************/
    visitor.cookieWrite = function(k,v,e) {
        var
            l = visitor.cookieLifetime,
            t;
        v = "" + v;
        l = (l ? ("" + l).toUpperCase() : "");
        if ((e) && (l != "SESSION") && (l != "NONE")) {
            t = (v != "" ? parseInt((l ? l : 0),10) : -60);
            if (t) {
                e = new Date;
                e.setTime(e.getTime() + (t * 1000));
            } else if (e == 1) {
                e = new Date;
                var y = e.getYear();
                e.setYear( y + 2 + (y < 1900 ? 1900 : 0));
            }
        } else {
            e = 0;
        }
        if ((k) && (l != "NONE")) {
            d.cookie = encodeURIComponent(k) + "=" + encodeURIComponent(v) + "; path=/;"
                     + (e ? " expires=" + e.toGMTString() + ";" : "")
                     + (visitor.cookieDomain ? " domain=" + visitor.cookieDomain + ";" : "");
            return (visitor.cookieRead(k) == v);
        }
        return 0;
    };

    /*********************************************************************
    * Function _callCallback(callback,args): Call a callback
    *     callback = If this is a function it will just be called.
    *                Otherwise it needs to be an array with two elements
    *                containing the object at index 0 and a function to
    *                call on the object at index 1.
    *     args     = Array of arguments
    * Returns:
    *     Nothing
    *********************************************************************/
    visitor._callbackList = Null;
    visitor._callCallback = function(callback,args) {
        var
            e;
        try {
            if (typeof(callback) == "function") {
                callback.apply(w,args);
            } else {
                callback[1].apply(callback[0],args);
            }
        } catch (e) {}
    };

    /*********************************************************************
    * Function _registerCallback(field,callback): Register callback for field
    *     field    = Field to link callback to
    *     callback = (see _callCallback)
    * Returns:
    *     Nothing
    *********************************************************************/
    visitor._registerCallback = function(field,callback) {
        if (callback) {
            if (visitor._callbackList == Null) {
                visitor._callbackList = {};
            }
            if (visitor._callbackList[field] == Undefined) {
                visitor._callbackList[field] = [];
            }
            visitor._callbackList[field].push(callback);
        }
    };

    /*********************************************************************
    * Function _callAllCallbacks(field,args): CAll all callbacks registered to field
    *     field = Field callbacks are linked to
    *     args  = Array of arguments
    * Returns:
    *     Nothing
    *********************************************************************/
    visitor._callAllCallbacks = function(field,args) {
        if (visitor._callbackList != Null) {
            // Call all of the callbacks
            var
                callbackList = visitor._callbackList[field];
            if (callbackList) {
                while (callbackList.length > 0) {
                    visitor._callCallback(callbackList.shift(),args);
                }
            }
        }
    };

    /*********************************************************************
    * Function _loadJSONPTimeout(fieldGroup,url,timeoutFunc): Load a set of data
    *                            via JSONP with a timeout
    *     fieldGroup  = Field group to link the loading/timeout to
    *     url         = URL to make the JSONP call to
    *     timeoutFunc = Timeout function to call
    * Returns:
    *     Nothing
    *********************************************************************/
    visitor._timeout = Null;
    visitor._loadJSONPTimeout = function(fieldGroup,url,timeoutFunc) {
        // Create a <script> tag to request the data
        // IMPORTANT: The below code is super paranoid to deal with different DOM frameworks and case sensitivity
        var
            p = 0,
            s = 0,
            e,
            c;

        // Make sure we have a URL before creating the script tag
        if ((url) && (d)) {
            // Find target parent/container tag
            c = 0;
            while ((!p) && (c < 2)) {
                try {
                    p = d.getElementsByTagName((c > 0 ? "HEAD" : "head"));
                    if ((p) && (p.length > 0)) {
                        p = p[0];
                    } else {
                        p = 0;
                    }
                } catch (e) {
                    p = 0;
                }
                c++;
            }
            // If the <head> tag is not found try to use the <body> tag as the parent
            // NOTE: We would end up here in a case sensitive DOM with a document that used mixed case for the <head> tag like <Head>
            if (!p) {
                try {
                    if (d.body) {
                        p = d.body;
                    }
                } catch (e) {
                    p = 0;
                }
            }

            // Create the script tag if we were able to find a parent
            if (p) {
                c = 0;
                while ((!s) && (c < 2)) {
                    try {
                        s = d.createElement((c > 0 ? "SCRIPT" : "script"));
                    } catch (e) {
                        s = 0;
                    }
                    c++;
                }
            }
        }

        // ERROR: If for some reason we don't have a URL or were unable to find a parent or create the script tag bail out
        if ((!url) || (!p) || (!s)) {
            if (timeoutFunc) {
                timeoutFunc();
            }
            return;
        }

        // Fill out the script tag for the JSONP request
        s.type = "text/javascript";
        s.setAttribute("async","async");
        s.src = url;
        if (p.firstChild) {
            p.insertBefore(s,p.firstChild);
        } else {
            p.appendChild(s);
        }

        // Timeout (default of 1/4 second) and proceed
        if (timeoutFunc) {
            if (visitor._timeout == Null) {
                visitor._timeout = new Object();
            }
            visitor._timeout[fieldGroup] = setTimeout(timeoutFunc,visitor.loadTimeout);
        }
    };

    /*********************************************************************
    * Function _clearTimeout(fieldGroup): Clear a timeout tied to a field group
    *     fieldGroup = Field group timeout is linked to
    * Returns:
    *     Nothing
    *********************************************************************/
    visitor._clearTimeout = function(fieldGroup) {
        // Clear timeout
        if ((visitor._timeout != Null) &&
            (visitor._timeout[fieldGroup])) {
            clearTimeout(visitor._timeout[fieldGroup]);
            visitor._timeout[fieldGroup] = 0;
        }
    };

    /*********************************************************************
    * Function isAllowed(): Test to see if the visitor class functionality
    *                       is allowed which currently means the ability
    *                       to set a cookie
    * Returns:
    *     true if allowed or false if not
    *********************************************************************/
    visitor._isAllowedDone = False;
    visitor._isAllowedFlag = False;
    visitor.isAllowed = function() {
        if (!visitor._isAllowedDone) {
            visitor._isAllowedDone = True;
            if ((visitor.cookieRead(visitor.cookieName)) ||
                (visitor.cookieWrite(visitor.cookieName,"T",1))) {
                visitor._isAllowedFlag = True;
            }
        }
        return visitor._isAllowedFlag;
    };

    /*********************************************************************
    * Fields
    *********************************************************************/
    visitor._fields = Null;
    visitor._fieldsExpired = Null;
    // NOTE: The messy construction of these field* variables is to keep the Google closure compiler from just using the string literal everywhere making the end result bigger or creating global variables
    // Marketing Cloud
    var fieldGroupMarketingCloud = thisClass.fieldGroupMarketingCloud;
    if (!fieldGroupMarketingCloud) {
        fieldGroupMarketingCloud = "MC";
    }
    var fieldMarketingCloudVisitorID = thisClass.fieldMarketingCloudVisitorID;
    if (!fieldMarketingCloudVisitorID) {
        fieldMarketingCloudVisitorID = "MCMID";
    }
    var fieldMarketingCloudCustomerIDHash = thisClass.fieldMarketingCloudCustomerIDHash;
    if (!fieldMarketingCloudCustomerIDHash) {
        fieldMarketingCloudCustomerIDHash = "MCCIDH";
    }
    var fieldMarketingCloudSyncs = thisClass.fieldMarketingCloudSyncs;
    if (!fieldMarketingCloudSyncs) {
        fieldMarketingCloudSyncs = "MCSYNCS";
    }
    var fieldMarketingCloudIDCallTimeStamp = thisClass.fieldMarketingCloudIDCallTimeStamp;
    if (!fieldMarketingCloudIDCallTimeStamp) {
        fieldMarketingCloudIDCallTimeStamp = "MCIDTS";
    }

    // Analytics
    var fieldGroupAnalytics = thisClass.fieldGroupAnalytics;
    if (!fieldGroupAnalytics) {
        fieldGroupAnalytics = "A";
    }
    var fieldAnalyticsVisitorID = thisClass.fieldAnalyticsVisitorID;
    if (!fieldAnalyticsVisitorID) {
        fieldAnalyticsVisitorID = "MCAID";
    }

    // Audience Manager
    var fieldGroupAudienceManager = thisClass.fieldGroupAudienceManager;
    if (!fieldGroupAudienceManager) {
        fieldGroupAudienceManager = "AAM";
    }
    var fieldAudienceManagerLocationHint = thisClass.fieldAudienceManagerLocationHint;
    if (!fieldAudienceManagerLocationHint) {
        fieldAudienceManagerLocationHint = "MCAAMLH";
    }
    var fieldAudienceManagerBlob = thisClass.fieldAudienceManagerBlob;
    if (!fieldAudienceManagerBlob) {
        fieldAudienceManagerBlob = "MCAAMB";
    }

    var fieldValueNONE = thisClass.fieldValueNONE;
    if (!fieldValueNONE) {
        fieldValueNONE = "NONE";
    }

    /*********************************************************************
    * Function _getSettingsDigest(): Generate the settings digest for this instace
    * Returns:
    *     Nothing
    *********************************************************************/
    visitor._settingsDigest = 0;
    visitor._getSettingsDigest = function() {
        if (!visitor._settingsDigest) {
            var
                settings = visitor.version;
            if (visitor.audienceManagerServer) {
                settings += '|' + visitor.audienceManagerServer;
            }
            if (visitor.audienceManagerServerSecure) {
                settings += '|' + visitor.audienceManagerServerSecure;
            }
            visitor._settingsDigest = visitor._hash(settings);
        }
        return visitor._settingsDigest;
    };

    /*********************************************************************
    * Function _readVisitor(): Read the visitor cookie into instance
    * Returns:
    *     Nothing
    *********************************************************************/
    visitor._readVisitorDone = False;
    visitor._readVisitor = function() {
        if (!visitor._readVisitorDone) {
            visitor._readVisitorDone = True;
            var
                settingsDigest = visitor._getSettingsDigest(),
                settingsDigestChanged = False,
                data = visitor.cookieRead(visitor.cookieName),
                pos,
                parts,
                field,
                value,
                expire,
                now = new Date;
            if (visitor._fields == Null) {
                visitor._fields = {};
            }
            // If this is a valid cookie value parse and go through each key|value pair
            if ((data) && (data != "T")) {
                data = data.split("|");
                // If the cookie starts out with a settings digest
                if (data[0].match(/^[\-0-9]+$/)) {
                    if (parseInt(data[0],10) != settingsDigest) {
                        settingsDigestChanged = True;
                    }
                    data.shift();
                }

                if (data.length % 2 == 1) {
                    data.pop();
                }
                for (pos = 0;pos < data.length;pos += 2) {
                    parts = data[pos].split("-");
                    field  = parts[0];
                    value  = data[pos + 1];
                    expire = (parts.length > 1 ? parseInt(parts[1],10) : 0);
                    if (settingsDigestChanged) {
                        // If the settings digest has changed clear out the Customer ID hash forcing resyncs
                        if (field == fieldMarketingCloudCustomerIDHash) {
                            value = "";
                        }
                        // If the settings digest has changed expire all expiring fields now
                        if (expire > 0) {
                            expire = ((now.getTime() / 1000) - 60);
                        }
                    }
                    if ((field) && (value)) {
                        visitor._setField(field,value,1);
                        if (expire > 0) {
                            visitor._fields["expire" + field] = expire;
                            if (now.getTime() >= (expire * 1000)) {
                                if (!visitor._fieldsExpired) {
                                    visitor._fieldsExpired = {};
                                }
                                visitor._fieldsExpired[field] = True;
                            }
                        }
                    }
                }
            }

            // If we still don't have the analytics visitor ID look for the Mod-Stats created s_vi because we may be on first party data collection where the s_vi cookie is availible
            if (!visitor._getField(fieldAnalyticsVisitorID)) {
                /* s_vi=[CS]v1|28B7854A85160711-40000182A01D8F44[CE]; */
                data = visitor.cookieRead("s_vi");
                if (data) {
                    data = data.split("|");
                    if ((data.length > 1) &&
                        (data[0].indexOf("v1") >= 0)) {
                        value = data[1];
                        pos = value.indexOf("[");
                        if (pos >= 0) {
                            value = value.substring(0,pos);
                        }
                        if ((value) &&
                            (value.match(/^[0-9a-fA-F\-]+$/))) {
                            visitor._setField(fieldAnalyticsVisitorID,value);
                        }
                    }
                }
            }
        }
    };

    /*********************************************************************
    * Function _writeVisitor(): Write visitor fields out to cookie
    * Returns:
    *     Nothing
    *********************************************************************/
    visitor._writeVisitor = function() {
        var
            data = visitor._getSettingsDigest(), // The first thing in the cookie is the settings digest
            field,
            value;
        for (field in visitor._fields) {
            if ((_isNOP(field)) &&
                (visitor._fields[field]) &&
                (field.substring(0,6) != "expire")) {
                value = visitor._fields[field];
                data += (data ? "|" : "") + field + (visitor._fields["expire" + field] ? "-" + visitor._fields["expire" + field] : "") + "|" + value;
            }
        }
        visitor.cookieWrite(visitor.cookieName,data,1);
    };

    /*********************************************************************
    * Function _getField(field,getExpired): Get value for field
    *     field      = Field to get value for
    *     getExpired = Optional flag to get expired field values
    * Returns:
    *     Field value
    *********************************************************************/
    visitor._getField = function(field,getExpired) {
        if ((visitor._fields != Null) && ((getExpired) || (!visitor._fieldsExpired) || (!visitor._fieldsExpired[field]))) {
            return visitor._fields[field];
        }
        return Null;
    };

    /*********************************************************************
    * Function _setField(field,value,noSave): Set value for field
    *     field  = Field to set value for
    *     value  = Value to set field to
    *     noSave = (option) Don't save the visitor
    * Returns:
    *     Nothing
    *********************************************************************/
    visitor._setField = function(field,value,noSave) {
        if (visitor._fields == Null) {
            visitor._fields = {};
        }
        visitor._fields[field] = value;
        if (!noSave) {
            visitor._writeVisitor();
        }
    };

    /*********************************************************************
    * Function _getFieldList(field,getExpired): Get list value for field
    *     field      = Field to get list value for
    *     getExpired = Optional flag to get expired field values
    * Returns:
    *     Field list value
    *********************************************************************/
    visitor._getFieldList = function(field,getExpired) {
        var value = visitor._getField(field,getExpired);
        if (value) {
            return value.split("*");
        }
        return Null;
    };

    /*********************************************************************
    * Function _setFieldList(field,listValue,noSave): Set list value for field
    *     field     = Field to set list value for
    *     listValue = List value to set field to
    *     noSave    = (option) Don't save the visitor
    * Returns:
    *     Nothing
    *********************************************************************/
    visitor._setFieldList = function(field,listValue,noSave) {
        visitor._setField(field,(listValue ? listValue.join("*") : ""),noSave);
    };

    /*********************************************************************
    * Function _getFieldMap(field,getExpired): Get map value for field
    *     field      = Field to get map value for
    *     getExpired = Optional flag to get expired field values
    * Returns:
    *     Field list value
    *********************************************************************/
    visitor._getFieldMap = function(field,getExpired) {
        var listValue = visitor._getFieldList(field,getExpired);
        if (listValue) {
            var
                mapValue = {},
                i;
            for (i = 0;i < listValue.length;i += 2) {
                mapValue[listValue[i]] = listValue[(i + 1)];
            }
            return mapValue;
        }
        return Null;
    };

    /*********************************************************************
    * Function _setFieldMap(field,mapValue,noSave): Set map value for field
    *     field    = Field to set map value for
    *     mapValue = Map value to set field to
    *     noSave   = (option) Don't save the visitor
    * Returns:
    *     Nothing
    *********************************************************************/
    visitor._setFieldMap = function(field,mapValue,noSave) {
        var
            listValue = Null,
            m;
        if (mapValue) {
            listValue = [];
            for (m in mapValue) {
                if (_isNOP(m)) {
                    listValue.push(m);
                    listValue.push(mapValue[m]);
                }
            }
        }
        visitor._setFieldList(field,listValue,noSave);
    };

    /*********************************************************************
    * Function _setFieldExpire(field,ttl): Set a field to expire
    *     field = Field to set value for
    *     ttl   = Field TTL in seconds
    * Returns:
    *     Nothing
    *********************************************************************/
    visitor._setFieldExpire = function(field,ttl) {
        var
            now = new Date;
        now.setTime(now.getTime() + (ttl * 1000));
        if (visitor._fields == Null) {
            visitor._fields = {};
        }
        visitor._fields["expire" + field] = Math.floor(now.getTime() / 1000);
        if (ttl < 0) {
            if (!visitor._fieldsExpired) {
                visitor._fieldsExpired = {};
            }
            visitor._fieldsExpired[field] = True;
        } else if (visitor._fieldsExpired) {
            visitor._fieldsExpired[field] = False;
        }
    };

    /*********************************************************************
    * Function _findVisitorID(visitorID): Find a visitor ID in an object
    *     visitorID = Visitor ID or object containing visitorID
    * Returns:
    *     Visitor ID
    *********************************************************************/
    visitor._findVisitorID = function(visitorID) {
        if (visitorID) {
            // Get the visitor ID
            if (typeof(visitorID) == "object") {
                if (visitorID["d_mid"]) {
                    visitorID = visitorID["d_mid"];
                } else if (visitorID["visitorID"]) {
                    visitorID = visitorID["visitorID"];
                } else if (visitorID["id"]) {
                    visitorID = visitorID["id"];
                } else if (visitorID["uuid"]) {
                    visitorID = visitorID["uuid"];
                } else {
                    visitorID = "" + visitorID; /* Call toString() method of object */
                }
            }
            // Handle special visitorID values
            if (visitorID) {
                visitorID = visitorID.toUpperCase();
                if (visitorID == "NOTARGET") {
                    visitorID = fieldValueNONE;
                }
            }
            // If the visitorID is not valid clear it out
            if ((!visitorID) || ((visitorID != fieldValueNONE) && (!visitorID.match(/^[0-9a-fA-F\-]+$/)))) {
                visitorID = "";
            }
        }
        return visitorID;
    };

    /*********************************************************************
    * Function _setFields(field,data): Set fields for fieldGroup
    *     fieldGroup = Field group
    *     data       = Data for fields
    * Returns:
    *     Nothing
    *********************************************************************/
    visitor._setFields = function(fieldGroup,data) {
        // Clear the timeout and loading flag
        visitor._clearTimeout(fieldGroup);
        if (visitor._loading != Null) {
            visitor._loading[fieldGroup] = False;
        }

        // Marketing Cloud
        if (fieldGroup == fieldGroupMarketingCloud) {
            // Marketing Cloud Visitor ID
            var
                marketingCloudVisitorID = visitor._getField(fieldMarketingCloudVisitorID);
            if (!marketingCloudVisitorID) {
                if ((typeof(data) == "object") && (data["mid"])) {
                    marketingCloudVisitorID = data["mid"];
                } else {
                    marketingCloudVisitorID = visitor._findVisitorID(data);
                }
                /***********************************************************************
                 * If we don't have a Marketing Cloud ID at this point
                 * 1. If there is a 1st party s.marketingCloudServer fire off an Analytics server call to generate a Marketing Cloud Visitor ID
                 * 2. If there is not a 1st party s.marketingCloudServer just generate a Marketing Cloud Visitor ID
                 ***********************************************************************/
                // We always have to have a Marketing Cloud Visitor ID so if one was not passed in generate one
                if (!marketingCloudVisitorID) {
                    if (visitor._use1stPartyMarketingCloudServer) {
                        visitor.getAnalyticsVisitorID(Null,False,True);
                        return;
                    }
                    marketingCloudVisitorID = visitor._generateID();
                }
                visitor._setField(fieldMarketingCloudVisitorID,marketingCloudVisitorID);
            }
            if ((!marketingCloudVisitorID) || (marketingCloudVisitorID == fieldValueNONE)) {
                marketingCloudVisitorID = "";
            }

            // Look for other Audience Manager or Analytics data that may have come back from the call to get the Marketing Cloud data
            if (typeof(data) == "object") {
                if ((data["d_region"]) || (data["dcs_region"]) ||
                    (data["d_blob"]) || (data["blob"])) {
                    visitor._setFields(fieldGroupAudienceManager,data);
                }
                if ((visitor._use1stPartyMarketingCloudServer) && (data["mid"])) {
                    visitor._setFields(fieldGroupAnalytics,{"id":data["id"]});
                }
            }

            // Call any Marketing Cloud Visitor ID Callbacks
            visitor._callAllCallbacks(fieldMarketingCloudVisitorID,[marketingCloudVisitorID]);
        }

        // Audience Manager
        if ((fieldGroup == fieldGroupAudienceManager) && (typeof(data) == "object")) {
            // Get TTL for AAM fields
            var
                ttl = 604800; // One week
            if ((data["id_sync_ttl"] != Undefined) && (data["id_sync_ttl"])) {
                ttl = parseInt(data["id_sync_ttl"],10);
            }

            // AAM Location Hint
            var
                aamLH = visitor._getField(fieldAudienceManagerLocationHint);
            if (!aamLH) {
                aamLH = data["d_region"];
                if (!aamLH) {
                    aamLH = data["dcs_region"];
                }
                if (aamLH) {
                    visitor._setFieldExpire(fieldAudienceManagerLocationHint,ttl);
                    visitor._setField(fieldAudienceManagerLocationHint,aamLH);
                }
            }
            if (!aamLH) {
                aamLH = "";
            }
            // Call any Audience Manager Location Hint callbacks
            visitor._callAllCallbacks(fieldAudienceManagerLocationHint,[aamLH]);

            // AAM Blob
            var
                aamBlob = visitor._getField(fieldAudienceManagerBlob);
            if ((data["d_blob"]) || (data["blob"])) {
                aamBlob = data["d_blob"];
                if (!aamBlob) {
                    aamBlob = data["blob"];
                }
                visitor._setFieldExpire(fieldAudienceManagerBlob,ttl);
                visitor._setField(fieldAudienceManagerBlob,aamBlob);
            }
            if (!aamBlob) {
                aamBlob = "";
            }
            // Call any Audience Manager Blob callbacks
            visitor._callAllCallbacks(fieldAudienceManagerBlob,[aamBlob]);

            /*
             * We are using the Audience Manager /id service as the Customer ID mapping service so if we recieve a response from
             * Audience Manager without an error we should apply the _newCustomerIDsHash marking the mapping as successful
             */
            if ((!data["error_msg"]) && (visitor._newCustomerIDsHash)) {
                visitor._setField(fieldMarketingCloudCustomerIDHash,visitor._newCustomerIDsHash);
            }

            // Handle ID Syncs
            if (!visitor.idSyncDisableSyncs) {
                destinationPublishing.idCallNotProcesssed = False;

                destinationPublishing.processIDCallData({
                    ibs: data["ibs"],
                    subdomain: data["subdomain"]
                });
            } else {
                destinationPublishing.idCallNotProcesssed = True;
            }
        }

        // Analytics
        if (fieldGroup == fieldGroupAnalytics) {
            // Analytics Visitor ID
            var
                analyticsVisitorID = visitor._getField(fieldAnalyticsVisitorID);
            if (!analyticsVisitorID) {
                analyticsVisitorID = visitor._findVisitorID(data);
                // If we don't have an Analytics visitor ID store the special NONE value so we don't keep trying to request it
                if (!analyticsVisitorID) {
                    analyticsVisitorID = fieldValueNONE;
                } else {
                    visitor._setFieldExpire(fieldAudienceManagerBlob,-1);
                }
                visitor._setField(fieldAnalyticsVisitorID,analyticsVisitorID);
            }
            if ((!analyticsVisitorID) || (analyticsVisitorID == fieldValueNONE)) {
                analyticsVisitorID = "";
            }
            // Call any Analytics Visitor ID callbacks
            visitor._callAllCallbacks(fieldAnalyticsVisitorID,[analyticsVisitorID]);
        }
    };

    /*********************************************************************
    * Function _getRemoteField(field,url,callback): Get a remote field
    *     field             = Field
    *     url               = URL to load field from
    *     callback          = Optional callback to call if field isn't ready yet
    *                         available yet.  (See _callCallback)
    *     forceCallCallback = Optional flag to call the callback
    * Returns:
    *     Blank field value if not allowed or not ready
    *     Field value if ready
    *********************************************************************/
    visitor._loading = Null;
    visitor._getRemoteField = function(field,url,callback,forceCallCallback) {
        var
            fieldValue = "",
            fieldGroup;

        // Make sure we can actually support this
        if (visitor.isAllowed()) {
            // Get the current value and see if we already have what we need
            visitor._readVisitor();

            fieldValue = visitor._getField(field);
            // If we don't have the fieldValue
            if (!fieldValue) {
                // Generate field group
                if (field == fieldMarketingCloudVisitorID) {
                    fieldGroup = fieldGroupMarketingCloud;
                } else if ((field == fieldAudienceManagerLocationHint) || (field == fieldAudienceManagerBlob)) {
                    fieldGroup = fieldGroupAudienceManager;
                } else if (field == fieldAnalyticsVisitorID) {
                    fieldGroup = fieldGroupAnalytics;
                }
                // Make sure we have a known field group
                if (fieldGroup) {
                    // Make sure we have a url only do this once
                    if ((url) && ((visitor._loading == Null) || (!visitor._loading[fieldGroup]))) {
                        if (visitor._loading == Null) {
                            visitor._loading = {};
                        }
                        visitor._loading[fieldGroup] = True;
                        visitor._loadJSONPTimeout(fieldGroup,url,function() {
                            if (!visitor._getField(field)) {
                                var
                                    fallbackValue = "";
                                if (field == fieldMarketingCloudVisitorID) {
                                    fallbackValue = visitor._generateID();
                                } else if (fieldGroup == fieldGroupAudienceManager) {
                                    // IMPORTANT: For the AAM group the value must always be an object and we include a timeout error so we will try again on the next page
                                    fallbackValue = {"error_msg" : "timeout"};
                                }
                                visitor._setFields(fieldGroup,fallbackValue);
                            }
                        });
                    }
                    visitor._registerCallback(field,callback);
                    // If we don't have a url set the fields to a default so all callbacks will be wrapped up
                    if (!url) {
                        visitor._setFields(fieldGroup,{"id":fieldValueNONE});
                    }
                    return "";
                }
            }
        }

        // If the field value is a visitor ID and it's the special NONE value clear out the return and force the callback to be called
        if (((field == fieldMarketingCloudVisitorID) || (field == fieldAnalyticsVisitorID)) &&
            (fieldValue == fieldValueNONE)) {
            fieldValue = "";
            forceCallCallback = True;
        }

        // If we have a callback and forceCallCallback is set call the callback
        if ((callback) && (forceCallCallback)) {
            visitor._callCallback(callback,[fieldValue]);
        }

        return fieldValue;
    };

    /*********************************************************************
    * Function _setMarketingCloudFields(marketingCloudData): Set Marketing Cloud fields
    *      marketingCloudData = Marketing Cloud Data
    * Returns:
    *     Nothing
    * Notes:
    *     See _setFields
    *********************************************************************/
    visitor._setMarketingCloudFields = function(marketingCloudData) {
        visitor._readVisitor();
        visitor._setFields(fieldGroupMarketingCloud,marketingCloudData);
    };

    /*********************************************************************
    * Function setMarketingCloudVisitorID(marketingCloudVisitorID): Set the Marketing Cloud Visitor ID
    *     marketingCloudVisitorID = Marketing Cloud Visitor ID
    * Returns:
    *     Nothing
    * Notes:
    *     See _setMarketingCloudFields
    *********************************************************************/
    visitor.setMarketingCloudVisitorID = function(marketingCloudVisitorID) {
        visitor._setMarketingCloudFields(marketingCloudVisitorID);
    };

    /*********************************************************************
    * Function getMarketingCloudVisitorID(callback,forceCallCallback): Get the Marketing Cloud Visitor ID
    *     callback          = Optional callback to register if visitor ID isn't
    *                         ready yet
    *     forceCallCallback = Option flag to force calling callback because
    *                         the return will not be checked
    * Returns:
    *     Blank visitor ID if not allowed or not ready
    *     Visitor ID if ready
    * Notes:
    *     See _getRemoteField
    *********************************************************************/
    visitor._use1stPartyMarketingCloudServer = False;
    visitor.getMarketingCloudVisitorID = function(callback,forceCallCallback) {
        // Make sure we can actually support this
        if (visitor.isAllowed()) {
            if ((visitor.marketingCloudServer) && (visitor.marketingCloudServer.indexOf(".demdex.net") < 0)) {
                visitor._use1stPartyMarketingCloudServer = True;
            }
            var
                url = visitor._getAudienceManagerURL("_setMarketingCloudFields");
            return visitor._getRemoteField(fieldMarketingCloudVisitorID,url,callback,forceCallCallback);
        }
        return "";
    };

    /*********************************************************************
    * Function _mapCustomerIDs(): Fire off mapping call for Customer IDs
    * Returns:
    *     Nothing
    *********************************************************************/
    visitor._mapCustomerIDs = function() {
        /*
         * We using the Audience Manager /id service for the Customer ID mapping and the AAM blob isd
         * already tied to the Customer ID hash changing so mapping is triggered by simply asking for
         * the AAM blob again.  We're not using a callback here because we are depending on _setFields
         * to apply the _newCustomerIDsHash if there wasn't an error
         */
        visitor.getAudienceManagerBlob();
    };

    /*********************************************************************
    * Function setCustomerIDs(customerIDs): Set the map of Customer IDs
    *     customerIDs = A map of customerIDType = customerID pairs
    * Returns:
    *     Nothing
    *********************************************************************/
    thisClass.AuthState = {
        "UNKNOWN":0,
        "AUTHENTICATED":1,
        "LOGGED_OUT":2
    };
    visitor._currentCustomerIDs = {};
    visitor._customerIDsHashChanged = False;
    visitor._newCustomerIDsHash = "";
    visitor.setCustomerIDs = function(customerIDs) {
        // Make sure we can actually support this
        if ((visitor.isAllowed()) && (customerIDs)) {
            // Get the current value and see if we already have what we need
            visitor._readVisitor();

            // Update the current customer IDs and authState enum
            var
                cidt,
                cid;
            for (cidt in customerIDs) {
                if (_isNOP(cidt)) {
                    cid = customerIDs[cidt];
                    if (cid) {
                        if (typeof(cid) == "object") {
                            var ccid = {};
                            if (cid["id"]) {
                                ccid["id"] = cid["id"];
                            }
                            if (cid["authState"] != Undefined) {
                                ccid["authState"] = cid["authState"];
                            }
                            visitor._currentCustomerIDs[cidt] = ccid;
                        } else {
                            visitor._currentCustomerIDs[cidt] = {"id":cid};
                        }
                    }
                }
            }

            var
                customerIDsWithAuthState = visitor.getCustomerIDs(),
                customerIDsHash = visitor._getField(fieldMarketingCloudCustomerIDHash),
                customerIDsSerialized = "";
            if (!customerIDsHash) {
                customerIDsHash = 0;
            }
            for (cidt in customerIDsWithAuthState) {
                if (_isNOP(cidt)) {
                    cid = customerIDsWithAuthState[cidt];
                    customerIDsSerialized += (customerIDsSerialized ? "|" : "") + cidt + "|" + (cid["id"] ? cid["id"] : "") + (cid["authState"] ? cid["authState"] : "");
                }
            }
            visitor._newCustomerIDsHash = visitor._hash(customerIDsSerialized);
            if (visitor._newCustomerIDsHash != customerIDsHash) {
                visitor._customerIDsHashChanged = True;

                // Sync with mapping services
                visitor._mapCustomerIDs();
            }
        }
    };

    /*********************************************************************
    * Function getCustomerIDs(): Get Customer IDs set by setCustomerIDs and
    *                            the auth-state for each customer ID type
    * Returns:
    *     Customer IDs and auth-states
    *     {
    *          [customerIDType1]:{
    *               "id":[customerID1],
    *               "authState":[authState1]
    *          },
    *          [customerIDType2]:{
    *               "id":[customerID2],
    *               "authState":[authState2]
    *          }
    *          ...
    *     }
    *********************************************************************/
    visitor.getCustomerIDs = function() {
        visitor._readVisitor();
        var
            customerIDs = {},
            cidt,
            cid;
        // Pull in the currently provided customer IDs and authenticated states
        for (cidt in visitor._currentCustomerIDs) {
            if (_isNOP(cidt)) {
                cid = visitor._currentCustomerIDs[cidt];
                if (!customerIDs[cidt]) {
                    customerIDs[cidt] = {};
                }
                if (cid["id"]) {
                    customerIDs[cidt]["id"] = cid["id"];
                }
                if (cid["authState"] != Undefined) {
                    customerIDs[cidt]["authState"] = cid["authState"];
                } else {
                    customerIDs[cidt]["authState"] = thisClass.AuthState["UNKNOWN"];
                }
            }
        }
        return customerIDs;
    };

    /*********************************************************************
    * Function _setAnalyticsFields(analyticsData): Set the Analytics fields
    *     analyticsData = Analytics data
    * Returns:
    *     Nothing
    * Notes:
    *     See _setFields
    *********************************************************************/
    visitor._setAnalyticsFields = function(analyticsData) {
        visitor._readVisitor();
        visitor._setFields(fieldGroupAnalytics,analyticsData);
    };

    /*********************************************************************
    * Function setAnalyticsVisitorID(analyticsVisitorID): Set the analytics visitor ID
    *     analyticsVisitorID = Analytics visitor ID
    * Returns:
    *     Nothing
    * Notes:
    *     See _setAnalyticsFields
    *********************************************************************/
    visitor.setAnalyticsVisitorID = function(analyticsVisitorID) {
        visitor._setAnalyticsFields(analyticsVisitorID);
    };

    /*********************************************************************
    * Function getAnalyticsVisitorID(callback,forceCallCallback,gettingMarketingCloudVisitorID): Get the analytics visitor ID
    *     callback                       = Optional callback to register if visitor ID isn't ready yet
    *     forceCallCallback              = Option flag to force calling callback because the return will not be checked
    *     gettingMarketingCloudVisitorID = Option flag to also get the Marketing Cloud Visitor ID from the Analytics /id service
    * Returns:
    *     Blank visitor ID if not allowed or not ready
    *     Visitor ID if ready
    * Notes:
    *     See _getRemoteField
    *********************************************************************/
    visitor.getAnalyticsVisitorID = function(callback,forceCallCallback,gettingMarketingCloudVisitorID) {
        // Make sure we can actually support this
        if (visitor.isAllowed()) {
            var marketingCloudVisitorID = "";
            if (!gettingMarketingCloudVisitorID) {
                marketingCloudVisitorID = visitor.getMarketingCloudVisitorID(function(newMarketingCloudVisitorID){
                    visitor.getAnalyticsVisitorID(callback,True);
                });
            }
            if ((marketingCloudVisitorID) || (gettingMarketingCloudVisitorID)) {
                var
                    server = (gettingMarketingCloudVisitorID ? visitor.marketingCloudServer : visitor.trackingServer),
                    url = "";
                if (visitor.loadSSL) {
                    if (gettingMarketingCloudVisitorID) {
                        if (visitor.marketingCloudServerSecure) {
                            server = visitor.marketingCloudServerSecure;
                        }
                    } else if (visitor.trackingServerSecure) {
                        server = visitor.trackingServerSecure;
                    }
                }
                if (server) {
                    url = "http" + (visitor.loadSSL ? "s" : "") + "://" + server
                        + "/id"
                        + "?callback=s_c_il%5B" + visitor._in + "%5D._set" + (gettingMarketingCloudVisitorID ? "MarketingCloud" : "Analytics") + "Fields"
                        + "&mcorgid=" + encodeURIComponent(visitor.marketingCloudOrgID)
                        + (marketingCloudVisitorID ? "&mid=" + marketingCloudVisitorID : "")
                    ;
                }
                return visitor._getRemoteField((gettingMarketingCloudVisitorID ? fieldMarketingCloudVisitorID : fieldAnalyticsVisitorID),url,callback,forceCallCallback);
            }
        }
        return "";
    };

    /*********************************************************************
    * Function _setAudienceManagerFields(audienceManagerData): Set the AudienceManager fields
    *     audienceManagerData = AudienceManager data
    * Returns:
    *     Nothing
    * Notes:
    *     See _setFields
    *********************************************************************/
    visitor._setAudienceManagerFields = function(audienceManagerData) {
        visitor._readVisitor();
        visitor._setFields(fieldGroupAudienceManager,audienceManagerData);
    };

    /*********************************************************************
    * Function _getAudienceManagerURL(jsonpCallback): Generate an AAM request URL
    *     jsonpCallback = Optional JSONP callback function name
    * Returns:
    *     AAM Request URL
    *********************************************************************/
    visitor._getAudienceManagerURL = function(jsonpCallback) {
        var
            server = visitor.audienceManagerServer,
            url = "",
            marketingCloudVisitorID = visitor._getField(fieldMarketingCloudVisitorID),
            blob = visitor._getField(fieldAudienceManagerBlob,True),
            analyticsVisitorID = visitor._getField(fieldAnalyticsVisitorID),
            customerIDs = ((analyticsVisitorID) && (analyticsVisitorID != fieldValueNONE) ? "&d_cid_ic=AVID%01" + encodeURIComponent(analyticsVisitorID) : "");
        if ((visitor.loadSSL) && (visitor.audienceManagerServerSecure)) {
            server = visitor.audienceManagerServerSecure;
        }
        if (server) {
            var
                customerIDsWithAuthState = visitor.getCustomerIDs(),
                cidt,
                cid;
            if (customerIDsWithAuthState) {
                for (cidt in customerIDsWithAuthState) {
                    if (_isNOP(cidt)) {
                        cid = customerIDsWithAuthState[cidt];
                        customerIDs += "&d_cid_ic=" + encodeURIComponent(cidt) + "%01" + encodeURIComponent((cid["id"] ? cid["id"] : "")) + (cid["authState"] ? "%01" + cid["authState"] : "");
                    }
                }
            }
            if (!jsonpCallback) {
                jsonpCallback = "_setAudienceManagerFields";
            }
            url = "http" + (visitor.loadSSL ? "s" : "") + "://" + server
                + "/id"
                + "?d_rtbd=json"
                + "&d_ver=2"
                + ((!marketingCloudVisitorID) && (visitor._use1stPartyMarketingCloudServer) ? "&d_verify=1" : "")
                + "&d_orgid=" + encodeURIComponent(visitor.marketingCloudOrgID)
                + "&d_nsid=" + (visitor.idSyncContainerID || 0)
                + (marketingCloudVisitorID ? "&d_mid=" + marketingCloudVisitorID : "")
                + (blob ? "&d_blob=" + encodeURIComponent(blob) : "")
                + customerIDs
                + "&d_cb=s_c_il%5B" + visitor._in + "%5D." + jsonpCallback
            ;
        }
        return url;
    };

    /*********************************************************************
    * Function getAudienceManagerLocationHint(callback,forceCallCallback): Get the AudienceManager Location Hint
    *     callback          = Optional callback to register if location hint isn't ready
    *     forceCallCallback = Option flag to force calling callback because
    *                         the return will not be checked
    * Returns:
    *     Blank location hint if not allowed or not ready
    *     Location hint if ready
    * Notes:
    *     See _getRemoteField
    *********************************************************************/
    visitor.getAudienceManagerLocationHint = function(callback,forceCallCallback) {
        // Make sure we can actually support this
        if (visitor.isAllowed()) {
            var marketingCloudVisitorID = visitor.getMarketingCloudVisitorID(function(newMarketingCloudVisitorID){
                visitor.getAudienceManagerLocationHint(callback,True);
            });
            if (marketingCloudVisitorID) {
                var analyticsVisitorID = visitor._getField(fieldAnalyticsVisitorID);
                if (!analyticsVisitorID) {
                    analyticsVisitorID = visitor.getAnalyticsVisitorID(function(newAnalyticsVisitorID){
                        visitor.getAudienceManagerLocationHint(callback,True);
                    });
                }
                if (analyticsVisitorID) {
                    var
                        url = visitor._getAudienceManagerURL();
                    return visitor._getRemoteField(fieldAudienceManagerLocationHint,url,callback,forceCallCallback);
                }
            }
        }
        return "";
    };

    /*********************************************************************
    * Function getAudienceManagerBlob(callback,forceCallCallback): Get the AudienceManager blob
    *     callback          = Optional callback to register if blob isn't ready
    *     forceCallCallback = Option flag to force calling callback because
    *                         the return will not be checked
    * Returns:
    *     Blank blob if not allowed or not ready
    *     Blob if ready
    * Notes:
    *     See _getRemoteField
    *********************************************************************/
    visitor.getAudienceManagerBlob = function(callback,forceCallCallback) {
        // Make sure we can actually support this
        if (visitor.isAllowed()) {
            var marketingCloudVisitorID = visitor.getMarketingCloudVisitorID(function(newMarketingCloudVisitorID){
                visitor.getAudienceManagerBlob(callback,True);
            });
            if (marketingCloudVisitorID) {
                var analyticsVisitorID = visitor._getField(fieldAnalyticsVisitorID);
                if (!analyticsVisitorID) {
                    analyticsVisitorID = visitor.getAnalyticsVisitorID(function(newAnalyticsVisitorID){
                        visitor.getAudienceManagerBlob(callback,True);
                    });
                }
                if (analyticsVisitorID) {
                    var
                        url = visitor._getAudienceManagerURL();
                    if (visitor._customerIDsHashChanged) {
                        visitor._setFieldExpire(fieldAudienceManagerBlob,-1);
                    }
                    return visitor._getRemoteField(fieldAudienceManagerBlob,url,callback,forceCallCallback);
                }
            }
        }
        return "";
    };

    /*********************************************************************
    * Function getSupplementalDataID(consumerID,noGenerate): Get a supplemental-data ID for the consumer
    *     consumerID = Consumer ID requesting supplemental-data ID (AppMeasurement instance number, client-code+mbox ID, etc...)
    *     noGenerate = Optional flag to not generate a new supplemental-data ID if there isn't a current one
    * Returns:
    *     Hit-stitching ID to use for a single event
    *********************************************************************/
    visitor._supplementalDataIDCurrent = "";
    visitor._supplementalDataIDCurrentConsumed = {};
    visitor._supplementalDataIDLast = "";
    visitor._supplementalDataIDLastConsumed = {};
    visitor.getSupplementalDataID = function(consumerID,noGenerate) {
        // If we don't have a current supplemental-data ID generate one if needed
        if ((!visitor._supplementalDataIDCurrent) && (!noGenerate)) {
            visitor._supplementalDataIDCurrent = visitor._generateID(1);
        }
        // Default to using the current supplemental-data ID
        var
            supplementalDataID = visitor._supplementalDataIDCurrent;
        // If we have the last supplemental-data ID that has not been consumed by this consumer...
        if ((visitor._supplementalDataIDLast) && (!visitor._supplementalDataIDLastConsumed[consumerID])) {
            // Use the last supplemental-data ID
            supplementalDataID = visitor._supplementalDataIDLast;
            // Mark the last supplemental-data ID as consumed for this consumer
            visitor._supplementalDataIDLastConsumed[consumerID] = True;
        // If we are using te current supplemental-data ID at this point and we have a supplemental-data ID...
        } else if (supplementalDataID) {
            // If the current supplemental-data ID has already been consumed by this consumer..
            if (visitor._supplementalDataIDCurrentConsumed[consumerID]) {
                // Move the current supplemental-data ID to the last including the current consumed list
                visitor._supplementalDataIDLast            = visitor._supplementalDataIDCurrent;
                visitor._supplementalDataIDLastConsumed    = visitor._supplementalDataIDCurrentConsumed;
                // Generate a new current supplemental-data ID if needed, use it, and clear the current consumed list
                visitor._supplementalDataIDCurrent         = supplementalDataID = (!noGenerate ? visitor._generateID(1) : '');
                visitor._supplementalDataIDCurrentConsumed = {};
            }
            // If we still have a supplemental-data ID mark the current supplemental-data ID as consumed by this consumer
            if (supplementalDataID) {
                visitor._supplementalDataIDCurrentConsumed[consumerID] = True;
            }
        }
        // Return the supplemental-data ID to use
        return supplementalDataID;
    };

    /* Constants */
    var constants = {
        POST_MESSAGE_ENABLED: !!w.postMessage,
        DAYS_BETWEEN_SYNC_ID_CALLS: 1,
        MILLIS_PER_DAY: 24 * 60 * 60 * 1000
    };

    visitor._constants = constants;

    /*
     * a backwards compatible implementation of postMessage
     * by Josh Fraser (joshfraser.com)
     * released under the Apache 2.0 license.
     *
     * this code was adapted from Ben Alman's jQuery postMessage code found at:
     * http://benalman.com/projects/jquery-postmessage-plugin/
     *
     * other inspiration was taken from Luke Shepard's code for Facebook Connect:
     * http://github.com/facebook/connect-js/blob/master/src/core/xd.js
     *
     * the goal of this project was to make a backwards compatable version of postMessage
     * without having any dependency on jQuery or the FB Connect libraries
     *
     * my goal was to keep this as terse as possible since my own purpose was to use this
     * as part of a distributed widget where filesize could be sensative.
     *
     */
    visitor._xd = {
        /*********************************************************************
         * Function postMessage(message, target_url, target): Post message to iframe
         *     message = specially formatted data
         *     target_url = iframe src
         *     target = iframe.contentWindow
         * Returns:
         *     Nothing
         *********************************************************************/
        postMessage: function (message, target_url, target) {
            var cache_bust = 1;

            if (!target_url) {
                return;
            }

            if (constants.POST_MESSAGE_ENABLED) {
                // the browser supports window.postMessage, so call it with a targetOrigin
                // set appropriately, based on the target_url parameter.
                target.postMessage(message, target_url.replace(/([^:]+:\/\/[^\/]+).*/, '$1'));

            } else if (target_url) {
                // the browser does not support window.postMessage, so set the location
                // of the target to target_url#message. A bit ugly, but it works! A cache
                // bust parameter is added to ensure that repeat messages trigger the callback.
                target.location = target_url.replace(/#.*$/, '') + '#' + (+new Date()) + (cache_bust++) + '&' + message;
            }
        },
        /*********************************************************************
         * Function receiveMessage(callback, source_origin): receive message from iframe
         *     callback = function
         *     source_origin = iframe hostname
         * Returns:
         *     Nothing
         *********************************************************************/
        receiveMessage: function(callback, source_origin) {
            var attached_callback;

            try {
                // browser supports window.postMessage
                if (constants.POST_MESSAGE_ENABLED) {
                    // bind the callback to the actual event associated with window.postMessage
                    if (callback) {
                        attached_callback = function (e) {
                            if ((typeof source_origin === 'string' && e.origin !== source_origin) || (Object.prototype.toString.call(source_origin) === '[object Function]' && source_origin(e.origin) === !1)) {
                                return !1;
                            }
                            callback(e);
                        };
                    }
                    if (window.addEventListener) {
                        window[callback ? 'addEventListener' : 'removeEventListener']('message', attached_callback, !1);
                    } else {
                        window[callback ? 'attachEvent' : 'detachEvent']('onmessage', attached_callback);
                    }
                }
            } catch (__Error__) {}
        }
    };

    /* Helpers */
    var helpers = {
        /*********************************************************************
         * Function addListener(element, eventType, callback): Add cross-browser event listener
         *     element = DOM element
         *     eventType = e.g., 'load'
         *     callback = function
         * Returns:
         *     Nothing
         *********************************************************************/
        addListener: (function() {
            if (d.addEventListener) {
                return function (element, eventType, callback) {
                    element.addEventListener(eventType, function (event) {
                        if (typeof callback === 'function') {
                            callback(event);
                        }
                    }, False);
                };
            } else if (d.attachEvent) {
                return function (element, eventType, callback) {
                    element.attachEvent('on' + eventType, function (event) {
                        if (typeof callback === 'function') {
                            callback(event);
                        }
                    });
                };
            }
        }()),
        /*********************************************************************
         * Function map(arr, fun): cross-browser Array map function
         *     arr = array
         *     fun = function called at each iteration
         * Returns:
         *     mapped array
         *********************************************************************/
        map: function (arr, fun) {
            // Adapted from MDC
            if (!Array.prototype.map) {
                if (arr === void 0 || arr === Null) {
                    throw new TypeError();
                }

                var t = Object(arr);
                var len = t.length >>> 0;

                if (typeof fun !== 'function') {
                    throw new TypeError();
                }

                var res = new Array(len);
                var thisp = arguments[1];
                for (var i = 0; i < len; i++) {
                    if (i in t) {
                        res[i] = fun.call(thisp, t[i], i, t);
                    }
                }

                return res;
            } else {
                return arr.map(fun);
            }
        },
        /*********************************************************************
         * Function encodeAndBuildRequest(arr, character): Take an array, encode it and join it on a character
         *     array = array to encode and join
         *     character = character join with
         * Returns:
         *     string representing the sanitized values
         * Example:
         *     encodeAndBuildRequest(['a=2', 'b=2'], '&'); // 'a%3D2&b%3D2'
         *********************************************************************/
        encodeAndBuildRequest: function (arr, character) {
            return this.map(arr, function (c) {
                return encodeURIComponent(c);
            }).join(character);
        }
    };

    visitor._helpers = helpers;

    /* Destination publishing for id syncs */
    var destinationPublishing = {
        THROTTLE_START: 30000,
        MAX_SYNCS_LENGTH: 649,
        throttleTimerSet: False,
        id: Null,
        iframeHost: Null,
        /*********************************************************************
         * Function getIframeHost(url): get hostname of iframe src
         *     url = iframe src
         * Returns:
         *     hostname
         * Example:
         *     getIframeHost('http://fast.demofirst.demdex.net/dest5.html') // http://fast.demofirst.demdex.net
         *********************************************************************/
        getIframeHost: function(url) {
            if (typeof url === 'string') {
                var split = url.split('/');

                return split[0] + '//' + split[2];
            }
        },
        subdomain: Null,
        url: Null,
        /*********************************************************************
         * Function getUrl(): get iframe src
         * Returns:
         *     iframe src
         *********************************************************************/
        getUrl: function() {
            var prefix = 'http://fast.',
                suffix = '?d_nsid=' + visitor.idSyncContainerID + '#' + encodeURIComponent(d.location.href),
                url;

            if (!this.subdomain) {
                this.subdomain = 'nosubdomainreturned';
            }

            if (visitor.loadSSL) {
                if (visitor.idSyncSSLUseAkamai) {
                    prefix = 'https://fast.';
                } else {
                    prefix = 'https://';
                }
            }

            url = prefix + this.subdomain + '.demdex.net/dest5.html' + suffix;
            this.iframeHost = this.getIframeHost(url);
            this.id = 'destination_publishing_iframe_' + this.subdomain + '_' + visitor.idSyncContainerID;

            return url;
        },
        /*********************************************************************
         * Function checkDPIframeSrc(): get iframe src from visitor._dpIframeSrc if it exists
         * Returns:
         *     iframe src
         *********************************************************************/
        checkDPIframeSrc: function() {
            var suffix = '?d_nsid=' + visitor.idSyncContainerID + '#' + encodeURIComponent(d.location.href);

            if (typeof visitor._dpIframeSrc === 'string' && visitor._dpIframeSrc.length) {
                this.id = 'destination_publishing_iframe_' + new Date().getTime() + '_' + visitor.idSyncContainerID;
                this.iframeHost = this.getIframeHost(visitor._dpIframeSrc);
                this.url = visitor._dpIframeSrc + suffix;
            }
        },
        idCallNotProcesssed: Null,
        startedAttachingIframe: False,
        iframeHasLoaded: False,
        iframeIdChanged: False,
        newIframeCreated: False,
        originalIframeHasLoadedAlready: False,
        sendingMessages: False,
        messages: [],
        messagesPosted: [],
        messagesReceived: [],
        messageSendingInterval: constants.POST_MESSAGE_ENABLED ? 15 : 100, // 100 ms for IE6/7, 15 ms for all other major modern browsers
        jsonWaiting: [],
        jsonProcessed: [],
        canSetThirdPartyCookies: True,
        receivedThirdPartyCookiesNotification: False,
        /*********************************************************************
         * Function attachIframe(): attach iframe
         * Returns:
         *     Nothing
         *********************************************************************/
        attachIframe: function () {
            this.startedAttachingIframe = True;

            var self = this,
                iframe = document.getElementById(this.id);

            if (!iframe) {
                createNewIframe();
            } else if (iframe.nodeName !== 'IFRAME') {
                this.id += '_2';
                this.iframeIdChanged = True;
                createNewIframe();
            } else {
                this.newIframeCreated = False;

                // This class name is set by Visitor API
                if (iframe.className !== 'aamIframeLoaded') {
                    this.originalIframeHasLoadedAlready = False;
                    addLoadListener();
                } else {
                    this.originalIframeHasLoadedAlready = True;
                    this.iframeHasLoaded = True;
                    this.requestToProcess();
                }
            }

            function createNewIframe() {
                iframe = document.createElement('iframe');
                iframe.id = self.id;
                iframe.style.cssText = 'display: none; width: 0; height: 0;';
                iframe.src = self.url;
                self.newIframeCreated = True;
                addLoadListener();
                document.body.appendChild(iframe);
            }

            function addLoadListener() {
                helpers.addListener(iframe, 'load', function () {
                    iframe.className = 'aamIframeLoaded';
                    self.iframeHasLoaded = True;
                    self.requestToProcess();
                });
            }

            this.iframe = iframe;
        },
        /*********************************************************************
         * Function requestToProcess(json): queues json, then processes the queue when conditions are met
         *     json = id sync json
         * Returns:
         *     Nothing
         *********************************************************************/
        requestToProcess: function(json) {
            var self = this;

            if (json === Object(json)) {
                this.jsonWaiting.push(json);
            }

            // IE6/7 will not receive ThirdPartyCookiesNotification
            if ((this.receivedThirdPartyCookiesNotification || !constants.POST_MESSAGE_ENABLED || this.iframeHasLoaded) && this.jsonWaiting.length) {
                this.process(this.jsonWaiting.shift());
                this.requestToProcess();
            }

            if (!visitor.idSyncDisableSyncs && this.iframeHasLoaded && this.messages.length && !this.sendingMessages) {
                if (!this.throttleTimerSet) {
                    this.throttleTimerSet = True;

                    setTimeout(function() {
                        self.messageSendingInterval = constants.POST_MESSAGE_ENABLED ? 15 : 150; // 150 ms for IE6/7, 15 ms for all other major modern browsers
                    }, this.THROTTLE_START);
                }

                this.sendingMessages = True;
                this.sendMessages();
            }
        },
        /*********************************************************************
         * Function process(json): processes json for sending to iframe
         *     json = id sync json
         * Returns:
         *     Nothing
         *********************************************************************/
        process: function (json) {
            var f = encodeURIComponent,
                declaredIdString = '',
                key, l, i, k, a, cb, callback;

            if ((key = json.ibs) && key instanceof Array && (l = key.length)) {
                for (i = 0; i < l; i++) {
                    k = key[i];

                    a = [f('ibs'), f(k.id || ''), f(k['tag'] || ''), helpers.encodeAndBuildRequest(k.url || [], ','), f(k.ttl || ''), '', declaredIdString, k.fireURLSync ? 'true' : 'false'];

                    if (this.canSetThirdPartyCookies) {
                        this.addMessage(a.join('|'));
                    } else if (k.fireURLSync) {
                        this.checkFirstPartyCookie(k, a.join('|'));
                    }
                }
            }

            this.jsonProcessed.push(json);
        },
        /*********************************************************************
         * Function checkFirstPartyCookie(config, message): checks if id sync should be fired, and sets control cookie
         *     config = id sync config
         *     message = id sync message
         * Returns:
         *     Nothing
         *********************************************************************/
        checkFirstPartyCookie: function(config, message) {
            visitor._readVisitor();

            var syncs = visitor._getField(fieldMarketingCloudSyncs),
                dataPresent = False,
                dataValid = False,
                now = Math.ceil(new Date().getTime() / constants.MILLIS_PER_DAY),
                data, pruneResult;

            if (syncs) {
                data = syncs.split('*');
                pruneResult = this.pruneSyncData(data, config.id, now);
                dataPresent = pruneResult.dataPresent;
                dataValid = pruneResult.dataValid;

                if (!dataPresent || !dataValid) {
                    this.addMessage(message);
                    data.push(config.id + '-' + (now + Math.ceil(config.ttl / 60 / 24)));
                    this.manageSyncsSize(data);
                    visitor._setField(fieldMarketingCloudSyncs, data.join('*'));
                }
            } else {
                this.addMessage(message);
                visitor._setField(fieldMarketingCloudSyncs, config.id + '-' + (now + Math.ceil(config.ttl / 60 / 24)));
            }
        },
        /*********************************************************************
         * Function pruneSyncData(data, id, now): removes expired id syncs and returns status of current id sync tracker
         *     data = array of id sync trackers
         *     id = data provider id
         *     now = current date in days since epoch
         * Returns:
         *     {
         *         dataPresent: <boolean>,
         *         dataValid: <boolean>
         *     }
         *********************************************************************/
        pruneSyncData: function(data, id, now) {
            var dataPresent = False,
                dataValid = False,
                tinfo, i, tstamp;

            for (i = 0; i < data.length; i++) {
                tinfo = data[i];
                tstamp = parseInt(tinfo.split('-')[1], 10);

                if (tinfo.match('^' + id + '-')) {
                    dataPresent = True;

                    if (now < tstamp) {
                        dataValid = True;
                    } else {
                        data.splice(i, 1);
                        i--;
                    }
                } else {
                    if (now >= tstamp) {
                        data.splice(i, 1);
                        i--;
                    }
                }
            }

            return {
                dataPresent: dataPresent,
                dataValid: dataValid
            }
        },
        /*********************************************************************
         * Function manageSyncsSize(data): replaces id sync trackers that are soonest to expire until size is within limit
         *     data = array of id sync trackers
         * Returns:
         *     Nothing
         *********************************************************************/
        manageSyncsSize: function(data) {
            if (data.join('*').length > this.MAX_SYNCS_LENGTH) {
                data.sort(function(a, b) {
                    return parseInt(a.split('-')[1], 10) - parseInt(b.split('-')[1], 10);
                });

                while (data.join('*').length > this.MAX_SYNCS_LENGTH) {
                    data.shift();
                }
            }
        },
        /*********************************************************************
         * Function addMessage(m): adds prefix to message, then queues for sending
         *     m = id sync message
         * Returns:
         *     Nothing
         *********************************************************************/
        addMessage: function(m) {
            var f = encodeURIComponent,
                identifier = visitor._enableErrorReporting ? f('---destpub-debug---') : f('---destpub---');

            this.messages.push(identifier + m);
        },
        /*********************************************************************
         * Function sendMessages(): sends messages to iframe
         * Returns:
         *     Nothing
         *********************************************************************/
        sendMessages: function () {
            var self = this,
                message;

            if (this.messages.length) {
                message = this.messages.shift();
                visitor._xd.postMessage(message, this.url, this.iframe.contentWindow);
                this.messagesPosted.push(message);

                setTimeout(function () {
                    self.sendMessages();
                }, this.messageSendingInterval);
            } else {
                this.sendingMessages = False;
            }
        },
        /*********************************************************************
         * Function receiveMessage(message): receives messages from iframe
         *     message = message from iframe
         * Returns:
         *     Nothing
         *********************************************************************/
        receiveMessage: function(message) {
            var prefix = /^---destpub-to-parent---/,
                split;

            if (typeof message === 'string' && prefix.test(message)) {
                split = message.replace(prefix, '').split('|');

                if (split[0] === 'canSetThirdPartyCookies') {
                    this.canSetThirdPartyCookies = (split[1] === 'true') ? True : False;
                    this.receivedThirdPartyCookiesNotification = True;
                    this.requestToProcess();
                }

                this.messagesReceived.push(message);
            }
        },
        /*********************************************************************
         * Function processIDCallData(json): processes id sync data from /id call response
         *     json = id sync data from /id call response
         * Returns:
         *     Nothing
         *********************************************************************/
        processIDCallData: function(json) {
            if (this.url === Null) {
                if (typeof visitor._subdomain === 'string' && visitor._subdomain.length) {
                    this.subdomain = visitor._subdomain;
                } else {
                    this.subdomain = json.subdomain || '';
                }

                this.url = this.getUrl();
            }

            if (this.subdomain && this.subdomain !== 'nosubdomainreturned' && !this.startedAttachingIframe) {
                if (thisClass.windowLoaded || d.readyState === 'complete' || d.readyState === 'loaded') {
                    this.attachIframe();
                }
            }

            if (typeof visitor.idSyncIDCallResult === 'function') {
                visitor.idSyncIDCallResult(json);
            } else {
                this.requestToProcess(json);
            }

            if (typeof visitor.idSyncAfterIDCallResult === 'function') {
                visitor.idSyncAfterIDCallResult(json);
            }
        },
        /*********************************************************************
         * Function canMakeSyncIDCall(idTS, nowTS): checks if /id call specific to id syncs should be made
         *     idTS = timestamp of wait expiration
         *     nowTS = current date in days since epoch
         * Returns:
         *     boolean
         *********************************************************************/
        canMakeSyncIDCall: function(idTS, nowTS) {
            return visitor._forceSyncIDCall || !idTS || nowTS - idTS > constants.DAYS_BETWEEN_SYNC_ID_CALLS;
        }
    };

    visitor._destinationPublishing = destinationPublishing;

    /* Init */
    if (marketingCloudOrgID.indexOf("@") < 0) {
        marketingCloudOrgID += "@AdobeOrg";
    }
    visitor.marketingCloudOrgID = marketingCloudOrgID;

    // Setup the config to use for cookies
    visitor.cookieName = "AMCV_" + marketingCloudOrgID;
    visitor.cookieDomain = visitor._getDomain();
    if (visitor.cookieDomain == w.location.hostname) {
        visitor.cookieDomain = "";
    }

    // Setup config for loading external data
    visitor.loadSSL = (w.location.protocol.toLowerCase().indexOf("https") >= 0);
    visitor.loadTimeout = 500;

    // Setup defaults
    visitor.marketingCloudServer = visitor.audienceManagerServer = "dpm.demdex.net";

    // Handle initConfig
    if ((initConfig) && (typeof(initConfig) == "object")) {
        // Apply initConfig
        var initVar;
        for (initVar in initConfig) {
            if (_isNOP(initVar)) {
                visitor[initVar] = initConfig[initVar];
            }
        }

        visitor.idSyncContainerID = visitor.idSyncContainerID || 0;

        // Public initConfig options
        // idSyncContainerID, idSyncSSLUseAkamai, idSyncDisableSyncs, idSyncIDCallResult, idSyncAfterIDCallResult

        // Internal initConfig options
        // _dpIframeSrc, _subdomain, _enableErrorReporting, _forceSyncIDCall

        visitor._readVisitor();

        var idTS = visitor._getField(fieldMarketingCloudIDCallTimeStamp),
            nowTS = Math.ceil(new Date().getTime() / constants.MILLIS_PER_DAY);

        if (!visitor.idSyncDisableSyncs && destinationPublishing.canMakeSyncIDCall(idTS, nowTS)) {
            visitor._setFieldExpire(fieldAudienceManagerBlob,-1);
            visitor._setField(fieldMarketingCloudIDCallTimeStamp, nowTS);
        }

        visitor.getMarketingCloudVisitorID();
        visitor.getAudienceManagerLocationHint();
        visitor.getAudienceManagerBlob();
    }

    if (!visitor.idSyncDisableSyncs) {
        destinationPublishing.checkDPIframeSrc();

        helpers.addListener(window, 'load', function() {
            var dp = destinationPublishing;

            thisClass.windowLoaded = True;

            if (dp.subdomain && dp.subdomain !== 'nosubdomainreturned' && dp.url && !dp.startedAttachingIframe) {
                dp.attachIframe();
            }
        });

        try {
            visitor._xd.receiveMessage(function(message) {
                destinationPublishing.receiveMessage(message.data);
            }, destinationPublishing.iframeHost);
        } catch (__Error__) {}
    }
}

/*********************************************************************
* Function getInstance(marketingCloudOrgID,initConfig): Finds instance for a marketingCloudOrgID
*     marketingCloudOrgID = Marketing Cloud Organization ID to use
*     initConfig          = Optional initial config object allowing the constructor to fire
*                           off requests immediately instead of lazily
* Returns:
*     Instance
*********************************************************************/
Visitor["getInstance"] = function(marketingCloudOrgID,initConfig) {
    /**
      * @type {Visitor}
      * @noalias
      */
    var visitor;
    var
        instanceList = window.s_c_il,
        instanceNum;

    if (marketingCloudOrgID.indexOf("@") < 0) {
        marketingCloudOrgID += "@AdobeOrg";
    }
    if (instanceList) {
        for (instanceNum = 0;instanceNum < instanceList.length;instanceNum++) {
            visitor = instanceList[instanceNum];
            if ((visitor) && (visitor._c == "Visitor") &&
                (visitor.marketingCloudOrgID == marketingCloudOrgID)) {
                return visitor;
            }
        }
    }
    return new Visitor(marketingCloudOrgID,initConfig);
};

// Set Visitor.windowLoaded to true on window load
(function() {
    // This is a hack to keep Google Closure Compiler from creating a global variable for true
    var thisClass = window['Visitor'],
        True = thisClass.True;

    if (!True) {
        True = true;
    }

    function loadCallback() {
        thisClass.windowLoaded = True;
    }

    if (window.addEventListener) {
        window.addEventListener('load', loadCallback);
    } else if (window.attachEvent) {
        window.attachEvent('onload', loadCallback);
    }
}());