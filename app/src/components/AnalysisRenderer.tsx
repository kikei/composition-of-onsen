import React, { useContext } from 'react';
import CommentList from './CommentList';

import ConfigContext from '../contexts/ConfigContext';
import AppPath from '../services/AppPath';

interface IProps extends React.Props<any> {
    id: string
}

const AnalysisRenderer: React.FC<IProps> = props => {
    const context = useContext(ConfigContext);
    const paths = new AppPath(context);

    return (
        <React.Fragment>
            <nav className="navbar has-background-color-0">
                <div className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <a className="button is-primary"
                                   href={paths.analysisEditor(props.id)}>
                                    <i className="fas fa-edit fa-fw is-small"></i>
                                    {' '}編集する
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="container is-fullhd analysis-container">
                <div className="content">
                    {props.children}
                </div>
                <div className="content analysis-comment-container">
                    <CommentList analysisId={props.id} />
                </div>
            </div>
        </React.Fragment>
    );
};

export default AnalysisRenderer;

