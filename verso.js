(function(undefined) {
    "use strict";

    function Verso(args) {
        var opts = args || {};

        // We ready to rock?
        this._isReady       = false;
        // List of DOM elements to be observed
        this._observeList   = [];
        // Last tick of time
        this._timer = null;
        // The last point we were on
        this._lastPoint = null;
        // To be able to remove the event listener
        this._listener = this.listener.bind(this);
        // Query that represents DOM elements that denote "pages"
        this.query          = opts.query || '.page';
        // Name of the event that is emitted when a dom element is encountered
        this.eventLabel     = opts.eventLabel || 'VersoPage';
        // Delay between checks on windowScroll events
        this.delay          = opts.delay || 500;
        // Distance element has to be up the viewport for it to register as a page
        this.viewPercentage = opts.viewPrecentage || 0.66;
        // Create our custom event
        this._event = new CustomEvent(this.eventLabel, {"detail": {}});
        // Start everything
        this.init();
    }

    // Gets all dom elements from query, and if exists, listen for scroll
    Verso.prototype.init = function() {
        this._observeList = document.querySelectorAll(this.query);

        if(this._observeList.length > 0) {
            window.addEventListener('scroll', this._listener, false);
            
            this._isReady = true;
        }
    };

    // Stops listening
    Verso.prototype.stopListening = function() {
        window.removeEventListener('scroll', this._listener, false);
        this._isReady = false;
    };

    // Checks which page is in current position, and if there is one, emits event
    Verso.prototype.checkCurrentPoint = function() {
        var temp            = null,
            rect            = null,
            el              = null,
            viewportHeight  = (window.innerHeight || document.documentElement.clientHeight),
            procArea        = viewportHeight - (viewportHeight * this.viewPercentage);

        if(rect.top < procArea) {
            temp = el;

            if(len === 1 && temp !== this._lastPoint) {
                this._lastPoint = temp;
                this.emit({el: temp, index: i});
            }
        } else {
            if(temp && temp !== this._lastPoint) {
                this.emit({el: temp, index: i});
            }
            this._lastPoint = temp;
            break;
        }
    };

    // Runs on scroll and continues functionality if delay is long enough
    Verso.prototype.listener = function(evt) {
        var e = evt || window.event;
    
        if(this._timer !== null) {
            clearTimeout(this._timer);
        }

        this._timer = setTimeout(this.checkCurrentPoint.bind(this), this.delay);
    };

    // Returns true if it is watching for page, false if not
    Verso.prototype.isReady = function() {
        return this._isReady;
    }

    // Fires custom event with given data
    Verso.prototype.emit = function(data) {
        this._event.detail.data = data;
        document.dispatchEvent(this._event);
    };

    // Sets or returns a property
    Verso.prototype.property = function(label, value) {
        if(value) {
            return this[label] = value;
        } else {
            return this[label];
        }
    };

    window.Verso = Verso;
})();