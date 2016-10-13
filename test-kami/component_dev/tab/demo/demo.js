/**
 * Created by Ellery1 on 16/7/4.
 */
import ReactDom, {render} from 'react-dom';
import React, {Component, PropTypes} from 'react';
import Tab, {TabLink} from '../src';

let linkFunc = function (dataAttrs, evt){
    console.log('data', dataAttrs);
}

ReactDom.render(
    <div>
        <Tab
            theme = "iconCol"
            part = {false}
            >
            <TabLink
                index = "now"
                icon = {"\uF000"}
                text =  "定位"
            />
            <TabLink
                onTouchTap = {linkFunc}
                icon = {"\uF000"}
                disabled = {false}
                text = "热卖"
            />
            <TabLink
                onTouchTap = {linkFunc}
                icon = {"\uF000"}
                text = "抢购"
            />
        </Tab>
        <Tab
            theme = "iconRow"
            part = {false}
            >
            <TabLink
                icon = {"\uF000"}
                text =  "定位"
            />
            <TabLink
                index = "now"
                onTouchTap = {linkFunc}
                icon = {"\uF000"}
                disabled = {false}
                text = "热卖"
            />
            <TabLink
                onTouchTap = {linkFunc}
                icon = {"\uF000"}
                text = "抢购"
            />
        </Tab>
        <Tab
            theme = "iconSingle"
            part = {false}
            >
            <TabLink
                icon = {"\uF000"}
                text =  "定位"
            />
            <TabLink
                onTouchTap = {linkFunc}
                icon = {"\uF000"}
                disabled = {false}
                text = "热卖"
            />
            <TabLink
                index = "now"
                onTouchTap = {linkFunc}
                icon = {"\uF000"}
                text = "抢购"
            />
        </Tab>
        <Tab
            theme = "iconSingle"
            part = {true}
        >
            <TabLink
                icon = "./image/animal.png"
                text =  "定位"
            />
            <TabLink
                index = "now"
                onTouchTap = {linkFunc}
                icon = "./image/animal.png"
                disabled = {false}
                text = "热卖"
            />
            <TabLink
                onTouchTap = {linkFunc}
                icon = "./image/animal.png"
                text = "抢购"
            />
        </Tab>

        <Tab
            theme = "iconCol"
            part = {false}
        >
            <TabLink
                icon = "./image/animal.png"
                text =  "定位"
            />
            <TabLink
                onTouchTap = {linkFunc}
                icon = "\uF000"
                text = "热卖"
            />
            <TabLink
                index = "now"
                onTouchTap = {linkFunc}
                icon = {"\uF000"}
                text = "抢购"
            />
        </Tab>
        <Tab
            theme = "iconRow"
            part = {false}
        >
            <TabLink
                icon = "./image/animal.png"
                text =  "定位"
            />
            <TabLink
                onTouchTap = {linkFunc}
                icon = "\uF000"
                disabled = {false}
                text = "热卖"
            />
            <TabLink
                index = "now"
                onTouchTap = {linkFunc}
                icon = {"\uF000"}
                text = "抢购"
            />
        </Tab>
        <Tab
            theme = "iconSingle"
            part = {false}
        >
            <TabLink
                index = "now"
                icon = "./image/animal.png"
                text =  "定位"
            />
            <TabLink
                onTouchTap = {linkFunc}
                icon = "./image/animal.png"
                disabled = {false}
                text = "热卖"
            />
            <TabLink
                index = "now"
                onTouchTap = {linkFunc}
                icon = "./image/animal.png"
                text = "抢购"
            />
        </Tab>
        <Tab
            theme = "iconNone"
            part = {false}
        >
            <TabLink
                icon = "./image/animal.png"
                text =  "定位"
            />
            <TabLink
                index = "now"
                onTouchTap = {linkFunc}
                icon = "\uF000"
                disabled = {false}
                text = "热卖"
            />
            <TabLink
                onTouchTap = {linkFunc}
                icon = {"\uF000"}
                text = "抢购"
            />
        </Tab>
        <Tab
            theme = "iconNone"
            part = {true}
        >
            <TabLink
                index = "now"
                icon = "./image/animal.png"
                text =  "定位"
            />
            <TabLink
                onTouchTap = {linkFunc}
                icon = "\uF000"
                text = "热卖"
            />
            <TabLink
                onTouchTap = {linkFunc}
                icon = {"\uF000"}
                text = "抢购"
            />
        </Tab>
        <Tab
            theme = "iconCol"
            part = {true}
        >
            <TabLink
                icon = "./image/animal.png"
                text =  "定位"
            />
            <TabLink
                onTouchTap = {linkFunc}
                index = "now"
                icon = "\uF000"
                text = "热卖"
            />
            <TabLink
                onTouchTap = {linkFunc}
                icon = {"\uF000"}
                text = "抢购"
            />
        </Tab>
        <Tab
            theme = "iconRow"
            part = {true}
        >
            <TabLink
                icon = "./image/animal.png"
                text =  "定位"
            />
            <TabLink
                onTouchTap = {linkFunc}
                icon = "\uF000"
                text = "热卖"
            />
            <TabLink
                index = "now"
                onTouchTap = {linkFunc}
                icon = {"\uF000"}
                text = "抢购"
            />
        </Tab>
        <Tab
            theme = "iconNone"
            part = {true}
        >
            <TabLink
                disabled = {true}
                icon = "./image/animal.png"
                text =  "定位"
            />
            <TabLink
                disabled = {true}
                index = "now"
                onTouchTap = {linkFunc}
                icon = "\uF000"
                text = "热卖"
            />
            <TabLink
                disabled = {true}
                onTouchTap = {linkFunc}
                icon = {"\uF000"}
                text = "抢购"
            />
        </Tab>
    </div>,
    document.getElementById('content')
);
