/**
 * Folder filters for WPMF
 */
let wpmfFoldersFiltersModule;
(function($) {

    wpmfFoldersFiltersModule =  {
        events : [], // event handling
        wpmf_all_media: false,
        /**
         * Initialize module related things
         */
        initModule : function(page_type) {
            if (wpmf.vars.usefilter === 1) {
                // fix conflict with WP smush , image recycle plugin
                if (wpmf.vars.wpmf_pagenow === 'upload.php' && !page_type) {
                    return;
                }

                if (page_type === 'upload-list') {
                    wpmfFoldersFiltersModule.initListSizeFilter();

                    wpmfFoldersFiltersModule.initListWeightFilter();

                    wpmfFoldersFiltersModule.initListMyMediasFilter();

                    wpmfFoldersFiltersModule.initListAllMediasFilter();

                    wpmfFoldersFiltersModule.initListFolderOrderFilter();

                    wpmfFoldersFiltersModule.initListFilesOrderFilter();

                    // Auto submit when a select box is changed
                    $('.filter-items select').on('change', function(){
                        $('#post-query-submit').click();
                    });
                } else {
                    if (typeof wp.media.view.AttachmentsBrowser !== "undefined") {
                        wpmfFoldersFiltersModule.initSizeFilter();

                        wpmfFoldersFiltersModule.initWeightFilter();

                        wpmfFoldersFiltersModule.initMyMediasFilter();

                        wpmfFoldersFiltersModule.initFoldersOrderFilter();

                        wpmfFoldersFiltersModule.initFilesOrderFilter();
                    }
                }

                const initDropdown = function($current_frame) {
                    // Check if the dropdown has already been added to the current frame
                    if (!$current_frame.find('.wpmf-dropdown').length) {
                        // Initialize dropdown
                        wpmfFoldersFiltersModule.initDropdown($current_frame);
                    }
                };

                if(wpmfFoldersModule.page_type === 'upload-list') {
                    wpmfFoldersFiltersModule.initFilter();
                    // Don't need to wait on list page
                    initDropdown(wpmfFoldersModule.getFrame());
                } else {
                    // Wait main module to be ready on modal window
                    wpmfFoldersModule.on('ready', function($current_frame){
                        wpmfFoldersFiltersModule.initFilter();
                        initDropdown($current_frame);
                    });
                }
            }
        },

        /**
         * Init filter
         */
        initFilter: function () {
            let data = {};
            let type = wpmfFoldersModule.getCookie('#media-attachment-filters' + wpmf.vars.site_url);
            let date = wpmfFoldersModule.getCookie('#media-attachment-date-filters' + wpmf.vars.site_url);
            let size = wpmfFoldersModule.getCookie('#media-attachment-size-filters' + wpmf.vars.site_url);
            let weight = wpmfFoldersModule.getCookie('#media-attachment-weight-filters' + wpmf.vars.site_url);
            let order_folder = wpmfFoldersModule.getCookie('#media-order-folder' + wpmf.vars.site_url);
            let order_media = wpmfFoldersModule.getCookie('#media-order-media' + wpmf.vars.site_url);
            let wpmf_all_media = wpmfFoldersModule.getCookie('#wpmf_all_media' + wpmf.vars.site_url);
            let ownMedia = wpmfFoldersModule.getCookie('#wpmf-display-media-filters' + wpmf.vars.site_url);

            if (typeof type !== "undefined" && type !== "undefined" && type !== "null" && type !== 'all' && type !== '') {
                if (wpmfFoldersModule.page_type !== 'upload-list') {
                    $('#media-attachment-filters').val(type).change();
                } else {
                    if (wpmf.vars.filter_media_type === '') {
                        if (type.indexOf('post_mime_type:') === -1) {
                            $('#attachment-filter').val('post_mime_type:' +type);
                        } else {
                            $('#attachment-filter').val(type);
                        }
                    }
               }
            }

            if (typeof date !== "undefined" && date !== "undefined" && date !== "null" && date !== 'all' && date !== '') {
                if (wpmfFoldersModule.page_type !== 'upload-list') {
                    $('#media-attachment-date-filters').val(date).change();
                }
            }

            if (typeof size !== "undefined" && size !== "undefined" && size !== "null" && size !== 'all' && size !== '') {
                $('#media-attachment-size-filters').val(size);
                data.wpmf_size = size;
            }

            if (typeof weight !== "undefined" && weight !== "undefined" && weight !== "null" && weight !== 'all' && weight !== '') {
                $('#media-attachment-weight-filters').val(weight);
                data.wpmf_weight = weight;
            }

            if (typeof wpmf_all_media !== "undefined" && parseInt(wpmf_all_media) === 1) {
                $('.display-all-media').prepend('<span class="check"><i class="material-icons">check</i></span>');
                data.wpmf_all_media = wpmf_all_media;
                wpmfFoldersFiltersModule.wpmf_all_media = 1;
            }

            if (typeof ownMedia !== "undefined" && ownMedia === 'yes') {
                $('.own-user-media').prepend('<span class="check"><i class="material-icons">check</i></span>');
                $('#wpmf-display-media-filters').val(ownMedia);
                data.wpmf_display_media = 'yes';
            }

            if (typeof order_folder !== "undefined" && order_folder !== "undefined" && order_folder !== "null" && order_folder !== 'all' && order_folder !== '') {
                $('#media-order-folder').val(order_folder);
            }

            if (typeof order_media !== "undefined" && order_media !== "undefined" && order_media !== "null" && order_media !== 'all' && order_media !== '') {
                $('#media-order-media').val(order_media);
                switch (order_media) {
                    case 'date|asc':
                        data.orderby = false;
                        data.wpmf_orderby = 'date';
                        data.order = 'ASC';
                        break;

                    case 'date|desc':
                        data.orderby = false;
                        data.wpmf_orderby = 'date';
                        data.order = 'DESC';
                        break;

                    case 'title|asc':
                        data.meta_key = '';
                        data.orderby = false;
                        data.wpmf_orderby = 'title';
                        data.order = 'ASC';
                        break;

                    case 'title|desc':
                        data.meta_key = '';
                        data.orderby = false;
                        data.wpmf_orderby = 'title';
                        data.order = 'DESC';
                        break;

                    case 'size|asc':
                        data.meta_key = 'wpmf_size';
                        data.orderby = false;
                        data.wpmf_orderby = 'meta_value_num';
                        data.order = 'ASC';
                        break;

                    case 'size|desc':
                        data.meta_key = 'wpmf_size';
                        data.orderby = false;
                        data.wpmf_orderby = 'meta_value_num';
                        data.order = 'DESC';
                        break;

                    case 'filetype|asc':
                        data.meta_key = 'wpmf_filetype';
                        data.orderby = false;
                        data.wpmf_orderby = 'meta_value';
                        data.order = 'ASC';
                        break;

                    case 'filetype|desc':
                        data.meta_key = 'wpmf_filetype';
                        data.orderby = false;
                        data.wpmf_orderby = 'meta_value';
                        data.order = 'DESC';
                        break;
                    case 'custom':
                        data.meta_key = 'wpmf_order';
                        data.orderby = false;
                        data.wpmf_orderby = 'meta_value_num';
                        data.order = 'ASC';
                        break;

                }
            }

            if (wpmfFoldersModule.page_type !== 'upload-list') {
                let n = wpmfFoldersModule.getBackboneOfMedia();
                if (typeof n.view !== 'undefined') {
                    n.view.collection.props.set(data);
                }
            }
        },

        /**
         * Initialize media size filtering
         */
        initSizeFilter : function() {
            let myMediaViewAttachmentsBrowser= wp.media.view.AttachmentsBrowser;

            // render filter to toolbar
            if (typeof myMediaViewAttachmentsBrowser !== "undefined") {
                wp.media.view.AttachmentsBrowser = wp.media.view.AttachmentsBrowser.extend({
                    createToolbar: function () {
                        // call the original method
                        myMediaViewAttachmentsBrowser.prototype.createToolbar.apply(this, arguments);

                        // add our custom filter
                        wpmfFoldersModule.attachments_browser.toolbar.set('sizetags', new wp.media.view.AttachmentFilters['wpmf_attachment_size']({
                            controller: wpmfFoldersModule.attachments_browser.controller,
                            model: wpmfFoldersModule.attachments_browser.collection.props,
                            priority: -74
                        }).render());
                    }
                });

                wp.media.view.AttachmentFilters['wpmf_attachment_size'] = wp.media.view.AttachmentFilters.extend({
                    className: 'wpmf-attachment-size attachment-filters',
                    id: 'media-attachment-size-filters',
                    createFilters: function () {
                        let filters = {};
                        _.each(wpmf.vars.wpmf_size || [], function (text) {
                            filters[text] = {
                                text: text,
                                props: {
                                    wpmf_size: text
                                }
                            };
                        });

                        filters.all = {
                            text: wpmf.l18n.all_size_label,
                            props: {
                                wpmf_size: 'all'
                            },
                            priority: 10
                        };

                        this.filters = filters;
                    }
                });
            }
        },

        /**
         * Initialize the media size filtering for list view
         */
        initListSizeFilter : function() {
            let filter_size = '<select name="attachment_size" id="media-attachment-size-filters" class="wpmf-attachment-size">';
            filter_size += '<option value="all" selected>' + wpmf.l18n.all_size_label + '</option>';
            $.each(wpmf.vars.wpmf_size, function (key) {
                if (this === wpmf.vars.size) {
                    filter_size += '<option value="' + this + '" selected>' + this + '</option>';
                } else {
                    filter_size += '<option value="' + this + '">' + this + '</option>';
                }
            });
            filter_size += '</select>';

            $('#wpmf-media-category').after(filter_size);
        },

        /**
         * Initialize media weight filtering
         */
        initWeightFilter : function() {
            let myMediaViewAttachmentsBrowser= wp.media.view.AttachmentsBrowser;

            wp.media.view.AttachmentsBrowser = wp.media.view.AttachmentsBrowser.extend({
                createToolbar: function () {
                    // call the original method
                    myMediaViewAttachmentsBrowser.prototype.createToolbar.apply(this, arguments);

                    // add our custom filter
                    wpmfFoldersModule.attachments_browser.toolbar.set('weighttags', new wp.media.view.AttachmentFilters['wpmf_attachment_weight']({
                        controller: this.controller,
                        model: this.collection.props,
                        priority: -74
                    }).render());
                }
            });

            wp.media.view.AttachmentFilters['wpmf_attachment_weight'] = wp.media.view.AttachmentFilters.extend({
                className: 'wpmf-attachment-weight attachment-filters',
                id: 'media-attachment-weight-filters',
                createFilters: function () {
                    let filters = {};
                    _.each(wpmf.vars.wpmf_weight || [], function (text) {
                        let labels = text[0].split('-');
                        let label;
                        if (text[1] === 'kB') {
                            label = (labels[0] / 1024) + ' kB-' + (labels[1] / 1024) + ' kB';
                        } else {
                            label = (labels[0] / (1024 * 1024)) + ' MB-' + (labels[1] / (1024 * 1024)) + ' MB';
                        }
                        filters[text[0]] = {
                            text: label,
                            props: {
                                wpmf_weight: text[0]
                            }
                        };
                    });

                    filters.all = {
                        text: wpmf.l18n.all_weight_label,
                        props: {
                            wpmf_weight: 'all'
                        },
                        priority: -74
                    };

                    this.filters = filters;
                }
            });
        },


        /**
         * Initialize the media weight filtering for list view
         */
        initListWeightFilter : function() {
            let filter_weight = '<select name="attachment_weight" id="media-attachment-weight-filters" class="wpmf-attachment-weight">';
            filter_weight += '<option value="all" selected>' + wpmf.l18n.all_weight_label + '</option>';
            $.each(wpmf.vars.wpmf_weight, function (key, text) {
                let labels = text[0].split('-');
                let label;
                if (text[1] === 'kB') {
                    label = (labels[0] / 1024) + ' kB-' + (labels[1] / 1024) + ' kB';
                } else {
                    label = (labels[0] / (1024 * 1024)) + ' MB-' + (labels[1] / (1024 * 1024)) + ' MB';
                }
                if (text[0] === wpmf.vars.weight) {
                    filter_weight += '<option value="' + text[0] + '" selected>' + label + '</option>';
                } else {
                    filter_weight += '<option value="' + text[0] + '">' + label + '</option>';
                }
            });
            filter_weight += '</select>';
            $('#wpmf-media-category').after(filter_weight);
        },

        /**
         * Initialize media folders ordering
         */
        initFoldersOrderFilter : function() {
            wpmfFoldersModule.on('ready', function($current_frame){
                if ($current_frame.find('#media-order-folder').length) {
                    // Filter already initialized
                    return;
                }

                let element = '<select id="media-order-folder" class="wpmf-order-folder attachment-filters">';
                _.each(wpmf.l18n.order_folder || [], function (text, key) {
                    element += '<option value="'+key+'">'+text+'</option>';
                });
                element += '</select>';

                $current_frame.find('.media-frame-content .media-toolbar-secondary').append(element);

                $current_frame.find('#media-order-folder').on('change', function() {
                    let a = $(this).val();
                    if (typeof a !== "undefined" && a !== "undefined" && a !== "null" && a !== '') {
                        wpmfFoldersModule.setCookie('#media-order-folder' + wpmf.vars.site_url, a, 365);
                    }

                    wpmfFoldersModule.setFolderOrdering(this.value);
                    wpmfFoldersFiltersModule.trigger('foldersOrderChanged');
                });
            });
        },

        /**
         * Initialize the media ordering for list view
         */
        initListFolderOrderFilter : function() {
            let filter_order = '<select name="folder_order" id="media-order-folder" class="wpmf-order-folder wpmf-order">';
            $.each(wpmf.l18n.order_folder, function (key, text) {
                    filter_order += '<option value="' + key + '">' + text + '</option>';
            });
            filter_order += '</select>';
            $('#wpmf-media-category').after(filter_order);


            if (wpmf.vars.wpmf_order_f && wpmf.vars.wpmf_order_f !== '') {
                $('.wpmf-order-folder option[value="' + wpmf.vars.wpmf_order_f + '"]').prop('selected', true);
            }
        },

        /**
         * Initialize media ordering
         */
        initFilesOrderFilter : function() {
            let myMediaViewAttachmentsBrowser= wp.media.view.AttachmentsBrowser;

            // render filter to toolbar
            wp.media.view.AttachmentsBrowser = wp.media.view.AttachmentsBrowser.extend({
                createToolbar: function () {
                    // call the original method
                    myMediaViewAttachmentsBrowser.prototype.createToolbar.apply(this, arguments);

                    // add our custom filter
                    wpmfFoldersModule.attachments_browser.toolbar.set('ordermediatags', new wp.media.view.AttachmentFilters['wpmf_order_media']({
                        controller: this.controller,
                        model: this.collection.props,
                        priority: -74
                    }).render());
                }
            });

            /* Filter sort media */
            wp.media.view.AttachmentFilters['wpmf_order_media'] = wp.media.view.AttachmentFilters.extend({
                className: 'wpmf-order-media attachment-filters',
                id: 'media-order-media',
                createFilters: function () {
                    let filters = {};
                    _.each(wpmf.l18n.order_media || [], function (text, key) {
                        switch (key) {
                            case 'date|asc':
                                filters[key] = {
                                    text: text,
                                    props: {
                                        orderby: false,
                                        wpmf_orderby: 'date',
                                        order: 'ASC'
                                    }
                                };
                                break;

                            case 'date|desc':
                                filters[key] = {
                                    text: text,
                                    props: {
                                        orderby: false,
                                        wpmf_orderby: 'date',
                                        order: 'DESC'
                                    }
                                };
                                break;

                            case 'title|asc':
                                filters[key] = {
                                    text: text,
                                    props: {
                                        meta_key: '',
                                        orderby: false,
                                        wpmf_orderby: 'title',
                                        order: 'ASC'
                                    }
                                };
                                break;

                            case 'title|desc':
                                filters[key] = {
                                    text: text,
                                    props: {
                                        meta_key: '',
                                        orderby: false,
                                        wpmf_orderby: 'title',
                                        order: 'DESC'
                                    }
                                };
                                break;

                            case 'size|asc':
                                filters[key] = {
                                    text: text,
                                    props: {
                                        meta_key: 'wpmf_size',
                                        orderby: false,
                                        wpmf_orderby: 'meta_value_num',
                                        order: 'ASC'
                                    }
                                };
                                break;

                            case 'size|desc':
                                filters[key] = {
                                    text: text,
                                    props: {
                                        meta_key: 'wpmf_size',
                                        orderby: false,
                                        wpmf_orderby: 'meta_value_num',
                                        order: 'DESC'
                                    }
                                };
                                break;

                            case 'filetype|asc':
                                filters[key] = {
                                    text: text,
                                    props: {
                                        meta_key: 'wpmf_filetype',
                                        orderby: false,
                                        wpmf_orderby: 'meta_value',
                                        order: 'ASC'
                                    }
                                };
                                break;

                            case 'filetype|desc':
                                filters[key] = {
                                    text: text,
                                    props: {
                                        meta_key: 'wpmf_filetype',
                                        orderby: false,
                                        wpmf_orderby: 'meta_value',
                                        order: 'DESC'
                                    }
                                };
                                break;
                            case 'custom':
                                filters[key] = {
                                    text: text,
                                    props: {
                                        meta_key: 'wpmf_order',
                                        orderby: false,
                                        wpmf_orderby: 'meta_value_num',
                                        order: 'ASC'
                                    }
                                };
                                break;

                        }
                    });

                    filters.all = {
                        text: wpmf.l18n.sort_media,
                        props: {
                            orderby: 'date',
                            order: 'DESC'
                        },
                        priority: 10
                    };

                    this.filters = filters;
                }
            });
        },

        initListFilesOrderFilter : function() {
            let filter_order = '<select name="media-order-media" id="media-order-media" class="wpmf-order-media attachment-filters">';
            filter_order += '<option value="all" selected>' + wpmf.l18n.sort_media + '</option>';
            $.each(wpmf.l18n.order_media, function (key, text) {
                if (key === wpmf.vars.wpmf_order_media) {
                    filter_order += '<option value="' + key + '" selected>' + text + '</option>';
                } else {
                    filter_order += '<option value="' + key + '">' + text + '</option>';
                }
            });
            filter_order += '</select>';
            $('#wpmf-media-category').after(filter_order);


            if (wpmf.vars.wpmf_order_media && wpmf.vars.wpmf_order_media !== '') {
                $('.wpmf-order-folder option[value="' + wpmf.vars.wpmf_order_media + '"]').prop('selected', true);
            }
        },

        /**
         * Initialize own user media filtering
         */
        initMyMediasFilter : function(){
            let myMediaViewAttachmentsBrowser= wp.media.view.AttachmentsBrowser;

            // render filter to toolbar
            wp.media.view.AttachmentsBrowser = wp.media.view.AttachmentsBrowser.extend({
                createToolbar: function () {
                    // call the original method
                    myMediaViewAttachmentsBrowser.prototype.createToolbar.apply(this, arguments);
                    this.toolbar.set('displaymediatags', new wp.media.view.AttachmentFilters['wpmf_filter_display_media']({
                        controller: this.controller,
                        model: this.collection.props,
                        priority: -80
                    }).render());
                }
            });

            wp.media.view.AttachmentFilters['wpmf_filter_display_media'] = wp.media.view.AttachmentFilters.extend({
                className: 'wpmf-filter-display-media attachment-filters',
                id: 'wpmf-display-media-filters',
                createFilters: function () {
                    let filters = {};
                    filters['yes'] = {
                        text: 'Yes',
                        props: {
                            wpmf_display_media: 'yes'
                        }
                    };

                    filters.all = {
                        text: 'No',
                        props: {
                            wpmf_display_media: 'no'
                        },
                        priority: 10
                    };

                    this.filters = filters;
                }
            });
        },

        /**
         * Initialize own user media filtering for list view
         */
        initListMyMediasFilter : function() {
            let filter_media = '<select id="wpmf-display-media-filters" name="wpmf-display-media-filters" class="wpmf-filter-display-media attachment-filters">';
            if (wpmf.vars.display_own_media === 'all') {
                filter_media += '<option value="all" selected>No</option>';
            } else {
                filter_media += '<option value="all">No</option>';
            }

            if (wpmf.vars.display_own_media === 'yes') {
                filter_media += '<option value="yes" selected>Yes</option>';
            } else {
                filter_media += '<option value="yes">Yes</option>';
            }

            filter_media += '</select>';
            $('#wpmf-media-category').after(filter_media);
        },

        /**
         * Initialize own user media filtering for list view
         */
        initListAllMediasFilter : function() {
            let filter_media = '<select id="wpmf_all_media" name="wpmf_all_media" class="wpmf_all_media attachment-filters">';
            if (parseInt(wpmf.vars.display_all_media) === 0) {
                filter_media += '<option value="0" selected>0</option>';
            } else {
                filter_media += '<option value="0">0</option>';
            }

            if (parseInt(wpmf.vars.display_all_media) === 1) {
                filter_media += '<option value="1" selected>1</option>';
            } else {
                filter_media += '<option value="1">1</option>';
            }

            filter_media += '</select>';
            $('#wpmf-media-category').after(filter_media);
        },

        /**
         * Generate the dropdown button which replace the filters
         */
        generateDropdown : function($current_frame) {
            let clear_filters, my_medias = '', all_medias = '', filter_type = '', filter_date = '', filter_size = '', filter_weight = '', sort_folder = '', sort_file = '';

            // Add folder ordering
            const folder_order_options = $current_frame.find('#media-order-folder option');
            if(folder_order_options.length) {
                sort_folder = '<li class="wpmf_filter_sort_folders"><i class="material-icons-outlined wpmf-filter-icon-left">sort</i><label class="wpmf_filter_label">'+wpmf.l18n.order_folder_label+'</label><i class="material-icons-outlined wpmf_icon_right">arrow_right</i><ul>';
                folder_order_options.each(function(){
                    sort_folder += `<li onclick="wpmfFoldersFiltersModule.selectFilter('#media-order-folder', '${$(this).val()}');">`;
                    sort_folder += $(this).html();
                    if($(this).is(':selected')) {
                        sort_folder += '<span class="check"><i class="material-icons">check</i></span>';
                    }
                    sort_folder += '</li>';
                });
                sort_folder += '</ul></li>';
            }

            // Add media sorting
            const media_sort_options = $current_frame.find('#media-order-media option');
            if(media_sort_options.length) {
                sort_file = '<li class="wpmf_filter_sort_files"> <i class="material-icons-outlined wpmf-filter-icon-left">sort</i><label class="wpmf_filter_label">'+wpmf.l18n.order_img_label+'</label><i class="material-icons-outlined wpmf_icon_right">arrow_right</i><ul>';
                media_sort_options.each(function(){
                    sort_file += `<li onclick="wpmfFoldersFiltersModule.selectFilter('#media-order-media', '${$(this).val()}');">`;
                    sort_file += $(this).html();
                    if($(this).is(':selected')) {
                        sort_file += '<span class="check"><i class="material-icons">check</i></span>';
                    }
                    sort_file += '</li>';
                });
                sort_file += '</ul></li>';
            }

            // add custom media type
            if (wpmfFoldersModule.page_type === 'upload-list') {
                if (typeof wpmf.vars.wpmfcount_pdf !== "undefined" && typeof wpmf.vars.wpmfcount_zip !== "undefined" && typeof wpmf.vars.wpmf_file !== "undefined") {
                    let wpmfoption = `<option data-filetype="pdf" value="wpmf-pdf">${wpmf.l18n.pdf} (${wpmf.vars.wpmfcount_pdf})</option>`;
                    wpmfoption += `<option data-filetype="zip" value="wpmf-zip">${wpmf.l18n.zip} (${wpmf.vars.wpmfcount_zip})</option>`;
                    wpmfoption += `<option data-filetype="other" value="wpmf-other">${wpmf.l18n.other}</option>`;
                    $('select[name="attachment-filter"] option[value="detached"]').before(wpmfoption);

                    if (wpmf.vars.wpmf_file !== '') {
                        $(`select[name="attachment-filter"] option[value="${wpmf.vars.wpmf_file}"]`).prop('selected', true);
                    }
                }
            }

            // Add type filtering for both grid and list views
            if (wpmfFoldersModule.page_type === 'upload-list') {
                var media_filter_options = $current_frame.find('#attachment-filter option');
            } else {
                media_filter_options = $current_frame.find('#media-attachment-filters option');
            }

            if(media_filter_options.length) {
                filter_type = '<li class="media_type_item"> <i class="material-icons-outlined wpmf-filter-icon-left">description</i><label class="wpmf_filter_label">'+wpmf.l18n.media_type+'</label><i class="material-icons-outlined wpmf_icon_right">arrow_right</i><ul class="wpmf-filter-type">';
                media_filter_options.each(function(){
                    if (wpmfFoldersModule.page_type === 'upload-list') {
                        filter_type += `<li data-type="${$(this).val()}" onclick="wpmfFoldersFiltersModule.selectFilter('#attachment-filter', '${$(this).val()}');">`;
                    } else {
                        filter_type += `<li data-type="${$(this).val()}" onclick="wpmfFoldersFiltersModule.selectFilter('#media-attachment-filters', '${$(this).val()}');">`;
                    }

                    filter_type += $(this).html();
                    if($(this).is(':selected')) {
                        filter_type += '<span class="check"><i class="material-icons">check</i></span>';
                    }
                    filter_type += '</li>';
                });

                filter_type += '</ul></li>';
            }

            // Add date filtering
            const date_filter_options = $current_frame.find('#media-attachment-date-filters option, #filter-by-date option');
            if(date_filter_options.length) {
                filter_date = '<li class="date_item"> <i class="material-icons-outlined wpmf-filter-icon-left">date_range</i><label class="wpmf_filter_label">'+wpmf.l18n.date+'</label><i class="material-icons-outlined wpmf_icon_right">arrow_right</i><ul>';
                date_filter_options.each(function(){
                    filter_date += `<li onclick="wpmfFoldersFiltersModule.selectFilter('#media-attachment-date-filters, #filter-by-date', '${$(this).val()}');">`;
                    filter_date += $(this).html();
                    if($(this).is(':selected')) {
                        filter_date += '<span class="check"><i class="material-icons">check</i></span>';
                    }
                    filter_date += '</li>';
                });
                filter_date += '</ul></li>';
            }

            // Add size filtering
            const size_filter_options = $current_frame.find('#media-attachment-size-filters option');
            if(size_filter_options.length) {
                if (size_filter_options.length <= 3) {
                    filter_size = '<li class="filter_sort_size_item"> <i class="material-icons-outlined wpmf-filter-icon-left">aspect_ratio</i><label class="wpmf_filter_label">'+wpmf.l18n.lang_size+'</label><i class="material-icons-outlined wpmf_icon_right">arrow_right</i><ul>';
                } else {
                    filter_size = '<li class="wpmf_filter_sort_size filter_sort_size_item"> <i class="material-icons-outlined wpmf-filter-icon-left">aspect_ratio</i><label class="wpmf_filter_label">'+wpmf.l18n.lang_size+'</label><i class="material-icons-outlined wpmf_icon_right">arrow_right</i><ul>';
                }

                size_filter_options.each(function(){
                    filter_size += `<li onclick="wpmfFoldersFiltersModule.selectFilter('#media-attachment-size-filters', '${$(this).val()}');">`;
                    filter_size += $(this).html();
                    if($(this).is(':selected')) {
                        filter_size += '<span class="check"><i class="material-icons">check</i></span>';
                    }
                    filter_size += '</li>';
                });
                filter_size += '</ul></li>';
            }

            // Add weight filtering
            const weight_filter_options = $current_frame.find('#media-attachment-weight-filters option');
            if(weight_filter_options.length) {
                if (weight_filter_options.length <= 3) {
                    filter_weight = '<li class="filter_sort_weight_item"> <i class="material-icons-outlined wpmf-filter-icon-left">score</i><label class="wpmf_filter_label">'+wpmf.l18n.lang_weight+'</label><i class="material-icons-outlined wpmf_icon_right">arrow_right</i><ul>';
                } else {
                    filter_weight = '<li class="wpmf_filter_sort_weight filter_sort_weight_item"> <i class="material-icons-outlined wpmf-filter-icon-left">score</i><label class="wpmf_filter_label">'+wpmf.l18n.lang_weight+'</label><i class="material-icons-outlined wpmf_icon_right">arrow_right</i><ul>';
                }

                weight_filter_options.each(function(){
                    filter_weight += `<li onclick="wpmfFoldersFiltersModule.selectFilter('#media-attachment-weight-filters', '${$(this).val()}');">`;
                    filter_weight += $(this).html();
                    if($(this).is(':selected')) {
                        filter_weight += '<span class="check"><i class="material-icons">check</i></span>';
                    }
                    filter_weight += '</li>';
                });
                filter_weight += '</ul></li>';
            }


            clear_filters = '<li onclick="wpmfFoldersFiltersModule.clearFilters();" class="clearfilters-item"><label class="wpmf_filter_label">'+wpmf.l18n.clear_filters+'</label><i class="material-icons-outlined wpmf_icon_right">cleaning_services</i></li>';

            // Own user media
            if (parseInt(wpmf.vars.hide_own_media_button) === 0) {
                my_medias +=  `<li class="own-user-media" onclick="wpmfFoldersFiltersModule.displayOwnMedia('#wpmf-display-media-filters');">`;
                if($current_frame.find('#wpmf-display-media-filters').val() === 'yes') {
                    my_medias += '<span class="check"><i class="material-icons">check</i></span>';
                }
                my_medias += '<label class="wpmf_filter_label">' + wpmf.l18n.display_own_media + '</label>';
                my_medias += '<i class="material-icons-outlined wpmf_icon_right">person</i>';
                my_medias += '</li>';
            }

            all_medias +=  `<li class="display-all-media" onclick="wpmfFoldersFiltersModule.displayAllMedia('#wpmf_all_media');">`;
            if(wpmfFoldersFiltersModule.wpmf_all_media || parseInt($current_frame.find('#wpmf_all_media').val()) === 1) {
                all_medias += '<span class="check"><i class="material-icons">check</i></span>';
            }
            all_medias += '<label class="wpmf_filter_label">' + wpmf.l18n.display_all_files + '</label>';
            all_medias += '<i class="material-icons-outlined wpmf_icon_right">all_inclusive</i>';
            all_medias += '</li>';

            return `<div class="wpmf-dropdowns-wrap"><div class="wpmf-filters-dropdown wpmf-dropdown-wrap">
                            <a class="wpmf-filters-dropdown-button wpmf-dropdown-btn">${wpmf.l18n.filter_label}</a>
                            <ul>
                                ${clear_filters}
                                
                                ${my_medias}
                                
                                ${all_medias}
                                
                                ${filter_type}
                                
                                ${filter_date}
                                
                                ${filter_size}
                                
                                ${filter_weight}
                            </ul>
                        </div>
                        <div class="wpmf-sorts-dropdown wpmf-dropdown-wrap">
                            <a class="wpmf-filters-dropdown-button wpmf-dropdown-btn">${wpmf.l18n.sort_label}</a>
                            <ul>
                                ${sort_folder}
                                
                                ${sort_file}
                            </ul>
                        </div></div>
                        `;
        },

        /**
         * Reset the dropdown button
         * @param $current_frame
         */
        initDropdown : function($current_frame){
            // Add dropdown
            if($current_frame.find('.wpmf-dropdowns-wrap').length) {
                // Create dropdown
                $current_frame.find('.wpmf-dropdowns-wrap').replaceWith(wpmfFoldersFiltersModule.generateDropdown($current_frame));

                // Replace dropdown if exists
            } else if (wpmfFoldersModule.page_type === 'upload-list') {
                $current_frame.find('.filter-items').append(wpmfFoldersFiltersModule.generateDropdown($current_frame));
            } else {
                if ($current_frame.find('.media-toolbar-secondary .select-mode-toggle-button').length) {
                    $current_frame.find('.media-toolbar-secondary .select-mode-toggle-button').after(wpmfFoldersFiltersModule.generateDropdown($current_frame));
                } else {
                    $current_frame.find('.media-toolbar-secondary .wpmf-media-categories').after(wpmfFoldersFiltersModule.generateDropdown($current_frame));
                }
            }

            if(!$current_frame.find('.wpmf-allfiles-btn').length) {
                $current_frame.find('.wpmf-dropdowns-wrap').append('<button type="button" class="button wpmf-allfiles-btn">'+ wpmf.l18n.display_all_files +'</button>');
            }

            // add active class if selected a filter
            $('.wpmf-dropdown-wrap').each(function () {
                if ($(this).find('ul li ul li:not(:first-child) .check').length
                    || $(this).find('.own-user-media .check').length
                    || $(this).find('.display-all-media .check').length) {
                    let count = $(this).find('ul li ul li:not(:first-child) .check').length + $(this).find('.own-user-media .check').length + $(this).find('.display-all-media .check').length;
                    $(this).append('<span class="wpmf_dropdown_item_active" data-count="'+ count +'"></span>');
                    $(this).find('.wpmf-dropdown-btn').addClass('active');
                }
            });

            if ($('.display-all-media .check').length || wpmfFoldersFiltersModule.wpmf_all_media) {
                $('.attachments .wpmf-attachment').hide();
            } else {
                $('.attachments .wpmf-attachment').show();
            }

            // Button to open dropdown
            $current_frame.find('.wpmf-dropdown-wrap > a').click(function(){
                let $this = $(this);
                $this.closest('.wpmf-dropdown-wrap').find(' > ul').css('display','inline-block').css('left', $this.position().left);
            });

            $current_frame.find('.wpmf-allfiles-btn').click(function(){
                wpmfFoldersModule.changeFolder(0);
                wpmfFoldersFiltersModule.displayAllMedia('#wpmf_all_media', true);
            });

            // Click outside the dropdown to close it
            $(window).click(function(event) {
                if($(event.target).hasClass('wpmf-dropdown-btn')) {
                    return;
                }
                $current_frame.find('.wpmf-dropdown-wrap > ul').css('display','');
            });
        },

        /**
         * Select a filter and trigger change
         * @param filter_elem
         * @param value
         */
        selectFilter : function(filter_elem, value) {
            // Save current value in case of undo
            const current_value = $(filter_elem).val();
            $(filter_elem).val(value).trigger('change');
            if ((filter_elem === '#media-order-media' || filter_elem === '#media-order-folder') && wpmfFoldersModule.page_type !== 'upload-list') {
                wpmfFoldersModule.reloadAttachments();
            }

            $([
                '#media-order-folder',
                '#media-attachment-size-filters',
                '#media-attachment-weight-filters',
                '#media-order-media',
                '#wpmf-display-media-filters',
                '#media-attachment-filters',
                '#attachment-filter',
                '#media-attachment-date-filters'
            ]).each(function(){
                let a = $(this.toString()).val();
                if (this.toString() === '#media-attachment-filters' || this.toString() === '#attachment-filter') {
                    if (typeof a !== "undefined") {
                        a = a.replace('post_mime_type:', '');
                        wpmfFoldersModule.setCookie('#media-attachment-filters' + wpmf.vars.site_url, a, 365);
                    }
                } else {
                    wpmfFoldersModule.setCookie(this.toString() + wpmf.vars.site_url, a, 365);
                }
            });

            // Show snackbar
            wpmfSnackbarModule.show({
                id: 'undo_filter',
                content : wpmf.l18n.wpmf_undofilter,
                is_undoable : true,
                onUndo : function(){
                    wpmfFoldersFiltersModule.selectFilter(filter_elem, current_value);
                }
            });

            // Force reloading folders
            wpmfFoldersModule.renderFolders();

            wpmfFoldersFiltersModule.initDropdown(wpmfFoldersModule.getFrame());
        },

        displayAllMedia : function(filter_elem, all = false) {
            let wpmf_all_media;
            if (wpmfFoldersModule.page_type === 'upload-list') {
                if (!all) {
                    wpmf_all_media = $(filter_elem).find('option:not(:selected)').val();
                    $(filter_elem).val(wpmf_all_media).trigger('change');
                } else {
                    wpmf_all_media = 1;
                    $(filter_elem).val(1).trigger('change');
                }
                wpmfFoldersModule.setCookie('#wpmf_all_media' + wpmf.vars.site_url, wpmf_all_media, 365);
            } else {
                if (!all) {
                    wpmf_all_media = (wpmfFoldersFiltersModule.wpmf_all_media) ? 0 : 1;
                } else {
                    wpmf_all_media = 1;
                }
                wpmfFoldersFiltersModule.wpmf_all_media = wpmf_all_media;
                let n = wpmfFoldersModule.getBackboneOfMedia();
                n.view.collection.props.set({wpmf_all_media: wpmf_all_media});
                wpmfFoldersModule.setCookie('#wpmf_all_media' + wpmf.vars.site_url, wpmf_all_media, 365);
            }

            wpmfFoldersFiltersModule.initDropdown(wpmfFoldersModule.getFrame());
        },

        /**
         * Toggle a filter value and trigger change
         * @param filter_elem
         */
        displayOwnMedia : function(filter_elem) {
            let ownMedia = $(filter_elem).find('option:not(:selected)').val();
            $(filter_elem).val(ownMedia).trigger('change');
            wpmfFoldersModule.setCookie('#wpmf-display-media-filters' + wpmf.vars.site_url, ownMedia, 365);
            // Force reloading folders
            wpmfFoldersModule.renderFolders();

            wpmfFoldersFiltersModule.initDropdown(wpmfFoldersModule.getFrame());
        },

        /**
         * Clear all filters
         */
        clearFilters : function() {
            $([
                '#media-order-folder',
                '#media-attachment-filters',
                '#attachment-filters',
                '#media-attachment-date-filters',
                '#filter-by-date',
                '#media-attachment-size-filters',
                '#media-attachment-weight-filters',
                '#media-order-media',
                '#wpmf-display-media-filters',
                '#wpmf_all_media'
            ]).each(function(){
                // delete cookie filter
                wpmfFoldersModule.setCookie(this.toString() + wpmf.vars.site_url, 'all', 365);
                $(this.toString()).find('option').first().attr('selected', 'selected').trigger('change');
            });

            if (wpmfFoldersModule.page_type !== 'upload-list') {
                $('.display-all-media .check').remove();
                wpmfFoldersFiltersModule.wpmf_all_media = false;
                let n = wpmfFoldersModule.getBackboneOfMedia();
                n.view.collection.props.set({wpmf_all_media: 0});
            }

            // Force reloading folders
            wpmfFoldersModule.renderFolders();
            // Reload the dropdown
            wpmfFoldersFiltersModule.initDropdown(wpmfFoldersModule.getFrame());
        },

        /**
         * Trigger an event
         * @param event string the event name
         * @param arguments
         */
        trigger: function(event) {
            // Retrieve the list of arguments to send to the function
            let args = Array.from(arguments).slice(1);

            // Retrieve registered function
            let events = wpmfFoldersFiltersModule.events[event];

            // For each registered function apply arguments
            for (let e in events) {
                events[e].apply(this, args);
            }
        },

        /**
         * Subscribe to an or multiple events
         * @param events {string|array} event name
         * @param subscriber function the callback function
         */
        on: function(events, subscriber) {
            // If event is a string convert it as an array
            if(typeof events === 'string') {
                events = [events];
            }

            // Allow multiple event to subscript
            for (let ij in events) {
                if (typeof subscriber === 'function') {
                    if (typeof wpmfFoldersFiltersModule.events[events[ij]] === "undefined") {
                        this.events[events[ij]] = [];
                    }
                    wpmfFoldersFiltersModule.events[events[ij]].push(subscriber);
                }
            }
        }
    };

    // add filter work with Easing Slider plugin
    if (wpmf.vars.base === 'toplevel_page_easingslider') {
        wpmfFoldersFiltersModule.initSizeFilter();

        wpmfFoldersFiltersModule.initWeightFilter();

        wpmfFoldersFiltersModule.initMyMediasFilter();

        wpmfFoldersFiltersModule.initFoldersOrderFilter();

        wpmfFoldersFiltersModule.initFilesOrderFilter();
    }

    // Wait for the main WPMF module filters initialization
    wpmfFoldersModule.on('afterFiltersInitialization', function() {
        wpmfFoldersFiltersModule.initModule(wpmfFoldersModule.page_type);
   });
})(jQuery);


