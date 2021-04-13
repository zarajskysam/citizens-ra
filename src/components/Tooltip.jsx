import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Tooltip extends Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
        content: PropTypes.string,
        position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    }

    static defaultProps = {
        content: 'Tooltip content',
        position: 'top'
    }

    state = {
        visible: false,
    }

    show = () => {
        this.setVisibility(true);
    }

    hide = () => {
        this.setVisibility(false);
    }

    setVisibility = visible => {
        this.setState({ visible })
        console.log(visible);
    }

    render() {
        const { visible } = this.state;
        const { children, content, style } = this.props;

        const classes = classNames(
            'tooltip',
        );

        return (
            <span className='tooltipWrapper'>
                { visible && <span style={style} className={classes}>{content}</span> }
                <span className='targetElement' onMouseEnter={this.show} onMouseLeave={this.hide}>{children}</span>
            </span>
        )
    }
}
