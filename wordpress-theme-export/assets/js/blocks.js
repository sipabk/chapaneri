/**
 * Chapaneri Heritage Gutenberg Blocks
 *
 * @package Chapaneri_Heritage
 */

(function(wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, ToggleControl, SelectControl, TextControl, RangeControl } = wp.components;
    const { Fragment, createElement: el } = wp.element;
    const { __ } = wp.i18n;

    // Block Icon
    const familyIcon = el('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        width: 24,
        height: 24
    }, el('path', {
        d: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-7 7c0-2.67 5.33-4 7-4s7 1.33 7 4v1H5v-1z',
        fill: 'currentColor'
    }));

    const searchIcon = el('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        width: 24,
        height: 24
    }, el('path', {
        d: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
        fill: 'currentColor'
    }));

    const statsIcon = el('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        width: 24,
        height: 24
    }, el('path', {
        d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
        fill: 'currentColor'
    }));

    const listIcon = el('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        width: 24,
        height: 24
    }, el('path', {
        d: 'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z',
        fill: 'currentColor'
    }));

    // =========================================================================
    // Family Search Block
    // =========================================================================
    registerBlockType('chapaneri/family-search', {
        title: __('Family Search', 'chapaneri-heritage'),
        description: __('Add an AJAX-powered search box for family members.', 'chapaneri-heritage'),
        icon: searchIcon,
        category: 'widgets',
        keywords: [__('search', 'chapaneri-heritage'), __('family', 'chapaneri-heritage'), __('member', 'chapaneri-heritage')],

        attributes: {
            showFilters: {
                type: 'boolean',
                default: true,
            },
            placeholder: {
                type: 'string',
                default: 'Search family members...',
            },
        },

        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({
                className: 'chapaneri-block chapaneri-block--search',
            });

            return el(Fragment, null,
                el(InspectorControls, null,
                    el(PanelBody, { title: __('Search Settings', 'chapaneri-heritage'), initialOpen: true },
                        el(ToggleControl, {
                            label: __('Show Filters', 'chapaneri-heritage'),
                            help: __('Display generation and gender filter dropdowns.', 'chapaneri-heritage'),
                            checked: attributes.showFilters,
                            onChange: function(value) { setAttributes({ showFilters: value }); }
                        }),
                        el(TextControl, {
                            label: __('Placeholder Text', 'chapaneri-heritage'),
                            value: attributes.placeholder,
                            onChange: function(value) { setAttributes({ placeholder: value }); }
                        })
                    )
                ),
                el('div', blockProps,
                    el('div', { className: 'block-preview' },
                        el('div', { className: 'block-preview__icon' }, searchIcon),
                        el('h4', null, __('Family Search', 'chapaneri-heritage')),
                        el('p', null, __('Displays an instant search box for family members.', 'chapaneri-heritage')),
                        el('div', { className: 'block-preview__settings' },
                            el('span', null, attributes.showFilters ? __('Filters: Enabled', 'chapaneri-heritage') : __('Filters: Disabled', 'chapaneri-heritage'))
                        )
                    )
                )
            );
        },

        save: function() {
            return null; // Dynamic block
        }
    });

    // =========================================================================
    // Family Stats Block
    // =========================================================================
    registerBlockType('chapaneri/family-stats', {
        title: __('Family Statistics', 'chapaneri-heritage'),
        description: __('Display family statistics like total members, generations, and locations.', 'chapaneri-heritage'),
        icon: statsIcon,
        category: 'widgets',
        keywords: [__('stats', 'chapaneri-heritage'), __('family', 'chapaneri-heritage'), __('count', 'chapaneri-heritage')],

        attributes: {
            layout: {
                type: 'string',
                default: 'grid',
            },
            showTotal: {
                type: 'boolean',
                default: true,
            },
            showGenerations: {
                type: 'boolean',
                default: true,
            },
            showLocations: {
                type: 'boolean',
                default: true,
            },
            showLiving: {
                type: 'boolean',
                default: true,
            },
        },

        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({
                className: 'chapaneri-block chapaneri-block--stats',
            });

            const layoutOptions = [
                { value: 'grid', label: __('Grid', 'chapaneri-heritage') },
                { value: 'horizontal', label: __('Horizontal', 'chapaneri-heritage') },
                { value: 'vertical', label: __('Vertical', 'chapaneri-heritage') },
            ];

            const enabledStats = [];
            if (attributes.showTotal) enabledStats.push(__('Total', 'chapaneri-heritage'));
            if (attributes.showGenerations) enabledStats.push(__('Generations', 'chapaneri-heritage'));
            if (attributes.showLocations) enabledStats.push(__('Locations', 'chapaneri-heritage'));
            if (attributes.showLiving) enabledStats.push(__('Living', 'chapaneri-heritage'));

            return el(Fragment, null,
                el(InspectorControls, null,
                    el(PanelBody, { title: __('Display Settings', 'chapaneri-heritage'), initialOpen: true },
                        el(SelectControl, {
                            label: __('Layout', 'chapaneri-heritage'),
                            value: attributes.layout,
                            options: layoutOptions,
                            onChange: function(value) { setAttributes({ layout: value }); }
                        })
                    ),
                    el(PanelBody, { title: __('Statistics to Show', 'chapaneri-heritage'), initialOpen: true },
                        el(ToggleControl, {
                            label: __('Total Members', 'chapaneri-heritage'),
                            checked: attributes.showTotal,
                            onChange: function(value) { setAttributes({ showTotal: value }); }
                        }),
                        el(ToggleControl, {
                            label: __('Generations', 'chapaneri-heritage'),
                            checked: attributes.showGenerations,
                            onChange: function(value) { setAttributes({ showGenerations: value }); }
                        }),
                        el(ToggleControl, {
                            label: __('Locations', 'chapaneri-heritage'),
                            checked: attributes.showLocations,
                            onChange: function(value) { setAttributes({ showLocations: value }); }
                        }),
                        el(ToggleControl, {
                            label: __('Living Members', 'chapaneri-heritage'),
                            checked: attributes.showLiving,
                            onChange: function(value) { setAttributes({ showLiving: value }); }
                        })
                    )
                ),
                el('div', blockProps,
                    el('div', { className: 'block-preview' },
                        el('div', { className: 'block-preview__icon' }, statsIcon),
                        el('h4', null, __('Family Statistics', 'chapaneri-heritage')),
                        el('p', null, __('Displays family statistics and metrics.', 'chapaneri-heritage')),
                        el('div', { className: 'block-preview__settings' },
                            el('span', null, __('Layout:', 'chapaneri-heritage') + ' ' + attributes.layout),
                            el('span', null, __('Showing:', 'chapaneri-heritage') + ' ' + enabledStats.join(', '))
                        )
                    )
                )
            );
        },

        save: function() {
            return null; // Dynamic block
        }
    });

    // =========================================================================
    // Family Member Block
    // =========================================================================
    registerBlockType('chapaneri/family-member', {
        title: __('Family Member', 'chapaneri-heritage'),
        description: __('Display a single family member card.', 'chapaneri-heritage'),
        icon: familyIcon,
        category: 'widgets',
        keywords: [__('member', 'chapaneri-heritage'), __('family', 'chapaneri-heritage'), __('profile', 'chapaneri-heritage')],

        attributes: {
            memberId: {
                type: 'number',
                default: 0,
            },
            showPhoto: {
                type: 'boolean',
                default: true,
            },
            showDates: {
                type: 'boolean',
                default: true,
            },
            showPlace: {
                type: 'boolean',
                default: true,
            },
        },

        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({
                className: 'chapaneri-block chapaneri-block--member',
            });

            const memberOptions = window.chapaneriBlocksData ? window.chapaneriBlocksData.members : [];
            const selectedMember = memberOptions.find(function(m) { return m.value === attributes.memberId; });

            return el(Fragment, null,
                el(InspectorControls, null,
                    el(PanelBody, { title: __('Member Selection', 'chapaneri-heritage'), initialOpen: true },
                        el(SelectControl, {
                            label: __('Select Member', 'chapaneri-heritage'),
                            value: attributes.memberId,
                            options: memberOptions,
                            onChange: function(value) { setAttributes({ memberId: parseInt(value, 10) }); }
                        })
                    ),
                    el(PanelBody, { title: __('Display Options', 'chapaneri-heritage'), initialOpen: true },
                        el(ToggleControl, {
                            label: __('Show Photo', 'chapaneri-heritage'),
                            checked: attributes.showPhoto,
                            onChange: function(value) { setAttributes({ showPhoto: value }); }
                        }),
                        el(ToggleControl, {
                            label: __('Show Dates', 'chapaneri-heritage'),
                            checked: attributes.showDates,
                            onChange: function(value) { setAttributes({ showDates: value }); }
                        }),
                        el(ToggleControl, {
                            label: __('Show Birthplace', 'chapaneri-heritage'),
                            checked: attributes.showPlace,
                            onChange: function(value) { setAttributes({ showPlace: value }); }
                        })
                    )
                ),
                el('div', blockProps,
                    el('div', { className: 'block-preview' },
                        el('div', { className: 'block-preview__icon' }, familyIcon),
                        el('h4', null, __('Family Member', 'chapaneri-heritage')),
                        attributes.memberId > 0
                            ? el('p', { className: 'selected-member' }, 
                                __('Selected:', 'chapaneri-heritage') + ' ' + (selectedMember ? selectedMember.label : __('Unknown', 'chapaneri-heritage'))
                              )
                            : el('p', null, __('Please select a family member from the sidebar.', 'chapaneri-heritage'))
                    )
                )
            );
        },

        save: function() {
            return null; // Dynamic block
        }
    });

    // =========================================================================
    // Family Members List Block
    // =========================================================================
    registerBlockType('chapaneri/family-members-list', {
        title: __('Family Members List', 'chapaneri-heritage'),
        description: __('Display a grid or list of family members with optional filters.', 'chapaneri-heritage'),
        icon: listIcon,
        category: 'widgets',
        keywords: [__('members', 'chapaneri-heritage'), __('family', 'chapaneri-heritage'), __('list', 'chapaneri-heritage'), __('grid', 'chapaneri-heritage')],

        attributes: {
            generation: {
                type: 'string',
                default: '',
            },
            gender: {
                type: 'string',
                default: '',
            },
            count: {
                type: 'number',
                default: 12,
            },
            layout: {
                type: 'string',
                default: 'grid',
            },
        },

        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({
                className: 'chapaneri-block chapaneri-block--members-list',
            });

            const generationOptions = window.chapaneriBlocksData ? window.chapaneriBlocksData.generations : [];
            const genderOptions = [
                { value: '', label: __('All Genders', 'chapaneri-heritage') },
                { value: 'male', label: __('Male', 'chapaneri-heritage') },
                { value: 'female', label: __('Female', 'chapaneri-heritage') },
            ];
            const layoutOptions = [
                { value: 'grid', label: __('Grid', 'chapaneri-heritage') },
                { value: 'list', label: __('List', 'chapaneri-heritage') },
            ];

            return el(Fragment, null,
                el(InspectorControls, null,
                    el(PanelBody, { title: __('Filter Members', 'chapaneri-heritage'), initialOpen: true },
                        el(SelectControl, {
                            label: __('Generation', 'chapaneri-heritage'),
                            value: attributes.generation,
                            options: generationOptions,
                            onChange: function(value) { setAttributes({ generation: value }); }
                        }),
                        el(SelectControl, {
                            label: __('Gender', 'chapaneri-heritage'),
                            value: attributes.gender,
                            options: genderOptions,
                            onChange: function(value) { setAttributes({ gender: value }); }
                        }),
                        el(RangeControl, {
                            label: __('Number of Members', 'chapaneri-heritage'),
                            value: attributes.count,
                            onChange: function(value) { setAttributes({ count: value }); },
                            min: 1,
                            max: 50
                        })
                    ),
                    el(PanelBody, { title: __('Display Settings', 'chapaneri-heritage'), initialOpen: true },
                        el(SelectControl, {
                            label: __('Layout', 'chapaneri-heritage'),
                            value: attributes.layout,
                            options: layoutOptions,
                            onChange: function(value) { setAttributes({ layout: value }); }
                        })
                    )
                ),
                el('div', blockProps,
                    el('div', { className: 'block-preview' },
                        el('div', { className: 'block-preview__icon' }, listIcon),
                        el('h4', null, __('Family Members List', 'chapaneri-heritage')),
                        el('p', null, __('Displays a collection of family members.', 'chapaneri-heritage')),
                        el('div', { className: 'block-preview__settings' },
                            el('span', null, __('Count:', 'chapaneri-heritage') + ' ' + attributes.count),
                            el('span', null, __('Layout:', 'chapaneri-heritage') + ' ' + attributes.layout)
                        )
                    )
                )
            );
        },

        save: function() {
            return null; // Dynamic block
        }
    });

})(window.wp);
