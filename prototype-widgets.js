/*!
 * prototype-widgets.js (pw)
 * http://code.google.com/p/prototype-widgets/
 *
 * Copyright 2011, John L. Singleton <jsinglet@gmail.com>
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: Sept 18, 2011  
 */


if (typeof Element == 'undefined')
 throw ("Prototype Widgets requires Prototype version 1.6 or greater")

 var PrototypeWidgets = {};

PrototypeWidgets.Base = Class.create({
    baseInitialize: function(element) {

        if ('string' == typeof element) {
            this.element = $(element)
        } else {
            this.element = element
        }

    }
    //saving functions, etc
});




PrototypeWidgets.PasswordStrengthChecker = Class.create(PrototypeWidgets.Base, {
    initialize: function(element, params) {
        this.baseInitialize(element);
        this.whereToDisplay = this.create();

        if (typeof params != 'undefined' && typeof params.defaultStrength != 'undefined') {
            this.updateToStrength(params.defaultStrength)
        } else {
            this.updateToStrength(0)
        }

        this.element.observe('keydown', this.updateMeter.bind(this));


    },

    create: function()
    {
        var theElement = new Element('div', {
            'class': 'pw-passwordChecker'
        });
        this.element.insert({
            'after': theElement
        });

        return theElement;
    },

    updateMeterStyle: function(style)
    {
        var w = this.whereToDisplay;

        ['check-very-weak', 'check-weak', 'check-medium', 'check-strong', 'check-very-strong'].each(function(ele) {
            if (w.hasClassName(ele)) {
                w.removeClassName(ele)
            }
        });

        this.whereToDisplay.addClassName(style)
    },

    updateToStrength: function(strength)
    {
        switch (strength)
        {
        case 0:
            this.updateMeterStyle('check-very-weak');
            this.whereToDisplay.update("Very Weak");
            break;
        case 1:
            this.updateMeterStyle('check-weak');
            this.whereToDisplay.update("Weak")
            break;
        case 2:
            this.updateMeterStyle('check-medium');
            this.whereToDisplay.update("Medium")
            break;
        case 3:
            this.updateMeterStyle('check-strong');
            this.whereToDisplay.update("Strong")
            break;

        case 4:
            this.updateMeterStyle('check-very-strong');
            this.whereToDisplay.update("Fort Knox")
            break;

        default:
            this.updateMeterStyle('check-very-weak');
        }
    },

    updateMeter: function()
    {
        var strength = this.getStrength();
        this.updateToStrength(strength);
    },

    getStrength: function() {

        var passwd = this.element.value;

        var intScore = 0;
        var strVerdict = 0;
        var strLog = "";
        if (passwd.length < 5) {
            intScore = intScore + 3
        } else {
            if (passwd.length > 4 && passwd.length < 8) {
                intScore = intScore + 6
            } else {
                if (passwd.length > 7 && passwd.length < 16) {
                    intScore = intScore + 12
                } else {
                    if (passwd.length > 15) {
                        intScore = intScore + 18
                    }
                }
            }
        }
        if (passwd.match(/[a-z]/)) {
            intScore = intScore + 1
        }
        if (passwd.match(/[A-Z]/)) {
            intScore = intScore + 5
        }
        if (passwd.match(/\d+/)) {
            intScore = intScore + 5
        }
        if (passwd.match(/(.*[0-9].*[0-9].*[0-9])/)) {
            intScore = intScore + 5
        }
        if (passwd.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)) {
            intScore = intScore + 5
        }
        if (passwd.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) {
            intScore = intScore + 5
        }
        if (passwd.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
            intScore = intScore + 2
        }
        if (passwd.match(/([a-zA-Z])/) && passwd.match(/([0-9])/)) {
            intScore = intScore + 2
        }
        if (passwd.match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)) {
            intScore = intScore + 2
        }
        if (intScore == 0) {
            strVerdict = 0
        } else {
            if (intScore < 16) {
                strVerdict = 1
            } else {
                if (intScore > 15 && intScore < 25) {
                    strVerdict = 2
                } else {
                    if (intScore > 24 && intScore < 35) {
                        strVerdict = 3
                    } else {
                        if (intScore > 34 && intScore < 45) {
                            strVerdict = 4
                        } else {
                            strVerdict = 4
                        }
                    }
                }
            }
        }

        return strVerdict;
    }


});





