# Prototype Widgets

Prototype Widgets (PW) is a series of high-quality, purpose-built, and otherwise hyphenated components for the Prototype Javascript library. Its aim is to create a library of widgets for use by all without having to resort to other frameworks like EXT or YUI which are generally much too heavyweight for most requirements.

PW will continue to grow with cool new custom widgets, but for its initial release the two components included in PW are:
  
* A password strength checker -- a cool graphical representation of the strength of a password
* A "rule builder" that allows you to chain together complex logic to build rules ala something like a mail filter, firewalls rules... whatever you like. 

# Getting Started 

If you've even used Prototype the following process should be fairly easy.

* Download and unpack Prototype, 1.6.1 or higher. 
* Download a current release of PW. Note that PW uses build numbers not version numbers. The higher the build number, the fresher the build. 

In the ```<head>``` of your document, place the following. 

```html
<head>
     <!-- insert your prototype library here -->
     <script type="text/javascript" src="prototype/prototype.js"></script>

     <!-- prototype-widgets -->
     <script type="text/javascript" src="prototype-widgets.js"></script>
     <link href="prototype-widgets.css" rel="stylesheet" type="text/css">
</head>
```

That's it, you are ready to rock and roll. 

# Using The Widgets 

Using the widgets is a fairly trivial matter as well. For a complete demonstration of the widgets, see the "demos" folder in the distribution. 

----

# PrototypeWidgets.PasswordStrengthChecker 

A "levels style" widget that checks the strength of the text in a given field and displays the result. 

## Usage 

```html
     PrototypeWidgets.PasswordStrengthChecker(
          element_id_or_reference, 
          {defaultStrength:level} //strength is 0, (weakest) thru 4 (strongest)
     ); 
```

*_Note that you can pass in either a string id for the element to watch or an actual reference to that element._*

## Example 


```html
<input type="password" value="" name="password" id="password">

<script type="text/javascript">
     new PrototypeWidgets.PasswordStrengthChecker('password', {defaultStrength:0});
</script>
```

Or

```html
<input type="password" value="" name="password" id="password">

<script type="text/javascript">
     new PrototypeWidgets.PasswordStrengthChecker($('password'), {defaultStrength:0});
</script>
```

This produces a Field Like this: 

[http://www.the-singleton.com/wp-content/uploads/2011/09/Screen-Shot-2011-09-18-at-8.48.31-PM.png]

----

# PrototypeWidgets.RuleBuilder 

A rule builder widget that can save and restore its state. 

## Usage 

```html
     PrototypeWidgets.RuleBuilder(element_id_or_reference, {ruleConfig: ruleOptionsAndValues});

```

### Available Methods 

```javascript
     PrototypeWidgets.RuleBuilder.render() // renders the rule builder to the specified element_id
     PrototypeWidgets.RuleBuilder.save()    // returns a JSON array representing the current state
     PrototypeWidgets.RuleBuilder.renderWith(json) //renders the given JSON into the rule builder
```


## Example 


```html
<div id="rb">You need to enable javascript!</div>

<script type="text/javascript">
     var rb = new PrototypeWidgets.RuleBuilder('rb', {ruleConfig: 
     [
      {option: 'Unicorn Color', options: ['Equals', 'Does Not Equal', 'Is Like']}, 
      {option: 'Average Speed', options: ['Equals', 'Does Not Equal', 'Is Like']}
     ]});

     rb.render();
</script>
```

Restoring State


```html
<div id="rb">You need to enable javascript!</div>

<script type="text/javascript">
     var rb = new PrototypeWidgets.RuleBuilder('rb', {ruleConfig: 
     [
      {option: 'Unicorn Color', options: ['Equals', 'Does Not Equal', 'Is Like']}, 
      {option: 'Average Speed', options: ['Equals', 'Does Not Equal', 'Is Like']}
     ]});

     rb.renderWith([{"ruleGroupMode": "first", "evaluationMode": "any", "rules": [{"condition": "Unicorn Color Equals", "value": "red"}, {"condition": "Unicorn Color Equals", "value": "blue"}]}, {"ruleGroupMode": "and", "evaluationMode": "all", "rules": [{"condition": "Average Speed Equals", "value": "100"}]}]);
</script>
```

Example: 

[http://www.the-singleton.com/wp-content/uploads/2011/09/Screen-Shot-2011-09-18-at-8.58.21-PM.png]