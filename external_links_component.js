import {LightningElement} from 'lwc';

//Importing our apex class method
import getUrlLinks from '@salesforce/apex/External_Links_Controller.getUtilityBarLinks';

//Importing the navigation mixin module so that we can navigate to new browser or console tabs
import {NavigationMixin} from 'lightning/navigation';

//Make sure to extend NavigationMixin here so that we can use it in the code
export default class external_links_component extends NavigationMixin(LightningElement){
	linkList;
        
        //This method is rendered on the load of the component. I use it instead of @wire
        //because @wire has a bug that sometimes causes Aura components in the same page
        //to not be able to do DML transactions
	connectedCallback(){
                //Calling our controller method to get our links and then assigning them to 
                //our linkList variable in the LWC controller
		getUrlLinks().then(
			result =>
			{
				this.linkList = result;
			}
		).catch( error =>
		{
			console.error('This is the error ::: ' + error);
		});
	}

        //This method is called when one of the link buttons is clicked. It determines whether 
        //to open this link in a console tab or a browser tab
	openLink(event)
	{
                //Getting the url for our link from the data-url attribute on the input button 
                //we clicked
		let urlToPass = event.target.getAttribute("data-url");

                //If the data-opentab attribute is true, we need to dispatch a custom event 
                //for our housing Aura component to handle 
		if(event.target.getAttribute("data-opentab") === "true")
		{
			const openTabEvent = new CustomEvent('opennewsubtab', {
					detail: {urlToPass}
			});

			this.dispatchEvent(openTabEvent);
		}
                //Otherwise we need to open the url as a browser tab
		else
		{
                        //The standard__webPage NavigationMixin type allows us to open this in
                        //a new browser tab.
			this[NavigationMixin.Navigate]({
				type: 'standard__webPage',
				attributes:{
					url: urlToPass
				}
			});
		}
	}
}