PrototypeWidgets.RuleBuilder = Class.create(PrototypeWidgets.Base, {
    initialize: function(element, params) {
        this.baseInitialize(element);
        this.container = this.element;
		this.ruleConfig = params.ruleConfig;

        //clear out whatever is in there.
        this.container.update('');
		this.container.addClassName('pw-rule-builder')

    },
    render: function() {

        //create and insert the rule group
        this._addRuleGroup(this.container, new PrototypeWidgets.RuleBuilder.RuleGroup(false), [new PrototypeWidgets.RuleBuilder.Rule(this.ruleConfig[0].option, '', '', this.ruleConfig)])

    },

    save: function(to)
    {
      
        var savedRules = new Array();

        this.container.getElementsBySelector('.pw-rule-group').each(function(e, idx) {

            var ruleGroupMode = "first";
            var evaluationMode = "all";
            var rules = new Array();


            var ruleGroupModeSelector = undefined
            var evaluationModeSelector = e.getElementsBySelector('.evaluation-mode-selector')[0]

            //only idx > 0 is allowed to set the rule group mode (of course)
            if (idx != 0) {
                ruleGroupModeSelector = e.getElementsBySelector('.rule-group-mode-selector')[0]
                ruleGroupMode = ruleGroupModeSelector.value
            }

            evaluationMode = evaluationModeSelector.value

            //now do the rules!
            e.getElementsBySelector('.rule-condition').each(function(rule) {
                var condition = rule.getElementsBySelector('.rule-condition-type')[0].value
                var value = rule.getElementsBySelector('.rule-text')[0].value

                rules.push({
                    "condition": condition,
                    "value": value
                })

            });

            var ruleGroup = {
                "ruleGroupMode": ruleGroupMode,
                "evaluationMode": evaluationMode,
                "rules": rules
            }

            savedRules.push(ruleGroup)
        });


        //alert(savedRules.toJSON())
        if (to != undefined) {
            $(to).value = savedRules.toJSON()
        }

        return savedRules.toJSON();
    },

    renderWith: function(rules) {

        var json = rules


        var par = this

        json.each(function(group, idx) {

            var theRules = new Array()

			var par2 = par;
			
            group.rules.each(function(theRule) {
                theRules.push(new PrototypeWidgets.RuleBuilder.Rule(par.getSelectedType(theRule.condition), theRule.condition, theRule.value, par2.ruleConfig))
            })

            if (idx == 0) {
                par._addRuleGroup(par.container, new PrototypeWidgets.RuleBuilder.RuleGroup(false, group.evaluationMode, group.ruleGroupMode), theRules)
            } else {
                par._addRuleGroup(par.bottomMostRuleGroup(), new PrototypeWidgets.RuleBuilder.RuleGroup(true, group.evaluationMode, group.ruleGroupMode), theRules)
            }


        });

    },

    bottomMostRuleGroup: function()
    {
        return this.container.getElementsBySelector('.pw-rule-group').reverse()[0]
    },

    bindEvents: function(ruleContainer, ruleGroup)
    {

        var addButtons = ruleContainer.getElementsByClassName('add-rule')
        var deleteButtons = ruleContainer.getElementsByClassName('delete-rule')
        var ruleGroupButton = ruleGroup.getElementsByClassName('add-rule-group')[0]
        var removeRuleGroupButton = ruleGroup.getElementsByClassName('remove-rule-group')[0]
        var selectConditionTypeButton = ruleGroup.getElementsByClassName('rule-condition-type')[0]

        var par = this

        $A(addButtons).each(function(addButton) {
            addButton.observe('click', par.addRule.bind(par))
        })

        $A(deleteButtons).each(function(deleteButton) {
            deleteButton.observe('click', par.removeRule.bind(par))
        })


        ruleGroupButton.observe('click', this.addRuleGroup.bind(this))
        selectConditionTypeButton.observe('change', this.ruleConditionTypeChanged.bind(this))

        if (removeRuleGroupButton != undefined) {
            removeRuleGroupButton.observe('click', this.removeRuleGroup.bind(this))
        }


    },

    getSelectedType: function(theType) {

        var selectedType = this.ruleConfig[0].option;

        this.ruleConfig.each(function(e) {
            if (theType.indexOf(e.option) != -1) {
                selectedType = e.option;
            }
        })


        return selectedType
    },

    ruleConditionTypeChanged: function(event)
    {
        var trigger = Event.element(event);

        var selectedType = this.getSelectedType(trigger.value)

        trigger.up().getElementsByClassName('rule-metric')[0].update(selectedType)

        trigger.up().getElementsByClassName('rule-text')[0].focus()


    },

    _addRuleGroup: function(whereToInsert, ruleGroup, initialRule) {

        if (ruleGroup.isFirst()) {

            whereToInsert.insert({
                'bottom': ruleGroup
            })

            var ruleGroup = this.container.getElementsByClassName('pw-rule-group')[0]

            //it will be the first and ONLY one.
            //get a handle to the rules container.
            var ruleContainer = ruleGroup.getElementsByClassName('rules')[0]

            initialRule.each(function(r) {
                ruleContainer.insert({
                    'bottom': r
                })

            })
            //now bind the plus and minus buttons
            this.bindEvents(ruleContainer, ruleGroup)

            this.restyleRules(ruleContainer)
        } else {

            whereToInsert.insert({
                'after': ruleGroup
            })

            var ruleGroup = whereToInsert.next()

            //it will be the first and ONLY one.
            //get a handle to the rules container.
            var ruleContainer = ruleGroup.getElementsByClassName('rules')[0]

            initialRule.each(function(r) {
                ruleContainer.insert({
                    'bottom': r
                })

            })

            //now bind the plus and minus buttons
            this.bindEvents(ruleContainer, ruleGroup)

            this.restyleRules(ruleContainer)

        }


    },

    addRuleGroup: function(event)
    {

        var trigger = Event.element(event);

        //create and insert the rule group
        var whereToInsert = trigger.up().up()

        this._addRuleGroup(whereToInsert, new PrototypeWidgets.RuleBuilder.RuleGroup(true), [new PrototypeWidgets.RuleBuilder.Rule(this.ruleConfig[0].option, '', '', this.ruleConfig)])

    },

    removeRuleGroup: function(event)
    {
        var trigger = Event.element(event);

        var ele = trigger.up().up().remove()

    },

    restyleRules: function(ruleSet)
    {
        //starting at the first rule group, style them
        ruleSet.getElementsBySelector('.rule-condition').each(function(e, idx) {

            e.removeClassName("even")
            e.removeClassName("odd")


            if (idx % 2 == 0) {
                e.addClassName("odd")
            } else {
                e.addClassName("even")
            }

        });
    },

    _addRule: function(rule, theRule)
    {
        var ele = rule.insert({
            'after': theRule
        }).next()

        var addButton = ele.getElementsByClassName('add-rule')[0];
        var deleteButton = ele.getElementsByClassName('delete-rule')[0];
        var selectConditionTypeButton = ele.getElementsByClassName('rule-condition-type')[0]

        addButton.observe('click', this.addRule.bind(this));
        deleteButton.observe('click', this.removeRule.bind(this));
        selectConditionTypeButton.observe('change', this.ruleConditionTypeChanged.bind(this))

        this.restyleRules(rule.up())
    },


    addRule: function(event) {

        var rule = Event.element(event).up();

        this._addRule(rule, new PrototypeWidgets.RuleBuilder.Rule(this.ruleConfig[0].option, '', '', this.ruleConfig))

    },

    removeRule: function(event) {

        var trigger = Event.element(event);
        var ruleSet = trigger.up().up()

        if (trigger.up().up().getElementsByClassName('rule-condition').length == 1) {
            return;
        }

        var ele = trigger.up().remove()

        this.restyleRules(ruleSet)
        //and away!
    }

});


