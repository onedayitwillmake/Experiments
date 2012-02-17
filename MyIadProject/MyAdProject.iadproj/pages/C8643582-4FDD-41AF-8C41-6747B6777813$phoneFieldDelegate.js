
this.onViewTouchUpInside = function (event) { 
	 // strip out formatting from the number on this button 
	 var phoneNumber = parseInt(this.viewController.outlets.phone.text.match(/\d/g).join(''), 10);  
 
	 // dial that number 
	 window.location = 'tel://' + phoneNumber; 
}; 

