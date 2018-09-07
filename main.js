var modal1 = document.getElementById('myModal-verifyacc');
var modal2 = document.getElementById('myModal-addpatient');
var modal3 = document.getElementById('myModal-patientdetails');
var modal31 = document.getElementById('myModal-searchres');
var modal32 = document.getElementById('myModal-patientrec');
var modal321 = document.getElementById('myModal-visitdetails');

function clearmodal(modal){

  if(modal===1){
      $("#mainbuttons").removeClass("blur");
      $("#footer").removeClass("blur");
      modal1.style.display = "none";
      $("#userid").val('');
      $("#inputname").val('');
      return;
    }
  if(modal===2){
      $("#mainbuttons").removeClass("blur");
      $("#footer").removeClass("blur");
      modal2.style.display = "none";
      $("#inputpname").val('');
      $("#inputpdob").val('');
      return;
    }
   if(modal===3){
      $("#mainbuttons").removeClass("blur");
      $("#footer").removeClass("blur");
      modal3.style.display = "none";
      $("#patientslisttable > tbody").html("");
      $("#searchpname").val('');
      return;
    } 
    if(modal===31){
      modal31.style.display = "none";
      $("#searchresult > tbody").html("");
      return;
    } 
    if(modal===32){
      modal32.style.display = "none";
      $("#patientname").html("");
      $("#patientdob").html("");
      $("#patientgender").html("");
      return;
    } 
    if(modal===321){
      modal321.style.display = "none";
      //add later

      return;
    } 
}
function openmodal(modal){
  $("#footer").addClass("blur");
  $("#mainbuttons").addClass("blur");
  if(modal===1){
      modal1.style.display = "block";
      return;
    }
  if(modal===2){
      modal2.style.display = "block";
      return;
    }
   if(modal===3){
      activetab("#searchtab","search","tabcontent1","tablinks1");
      modal3.style.display = "block";
      return;
    } 
    if(modal===31){
      modal31.style.display = "block";
      return
    }
    if(modal===32){
      activetab("#addvisittab","addvisit","tabcontent2","tablinks2");
      addvisit();
      modal32.style.display = "block";
      return
    }
     if(modal===321){
      modal321.style.display = "block";
      return
    }
}

function redirect() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
            document.location.href = "index.html";
      }
      else{
          //logged in
          database.ref('/users/' + user.uid).once('value').then(function(snapshot) {
            var username = (snapshot.val() && snapshot.val().name) || 'Anonymous';
            if(snapshot.val().isadmin){
                document.querySelector('#userstatus').innerHTML = "Admin: " + username+"";
                document.getElementById("btnverifyacc").classList.remove("hide");
              }
            else
                document.querySelector('#userstatus').innerHTML = "Manager: " + username+"";
          });
      }
    });
}
 
function logoutfunc() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
     document.location.href = "index.html";
}

function verifyaccfunc() {
  // Get the modal
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
     openmodal(1);
  span.onclick = function() {    
      clearmodal(1);
  }
}
function addpatientfunc() {
  var span = document.getElementsByClassName("close")[1];
     openmodal(2);
  span.onclick = function() {
      clearmodal(2);
  }
}
function patientdetails(){
var span = document.getElementsByClassName("close")[2];
     openmodal(3);
  span.onclick = function() {
      clearmodal(3);
  }
}

//add admin confirm
function confirmverifyacc(){
  
  var userid = document.querySelector('#userid');
  var inputname = document.querySelector('#inputname');
  var acctype = document.querySelector('#admin');
  if(userid.value == "" || userid.value == null || inputname.value == "" || inputname.value == null)
         alert("Required Field is empty");
  else
     writeUserData(userid.value,inputname.value,acctype.checked)
   clearmodal(1);

}
function confirmaddpatient(){

  var inputpname = document.querySelector('#inputpname');
  var inputpdob = document.querySelector('#inputpdob');
  var gender = "Male";
  if(document.querySelector('#pfemale').checked)
    gender="Female";
  if(inputpdob.value == "" || inputpdob.value == null || inputpname.value == "" || inputpname.value == null)
         alert("Required Field is empty/incorrect");
  else
  {
     writePatientData(inputpname.value,inputpdob.value,gender);
     alert("Patient: "+inputpname.value+" added");
  }
    clearmodal(2);

}