PrototypeWidgets.RuleBuilder.Rule = Class.create({
    initialize: function(ruleMetric, ruleCondition, ruleValue, ruleConfig) {
        this.ruleMetric = ruleMetric;
        this.ruleCondition = ruleCondition;
        this.ruleValue = ruleValue;
		this.ruleConfig = ruleConfig;
    },


    toString: function()
    {
		//start
        var buffer = '<div class="rule-condition"> <div class="rule-metric">' + this.ruleMetric + '</div>\
						<select class="rule-condition-type">';

	    var ruleCondition = this.ruleCondition;
	   
		//all the options.
		this.ruleConfig.each(function(ele){
			var option = ele.option;
			var options    = ele.options;
			var ruleCondition = ruleCondition;
			buffer += '	<optgroup label="'+option+'">';
			
			options.each(function(opt){
				buffer += '<option value="'+option+' '+opt+'" ' + ((ruleCondition == option +' '+opt) ? 'selected' : '') + '>'+opt+'</option>';
			});
			
			buffer += '</optgroup>';
			
		});
		
		buffer += '</select>\
		<input type="text" class="rule-text"  value="' + this.ruleValue + '"> \
		<button type="button" class="delete-rule">-</button><button  type="button" class="add-rule">+</button>\
	</div>';
	
	
	return buffer;
		


    }
});

PrototypeWidgets.RuleBuilder.RuleGroup = Class.create({
    initialize: function(enableRemove, evaluationMode, groupMode) {
        this.enableRemove = enableRemove
        this.evaluationMode = evaluationMode
        this.groupMode = groupMode

    },

    isFirst: function()
    {
        return ! this.enableRemove
    },

    toString: function()
    {
        if (this.enableRemove) {
            return '<div class="pw-rule-group"> \
				   <div><select class="rule-group-mode-selector"> \
								<option value="and" ' + ((this.groupMode == "and") ? 'selected' : '') + '>and</option> \
							   	<option value="or" ' + ((this.groupMode == "or") ? 'selected' : '') + '>or</option> \
							</select> if <select class="evaluation-mode-selector"> \
								<option value="all" ' + ((this.evaluationMode == "any") ? 'selected' : '') + '>all</option> \
							   	<option value="any" ' + ((this.evaluationMode == "all") ? 'selected' : '') + '>any</option> \
							</select> \
					of the following conditions are met: \
					</div> \
					<div class="rules"></div>\
						<div class="rule-group-footer"><a href="#" class="remove-rule-group" onclick="return false;">Remove rule group</a> <button  type="button" class="add-rule-group">Add new rule group</button></div>\
					</div>';

        } else {
            return '<div class="pw-rule-group"> \
				   <div>If <select class="evaluation-mode-selector"> \
								<option value="all"  ' + ((this.evaluationMode == 'all') ? 'selected' : '') + '>all</option> \
							   	<option value="any" ' + ((this.evaluationMode == 'any') ? 'selected' : '') + '>any</option> \
							</select> \
					of the following conditions are met: \
					</div> \
					<div class="rules"></div>\
						<div class="rule-group-footer"><button class="add-rule-group"  type="button">Add new rule group</button></div>\
					</div>';

        }

    }
});

