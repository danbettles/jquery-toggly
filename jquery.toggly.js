/*jslint browser:true this:true*/
/*global jQuery*/
/**
 * @author Dan Bettles <danbettles@yahoo.co.uk>
 * @copyright Powder Blue Ltd 2016
 * @license MIT
 */

(function () {
    "use strict";

    /**
     * @param {jQuery} $toggleable
     * @param {Object} options
     * @returns {Toggly}
     */
    function Toggly($toggleable, options) {
        var finalOptions;

        finalOptions = jQuery.isPlainObject(options)
            ? options
            : {};

        this
            .setToggleable($toggleable)
            .setOptions(jQuery.extend(true, {
                anchor: {
                    attachee: this.getToggleable(),
                    attachmentMethod: "insertBefore",
                    class: ""
                },
                messages: {
                    expand: "Expand",
                    collapse: "Collapse"
                }
            }, finalOptions))
            .setAnchorEl(undefined);
    }

    Toggly.prototype = {

        /**
         * @private
         * @param {jQuery} $toggleable
         * @return {Toggly} this
         */
        setToggleable: function ($toggleable) {
            this.$toggleable = $toggleable;

            return this;
        },

        /**
         * @return {jQuery}
         */
        getToggleable: function () {
            return this.$toggleable;
        },

        /**
         * @private
         * @param {Object} options
         * @return {Toggly} this
         */
        setOptions: function (options) {
            if (typeof jQuery()[options.anchor.attachmentMethod] !== "function") {
                throw "`" + options.anchor.attachmentMethod + "` is not a jQuery method";
            }

            this.options = options;

            return this;
        },

        /**
         * @return {Object}
         */
        getOptions: function () {
            return this.options;
        },

        /**
         * @private
         * @param {jQuery} $anchor
         * @return {Toggly} this
         */
        setAnchorEl: function ($anchor) {
            this.$anchor = $anchor;

            return this;
        },

        /**
         * @return {jQuery}
         */
        getAnchorEl: function () {
            return this.$anchor;
        },

        /**
         * @private
         * @param {String} text
         * @return {Toggly} this
         */
        setAnchorText: function (text) {
            this.getAnchorEl().html("<span>" + text + "</span>");

            return this;
        },

        /**
         * @private
         */
        collapse: function () {
            this.getToggleable().addClass("toggly-collapsed");
            this.getAnchorEl().addClass("toggly-expand");
            this.setAnchorText(this.getOptions().messages.expand);
        },

        /**
         * @private
         */
        expand: function () {
            this.getToggleable().removeClass("toggly-collapsed");
            this.getAnchorEl().removeClass("toggly-expand");
            this.setAnchorText(this.getOptions().messages.collapse);
        },

        toggle: function () {
            if (this.getToggleable().hasClass("toggly-collapsed")) {
                this.expand();
            } else {
                this.collapse();
            }
        },

        setUp: function () {
            var toggly = this;
            var anchorOptions = this.getOptions().anchor;
            var $anchor;

            $anchor = jQuery("<a/>", {href: "javascript:", class: "toggly-anchor " + anchorOptions.class})
                .click(function (e) {
                    e.preventDefault();
                    toggly.toggle();
                });

            $anchor[anchorOptions.attachmentMethod](anchorOptions.attachee);
            this.setAnchorEl($anchor);

            this.collapse();
        }
    };

    jQuery.fn.extend({

        /**
         * @param {Object} options
         * @return {jQuery}
         */
        toggly: function (options) {
            return this.each(function () {
                var $el = jQuery(this);

                $el
                    .data("toggly", new Toggly($el, options))
                    .data("toggly")
                        .setUp();
            });
        }
    });
}());
