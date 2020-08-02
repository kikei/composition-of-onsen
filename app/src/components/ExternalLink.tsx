import React from 'react';

interface IProps extends React.Props<any> {
    href: string;
    title?: string;
    className?: string;
}

const ExternalLink: React.FC<IProps> = props => (
    <a href={props.href}
       title={props.title ?? undefined}
       target="_blank"
       rel="noopener noreferrer">
        {props.children}
        <span className="icon sup">
            <i className="fas fa-external-link-alt fa-fw"></i>
        </span>
    </a>
);

export default ExternalLink;
