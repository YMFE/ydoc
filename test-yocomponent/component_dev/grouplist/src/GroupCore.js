/**
 * Grouplist核心逻辑,负责管理Grouplist组件的状态
 */
import ComponentCore from '../../common/ComponentCore';

export default class GroupCore extends ComponentCore {
    static guid = -1;

    /**
     * 构造函数
     * @param dataSource 数据源,将会被插入一些title对象
     * @param itemHeight 列表项高度
     * @param titleHeight title高度
     * @param sortFunc group排序规则
     * @param infinite 是否开启无穷模式
     * @param offsetY 初始偏移
     */
    constructor(dataSource,
                itemHeight = null,
                titleHeight,
                sortFunc,
                infinite,
                offsetY = 0) {
        super('grouplist');
        //stickyHeader是一个内部状态,保存了当前吸顶title的位置和key
        this.stickyHeader = null;
        //调用initialize过程,这个过程在componentWillReceiveProps时也会被调用,可以init/reset组件的状态
        this.initialize(
            offsetY,
            dataSource,
            sortFunc,
            infinite,
            itemHeight,
            titleHeight
        );
    }

    /**
     * 初始化/重置组件的状态
     * @param offsetY
     * @param dataSource
     * @param sortFunc
     * @param infinite
     * @param itemHeight
     * @param titleHeight
     */
    initialize(offsetY,
               dataSource,
               sortFunc = this.sortFunc,
               infinite = this.infinite,
               itemHeight = this.itemHeight,
               titleHeight = this.titleHeight) {
        this.infinite = infinite;
        this.itemHeight = itemHeight;
        this.titleHeight = titleHeight;
        this.currentGroup = {};
        this.dataSource = this.renderData(dataSource, itemHeight, titleHeight, sortFunc);
        this.groupTitles = this.getTitles();
        this.isHeightFixed = this.dataSource.every(item=> {
                return !!item.height
            }) || !infinite;
        this.offsetY = this.isHeightFixed ? offsetY : this.offsetY;
    }

    /**
     * 调用initalize并触发change事件让组件更新,在componentWillReceiveProps中调用
     * @param dataSource
     * @param sortFunc
     * @param infinite
     * @param offsetY
     */
    refresh(dataSource = this.dataSource,
            sortFunc = this.sortFunc,
            infinite = this.infinite,
            offsetY = this.offsetY) {
        this.initialize(offsetY, dataSource, sortFunc, infinite);
        this.emitEvent('refresh', this.dataSource, this.groupTitles);
    }

    /**
     * 处理数据源,计算出数据源的所有title并插入
     * @param dataSource
     * @param itemHeight
     * @param titleHeight
     * @param sortFunc
     * @returns {Array}
     */
    renderData(dataSource,
               itemHeight = this.itemHeight,
               titleHeight = this.titleHeight,
               sortFunc = this.sortFunc) {
        return this.dataSource = this
            .insertGroupTitles(dataSource, this.extractGroupKeys(dataSource, sortFunc))
            .map(item=>Object.assign({}, item, {
                height: item._type === 'groupTitle' ? titleHeight : itemHeight ? itemHeight : item.height
            }));
    }

    /**
     * 从数据源中提取出所有groupKey并根据sortFunc排序
     * @param dataSource
     * @param sortFunc
     * @returns {Array.<string>}
     */
    extractGroupKeys(dataSource, sortFunc) {
        let keyListWithoutNotGrouped = dataSource
            .map(item=>item.groupKey)
            .filter(key=>key !== 'notGrouped')
            .reduce((acc, groupKey)=> {
                if (acc.find(it=>it === groupKey) === undefined) {
                    acc.push(groupKey);
                }
                return acc;
            }, []);

        if (sortFunc) {
            keyListWithoutNotGrouped = keyListWithoutNotGrouped.sort(sortFunc);
        }

        return this.groupKeys = ['notGrouped'].concat(keyListWithoutNotGrouped);
    }