function searchpatient(){
  var searchpname = document.querySelector('#searchpname');
  if(searchpname.value == "" || searchpname.value == null)
         alert("Required Field is empty/incorrect");
  else{
        var span = document.getElementsByClassName("close")[3];
        span.onclick = function() {    
            clearmodal(31);
        }
      openmodal(31);
      var table = $("#searchresult").find("tbody");
      $("#searchresult").addClass("loader");
      var content="";
       $("#searchresult > tbody").html("");
      var isFound = false;

      firebase.database().ref('patients').orderByChild('pnamesearch').startAt(searchpname.value.toLowerCase()).endAt(searchpname.value.toLowerCase()+"\uf8ff").on('value',function (snapshot) {
        $("#searchresult > tbody").html("");
        snapshot.forEach(function(data) {
          isFound=true;
          content="";
          content +='<tr><td>' + data.val().pname + '</td><td>' + data.val().pdob + '</td><td>' + data.val().gender + '</td></tr>';
          table.append(content);
      });

      $('#searchresult tbody tr').unbind("click");
      $('#searchresult tbody tr').click(function() {
          generatepatientdata($(this).find('td:first').html(),$(this).find('td:nth-child(2)').html(),$(this).find('td:nth-child(3)').html());
      });
      $("#searchresult").removeClass("loader");
      if(!isFound){
        clearmodal(31);
        alert("No patient record found by name: "+searchpname.value);
      }
    });
   }
}

