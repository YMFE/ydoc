import React, {Component} from 'react';
import './demoListItem.scss';
import List from '../../../../component_dev/list/src';

export default class DemoListItem extends Component {

    constructor() {
        super();
    }

    getRelativeHeight(w, h) {
        return h * document.body.offsetWidth / w;
    }

    render() {
        const {item, isHeightFixed}=this.props;

        return (
            <div className="wrapper">
                <a className="img-wrap">
                    <List.LazyImage
                        src={item.imgUrl}
                        defaultImage={null}
                        style={{
                            width: '100%',
                            height: isHeightFixed ? 200 : this.getRelativeHeight(item.imgWidth, item.imgHeight),
                            background: '#ddd'
                        }}
                    />
                </a>
                <div className="comment-wrap">
                    <h2 className="comment-title ellipsis">{item.title}</h2>
                    <p className="comment-detail ellipsis">{item.hotelName}</p>
                    <div className="tags ellipsis">
                        {item.tags.join(' ')}
                    </div>
                </div>
            </div>
        );
    }
}