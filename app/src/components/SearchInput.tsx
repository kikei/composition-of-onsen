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
        <form action="/" className="search-form">
            <input type="text"
                   value={searchInput}
                   onChange={e => setSearchInput(e.target.value) }
            />
            <button onClick={e => onSubmit(searchInput)}>
                Search
            </button>
        </form>
    )
}

export default SearchInput;
