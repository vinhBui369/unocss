var wpmfEmlImportModule;
(function ($) {
    wpmfEmlImportModule = {
        categories: [],
        categories_order: [],
        init: function () {
            $('.open_import_eml').on('click', function () {
                var button = '<div class="wpmfeml_action">';
                button += '<button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect wpmfeml_button wpmfeml_import_all_btn">'+ import_eml_objects.l18n.import_all_label +'</button>';
                button += '<button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect wpmfeml_button wpmfeml_import_selected_btn">'+ import_eml_objects.l18n.import_selected_label +'</button>';
                button += '<button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect wpmfeml_button wpmfeml_cancel_btn">'+ import_eml_objects.l18n.cancel_label +'</button>';
                button += '<span class="spinner" style="margin: 8px"></span>';
                button += '</div>';
                showDialog({
                    title: import_eml_objects.l18n.eml_label_dialog,
                    id: 'import-eml-dialog',
                    text: '<div class="wpmfeml_categories_tree"></div>' + button
                });

                wpmfEmlImportModule.categories_order = import_eml_objects.vars.categories_order;
                wpmfEmlImportModule.categories = import_eml_objects.vars.categories;
                wpmfEmlImportModule.importCategories();
                // Render the tree view
                wpmfEmlImportModule.loadTreeView();
                wpmfEmlImportModule.handleClick();
            });

            $('.wpmfeml_notice .wpmf-notice-dismiss').unbind('click').bind('click', function () {
                $.ajax({
                    type: 'POST',
                    url: import_eml_objects.vars.ajaxurl,
                    data: {
                        action: "wpmf_update_eml_notice_flag",
                        wpmf_nonce: import_eml_objects.vars.wpmf_nonce
                    },
                    beforeSend: function () {
                        $('.wpmfeml_notice').remove();
                    },
                    success: function (res) {}
                });
            });
        },

        handleClick: function () {
            $('.wpmfeml-check').unbind('click').bind('click', function () {
                if ($(this).closest('.wpmfeml-item-check').hasClass('wpmfeml_checked')) {
                    $(this).closest('.wpmfeml-item-check').removeClass('wpmfeml_checked').addClass('wpmfeml_notchecked');
                    $(this).closest('li').find('ul .wpmfeml-item-check').removeClass('wpmfeml_checked').addClass('wpmfeml_notchecked');
                } else {
                    $(this).closest('.wpmfeml-item-check').addClass('wpmfeml_checked').removeClass('wpmfeml_notchecked');
                    $(this).closest('li').find('ul .wpmfeml-item-check').addClass('wpmfeml_checked').removeClass('wpmfeml_notchecked');
                }
                var parents = $(this).parents('li');
                $.each(parents, function (i, parent) {
                    var checked_length = $(parent).find(' > .wpmfeml_trees > li > .wpmfeml-item .wpmfeml_checked').length;
                    var not_checked_length = $(parent).find(' > .wpmfeml_trees > li > .wpmfeml-item .wpmfeml_notchecked').length;
                    if (checked_length && not_checked_length) {
                        $(parent).find('> .wpmfeml-item .wpmfeml-item-check').removeClass('wpmfeml_checked wpmfeml_notchecked').addClass('wpmfeml_part_checked');
                    }

                    if (checked_length && !not_checked_length) {
                        $(parent).find('> .wpmfeml-item .wpmfeml-item-check').removeClass('wpmfeml_part_checked wpmfeml_notchecked').addClass('wpmfeml_checked');
                    }

                    if (!checked_length && not_checked_length) {
                        $(parent).find('> .wpmfeml-item .wpmfeml-item-check').removeClass('wpmfeml_part_checked wpmfeml_checked').addClass('wpmfeml_notchecked');
                    }
                });

                if ($('.wpmfeml_checked').length) {
                    $('.wpmfeml_import_selected_btn').show();
                    $('.wpmfeml_import_all_btn').hide();
                } else {
                    $('.wpmfeml_import_selected_btn').hide();
                    $('.wpmfeml_import_all_btn').show();
                }
            });

            $('.wpmfeml_cancel_btn').unbind('click').bind('click', function () {
                var dialod = $('#import-eml-dialog');
                hideDialog(dialod);
            });

            $('.wpmfeml_import_all_btn').unbind('click').bind('click', function () {
                wpmfEmlImportModule.getAndInsertAllEmlCategories(1);
            });

            $('.wpmfeml_import_selected_btn').unbind('click').bind('click', function () {
                var ids = [];
                $('.wpmfeml_checked').each(function (i, checkbox) {
                    var id = $(checkbox).closest('.wpmfeml-item').data('id');
                    if (parseInt(id) !== 0) {
                        ids.push(id);
                    }
                });

                if (ids.length) {
                    wpmfEmlImportModule.getAndInsertAllEmlCategories(1, 'selected', ids);
                }
            });
        },

        getAndInsertAllEmlCategories: function (paged, type = 'all', ids = []) {
            var data = {
                action: "wpmf_get_insert_eml_categories",
                paged: paged,
                wpmf_nonce: import_eml_objects.vars.wpmf_nonce
            };

            if (type === 'selected') {
                data.type = 'selected';
                data.ids = ids.join();
            }
            $.ajax({
                type: 'POST',
                url: import_eml_objects.vars.ajaxurl,
                data: data,
                beforeSend: function () {
                    $('.wpmfeml_action .spinner').css('visibility', 'visible').show();
                },
                success: function (res) {
                    if (res.status) {
                        if (res.continue) {
                            wpmfEmlImportModule.getAndInsertAllEmlCategories(parseInt(paged) + 1, type, ids);
                        } else {
                            // update parent and add object
                            wpmfEmlImportModule.updateParentForImportedEmlFolder(1)
                        }
                    }
                }
            });
        },

        updateParentForImportedEmlFolder: function (paged) {
            $.ajax({
                type: 'POST',
                url: import_eml_objects.vars.ajaxurl,
                data: {
                    action: "wpmf_update_eml_categories",
                    paged: paged,
                    wpmf_nonce: import_eml_objects.vars.wpmf_nonce
                },
                success: function (res) {
                    if (res.status) {
                        if (res.continue) {
                            wpmfEmlImportModule.updateParentForImportedEmlFolder(parseInt(paged) + 1)
                        } else {
                            $('.wpmfeml_action .spinner').hide();
                            $('.wpmfeml_notice').remove();
                            var dialod = $('#import-eml-dialog');
                            hideDialog(dialod);
                            if (import_eml_objects.vars.pagenow === 'upload.php') {
                                location.reload();
                            }
                        }
                    }
                }
            });
        },

        importCategories: function () {
            var folders_ordered = [];

            // Add each category
            $(wpmfEmlImportModule.categories_order).each(function () {
                folders_ordered.push(wpmfEmlImportModule.categories[this]);
            });

            // Reorder array based on children
            var folders_ordered_deep = [];
            var processed_ids = [];
            var loadChildren = function loadChildren(id) {
                if (processed_ids.indexOf(id) < 0) {
                    processed_ids.push(id);
                    for (var ij = 0; ij < folders_ordered.length; ij++) {
                        if (parseInt(folders_ordered[ij].parent_id) === parseInt(id)) {
                            folders_ordered_deep.push(folders_ordered[ij]);
                            loadChildren(folders_ordered[ij].id);
                        }
                    }
                }
            };
            loadChildren(0);

            // Finally save it to the global var
            wpmfEmlImportModule.categories = folders_ordered_deep;
        },

        /**
         * Render tree view inside content
         */
        loadTreeView: function () {
            $('.wpmfeml_categories_tree').html(wpmfEmlImportModule.getRendering());
        },

        /**
         * Get the html resulting tree view
         * @return {string}
         */
        getRendering: function () {
            var ij = 0;
            var content = '';

            /**
             * Recursively print list of folders
             * @return {boolean}
             */
            var generateList = function () {
                content += '<ul class="wpmfeml_trees">';
                while (ij < wpmfEmlImportModule.categories.length) {
                    var className = 'closed ';
                    // Open li tag
                    content += '<li class="' + className + '" data-id="' + wpmfEmlImportModule.categories[ij].id + '">';
                    content += '<div class="wpmfeml-item" data-id="' + wpmfEmlImportModule.categories[ij].id + '">';
                    content += '<div class="wpmfeml-item-inside" data-id="' + wpmfEmlImportModule.categories[ij].id + '">';
                    var a_tag = '<a class="wpmfeml-text-item" data-id="' + wpmfEmlImportModule.categories[ij].id + '">';
                    if (wpmfEmlImportModule.categories[ij + 1] && wpmfEmlImportModule.categories[ij + 1].depth > wpmfEmlImportModule.categories[ij].depth) {
                        // The next element is a sub folder
                        content += '<a class="wpmfeml-toggle-icon" onclick="wpmfEmlImportModule.toggle(' + wpmfEmlImportModule.categories[ij].id + ')"><i class="material-icons wpmfeml-arrow">arrow_right</i></a>';
                    } else {
                        content += '<a class="wpmfeml-toggle-icon wpmfeml-notoggle-icon"><i class="material-icons wpmfeml-arrow">arrow_right</i></a>';
                    }

                    if (parseInt(wpmfEmlImportModule.categories[ij].id) !== 0) {
                        content += '<a class="wpmfeml-item-check wpmfeml_notchecked"><span class="material-icons wpmfeml-check wpmfeml-item-checkbox-checked"> check_box </span><span class="material-icons wpmfeml-check wpmfeml-item-checkbox"> check_box_outline_blank </span><span class="material-icons wpmfeml-check wpmfeml-item-part-checkbox"> indeterminate_check_box </span></a>';
                    }
                    content += a_tag;

                    if (parseInt(wpmfEmlImportModule.categories[ij].id) === 0) {
                        content += '<i class="wpmfeml-icon-root"></i>';
                    } else {
                        content += '<i class="material-icons wpmfeml-item-icon">folder</i>';
                    }
                    content += '<span class="wpmfeml-item-title" data-id="'+ wpmfEmlImportModule.categories[ij].id +'">' + wpmfEmlImportModule.categories[ij].label + '</span>';
                    content += '</a>';
                    content += '</div>';
                    content += '</div>';

                    // This is the end of the array
                    if (wpmfEmlImportModule.categories[ij + 1] === undefined) {
                        // Let's close all opened tags
                        for (var ik = wpmfEmlImportModule.categories[ij].depth; ik >= 0; ik--) {
                            content += '</li>';
                            content += '</ul>';
                        }

                        // We are at the end don't continue to process array
                        return false;
                    }

                    if (wpmfEmlImportModule.categories[ij + 1].depth > wpmfEmlImportModule.categories[ij].depth) {
                        // The next element is a sub folder
                        // Recursively list it
                        ij++;
                        if (generateList() === false) {
                            // We have reached the end, let's recursively end
                            return false;
                        }
                    } else if (wpmfEmlImportModule.categories[ij + 1].depth < wpmfEmlImportModule.categories[ij].depth) {
                        // The next element don't have the same parent
                        // Let's close opened tags
                        for (var _ik = wpmfEmlImportModule.categories[ij].depth; _ik > wpmfEmlImportModule.categories[ij + 1].depth; _ik--) {
                            content += '</li>';
                            content += '</ul>';
                        }

                        // We're not at the end of the array let's continue processing it
                        return true;
                    }

                    // Close the current element
                    content += '</li>';
                    ij++;
                }
            };

            // Start generation
            generateList();
            return content;
        },

        /**
         * Toggle the open / closed state of a folder
         * @param folder_id
         */
        toggle: function (folder_id) {
            // Check is folder has closed class
            if ($('.wpmfeml_categories_tree').find('li[data-id="' + folder_id + '"]').hasClass('closed')) {
                // Open the folder
                wpmfEmlImportModule.openFolder(folder_id);
            } else {
                // Close the folder
                wpmfEmlImportModule.closeFolder(folder_id);
                // close all sub folder
                $('li[data-id="' + folder_id + '"]').find('li').addClass('closed');
            }
        },

        /**
         * Open a folder to show children
         */
        openFolder: function (folder_id) {
            $('.wpmfeml_categories_tree').find('li[data-id="' + folder_id + '"]').removeClass('closed');
        },

        /**
         * Close a folder and hide children
         */
        closeFolder: function (folder_id) {
            $('.wpmfeml_categories_tree').find('li[data-id="' + folder_id + '"]').addClass('closed');
        }
    };
    
    $(document).ready(function () {
        wpmfEmlImportModule.init();
    });
})(jQuery);