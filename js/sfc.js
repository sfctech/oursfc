;
const sfc = (() => {
	const options = {
	  protocol : 'https:',
	  hostname : '//api.mlab.com',
	  domain: "/api/1/databases/sfcdb/collections?apiKey=",
	  apiKey: "m1QZo1IgF6SGC5zAgYCcseYPWf5xIsRS"
	}
	
	const $GetUrl = options.protocol + options.hostname + options.domain + options.apiKey;
/*
  let getData = (surl = $GetUrl) => {
  	return new Promise((resolve, reject) => {
	    $.ajax({
			    url: surl,
	        type: 'GET',
	        contentType: 'application/json',
	        dataType: 'json',
	        async: true,
	        timeout: 5000,
	        // callback handler that will be called on success
	        success: function (data, textStatus, jqXHR) {
	            //console.info(JSON.stringify(data, null, 2));
	            resolve(data);
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	            if (textStatus == "timeout")
	                console.error("Timeout! network condition is bad", "error");
	            else if (textStatus == "abort")
	                console.error("Request aborted", "error");
	            else
	                console.error("Failed to load data", "error");
	            
	            reject(errorThrown);
	        },
	        complete: function (jqXHR, textStatus) {
	        	  console.log(jqXHR.status + ", " + jqXHR.statusText);
	        		console.log(jqXHR.getAllResponseHeaders());
	            if (textStatus !== "success") {
	                console.error("The errror status: " + textStatus);
	            }
	        }
	    });
    });
	};
*/	
	const myAjax = (surl, oData, way) => {
  	    return new Promise((resolve, reject) => {
	        $.ajax({
			    url: surl,
	            type: way,
	            data: JSON.stringify(oData),
	            contentType: 'application/json',
	            //dataType: 'json',
	            async: true,
                timeout: 5000,
                crossDomain: true,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                },
	            // callback handler that will be called on success
	            success: function (data, textStatus, jqXHR) {
	                //console.info(JSON.stringify(data, null, 2));
	                resolve(data);
	            },
	            error: function (jqXHR, textStatus, errorThrown) {
	                if (textStatus == "timeout")
	                    console.error("Timeout! network condition is bad", "error");
	                else if (textStatus == "abort")
	                    console.error("Request aborted", "error");
	                else
	                    console.error("Failed to load data", "error");
	            
	                reject(errorThrown);
	            },
	            complete: function (jqXHR, textStatus) {
	        	      console.log(jqXHR.status + ", " + jqXHR.statusText);
	        		    console.log(jqXHR.getAllResponseHeaders());
	                if (textStatus !== "success") {
	                    console.error("The errror status: " + textStatus);
	                }
	            }
	        });
        });
    };

	const formatPhoneNumber = (phone) => {
	    //normalize string and remove all unnecessary characters
	    let phone2 = phone.replace(/\D+/g, '');

	    //check if number length equals to 10
	    if (phone2.length == 10) {
	        //reformat and return phone number
	        return phone2.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
	    }

	    return phone;
    }

    const getFormattedTime = () => {
        var today = new Date();
        var y = today.getFullYear();
        // JavaScript months are 0-based.
        var m = (today.getMonth() < 9) ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
        var d = (today.getDate() < 10) ? "0" + today.getDate() : today.getDate();
        var h = (today.getHours() < 10) ? "0" + today.getHours() : today.getHours();
        var mi = (today.getMinutes() < 10) ? "0" + today.getMinutes() : today.getMinutes();
        var s = (today.getSeconds() < 10) ? "0" + today.getSeconds() : today.getSeconds();
        return y + "-" + m + "-" + d + " " + h + ":" + mi + ":" + s;
    }

    const getBase64FromFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                //let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
                //if ((encoded.length % 4) > 0) {
                //    encoded += '='.repeat(4 - (encoded.length % 4));
                //}
                //resolve(encoded);

                resolve(reader.result);
            }
            reader.onerror = error => reject(error);
        });
    }

    const htmlEscape = (str) => {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    const deHtmlEscape = (str) => {
        return String(str)
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    }
		
	return {
	  //getData,
        myAjax,
        formatPhoneNumber,
        getFormattedTime,
        getBase64FromFile,
        htmlEscape,
        deHtmlEscape,
	}

})();