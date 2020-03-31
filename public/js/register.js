function validator(){
	alert("form is submitted")
	var email=document.getElementById("em").value;
	var pas=document.getElementById("pas").value;
	var ph=document.getElementById("ph").value;
	var c=checkpas(pas)
	var b=checkph(ph)
	if(c==true && b==true){
		return true

	}
	else{
		return false
	}
}

function checkpas(pas){
	if(pas.length>8){
		return true

	}
	else{
		$("#p2").css("display","block")
		$("#p2").html("<b>weak password </b>")
		return false
	}

}

function checkph(ph){
	if(ph.length==10){
		return true
	}
	else{
		$("#p3").css("display","block")
		$("#p3").html("<b>invalid phone number</b>")
	}
}

	