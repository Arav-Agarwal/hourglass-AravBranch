import {
    Template
} from 'meteor/templating';

import './main.html';

Meteor.subscribe('schools');
Meteor.subscribe('classes');
Meteor.subscribe('work');

var openValues = {
    "menu": "-25%",
    "options": "-20%"
};

var themeColors = {
    "light": {
        "background": "White.jpg",
        "header": "#EBEBEB",
        "sidebar": "#65839A",
        "statusIcons": "#33ADFF",
        "highlightText": "#FF1A1A",
        "cards": "#FEFEFE"
    },
    "dark": {

    }
};

var workColors = {
    "test": "red",
    "project": "blue",
    "normal": "green",
    "quiz": "black"
};

Session.set("calendarclasses", null);
Session.set("sidebar", null);
Session.set("mode", null); // Change to user preferences
Session.set("newWork",null);
Session.set("currentWork",null);
Session.set("modifying",null);
Session.set("radioDiv",null);
Session.set("radioOffset",null);
Session.set("serverData",null);

Template.registerHelper('divColor', (div) => {
    return themeColors[Cookie.get("theme")][div];
});

Template.registerHelper('overlayDim', (part) => {
    var dim = [window.innerWidth * .2, window.innerHeight * 0.2];
    var width = "width:" + dim[0].toString() + "px;";
    var height = "height:" + dim[1].toString() + "px;";
    var margin = "margin-left:" + (-dim[0] / 2).toString() + "px;";
    var bg = "background-color:" + themeColors[Cookie.get("theme")].header + ";";
    return width + height + margin + bg;
});

Template.registerHelper('myClasses', () => {
	if (Meteor.user().profile.classes === undefined || Meteor.user().profile.classes.length === 0) {
    		return [];
    	} else {
    		var array = [];
    		var courses = Meteor.user().profile.classes;
    		for(var i = 0; i < courses.length; i++) {
    			array.push(classes.findOne({_id:courses[i]}));
    		}
    		return array;
    	}
});

Template.main.helpers({
    schoolName() {
    	Session.set("calendarclasses", Meteor.user().profile.classes);
        return " - " + Meteor.user().profile.school;
    },
    iconColor(icon) {
        if (Session.get("sidebar") === icon + "Container") {
            return themeColors[Cookie.get("theme")].statusIcons;
        } else if (Session.get("sidebar") === "both") {
            return themeColors[Cookie.get("theme")].statusIcons;
        } else {
            return;
        }
    },
    bgSrc() {
        var dim = [window.innerWidth, window.innerHeight];
        var pic = "Backgrounds/"+themeColors[Cookie.get("theme")].background;
        return pic;
    },
    menuStatus() {
        if (Session.get("sidebar") === "menuContainer") {
            return "0%";
        } else if (Session.get("sidebar") === "both") {
            return "0%";
        } else {
            return openValues.menu;
        }
    },
    optionsStatus() {
        if (Session.get("sidebar") === "optionsContainer") {
            return "0%";
        } else if (Session.get("sidebar") === "both") {
            return "0%";
        } else {
            return openValues.options;
        }
    },
    modeStatus(status) {
        if (status === Session.get("mode")) {
            return themeColors[Cookie.get("theme")].highlightText;
        } else {
            return;
        }
    },
    currMode(name) {
        if (name === Session.get("mode")) {
            return true;
        } else {
            return false;
        }
    },
    calendarOptions() {
        var events = [];
        calendarclasses = Session.get("calendarclasses");
        var cursor = work.find({class: {$in: userclasses}});
        cursor.forEach(function(current) {
            backgroundColor = calendarColors[current.type];
            title = current.name;
            duedate = current.dueDate.toISOString().slice(0, 10);
            events.push({
                start: duedate,
                title: title,
                backgroundColor: backgroundColor
            });
        });
        return {
            height: window.innerHeight * .8,
            events: events,
            buttonText: {
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day'
            }
        };
    },
    calCenter() {
        var width = window.innerWidth * 0.85;
        return "width:" + width.toString() + "px;margin-left:" + (0.5 * window.innerWidth - 0.5 * width).toString() + "px";
    },
    calbg() {
        var width = window.innerWidth * 0.865;
        var height = window.innerHeight * 0.76;
        return "width:" + width.toString() + "px;height:" + height.toString() + "px;margin-left:" + (0.5 * window.innerWidth - 0.5 * width).toString() + "px;margin-top:" + (0.47 * window.innerHeight - 0.5 * height).toString() + "px";
    },
    workCenter() {
        var w = window.innerWidth * .3;
        var h = window.innerHeight * 0.7;
        return "width:"+w.toString()+"px;height:"+h.toString()+"px;margin-left:"+-.5*w.toString()+"px;margin-top:"+-.5*h.toString()+"px";
    },
    work(value) {
    	return Session.get("currentWork")[value];
    },
    workType() {
    	type = Session.get("currentWork").type
    	if(type.includes("edit")) {
    		return;
    	} else {
    		return workColors.type;
    	}
    },
    newWork() {
    	return Session.get("newWork");
    }
});

