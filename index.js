"use strict";

var AWS = require("aws-sdk");
var s3 = new AWS.S3();

var identityPoolId = "COGNITO_IDENTITY_POOL";
var developerProviderName = "COGNITO_DEVELOPER_PROVIDER_NAME";

var cognito = new AWS.CognitoIdentity();

function getIdentityToken(userIdentifier, identityId, callback) {
    
    // TODO:  some type of lookup to validate the userIdentifier
    
    var params = {
        IdentityPoolId: identityPoolId,
        IdentityId: identityId,
		Logins: {}
	};
    params.Logins[developerProviderName] = userIdentifier;
    cognito.getOpenIdTokenForDeveloperIdentity(param, function(err, data) {
        if (err) {
            return callback(err);
        }
        else {
            callback(null, data.IdentityId, data.Token);
        }
    });
}

module.exports.handler = function(event, context) {
    var userIdentifier = event.body.userIdentifier;
    var identityId = event.body.identityId;
    getIdentityToken(userIdentifier, identityId, function(err, identityId, token) {
        if (err) {
            context.fail("Error in getToken: " + err);
	    }
        else {
            context.succeed({
                success: true,
                identityId: identityId,
                token: token,
                userIdentifier: userIdentifier
            });
        }
    });
}