function activetab(tabId, tabName,tabcontent,tablink) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName(tabcontent);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName(tablink);
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    $(tabId).addClass("active");
}
function openpatienttab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent1");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks1");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    if(tabName=="viewAll")
      generatepatientlist();
    else
      $("#patientslisttable > tbody").html("");

}
function generatepatientlist(){
  var table = $("#patientslisttable").find("tbody");
  $("#patientslisttable").addClass("loader");
  var content="";
  firebase.database().ref("patients").orderByChild("pnamesearch").on("value",function(snapshot) {
    $("#patientslisttable > tbody").html("");
    snapshot.forEach(function(childSnapshot) {
      table.append('<tr><td>' + childSnapshot.val().pname + '</td><td>' + childSnapshot.val().pdob + '</td><td>' + childSnapshot.val().gender + '</td></tr>');
    });
    $("#patientslisttable").removeClass("loader");
  });
}
function generatepatientdata(pname,pdob,gender) {
  var span = document.getElementsByClassName("close")[4];
     openmodal(32);
  span.onclick = function() {
      clearmodal(32);
  }
  $("#patientname").append(pname);
  $("#patientdob").append(pdob);
  $("#patientgender").append(gender);
}
function addvisit() {
  var date = new Date();
  var day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear(),
      hour = date.getHours(), min  = date.getMinutes();
  month = (month < 10 ? "0" : "") + month;
  day = (day < 10 ? "0" : "") + day;
  hour = (hour < 10 ? "0" : "") + hour;
  min = (min < 10 ? "0" : "") + min;

  document.getElementById("inputvisitdate").value = year + "-" + month + "-" + day;      
  document.getElementById("inputvisittime").value = hour + ":" + min;
  $("#inputprescription").val("");
  $("#inputdoctornotes").val("");
  $("#inputnextappointment").val("");

}
function confirmaddvisit(){
      var patientid = $("#patientname").html()+"-"+$("#patientdob").html();
      var visitdate = document.querySelector('#inputvisitdate');
      var visittime = document.querySelector('#inputvisittime');
      var prescription = document.querySelector('#inputprescription');
      var doctornotes = document.querySelector('#inputdoctornotes');
      var nextappt = document.querySelector('#inputnextappointment');

      if(visitdate.value == "" || visittime.value == null || visitdate.value == "" || visittime.value == null)
             alert("Required Field is empty");
      else{
         writeVisitData(patientid,visitdate.value,visittime.value,prescription.value,doctornotes.value,nextappt.value);
         alert("Patient visit added successfully.")
       }
      clearmodal(32);

}
function viewlast() {
    var patientid = $("#patientname").html()+"-"+$("#patientdob").html();
    var visitdatetime;
    firebase.database().ref('patients/'+patientid).child('lastvisit').once("value",function(snapshot) {
        visitdatetime = snapshot.val();
    });
    if(visitdatetime==null){
      $("#lastvisitdetails").hide();
      $("#lastvisitstatus").show();
    }
    else{
      visitdatetimearray = visitdatetime.split(" ");
      firebase.database().ref('patientHistory/'+patientid+'/'+visitdatetime).once("value",function(snapshot) {
          $("#visitdate").html(visitdatetimearray[0]);
          $("#visittime").html(visitdatetimearray[1]);
          $("#prescription").html(snapshot.val().prescription);
          $("#doctornotes").html(snapshot.val().doctornotes);
          $("#nextappointment").html(snapshot.val().nextappointment);
          $("#lastvisitstatus").hide();
          $("#lastvisitdetails").show(); 
      });
    }
}
function viewhistory() {
      var patientid = $("#patientname").html()+"-"+$("#patientdob").html();
      var table = $("#visithistorytable").find("tbody");
      $("#visithistorytable").addClass("loader");
      var content="";
       $("#visithistorytable > tbody").html("");
      var isFound = false;

      firebase.database().ref('patientHistory'+'/'+patientid).orderByValue().on('value',function (snapshot) {
        $("#visithistorytable > tbody").html("");
        $("#visithistorystatus").hide();
        $("#visithistorytable").show();
        var datetimearray;
        snapshot.forEach(function(data) {
          datetimearray=data.key.split(" ");
          isFound=true;
          content="";
          content +='<tr><td>' + datetimearray[0] + '</td><td>' + datetimearray[1] + '</td></tr>';
          table.append(content);
      });

      $('#visithistorytable tbody tr').unbind("click");
      $('#visithistorytable tbody tr').click(function() {
          visitdetails(patientid,$(this).find('td:first').html(),$(this).find('td:nth-child(2)').html());
         });
      $("#visithistorytable").removeClass("loader");
      if(!isFound){
        $("#visithistorytable").hide();
        $("#visithistorystatus").show();
      }
    });
}
function visitdetails(patientid,visitdate,visittime){
    var span = document.getElementById("visitdetailsclose");
    span.onclick = function() {  
          clearmodal(321);
    }
    openmodal(321);
    var visitdatetime = visitdate+" "+visittime;
      firebase.database().ref('patientHistory/'+patientid+'/'+visitdatetime).once("value",function(snapshot) {
          $("#visitdate1").html(visitdate);
          $("#visittime1").html(visittime);
          $("#prescription1").html(snapshot.val().prescription);
          $("#doctornotes1").html(snapshot.val().doctornotes);
          $("#nextappointment1").html(snapshot.val().nextappointment);
      });
    
}
function openpatientrectab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent2");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks2");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    if(tabName=='addvisit')
        addvisit();
    if(tabName=='viewlast')
        viewlast();
    if(tabName=='viewhistory')
        viewhistory();

}

window.onclick = function(event) {

    // When the user clicks anywhere outside of the modal, close it
    if (event.target == modal1 ||event.target == modal2||event.target == modal3||event.target == modal31||event.target == modal32||event.target == modal321) {
        clearmodal(1);
        clearmodal(2);
        clearmodal(3);
        clearmodal(31);
        clearmodal(32);
        clearmodal(321);
    }
}
$(document).ready(function() {

  //for(var i = 100;i<10000;i++){
    //deleteall();
  //}
});