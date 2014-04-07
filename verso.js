(function(undefined) {

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

        this._event = new CustomEvent(this.eventLabel, {"detail": {}});

        this.init();
    }

    Verso.prototype.init = function() {
        var self = this;
        this._observeList = document.querySelectorAll(this.query);

        if(this._observeList.length > 0) {
            window.addEventListener('scroll', this._listener, false);
            
            this._isReady = true;
        }
    };

    Verso.prototype.stopListening = function() {
        var self = this;

        window.removeEventListener('scroll', this._listener, false);
        this._isReady = false;
    };

    Verso.prototype.checkCurrentPoint = function() {
        var temp = null,
            rect = null,
            el   = null,
            procArea = window.innerHeight - (window.innerHeight * this.viewPercentage);

        for(var i = 0, len = this._observeList.length; i < len; i++) {
            el = this._observeList[i];
            rect = el.getBoundingClientRect();

            if(rect.top < procArea) {
                temp = el;
            } else {
                if(temp && temp !== this._lastPoint) {
                    this.emit({el: temp, index: i});
                }
                this._lastPoint = temp;
                break;
            }
        }
    };

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

    Verso.prototype.emit = function(data) {
        this._event.detail.data = data;
        document.dispatchEvent(this._event);
    };

    Verso.prototype.property = function(label, value) {
        if(value) {
            return this[label] = value;
        } else {
            return this[label];
        }
    };

    window.Verso = Verso;
})();