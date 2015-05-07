jQuery.getScript('http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/aes.js', function () {
	$.extend(dontpad, {
		passphrase: undefined,

		update: function() {
			if (!dontpad.passphrase) return;

			$.ajax({
				data: { lastUpdate: $('#lastUpdate').val() },
				url: document.location + '.body.json',
		        contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		        dataType: 'json',
		        type: "GET",
		        success: function(result) {
			        	if (result && result.changed) {
			        		dontpad.$text.val(CryptoJS.AES.decrypt(result.body, dontpad.passphrase).toString());
			        		$('#lastUpdate').val(result.lastUpdate);
			        	}
			        	dontpad.$noConnectionAlert.hide();
		        },
		        error: function() {
		        		dontpad.$noConnectionAlert.show();
		        }
			});
		},

		save: function() {
			if (!dontpad.passphrase) return;

			if (dontpad.changed) {
				dontpad.changed = false;
				$.ajax({
					data: { text: CryptoJS.AES.encrypt(dontpad.$text.val(), dontpad.passphrase).toString() },
					url: document.location,
			        contentType: "application/x-www-form-urlencoded;charset=UTF-8",
			        type: "POST",
			        dataType: 'json',
			        success: function(result) {
			        	$('#lastUpdate').val(result);
			        }
				});
			}
		}	
	});

	// Disables the input.
	dontpad.$text.css('background-color', '#ecc');
	dontpad.$text.attr('disabled', 'disabled');

	// Asks for the passphrase and test it.
	var pass = prompt('Please enter your passphrase for this document.');
	if (!pass) { alert('Aborted.'); return; }
	var decrypted = CryptoJS.AES.decrypt(dontpad.$text.val(), pass);
    if (decrypted.sigBytes < 0) {
    	// Nope.
    	alert('Wrong passphrase.');
    } else {
    	// Enables it.
    	dontpad.$text.css('background-color', '#cec');
    	dontpad.$text.removeAttr('disabled');
    	dontpad.$text.val(decrypted.toString(CryptoJS.enc.Utf8));
    	dontpad.passphrase = pass;
    }
});