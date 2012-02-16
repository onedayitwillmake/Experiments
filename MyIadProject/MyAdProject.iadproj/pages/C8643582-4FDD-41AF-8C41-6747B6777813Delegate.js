
this.onViewControllerViewWillAppear = function (event) { 
	 // don't do anything if we didn't get an annotation from the map page 
	 if (this.annotation == null) {  
		 return;  
	 } 

	 // set image 
	 if (this.annotation.image && this.outlets.imageView) { 
		 this.outlets.imageView.image = this.annotation.image; 
	 }  

	 // set title 
	 if (this.outlets.title) { 
		 this.outlets.title.text = this.annotation.title || ''; 
	 }  

	 // set address 
	 if (this.outlets.address) { 
		 this.outlets.address.text = this.annotation.address || ''; 
	 } 

	 // set website 
	 if (this.outlets.website) { 
		 this.outlets.website.text = this.annotation.url || ''; 
	 } 

	 // set phone number 
	 if (this.outlets.phone) { 
		 this.outlets.phone.text = this.annotation.phone || ''; 
	 };  
};
