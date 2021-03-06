import React, { useState } from 'react';

interface IProps {
    value?: string;
    onSearch?: (query: string) => void;
}

const SearchInput: React.FC<IProps> = props => {
    const [searchInput, setSearchInput] = useState(props.value ?? '');

    const onSubmit = (query: string) => {
        if (typeof props.onSearch === 'function') {
            props.onSearch(searchInput);
        }
        setSearchInput('');
    };

    return (
        <div className="field has-addons search-form">
            <div className="control">
                <input className="input"
                       type="text"
                       value={searchInput}
                       onChange={e => setSearchInput(e.target.value)}
                       onKeyDown={e => e.key === 'Enter' &&
                                     onSubmit(searchInput)}
                />
            </div>
            <div className="control">
                <button className="button is-primary"
                        onClick={e => onSubmit(searchInput)}>
                    <i className="fas fa-search"></i>
                </button>
            </div>
        </div>
    )
}

export default SearchInput;
