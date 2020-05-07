import React, { useState } from 'react';

interface IProps {
    onSearch?: (query: string) => void;
}

const SearchInput: React.FC<IProps> = props => {
    const [searchInput, setSearchInput] = useState('');

    const onSubmit = (query: string) => {
        if (typeof props.onSearch === 'function') {
            props.onSearch(searchInput);
        }
    };

    return (
        <div className="field has-addons search-form">
            <div className="control">
                <input className="input"
                       type="text"
                       value={searchInput}
                       onChange={e => setSearchInput(e.target.value) }
                />
            </div>
            <div className="control">
                <button className="button is-primary"
                        onClick={e => onSubmit(searchInput)}>
                    Search
                </button>
            </div>
        </div>
    )
}

export default SearchInput;
