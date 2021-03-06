/**
 * @author 
 */



imports("Controls.Part.Icon");
using("Controls.Suggest.Picker");
using("Controls.Composite.MonthCalender");


var DatePicker = Picker.extend({
	
	dataStringFormat: 'yyyy/M/d',
	
	dropDownWidth: 'auto',
	
	menuButtonTpl: '<button class="x-button" type="button"><span class="x-icon x-icon-calendar"></span></button>',
	
	createDropDown: function(existDom){
		return new MonthCalender(existDom).on('selecting', this.onItemClick, this);
	},
	
	onItemClick: function(value) {
		if(this.trigger('selecting', value)) {
			var old = this.getValue();
			this.setValue(value).hideDropDown();
			if(old !== value){
				this.trigger('change');
			}
			
			return;
		}
		
		return false;
	},
	
	selectItem: function (value) {
		this.onItemClick(value);
		return this;
	},
	
	updateDropDown: function(){
		var d = new Date(this.getText());
		if(!isNaN(d.getYear()))
			this.dropDown.setValue(d);
	},
	
	getValue: function(){
		return new Date(this.getText());
	},
	
	setValue: function(value){
		return this.setText(value.toString(this.dataStringFormat));
	}

});


