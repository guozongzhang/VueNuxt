/*
 * jQuery Bootstrap Pagination v1.3.1
 * https://github.com/esimakin/twbs-pagination
 *
 * Copyright 2014-2015 Eugene Simakin <eugenesimakin@mail.ru>
 * Released under Apache 2.0 license
 * http://apache.org/licenses/LICENSE-2.0.html
 */
(function ($, window, document, undefined) {

    'use strict';

    var old = $.fn.twbsPagination;
    var newpages = 1;//全局变量，更新修改页码（输入框显示当前页码）

    // PROTOTYPE AND CONSTRUCTOR

    var TwbsPagination = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.twbsPagination.defaults, options);
        if (this.options.totalPages == 0) {
            this.options.totalPages = 1
        }
        if (Number(this.options.startPage) > Number(this.options.totalPages)) {
            this.options.totalPages = 1
            this.options.startPage = 1
        }
        if (Number(this.options.startPage) < 1 || Number(this.options.startPage) > Number(this.options.totalPages)) {
            throw new Error('Start page option is incorrect');
        }

        this.options.totalPages = parseInt(this.options.totalPages);
        if (isNaN(this.options.totalPages)) {
            throw new Error('Total pages option is not correct!');
        }

        this.options.visiblePages = parseInt(this.options.visiblePages);
        if (isNaN(this.options.visiblePages)) {
            throw new Error('Visible pages option is not correct!');
        }

        if (this.options.totalPages < this.options.visiblePages) {
            this.options.visiblePages = this.options.totalPages;
        }

        if (this.options.onPageClick instanceof Function) {
            this.$element.first().on('page', this.options.onPageClick);
        }

        if (this.options.href) {
            var match, regexp = this.options.href.replace(/[-\/\\^$*+?.|[\]]/g, '\\$&');
            regexp = regexp.replace(this.options.hrefVariable, '(\\d+)');
            if ((match = new RegExp(regexp, 'i').exec(window.location.href)) != null) {
                this.options.startPage = parseInt(match[1], 10);
            }
        }

        var tagName = (typeof this.$element.prop === 'function') ?
            this.$element.prop('tagName') : this.$element.attr('tagName');

        if (tagName === 'UL') {
            this.$listContainer = this.$element;
        } else {
            this.$listContainer = $('<ul></ul>');
        }

        this.$listContainer.addClass(this.options.paginationClass);

        if (tagName !== 'UL') {
            this.$element.append(this.$listContainer);
        }

        this.render(this.getPages(this.options.startPage));
        this.setupEvents();

        if (this.options.initiateStartPageClick) {
            this.$element.trigger('page', this.options.startPage);
        }

        return this;
    };

    TwbsPagination.prototype = {

        constructor: TwbsPagination,

        destroy: function () {
            this.$element.empty();
            this.$element.removeData('twbs-pagination');
            this.$element.off('page');

            return this;
        },

        show: function (page) {
            if (page < 1) {
                this.$element.trigger('page', 1);
                newpages = 1
            } else {
                if(page > this.options.totalPages){
                    this.$element.trigger('page', this.options.totalPages);
                    newpages = this.options.totalPages;
                } else {
                    this.$element.trigger('page', page);
                    newpages = page;
                }
            }
            
            this.setupEvents();
            this.render(this.getPages(newpages));
            return this;
        },

        buildListItems: function (pages) {
            var listItems = [];

            if (this.options.first) {
                listItems.push(this.buildItem('first', 1));
            }

            if (this.options.prev) {
                var prev = pages.currentPage > 1 ? pages.currentPage - 1 : this.options.loop ? this.options.totalPages  : 1;
                listItems.push(this.buildItem('prev', prev));
            }

            for (var i = 0; i < pages.numeric.length; i++) {
                listItems.push(this.buildItem('page', pages.numeric[i]));
            }

            if (this.options.next) {
                var next = pages.currentPage < this.options.totalPages ? pages.currentPage + 1 : this.options.loop ? 1 : this.options.totalPages;
                listItems.push(this.buildItem('next', next));
            }

            if (this.options.last) {
                listItems.push(this.buildItem('last', this.options.totalPages));
            }

            //yuguo 2016-08-03
            if (this.options.selectable) {
                listItems.push(this.buildItem('selectable', this.options.selectable));
            }

            //yuguo 2016-08-03
            if (this.options.inputtext) {
                listItems.push(this.buildItem('inputtext', this.options.inputtext));
            }

            //yuguo 2016-08-03
            if (this.options.goto) {
                listItems.push(this.buildItem('goto', this.options.goto));
            }

            return listItems;
        },

        buildItem: function (type, page) {
            var $itemContainer = $('<li></li>'),
                $itemContent = $('<a></a>'),
                itemText = null;
            switch (type) {
                case 'page':
                    itemText = page;
                    $itemContainer.addClass(this.options.pageClass);
                    $itemContainer.data('page', page);
                    $itemContainer.data('page-type', type);
                    $itemContainer.append($itemContent.attr('href', this.makeHref(page)).html(itemText));
                    break;
                case 'first':
                    itemText = this.options.first;
                    $itemContainer.addClass(this.options.firstClass);
                    $itemContainer.data('page', page);
                    $itemContainer.data('page-type', type);
                    $itemContainer.append($itemContent.attr('href', this.makeHref(page)).html(itemText));
                    break;
                case 'prev':
                    itemText = this.options.prev;
                    $itemContainer.addClass(this.options.prevClass);
                    $itemContainer.data('page', page);
                    $itemContainer.data('page-type', type);
                    $itemContainer.append($itemContent.attr('href', this.makeHref(page)).html(itemText));
                    break;
                case 'next':
                    itemText = this.options.next;
                    $itemContainer.addClass(this.options.nextClass);
                    $itemContainer.data('page', page);
                    $itemContainer.data('page-type', type);
                    $itemContainer.append($itemContent.attr('href', this.makeHref(page)).html(itemText));
                    break;
                case 'last':
                    itemText = this.options.last;
                    $itemContainer.addClass(this.options.lastClass);
                    $itemContainer.data('page', page);
                    $itemContainer.data('page-type', type);
                    $itemContainer.append($itemContent.attr('href', this.makeHref(page)).html(itemText));
                    break;
                case 'selectable': //yuguo 2016-08-03
                    $itemContainer.addClass('selectable');
                    var options = [15,30,50,100].map(function(item) {
                        if(parseInt(store.get(location.pathname + '_pagsize')) == item) {
                            return '<option value="'+ item +'" selected>'+ item +'</option>';
                        }
                        return '<option value="'+ item +'">'+ item +'</option>';
                    }).join('')

                    var $input = $('<a href="javascript:;" data-flag="false" style="padding: 5px;height: 32px"><select data-flag="select" style="display:inline-block;width:50px;text-align:center;">'+ options +'</select>条</a>')
                    $itemContainer.append($input);
                    break;
                case 'inputtext': //yuguo 2016-08-03
                    $itemContainer.addClass('inputtext');
                    var $input = $('<a href="javascript:;" data-flag="false" style="padding: 5px;height: 32px"><input data-flag="false" style="display:inline-block;width:36px;height:100%;margin:0;padding:0px 2px;text-align:center;" value='+ newpages +' type="text"/></a>')
                    $itemContainer.append($input);
                    break;
                case 'goto': //yuguo 2016-08-03
                    itemText = this.options.goto;
                    $itemContainer.addClass('goto');
                    $itemContainer.data('page', page);
                    $itemContainer.data('page-type', type);
                    var $gopage = $('<a href="#" data-flag="goto">跳转</a>')
                    $itemContainer.append($gopage);
                    break;
                default:
                    break;
            }

            /*$itemContainer.data('page', page);
            $itemContainer.data('page-type', type);
            $itemContainer.append($itemContent.attr('href', this.makeHref(page)).html(itemText));*/

            return $itemContainer;
        },

        getPages: function (currentPage) {
            var pages = [];

            var half = Math.floor(this.options.visiblePages / 2);
            var start = currentPage - half + 1 - this.options.visiblePages % 2;
            var end = currentPage + half;

            // handle boundary case
            if (start <= 0) {
                start = 1;
                end = this.options.visiblePages;
            }
            if (end > this.options.totalPages) {
                start = this.options.totalPages - this.options.visiblePages + 1;
                end = this.options.totalPages;
            }

            var itPage = start;
            while (itPage <= end) {
                pages.push(itPage);
                itPage++;
            }

            return {"currentPage": currentPage, "numeric": pages};
        },

        render: function (pages) {
            var _this = this;
            this.$listContainer.children().remove();
            this.$listContainer.append(this.buildListItems(pages));

            this.$listContainer.children().each(function () {
                var $this = $(this),
                    pageType = $this.data('page-type');

                switch (pageType) {
                    case 'page':
                        if ($this.data('page') === pages.currentPage) {
                            $this.addClass(_this.options.activeClass);
                        }
                        break;
                    case 'first':
                            $this.toggleClass(_this.options.disabledClass, pages.currentPage === 1);
                        break;
                    case 'last':
                            $this.toggleClass(_this.options.disabledClass, pages.currentPage === _this.options.totalPages);
                        break;
                    case 'prev':
                            $this.toggleClass(_this.options.disabledClass, !_this.options.loop && pages.currentPage === 1);
                        break;
                    case 'next':
                            $this.toggleClass(_this.options.disabledClass,
                                !_this.options.loop && pages.currentPage === _this.options.totalPages);
                        break;
                    case 'selectable'://yuguo 2016-08-03
                            $this.toggleClass(_this.options.disabledClass, pages.currentPage === _this.options.selectable);
                        break;
                    case 'inputtext'://yuguo 2016-08-03
                            $this.toggleClass(_this.options.disabledClass, pages.currentPage === _this.options.inputtext);
                        break;
                    case 'goto'://yuguo 2016-08-03
                            $this.toggleClass(_this.options.disabledClass, pages.currentPage === _this.options.goto);
                        break;
                    default:
                        break;
                }

            });
        },

        setupEvents: function () {
            var _this = this;
            this.$listContainer.find('li').each(function () {
                var $this = $(this);
                $this.off();
                if ($this.hasClass(_this.options.disabledClass) || $this.hasClass(_this.options.activeClass)) {
                    $this.on('click', false);
                    return;
                }
                $this.click(function (evt) {
                    var flag = $(evt.target).attr('data-flag');

                    if(flag == 'select') {
                        return ;
                    }
                    //点击输入框
                    if(flag == 'false') {
                        return ;
                    }
                    //点击跳转
                    if(flag == 'goto') {
                        var val = $(evt.target).closest('li').prev('li').find('input').val();
                        !_this.options.href && evt.preventDefault();
                        _this.show(parseInt(val));
                        return ;
                    }
                    
                    // Prevent click event if href is not set.
                    !_this.options.href && evt.preventDefault();
                    _this.show(parseInt($this.data('page')));
                });

                $this.change(function (evt) {
                    var flag = $(evt.target).attr('data-flag');
                    if(flag == 'select') {
                        var val = $(evt.target).val();
                        store.set(location.pathname + '_pagsize', val)
                        !_this.options.href && evt.preventDefault();
                        _this.show(1);
                        return ;
                    }
                })
            });
        },

        makeHref: function (c) {
            return this.options.href ? this.options.href.replace(this.options.hrefVariable, c) : "#";
        }

    };

    // PLUGIN DEFINITION

    $.fn.twbsPagination = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);
        var methodReturn;

        var $this = $(this);
        var data = $this.data('twbs-pagination');
        var options = typeof option === 'object' && option;

        if (!data) $this.data('twbs-pagination', (data = new TwbsPagination(this, options) ));
        if (typeof option === 'string') methodReturn = data[ option ].apply(data, args);

        return ( methodReturn === undefined ) ? $this : methodReturn;
    };

    $.fn.twbsPagination.defaults = {
        totalPages: 0,
        startPage: 1,
        visiblePages: 5,
        initiateStartPageClick: true,
        href: false,
        hrefVariable: '{{number}}',
        first: 'First',
        prev: 'Previous',
        next: 'Next',
        last: 'Last',
        loop: false,
        onPageClick: null,
        paginationClass: 'pagination',
        nextClass: 'next',
        prevClass: 'prev',
        lastClass: 'last',
        firstClass: 'first',
        pageClass: 'page',
        activeClass: 'active',
        disabledClass: 'disabled',
        selectable: 15,
        inputtext: 1,//yuguo 2016-08-03 备注；不能为null,否则不显示
        gotoPage: 'goto',//yuguo 2016-08-03
    };

    $.fn.twbsPagination.Constructor = TwbsPagination;

    $.fn.twbsPagination.noConflict = function () {
        $.fn.twbsPagination = old;
        return this;
    };

})(window.jQuery, window, document);
