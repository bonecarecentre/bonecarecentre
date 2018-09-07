 // Initialize Firebase
var config = {
	apiKey: "AIzaSyB0fZqSLJHJWx2JtdHswzAhZxwfQ-hgfPM",
	authDomain: "bonecarecentre-890e1.firebaseapp.com",
	databaseURL: "https://bonecarecentre-890e1.firebaseio.com",
	projectId: "bonecarecentre-890e1",
	storageBucket: "bonecarecentre-890e1.appspot.com",
	//messagingSenderId: "761728794886"
};
firebase.initializeApp(config);
 var getJSON = firebase.functions().httpsCallable('getJSON');
    getJSON().then(function(result) {
        console.log(JSON.stringify(result.data));
    }).catch(function(error) {
        // Getting the Error details.
        var code = error.code;
        var message = error.message;
        var details = error.details;
        // ...
    });
// Get a reference to the database service
var database = firebase.database();
	
function writeUserData(userId, name ,isadmin) {
  	firebase.database().ref('users/' + userId).set({
	    name: name,
	    isadmin: isadmin
  	}).catch(function(error){
  		alert(error.message);
	});
}
function writePatientData(pname, pdob ,gender) {
	firebase.database().ref().child("patients").child(pname+"-"+pdob).once('value', function (snapshot) {
	   	if (snapshot.exists()) {
	        // get the ref (in this case /users/2) and update its contents
	        alert("User already exists with same name and date of birth");
	    } else {
	        	var newpkey = pname+"-"+pdob;
			  	firebase.database().ref('patients/' + newpkey).set({
			    	pname: pname,
			    	pdob: pdob,
			    	gender: gender,
			    	pnamesearch: pname.toLowerCase()
			  	}).catch(function(error){
			  		alert(error.message);
				}).then(function(){
					//alert("Patient: "+pname+", Added");
				});
	    }
   	});
}
function writeVisitData(userid, visitdate, visittime, prescription, doctornotes, nextappointment) {
  	firebase.database().ref('patientHistory/'+userid+'/'+visitdate+' '+visittime).set({
	    prescription: prescription,
	    doctornotes: doctornotes,
	    nextappointment: nextappointment
  	}).catch(function(error){
  		alert(error.message);
	});
	var updates = {};
	updates['lastvisit'] = visitdate+' '+visittime
	firebase.database().ref('patients/'+userid).update(updates);
}
function deleteall() {
	firebase.database().ref().child("patients").once('value', function (snapshot) {

	        	
			  	firebase.database().ref('patients').set({
			    	pname: "xyz"
			  	});
	    });
}
  