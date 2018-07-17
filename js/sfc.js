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
	let myAjax = (surl, oData, way) => {
  	    return new Promise((resolve, reject) => {
	        $.ajax({
			    url: surl,
	            type: way,
	            data: JSON.stringify(oData),
	            contentType: 'application/json',
	            //dataType: 'json',
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

	let formatPhoneNumber = (phone) => {
	    //normalize string and remove all unnecessary characters
	    let phone2 = phone.replace(/\D+/g, '');

	    //check if number length equals to 10
	    if (phone2.length == 10) {
	        //reformat and return phone number
	        return phone2.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
	    }

	    return phone;
	}
		
	return {
	  //getData,
	    myAjax,
	    formatPhoneNumber,
	}

})();