Template.main.events({
    'click .fa-bars' () {
        var side = Session.get("sidebar");
        if (side === "menuContainer") {
            Session.set("sidebar", null);
        } else if (side === "optionsContainer") {
            Session.set("sidebar", "both");
        } else if (side === "both") {
            Session.set("sidebar", "optionsContainer");
        } else {
            Session.set("sidebar", "menuContainer");
        }
    },
    'click .fa-cog' () {
        var side = Session.get("sidebar");
        if (side === "optionsContainer") {
            Session.set("sidebar", null);
        } else if (side === "menuContainer") {
            Session.set("sidebar", "both");
        } else if (side === "both") {
            Session.set("sidebar", "menuContainer");
        } else {
            Session.set("sidebar", "optionsContainer");
        }
    },
    'click .classes' () {
        if (Session.get("mode") === "classes") return;
        var modeHolder = document.getElementById("mainBody");
        closeDivFade(modeHolder);
        setTimeout(function() {
            Session.set("mode", "classes");
            openDivFade(modeHolder);
        }, 300);
    },
    'click .calendar' () {
        if (Session.get("mode") === "calendar") return;
        var modeHolder = document.getElementById("mainBody");
        closeDivFade(modeHolder);
        setTimeout(function() {
            Session.set("mode", "calendar");
            openDivFade(modeHolder);
        }, 300);
    },
    'click' (event) {
        var e = event.target.className;
        var sessval = Session.get("modifying");
        if (e !== Session.get("sidebar") &&
            !e.includes("fa-cog") &&
            !e.includes("fa-bars") &&
            !document.getElementById("menuContainer").contains(event.target) &&
            !document.getElementById("optionsContainer").contains(event.target)) {
            Session.set("sidebar", null);
        }
        if(e === "overlay") {
        	closeDivFade(document.getElementsByClassName("overlay")[0]);
        	if(!Session.get("newWork")) {
        		Session.set("serverData",getHomeworkFormData())
        		sendData("editWork");
        	} else {
        		clearHomeworkForm();
        	}
        	Session.set("newWork",null);
        	Session.set("currentWork",null);
        }

        if (event.target.id !== sessval &&
            event.target.id !== sessval + "a" &&
            !Session.equals("modifying", null) &&
            !event.target.parentNode.className.includes("profOptions")) {
            closeInput(sessval);
        }
        if (!event.target.className.includes("radio") &&
        !Session.equals("radioDiv", null) &&
        !event.target.parentNode.className.includes("workOptions") &&
        event.target.readOnly !== true) {
            var opnum = (parseInt(Session.get("radioDiv")) - parseInt(Session.get("radioOffset"))).toString();
            for (var i = 0; i < document.getElementsByClassName("workOptions").length; i++) {
                try {
                    closeDivFade(document.getElementsByClassName("workOptions")[i]);
                } catch (err) {}
            }
            Session.set("radioDiv", null);
            Session.set("radioOffset", null);
        }
    },
    'click .creWork' (event) {
        openDivFade(document.getElementsByClassName("overlay")[0]);
        Session.set("newWork", true);
        Session.set("currentWork",
    		{
    			name:"Name | Click here to edit...",
    			class:event.target.getAttribute("classid"),
    			dueDate:"Click here to edit...",
    			description:"Click here to edit...",
    			type:"Click here to edit..."
    		});
    },
    'click .change' (event) {
    	var ele = event.target;
        var sessval = Session.get("modifying");
        if (ele.id !== sessval && sessval !== null) closeInput(sessval);

        Session.set("modifying", ele.id);
        var dim = ele.getBoundingClientRect();
        ele.style.display = "none";
        var input = document.createElement("input");

        if (ele.getAttribute("type") !== null) {
            input.type = ele.getAttribute("type");
        } else {
            input.type = "text";
        }
        input.value = ele.childNodes[0].nodeValue;
        input.className = "changeInput";
        input.style.height = 0.9 * dim.height.toString() + "px";
        input.style.width = "70%";
        input.style.padding = "0.1%";
        input.id = ele.id + "a";
        input.setAttribute("opc", ele.getAttribute("opc"));
        ele.parentNode.appendChild(input);
        if (ele.getAttribute("re") == "readonly") {
            input.readOnly = true;
            input.className += " op";
            input.style.cursor = "pointer";
        } else {
            input.select();
        }
        input.focus();
        if (ele.getAttribute("restrict") !== null) {
            var span = document.createElement("span");
            span.id = "restrict";
            var num = parseInt(ele.getAttribute("restrict")) - input.value.length;
            if (num <= 0) {
                span.style.setProperty("color", "#FF1A1A", "important");
                num = 0;
            }
            span.appendChild(document.createTextNode(num.toString() + " characters left"));
            ele.parentNode.appendChild(span);
        }
    },
    'keydown' (event) {
        var sessval = Session.get("modifying");
        if (event.keyCode == 13) {
            try {
                closeInput(sessval);
            } catch (err) {}
        }
        if (sessval !== null && event.keyCode !== 13) {
            var restrict = document.getElementById(sessval).getAttribute("restrict");
            if (restrict !== null) {
                var num = parseInt(restrict) - event.target.value.length;
                var restext = document.getElementById("restrict");
                if (num === 1) {
                    restext.childNodes[0].nodeValue = num.toString() + " character left";
                    restext.style.setProperty("color", "#999", "important");
                } else if (num <= 0) {
                    var input = document.getElementById(sessval + "a");
                    input.value = input.value.substring(0, parseInt(restrict));
                    restext.childNodes[0].nodeValue = "0 characters left";
                    restext.style.setProperty("color", "#FF1A1A", "important");
                } else {
                    restext.childNodes[0].nodeValue = num.toString() + " characters left";
                    restext.style.setProperty("color", "#999", "important");
                }
            }
        }
    },
    'click #workSubmit' () {
    	Session.set("serverData",getHomeworkFormData());
    	if(Session.get("newWork")) {
    		sendData("editWork");
    	} else {
    		sendData("createWork");
    	}
    	Session.set("newWork",null);
        Session.set("currentWork",null);
    }
});

function openDivFade(div) {
    div.style.display = "block";
    div.style.opacity = "0";
    setTimeout(function() {
        div.style.opacity = "1";
    }, 100);
}

function closeDivFade(div) {
    div.style.opacity = "0";
    setTimeout(function() {
        div.style.display = "none";
    }, 100);
}

function sendData(funcName) {
    Meteor.call(funcName, Session.get("serverData"));
}

function closeInput(sessval) {
    var input = document.getElementById(sessval + "a");
    var span = document.getElementById(sessval);
    input.parentNode.removeChild(input);
    try {
        var restrict = document.getElementById("restrict");
        restrict.parentNode.removeChild(restrict);
    } catch (err) {}
    if (input.value === "") {
        span.childNodes[0].nodeValue = "Click here to edit...";
    } else {
        span.childNodes[0].nodeValue = input.value;
    }
    span.style.display = "initial";
    Session.set("modifying", null);
    if(Session.get("newWork")) {
    	Session.set("serverData",getHomeworkFormData());
    	sendData("editProfile");
    }

}

function getHomeworkFormData() {
	return;
}

function clearHomeworkForm() {
	
}