    /**
     * 将提取出的title与数据源merge,形成新的数据源
     * @param dataSource
     * @param groupKeys
     * @returns {Array}
     */
    insertGroupTitles(dataSource, groupKeys) {
        return groupKeys.reduce((acc, key)=> {
            const title = {_type: 'groupTitle', groupKey: key, key: 'group_title_' + key + (++GroupCore.guid)};
            let ret = acc
                .concat(
                    title,
                    dataSource
                        .filter(it=>it.groupKey === key)
                        .map(it=>Object.assign({}, {_type: "item"}, it))
                );

            return key !== 'notGrouped' ? ret : ret.filter(item=>
                !(item._type === 'groupTitle' && item.groupKey === 'notGrouped')
            );
        }, []);
    }

    /**
     * 从数据源中获取所有title
     * @param dataSource
     * @returns {Array}
     */
    getTitles(dataSource = this.dataSource) {
        return dataSource.filter(item=>item._type === 'groupTitle');
    }

    /**
     * 更新title的高度
     * 在无穷列表和静态列表模式中,titleHeight都是dom渲染之后才获取到的,这个高度会被用来计算stickyHeader的偏移量
     * @param item
     * @param domNode
     * @returns {Array}
     */
    updateGroupTitle(item, domNode) {
        if (item._type === 'groupTitle') {
            if (!this.infinite) {
                item = Object.assign({}, item, {
                    _translateY: domNode.offsetTop,
                    height: domNode.offsetHeight
                });
            }

            return this.groupTitles = this.groupTitles.map(title=>
                title.groupKey === item.groupKey ? item : title
            );
        }
    }

    /**
     * 根据当前列表的偏移量更新吸顶title的位置和内容
     * @param offsetY
     */
    refreshStickyHeader(offsetY = this.offsetY) {
        const title = this.getCurrentTitle(offsetY),
            offset = this.getCurrentTitleOffsetY(offsetY),
            groupKey = title ? title.groupKey : null;

        if (this.currentGroup.offset !== offset || this.currentGroup.key !== groupKey) {
            this.currentGroup = {key: groupKey, offset};
            this.stickyHeader = {
                title: title,
                offset: offset
            };

            this.emitEvent('refreshStickyHeader', this.stickyHeader);
        }
    }

    /**
     * 根据列表的偏移量计算吸顶title的偏移量
     * @param offsetY
     * @returns {number}
     */
    getCurrentTitleOffsetY(offsetY) {
        const nextTitle = this.getNextTitle(offsetY),
            currentTitle = this.getCurrentTitle(offsetY),
            nextTitleTranslateY = nextTitle && nextTitle._translateY;

        if (nextTitle
            && offsetY > nextTitleTranslateY - currentTitle.height
            && offsetY < nextTitleTranslateY) {
            return -(currentTitle.height - (nextTitleTranslateY - offsetY));
        }

        return 0;
    }

    /**
     * 根据列表偏移量获取当前吸顶的title的下一个title
     * @param offsetY
     * @param groupTitles
     * @returns {Object}
     */
    getNextTitle(offsetY, groupTitles = this.groupTitles) {
        const currentTitle = this.getCurrentTitle(offsetY),
            currentTitleIndex = groupTitles.indexOf(currentTitle);

        if (currentTitleIndex !== -1 && currentTitleIndex !== groupTitles.length - 1) {
            return groupTitles[currentTitleIndex + 1];
        }

        return null;
    }

    /**
     * 根据偏移量获取当前被吸顶的title
     * @param offsetY
     * @param groupTitles
     * @returns {Object}
     */
    getCurrentTitle(offsetY, groupTitles = this.groupTitles) {
        const titlesAboveOffsetY = groupTitles.filter(title=>
            title._translateY != null && title._translateY <= offsetY
        );
        return titlesAboveOffsetY[titlesAboveOffsetY.length - 1];
    }

    /**
     * 根据groupkey返回该分组title的translateY(用来做分组导航)
     * @param groupKey
     * @returns {Number}
     */
    getGroupOffsetY(groupKey) {
        const targetGroup = this.groupTitles.find(title=>title.groupKey === groupKey);

        if (targetGroup) {
            return targetGroup._translateY;
        }

        return null;
    }
};