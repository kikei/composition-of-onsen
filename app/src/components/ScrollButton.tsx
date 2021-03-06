import React, { useState, useEffect } from 'react';

interface IProps extends React.Props<any> {
    className?: string;
    interval?: number;
    speed?: number
}

const ScrollButton: React.FC<IProps> = props => {
    const setTimeout = window.setTimeout;
    const speed = props.speed ?? 16;
    const interval = props.interval ?? 1;

    const [visible, setVisible] = useState(false);
    const [timerId, setTimerId] =
        useState(null as null | ReturnType<typeof setTimeout>);

    useEffect(() => {
        const onScroll = () => {
            const v = window.pageYOffset >= 10;
            setVisible(v);
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    let _timerId = timerId;
    const scrollStep = () => {
        const offset = window.pageYOffset;
        if (offset !== 0) {
            window.scroll(0, offset - speed);
        } else {
            console.debug('end scroll, _timerId:', _timerId);
            clearInterval(_timerId!);
            setTimerId(_timerId = null);
        }
    };
    const scrollTo = () => {
        if (!timerId)
            setTimerId(_timerId = setInterval(scrollStep, interval));
    };
    return (
        <a href="?" title="Back to top"
           onClick={e => {
            e.preventDefault();
            scrollTo()
           }}
           className={ visible ? 'notop' : 'top' }>
            <i className="fa-4x far fa-arrow-alt-circle-up"></i>
        </a>
    );
};

export default ScrollButton;
